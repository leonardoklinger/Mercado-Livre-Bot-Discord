const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } = require('discord.js')
const { buscarProdutoEspecifico, editarProduto } = require("../../Models/Produto/Repository/produto.repository")
const { PaginacaoController } = require("./paginacaoProduto.controller")
const util = require("../../Util/configuracao")


const paginacaoController = new PaginacaoController()

class EditarProdutoController {
    //Embed do crud
    embedEdicao() {
        return new EmbedBuilder()
            .setColor(util.padrao.corEmbed)
            .setTitle(`${util.padrao.nomeLoja} - Painel de edição`)
            .setImage(util.padrao.imagemEmbed)
            .setFooter({ text: "Você tem apenas 4 minutos ⏰ e 20 tentativas 🖱️ para utiliziar este comando. Após irá ficar inválido! ❌" })
    }

    //Modal de edição
    async modalEdit(interaction, idValue, nomeValue, valorValue, descricaoValue) {
        const modal = new ModalBuilder()
            .setCustomId("modaleditar")
            .setTitle("Edição de Produto");

        const id = new TextInputBuilder()
            .setCustomId("cadastroid")
            .setLabel("Id do produto não alterar !!!!")
            .setStyle(TextInputStyle.Short)
            .setMaxLength(24)
            .setPlaceholder("Não alterar!!!!!!!!!")
            .setRequired(false)
            .setValue(String(idValue ? idValue : ""))

        const nome = new TextInputBuilder()
            .setCustomId("cadastronome")
            .setLabel("Nome")
            .setStyle(TextInputStyle.Short)
            .setMaxLength(255)
            .setPlaceholder("Informe um nome")
            .setRequired(false)
            .setValue(String(nomeValue ? nomeValue : ""))

        const valor = new TextInputBuilder()
            .setCustomId("cadastrovalor")
            .setLabel("Preço (R$)")
            .setStyle(TextInputStyle.Short)
            .setMaxLength(10)
            .setPlaceholder("Exemplo: 10.80")
            .setRequired(false)
            .setValue(String(valorValue ? valorValue : ""))

        const descricao = new TextInputBuilder()
            .setCustomId("cadastrodescricao")
            .setLabel("Descrição")
            .setStyle(TextInputStyle.Paragraph)
            .setMaxLength(500)
            .setPlaceholder("Informe uma descrição (Não opcional)")
            .setRequired(false)
            .setValue(String(descricaoValue ? descricaoValue : ""))

        const idActionRow = new ActionRowBuilder().addComponents(id)
        const nomeActionRow = new ActionRowBuilder().addComponents(nome)
        const valorActionRow = new ActionRowBuilder().addComponents(valor)
        const descricaoActionRow = new ActionRowBuilder().addComponents(descricao)

        modal.addComponents(idActionRow, nomeActionRow, valorActionRow, descricaoActionRow)
        try {
            await interaction.showModal(modal)
        } catch (error) {
            await interaction.channel.send({ content: `${error}`, components: [] })
        }
    }

    //Coletando e editando dados coletados no banco de dados
    async editarProduto(interaction) {
        try {
            const dadosRetorno = await paginacaoController.retornadoDeDadosJaTradados(interaction)
            await interaction.deferUpdate()
            const msg = await interaction.editReply({ content: `${interaction.user}, Painel de Edição <:lapisEmote:1037826894453805066>`, embeds: [this.embedEdicao()], components: [dadosRetorno.menu, dadosRetorno.botoes] })
            const canal = await interaction.guild.channels.cache.get(interaction.channelId)
            const coll = msg.createMessageComponentCollector({
                filter: i => i.user.id === interaction.user.id,
                time: 240000,
                max: 20
            })

            coll.on("collect", async (i) => {
                const dadosRetorno = await paginacaoController.escolherBotao(i)
                if (!dadosRetorno) return
                if (dadosRetorno.clicou && dadosRetorno.clicou === "selecionarproduto") {
                    const id = JSON.parse(i.values).id
                    const buscarProduto = await buscarProdutoEspecifico(i.guildId, id)

                    if (!buscarProduto) return i.channel.send({ content: `${interaction.user}, Não existe nenhum produto com este **ID**`, components: [], fetchReply: true })
                        .then(replyMessage => util.apagarMessage(canal, replyMessage.id, 3000))

                    const { nome, preco, decricao } = buscarProduto
                    return await this.modalEdit(i, id, nome, preco, decricao)
                }
                await i.update({ components: [dadosRetorno.menu, dadosRetorno.botoes] })
            })
        } catch (error) {
            await interaction.channel.send({ content: `${error}`, components: [] })
        }
    }

    //Salvando alterações feitas
    async editarProdutoSubmit(interaction) {
        try {
            const id = interaction.fields.getTextInputValue('cadastroid')
            const nome = interaction.fields.getTextInputValue('cadastronome')
            const valor = interaction.fields.getTextInputValue('cadastrovalor')
            const descricao = interaction.fields.getTextInputValue('cadastrodescricao')
            const valorNumber = Number(valor)
            const canal = await interaction.guild.channels.cache.get(interaction.channelId)

            if (!id) return "Informe o id do seu produto"
            if (isNaN(valorNumber)) return "Por favor, informe um valor legível"
            const dadosId = await buscarProdutoEspecifico(interaction.guildId, id)
            if (!dadosId) return "Não existe nenhum produto cadastro com este Id"
            const dadosEditado = await editarProduto(id, nome, valorNumber, descricao)

            await interaction.deferUpdate()
            interaction.followUp({ content: dadosEditado, fetchReply: true })
                .then(replyMessage => util.apagarMessage(canal, replyMessage.id, 3000))
        } catch (error) {
            await interaction.channel.send({ content: `${error}`, components: [] })
        }
    }
}

module.exports = {
    EditarProdutoController
}