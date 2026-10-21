
const imagensPersonagens = {
    "Naruto": "/imagens/personagens/Naruto.png",
    "Sasuke": "/imagens/personagens/Sasuke.png"
}

function CardsPersonagens({personagem}){
    //Fazer isso consumir a parte da API que seleciona personagem, e para a imagem dos personagens usar "lib" que vou deixar pronta aqui.
    //Ex:
    return (
        <div className="CardPersonagem">
            <img src={imagensPersonagens[personagem]} 
            alt={personagem} />
        </div>
    )
    
}

export default CardsPersonagens;