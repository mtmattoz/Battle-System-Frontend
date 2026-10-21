import './Select.css'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ninjas, corDe } from '../data/ninjas';

// Painel grande de cada lado (só apresentação)
function PainelNinja({ lado, ninja, ativo, onClick }) {
    const info = ninja ? ninjas[ninja.nome] : null;

    return (
        <button
            type="button"
            className={`sel-painel sel-painel--${lado} ${ativo ? "is-ativo" : ""}`}
            style={{ "--cor": corDe(ninja?.nome) }}
            onClick={onClick}
            aria-pressed={ativo}
            aria-label={`Escolher ${lado === "jogador" ? "seu ninja" : "o rival"}`}
        >
            <span className="sel-painel-fumaca" aria-hidden="true" />
            <span className="sel-painel-cor" aria-hidden="true" />

            <span className="sel-painel-tag">
                {lado === "jogador" ? "Você" : "Rival"}
            </span>

            {ninja && (
                <img
                    key={ninja.id}
                    className="sel-painel-foto"
                    src={info?.foto}
                    alt={ninja.nome}
                />
            )}

            <span className="sel-painel-info">
                <strong className="sel-painel-nome">{ninja?.nome ?? "—"}</strong>
                {info?.titulo && <span className="sel-painel-titulo">{info.titulo}</span>}
                {ninja?.vida != null && (
                    <span className="sel-painel-hp">HP {ninja.vida}</span>
                )}
            </span>
        </button>
    );
}

function Select() {
    const navigate = useNavigate();
    const [personagens, setPersonagens] = useState([]);
    const [jogador, setJogador] = useState(null);
    const [inimigo, setInimigo] = useState(null);
    const [ladoSelecionado, setLadoSelecionado] = useState("jogador");

    useEffect(() => {
        fetch("http://localhost:8081/personagem")
            .then(res => res.json())
            .then(data => {
                setPersonagens(data);
                if (data.length >= 2) {
                    setJogador(data[0]);
                    setInimigo(data[1]);
                }
            })
            .catch(err => console.log(err));
    }, []);

    const confirmar = async () => {
        try {
            const response = await fetch("http://localhost:8081/partida/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    // Nomes corrigidos para bater com o Record Java
                    personagemJogadorId: jogador.id,
                    personagemRivalId: inimigo.id
                })
            });

            const partida = await response.json();

            if (partida.id) {
                navigate("/batalha", {
                    state: {
                        partidaId: partida.id,
                        jogador,
                        inimigo
                    }
                });
            } else {
                alert("Erro ao criar partida: ID não retornado.");
            }
        } catch (err) {
            console.log(err);
            alert("Erro ao criar partida");
        }
    };

    return (
        <main className="sel">
            <div className="sel-fundo" aria-hidden="true" />

            <header className="sel-topo">
                <h1 className="sel-titulo">Escolha os ninjas</h1>
                <p className="sel-instrucao">
                    Clique em um dos lados e depois escolha o ninja na lista.
                </p>
            </header>

            <section className="sel-arena">
                <PainelNinja
                    lado="jogador"
                    ninja={jogador}
                    ativo={ladoSelecionado === "jogador"}
                    onClick={() => setLadoSelecionado("jogador")}
                />

                <div className="sel-centro">
                    <img className="sel-versus" src="imagens/background/Versus.png" alt="contra" />

                    <div className="sel-lados" role="tablist" aria-label="Lado que você está escolhendo">
                        <button
                            type="button"
                            role="tab"
                            aria-selected={ladoSelecionado === "jogador"}
                            className={`sel-lado ${ladoSelecionado === "jogador" ? "is-ativo" : ""}`}
                            onClick={() => setLadoSelecionado("jogador")}
                        >
                            Seu ninja
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={ladoSelecionado === "inimigo"}
                            className={`sel-lado sel-lado--rival ${ladoSelecionado === "inimigo" ? "is-ativo" : ""}`}
                            onClick={() => setLadoSelecionado("inimigo")}
                        >
                            Rival
                        </button>
                    </div>

                    {personagens.length === 0 ? (
                        <p className="sel-vazio">
                            Carregando ninjas… Se nada aparecer, confira se a API está rodando na porta 8081.
                        </p>
                    ) : (
                        <div className="sel-grade">
                            {personagens.map((personagem) => {
                                const ativo =
                                    (ladoSelecionado === "jogador" && jogador?.id === personagem.id) ||
                                    (ladoSelecionado === "inimigo" && inimigo?.id === personagem.id);

                                return (
                                    <button
                                        type="button"
                                        key={personagem.id}
                                        className={`personagem ${ativo ? "ativo" : ""}`}
                                        style={{ "--cor": corDe(personagem.nome) }}
                                        onClick={() => {
                                            if (ladoSelecionado === "jogador") setJogador(personagem);
                                            else setInimigo(personagem);
                                        }}
                                    >
                                        <img src={ninjas[personagem.nome]?.icon} alt="" />
                                        <span className="personagem-nome">{personagem.nome}</span>

                                        {jogador?.id === personagem.id && (
                                            <span className="personagem-marca personagem-marca--j">Você</span>
                                        )}
                                        {inimigo?.id === personagem.id && (
                                            <span className="personagem-marca personagem-marca--i">Rival</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    <button
                        type="button"
                        className="btn-selo sel-confirmar"
                        onClick={confirmar}
                        disabled={!jogador || !inimigo}
                    >
                        Confirmar duelo
                    </button>
                </div>

                <PainelNinja
                    lado="inimigo"
                    ninja={inimigo}
                    ativo={ladoSelecionado === "inimigo"}
                    onClick={() => setLadoSelecionado("inimigo")}
                />
            </section>
        </main>
    );
}

export default Select;
