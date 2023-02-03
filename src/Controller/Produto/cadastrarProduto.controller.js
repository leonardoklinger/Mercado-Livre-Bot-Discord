const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js')
const { cadastrarProduto } = require("../../Models/Produto/Repository/produto.repository")
const util = require("../../Util/configuracao")

class CadastrarProdutoController {
    //Modal cadastro produto
    async modal(interaction) {
        const modal = new ModalBuilder()
            .setCustomId("crudmodal")
            .setTitle("Cadastro Produto");

        const nome = new TextInputBuilder()
            .setCustomId("cadastronome")
            .setLabel("Nome")
            .setStyle(TextInputStyle.Short)
            .setMaxLength(255)
            .setPlaceholder("Informe um nome")
            .setRequired(true)

        const valor = new TextInputBuilder()
            .setCustomId("cadastrovalor")
            .setLabel("Preço (R$)")
            .setStyle(TextInputStyle.Short)
            .setMaxLength(10)
            .setPlaceholder("Exemplo: 10.80")
            .setRequired(true)

        const descricao = new TextInputBuilder()
            .setCustomId("cadastrodescricao")
            .setLabel("Descrição")
            .setStyle(TextInputStyle.Paragraph)
            .setMaxLength(500)
            .setPlaceholder("Informe uma descrição (Não opcional)")
            .setRequired(false)

        const nomeActionRow = new ActionRowBuilder().addComponents(nome)
        const valorActionRow = new ActionRowBuilder().addComponents(valor)
        const descricaoActionRow = new ActionRowBuilder().addComponents(descricao)

        modal.addComponents(nomeActionRow, valorActionRow, descricaoActionRow)
        try {
            await interaction.showModal(modal)
        } catch (error) {
            await interaction.channel.send({ content: `${error}`, components: [] })
        }
    }

    //Cadastrando um produto
    async cadastrarProduto(interaction) {
        try {
            const dados = await this.dadosModal(interaction)
            const { nome, valor, descricao } = dados
            const canal = await interaction.guild.channels.cache.get(interaction.channelId)
            if (dados.content) return interaction.reply({ content: dados.content, fetchReply: true })
                .then(replyMessage => util.apagarMessage(canal, replyMessage.id, 10000))

            const produto = await cadastrarProduto(nome, valor, descricao ?? descricao, interaction.guildId)
            await interaction.reply({ content: produto, fetchReply: true }).then(replyMessage => util.apagarMessage(canal, replyMessage.id, 3000))
        } catch (error) {
            await interaction.channel.send({ content: `${error}`, components: [] })
        }
    }

    //Pegando dados dos campus inputs modal
    async dadosModal(interaction) {
        try {
            const nome = interaction.fields.getTextInputValue('cadastronome')
            const valor = interaction.fields.getTextInputValue('cadastrovalor')
            const descricao = interaction.fields.getTextInputValue('cadastrodescricao')
            const valorNumber = Number(valor)

            if (!nome) return { content: "Informe um nome para seu produto" }
            if (!valor) return { content: "Informe um valor para seu produto" }
            if (isNaN(valorNumber)) return { content: "Por favor, informe um valor legível" }

            return { nome, valor, descricao }
        } catch (error) {
            await interaction.channel.send({ content: `${error}` })
        }
    }
}

module.exports = {
    CadastrarProdutoController
}