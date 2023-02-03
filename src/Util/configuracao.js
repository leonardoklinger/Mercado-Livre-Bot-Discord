const padrao = {
    1: "1️⃣",
    2: "2️⃣",
    3: "3️⃣",
    4: "4️⃣",
    5: "5️⃣",
    6: "6️⃣",
    7: "7️⃣",
    8: "8️⃣",
    9: "9️⃣",
    10: "🔟",
    corEmbed: "#3fff20",
    nomeLoja: "Veigarista Shop",
    emoteSucesso: "<:emoteSucesso:1037836648865611836>",
    emoteProduto: "<:produtoEmote:1037829678427291798>",
    emoteEditar: "<:editarEmote:1037828258256920596>",
    emoteLixeira: "<:lixeiraEmote:1037827511670820946>",
    emoteSetaParaBaixo: "<:setaParaBaixoEmote:1038221971638472754>",
    emoteSetaParaDireita: "<:setaParaLadoDireito:1038223168176914474>",
    emoteSetaParaEsquerda: "<:setaParaLadoEsquerdo:1038223195813200012>",
    emoteSetaVoltarTudo: "<:setaTodoParaTras:1038228947147698308>",
    emoteSetaPassarTudo: "<:setaTudoParaFrente:1038228964029771826>",
    emotecarrinho: "<:emoteCarrinho:1038226272498757642>",
    imagemEmbed: "https://media.discordapp.net/attachments/726279288827150407/1037824464433459331/VeigaristaEcommerce.png",
    banner: "https://media.discordapp.net/attachments/726279288827150407/1037824464433459331/VeigaristaEcommerce.png",
    emoteAdicionar: "<:emoteAdd:1040701243502362625>",
    emoteSubtrair: "<:emoteMenos:1040701469961232394> ",
    emoteBackup: "<:emoteBackup:1040700059404210286>",
    emoteCarregando: "<a:3339_loading:1040694802582347786>"
}

function apagarMessage(canal, id, tempo = 0) {
    setTimeout(() => {
        canal?.messages.fetch(id).then(m => {
            m.delete()//Apaga msg user
        }).catch((error) => { return })
    }, tempo)
}

module.exports = {
    padrao,
    apagarMessage
}