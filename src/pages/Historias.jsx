import './Historias.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ninjas, corDe } from '../data/ninjas';
import { historias } from '../data/historias';

// GIF do personagem; se não carregar (sem internet), mostra a arte local
function RetratoAnimado({ nome }) {
    const [falhou, setFalhou] = useState(false);
    const info = ninjas[nome];

    useEffect(() => setFalhou(false), [nome]);

    if (!info) return null;

    return falhou ? (
        <img className="hist-retrato-img hist-retrato-img--arte" src={info.foto} alt={nome} />
    ) : (
        <img className="hist-retrato-img" src={info.gif} alt={`${nome} em ação`} onError={() => setFalhou(true)} />
    );
}

function Historias() {
    const navigate = useNavigate();
    const [personagens, setPersonagens] = useState([]);
    const [ataques, setAtaques] = useState([]);
    const [selecionadoId, setSelecionadoId] = useState(null);
    const [erro, setErro] = useState(false);

    useEffect(() => {
        fetch("http://localhost:8081/personagem")
            .then(res => res.json())
            .then(data => {
                setPersonagens(data);
                if (data.length > 0) setSelecionadoId(data[0].id);
            })
            .catch(err => {
                console.log(err);
                setErro(true);
            });

        fetch("http://localhost:8081/ataque")
            .then(res => res.json())
            .then(data => setAtaques(data))
            .catch(console.error);
    }, []);

    const atual = personagens.find(p => p.id === selecionadoId);
    const jutsus = atual
        ? ataques.filter(a => a.personagemId === atual.id).sort((a, b) => b.dano - a.dano)
        : [];
    const paragrafos = atual ? historias[atual.nome] || [] : [];

    return (
        <main className="hist">
            <div className="hist-fundo" aria-hidden="true" />

            <header className="hist-topo">
                <button className="btn-tinta hist-voltar" onClick={() => navigate('/')}>
                    Voltar
                </button>
                <h1 className="hist-titulo">Pergaminhos ninja</h1>
                <span className="hist-topo-espaco" aria-hidden="true" />
            </header>

            {erro && (
                <p className="hist-aviso">
                    Não foi possível carregar os ninjas. Confira se a API está rodando na porta 8081.
                </p>
            )}

            {!erro && personagens.length === 0 && (
                <p className="hist-aviso">Abrindo os pergaminhos…</p>
            )}

            {atual && (
                <div className="hist-corpo">
                    {/* Lista de ninjas */}
                    <nav className="hist-lista" aria-label="Escolha um ninja">
                        {personagens.map(p => (
                            <button
                                key={p.id}
                                type="button"
                                className={`hist-item ${p.id === selecionadoId ? "is-ativo" : ""}`}
                                style={{ "--cor": corDe(p.nome) }}
                                onClick={() => setSelecionadoId(p.id)}
                                aria-current={p.id === selecionadoId ? "true" : undefined}
                            >
                                <img src={ninjas[p.nome]?.icon} alt="" />
                                <span className="hist-item-texto">
                                    <strong>{p.nome}</strong>
                                    {ninjas[p.nome]?.titulo && <small>{ninjas[p.nome].titulo}</small>}
                                </span>
                            </button>
                        ))}
                    </nav>

                    {/* Pergaminho aberto */}
                    <article
                        key={atual.id}
                        className="hist-pergaminho pergaminho"
                        style={{ "--cor": corDe(atual.nome) }}
                    >
                        <div className="hist-cabecalho">
                            <figure className="hist-retrato">
                                <RetratoAnimado nome={atual.nome} />
                            </figure>

                            <div className="hist-ficha">
                                <h2 className="hist-nome">{atual.nome}</h2>
                                {ninjas[atual.nome]?.titulo && (
                                    <p className="hist-subtitulo">{ninjas[atual.nome].titulo}</p>
                                )}

                                <dl className="hist-dados">
                                    <div>
                                        <dt>Vida</dt>
                                        <dd>{atual.vida ?? "—"}</dd>
                                    </div>
                                    <div>
                                        <dt>Jutsus</dt>
                                        <dd>{jutsus.length}</dd>
                                    </div>
                                </dl>

                                {jutsus.length > 0 && (
                                    <ul className="hist-jutsus">
                                        {jutsus.map(j => (
                                            <li key={j.id}>
                                                <span className="hist-jutsu-nome">{j.nome}</span>
                                                <span className="hist-jutsu-info">
                                                    {j.dano} de dano
                                                    {j.custoChakra != null && ` · ${j.custoChakra === 0 ? "sem custo" : `${j.custoChakra} de chakra`}`}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        <div className="hist-texto">
                            {paragrafos.length > 0 ? (
                                paragrafos.map((t, i) => <p key={i}>{t}</p>)
                            ) : (
                                <p className="hist-sem-historia">
                                    A história de {atual.nome} ainda não foi escrita. Adicione o texto em
                                    src/data/historias.js.
                                </p>
                            )}
                        </div>
                    </article>
                </div>
            )}
        </main>
    );
}

export default Historias;