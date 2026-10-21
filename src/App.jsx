import { useNavigate } from "react-router-dom"
import './App.css'

function App() {
  const navigate = useNavigate();

  return (
    <main className="titulo-tela">
      <div className="titulo-arte" aria-hidden="true" />
      <div className="titulo-vinheta" aria-hidden="true" />

      <div className="titulo-acoes">
        <div className="titulo-botoes">
          <button
            className="btn-selo titulo-botao"
            onClick={() => navigate('/select')}
          >
            Começar batalha
          </button>
          <button
            className="btn-tinta titulo-botao-secundario"
            onClick={() => navigate('/historias')}
          >
            Pergaminhos ninja
          </button>
        </div>
        <p className="titulo-dica">
          Escolha seu ninja, escolha o rival e lute até o HP de alguém zerar.
        </p>
      </div>
    </main>
  )
}

export default App