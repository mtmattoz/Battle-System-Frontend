// Dados puramente visuais (imagens, GIFs e cores de cada ninja).
// Os GIFs são os mesmos escolhidos para a tela de vitória.
// Nada aqui conversa com o back-end: os dados reais continuam vindo da API.

export const ninjas = {
    Naruto: {
        icon: "imagens/personagens/icon/Narutoicon.png",
        foto: "imagens/personagens/Naruteggs.png",
        cor: "#f28c28",
        titulo: "Jinchūriki da Kyūbi",
        gif: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2dyazE1M28zdHc1NWl6YW9iazFjMGdvMWVxYWU1MXN2a3Bqc3plNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/4F3N277RL2NvW/giphy.gif",
    },
    Sasuke: {
        icon: "imagens/personagens/icon/SasukeIcon.png",
        foto: "imagens/personagens/Sasukeggs.png",
        cor: "#8b6cf0",
        titulo: "Último Uchiha",
        gif: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ2k3MmRraXN1cGhod3RhZmszMm0zdG84bTNyNm9wZWVjc2tyMGp4byZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1dcLFNKRUKvte/giphy.gif",
    },
    Kakashi: {
        icon: "imagens/personagens/icon/Kakashiicon.png",
        foto: "imagens/personagens/Kakasheggs.png",
        cor: "#6fb6dc",
        titulo: "Ninja que copia",
        gif: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZnhhbzF2NXJybzNnc3luaXQ5a3R4Z3UyeXA1cmtxMmp4ZmYyM3lzayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/vXyIMuWbGTMtO/giphy.gif",
    },
    Pain: {
        icon: "imagens/personagens/icon/Painicon.png",
        foto: "imagens/personagens/Painggs.png",
        cor: "#e8643a",
        titulo: "Líder da Akatsuki",
        gif: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHdtNGx6NHBlbmRxZXFwdHY1cG81bmozOXQxc2N5eXB5cDh1NW5rNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/hMAhEUs3fwEbC/giphy.gif",
    },
    Itachi: {
        icon: "imagens/personagens/icon/Itachiicon.png",
        foto: "imagens/personagens/Itachieggs.png",
        cor: "#d8322a",
        titulo: "Mestre do Tsukuyomi",
        gif: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHVpcm9ucHVjcHoyeHBwdHVsYXdzdjRxMjR1d3ZudXR2ZWk2MXgxdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/yzWxW50V4W8Bq/giphy.gif",
    },
    Orochimaru: {
        icon: "imagens/personagens/icon/Orochicon.png",
        foto: "imagens/personagens/Orocheggs.png",
        cor: "#79b85e",
        titulo: "Sannin das serpentes",
        gif: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExc3p4ZGtwdHJ3Mmdxb3A5MmcwZnY0bGdxcjl2ZWI3cnd4dGZ6and1ZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l7hW3QhDalRjW/giphy.gif",
    },
};

export const corPadrao = "#e8b04a";

export function corDe(nome) {
    return ninjas[nome]?.cor || corPadrao;
}