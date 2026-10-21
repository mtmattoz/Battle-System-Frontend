import './Battle.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { ninjas, corDe } from '../data/ninjas';

const VIDA_MAXIMA = 250;   // o back-end inicia toda partida com 250 de vida
const CHAKRA_MAXIMO = 100; // chakra cheio (recupera 15 por turno no back-end)

// Barra de HP inclinada (só apresentação)
function BarraVida({ nome, vida, chakra, lado }) {
    const pct = Math.max(0, Math.min(100, (vida / VIDA_MAXIMA) * 100));
    const nivel = pct > 50 ? "alto" : pct > 20 ? "medio" : "baixo";
    const pctChakra = Math.max(0, Math.min(100, (chakra / CHAKRA_MAXIMO) * 100));

    return (
        <div className={`hud-lado hud-lado--${lado}`} style={{ "--cor": corDe(nome) }}>
            <div className="hud-retrato">
                {nome && <img src={ninjas[nome]?.icon} alt="" />}
            </div>
            <div className="hud-dados">
                <div className="hud-linha">
                    <span className="hud-nome">{nome}</span>
                    <span className="hud-hp">
                        {vida}<small>/{VIDA_MAXIMA}</small>
                    </span>
                </div>
                <div
                    className="hud-barra"
                    role="meter"
                    aria-label={`Vida de ${nome}`}
                    aria-valuemin={0}
                    aria-valuemax={VIDA_MAXIMA}
                    aria-valuenow={vida}
                >
                    <span className="hud-barra-rastro" style={{ width: `${pct}%` }} />
                    <span className={`hud-barra-vida hud-barra-vida--${nivel}`} style={{ width: `${pct}%` }} />
                </div>
                {/* Barra de chakra (estilo direto aqui para não depender do CSS) */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginTop: "2px",
                        flexDirection: lado === "rival" ? "row-reverse" : "row",
                    }}
                >
                    <div
                        role="meter"
                        aria-label={`Chakra de ${nome}`}
                        aria-valuemin={0}
                        aria-valuemax={CHAKRA_MAXIMO}
                        aria-valuenow={chakra}
                        style={{
                            position: "relative",
                            flex: 1,
                            maxWidth: "60%",
                            height: "10px",
                            background: "rgba(5, 7, 13, 0.85)",
                            border: "2px solid #05070d",
                            transform: lado === "rival" ? "skewX(20deg)" : "skewX(-20deg)",
                            overflow: "hidden",
                        }}
                    >
                        <span
                            style={{
                                position: "absolute",
                                top: 0,
                                bottom: 0,
                                left: lado === "rival" ? "auto" : 0,
                                right: lado === "rival" ? 0 : "auto",
                                width: `${pctChakra}%`,
                                background: "linear-gradient(90deg, #2f8fe0, #6fd3ff)",
                                boxShadow: "0 0 8px rgba(111, 211, 255, 0.7)",
                                transition: "width 0.4s ease-out",
                            }}
                        />
                    </div>
                    <span
                        style={{
                            fontSize: "0.78rem",
                            fontWeight: 600,
                            color: "#6fd3ff",
                            textShadow: "0 1px 2px #000",
                            whiteSpace: "nowrap",
                        }}
                    >
                        Chakra {chakra}
                    </span>
                </div>
            </div>
        </div>
    );
}

function Batalha() {
    const location = useLocation();
    const navigate = useNavigate();

    const jogador = location.state?.jogador;
    const inimigo = location.state?.inimigo;
    const partidaId = location.state?.partidaId;

    const [ataques, setAtaques] = useState([]);
    const [ataquesRival, setAtaquesRival] = useState([]);
    const [historico, setHistorico] = useState([]);
    const [vidaJogador, setVidaJogador] = useState(VIDA_MAXIMA);
    const [vidaInimigo, setVidaInimigo] = useState(VIDA_MAXIMA);
    const [chakraJogador, setChakraJogador] = useState(CHAKRA_MAXIMO);
    const [chakraRival, setChakraRival] = useState(CHAKRA_MAXIMO);
    const [finalizada, setFinalizada] = useState(false);

    // ---- Estados apenas visuais (não afetam a API) ----
    const [enviando, setEnviando] = useState(false);
    const [golpes, setGolpes] = useState([]);       // números de dano flutuando
    const [atingido, setAtingido] = useState(null); // "jogador" | "rival"
    const vidaAnterior = useRef({ jogador: VIDA_MAXIMA, rival: VIDA_MAXIMA });
    const logRef = useRef(null);

    // Sem dados da partida (ex.: página recarregada) volta para a seleção
    useEffect(() => {
        if (!jogador || !inimigo) navigate('/select');
    }, [jogador, inimigo, navigate]);

    useEffect(() => {
        if (!jogador || !inimigo) return;

        fetch("http://localhost:8081/ataque")
            .then(res => res.json())
            .then(data => {
                // Cada personagem recebe os próprios ataques (pelo dono), do maior dano para o menor
                const filtrados = data
                    .filter(atk => atk.personagemId === jogador.id)
                    .sort((a, b) => b.dano - a.dano);
                setAtaques(filtrados);

                const filtradosRival = data
                    .filter(atk => atk.personagemId === inimigo.id)
                    .sort((a, b) => b.dano - a.dano);
                setAtaquesRival(filtradosRival);
            })
            .catch(console.error);
    }, [jogador, inimigo]);

    async function atacar(ataque) {
        if (finalizada) return;

        try {
            const response = await fetch("http://localhost:8081/partida/atacar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    partidaId: partidaId,
                    ataqueId: ataque.id
                })
            });

            if (!response.ok) throw new Error("Erro ao atacar");

            const resultado = await response.json();

            // 1. Atualiza os estados com os dados do backend
            setVidaJogador(resultado.vidaJogador);
            setVidaInimigo(resultado.vidaRival);
            setFinalizada(resultado.finalizada);
            if (resultado.chakraJogador != null) setChakraJogador(resultado.chakraJogador);
            if (resultado.chakraRival != null) setChakraRival(resultado.chakraRival);

            // 2. Atualiza o Histórico (Log)
            const novoHistorico = [...historico, `${jogador.nome} usou ${ataque.nome}!`];

            // 3. A MUDANÇA ESTÁ AQUI NESTE BLOCO IF:
            if (resultado.finalizada) {
                const nomeGanhador = resultado.vencedor === 'JOGADOR' ? jogador.nome : inimigo.nome;

                // Formata o nome para buscar a imagem correta (ex: "Rock Lee" vira "rocklee")
                const fotoLimpa = nomeGanhador.toLowerCase().replace(/\s/g, '');

                novoHistorico.push(`FIM DE JOGO! O vencedor foi: ${nomeGanhador}`);
                setHistorico(novoHistorico);

                // Aguarda 1.5 segundos para o jogador ver o HP zerar e a mensagem de Fim de Jogo, depois muda a tela
                setTimeout(() => {
                    navigate('/fim', {
                        state: {
                            vencedorNome: nomeGanhador,
                            fotoVencedor: fotoLimpa
                        }
                    });
                }, 1500);

                return; // Para a execução aqui para não adicionar a linha do else
            } else {
                // 1. Calcula o dano exato: Vida antiga do React MENOS a vida nova vinda do Java
                const danoTomado = vidaJogador - resultado.vidaJogador;

                // 2. Procura no state qual ataque do inimigo tira exatamente esse dano
                const ataqueCerto = ataquesRival.find(atk => atk.dano === danoTomado);

                // 3. Extrai o nome do ataque (com uma proteção de segurança caso não encontre)
                // (o back-end agora informa o golpe exato; o cálculo pelo dano fica como reserva)
                const golpeInimigo = resultado.ultimoAtaqueRival || (ataqueCerto ? ataqueCerto.nome : "um ataque misterioso");

                novoHistorico.push(`${inimigo.nome} usou ${golpeInimigo}!`);
            }
            setHistorico(novoHistorico);

        } catch (err) {
            console.error(err);

            if (err.message.includes("Partida finalizada")) {
                alert("A batalha acabou! O vencedor foi decidido.");
            } else {
                alert("Erro ao realizar o ataque.");
            }
        }
    }

    // Evita clique duplo enquanto o ataque está sendo processado
    async function usarAtaque(ataque) {
        if (enviando) return;
        setEnviando(true);
        await atacar(ataque);
        setEnviando(false);
    }

    // ---- Efeitos visuais de dano ----
    function mostrarGolpe(alvo, valor) {
        const id = Date.now() + Math.random();
        setGolpes(g => [...g, { id, alvo, valor }]);
        setAtingido(alvo);
        setTimeout(() => setAtingido(a => (a === alvo ? null : a)), 450);
        setTimeout(() => setGolpes(g => g.filter(x => x.id !== id)), 1100);
    }

    useEffect(() => {
        const dano = vidaAnterior.current.rival - vidaInimigo;
        vidaAnterior.current.rival = vidaInimigo;
        if (dano > 0) mostrarGolpe("rival", dano);
    }, [vidaInimigo]);

    useEffect(() => {
        const dano = vidaAnterior.current.jogador - vidaJogador;
        vidaAnterior.current.jogador = vidaJogador;
        if (dano > 0) {
            // o golpe do rival aparece logo depois do seu
            const t = setTimeout(() => mostrarGolpe("jogador", dano), 350);
            return () => clearTimeout(t);
        }
    }, [vidaJogador]);

    useEffect(() => {
        if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
    }, [historico]);

    if (!jogador || !inimigo) return null;

    const estado = finalizada
        ? "Partida encerrada!"
        : enviando
            ? "Executando o jutsu…"
            : "Escolha um ataque";

    return (
        <main className="fbody">
            <div className="arena-fundo" aria-hidden="true" />

            {/* HUD superior */}
            <header className="hud">
                <BarraVida nome={jogador.nome} vida={vidaJogador} chakra={chakraJogador} lado="jogador" />
                <div className="hud-centro">
                    <span className="hud-vs">VS</span>
                    <span className="hud-partida">Partida #{partidaId}</span>
                </div>
                <BarraVida nome={inimigo.nome} vida={vidaInimigo} chakra={chakraRival} lado="rival" />
            </header>

            {/* Lutadores */}
            <div className={`lutador lutador--rival ${atingido === "rival" ? "is-atingido" : ""}`}>
                <img src={`imagens/personagens/${inimigo.nome}Frente.png`} alt={inimigo.nome} />
                <span className="lutador-sombra" aria-hidden="true" />
                {golpes.filter(g => g.alvo === "rival").map(g => (
                    <span key={g.id} className="dano">-{g.valor}</span>
                ))}
            </div>

            <div className={`lutador lutador--jogador ${atingido === "jogador" ? "is-atingido" : ""}`}>
                <img src={`imagens/personagens/${jogador.nome}Costa.png`} alt={jogador.nome} />
                <span className="lutador-sombra" aria-hidden="true" />
                {golpes.filter(g => g.alvo === "jogador").map(g => (
                    <span key={g.id} className="dano dano--jogador">-{g.valor}</span>
                ))}
            </div>

            {/* Registro de batalha */}
            <aside className="log pergaminho" aria-label="Registro de batalha">
                <h2 className="Titulo">Registro de batalha</h2>
                <div className="conteudoLog" ref={logRef} aria-live="polite">
                    {historico.length === 0 && (
                        <p className="log-vazio">Nenhum golpe ainda. Ataque primeiro!</p>
                    )}
                    {historico.map((item, index) => (
                        <p
                            key={index}
                            className={
                                item.startsWith("FIM DE JOGO")
                                    ? "log-fim"
                                    : item.startsWith(jogador.nome)
                                        ? "log-jogador"
                                        : "log-rival"
                            }
                        >
                            {item}
                        </p>
                    ))}
                </div>
            </aside>

            {/* Painel de comandos */}
            <section className="comandos" style={{ "--cor": corDe(jogador.nome) }}>
                <div className="comandos-topo">
                    <span className="comandos-titulo">Jutsus de {jogador.nome}</span>
                    <span className={`comandos-estado ${finalizada ? "is-fim" : ""}`}>{estado}</span>
                </div>

                <div className="AtkBar">
                    {ataques.length === 0 && (
                        <p className="comandos-vazio">Carregando ataques…</p>
                    )}
                    {ataques.map((ataque) => {
                        const custo = ataque.custoChakra ?? 0;
                        const semChakra = custo > chakraJogador;

                        return (
                            <button
                                key={ataque.id}
                                className={`ataque ${semChakra ? "is-sem-chakra" : ""}`}
                                disabled={finalizada || enviando || semChakra}
                                onClick={() => usarAtaque(ataque)}
                                title={semChakra ? `Precisa de ${custo} de chakra` : undefined}
                            >
                                <span className="ataque-nome">{ataque.nome}</span>
                                <span className="ataque-meta">
                                    {ataque.tipo && <span className="ataque-tipo">{ataque.tipo}</span>}
                                    <span className="ataque-dano">{ataque.dano} de dano</span>
                                </span>
                                <span className="ataque-custo">
                                    {custo === 0 ? "Sem custo" : semChakra ? `Faltam ${custo - chakraJogador} de chakra` : `${custo} de chakra`}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}

export default Batalha;