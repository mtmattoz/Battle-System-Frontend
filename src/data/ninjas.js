// Dados puramente visuais (imagens e cores de cada ninja).
// Nada aqui conversa com o back-end: os dados reais continuam vindo da API.

export const ninjas = {
    Naruto: {
        icon: "imagens/personagens/icon/Narutoicon.png",
        foto: "imagens/personagens/Naruteggs.png",
        cor: "#f28c28",
        titulo: "Jinchūriki da Kyūbi",
    },
    Sasuke: {
        icon: "imagens/personagens/icon/SasukeIcon.png",
        foto: "imagens/personagens/Sasukeggs.png",
        cor: "#8b6cf0",
        titulo: "Último Uchiha",
    },
    Kakashi: {
        icon: "imagens/personagens/icon/Kakashiicon.png",
        foto: "imagens/personagens/Kakasheggs.png",
        cor: "#6fb6dc",
        titulo: "Ninja que copia",
    },
    Pain: {
        icon: "imagens/personagens/icon/Painicon.png",
        foto: "imagens/personagens/Painggs.png",
        cor: "#e8643a",
        titulo: "Líder da Akatsuki",
    },
    Itachi: {
        icon: "imagens/personagens/icon/Itachiicon.png",
        foto: "imagens/personagens/Itachieggs.png",
        cor: "#d8322a",
        titulo: "Mestre do Tsukuyomi",
    },
    Orochimaru: {
        icon: "imagens/personagens/icon/Orochicon.png",
        foto: "imagens/personagens/Orocheggs.png",
        cor: "#79b85e",
        titulo: "Sannin das serpentes",
    },
};

export const corPadrao = "#e8b04a";

export function corDe(nome) {
    return ninjas[nome]?.cor || corPadrao;
}
