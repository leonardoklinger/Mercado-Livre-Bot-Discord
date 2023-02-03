const { ApplicationCommandType, PermissionsBitField } = require('discord.js')
const { EstoqueProdutoController } = require("../../Controller/Produto/estoqueProduto.controller")
const { PaginacaoController } = require("../../Controller/Produto/paginacaoProduto.controller")
const util = require("../../Util/configuracao")

const estoqueProdutoController = new EstoqueProdutoController()
const paginacaoController = new PaginacaoController()

module.exports = {
    name: "estoque",
    description: "Configurar estoque 🛒",
    type: ApplicationCommandType.ChatInput,
    permissao: PermissionsBitField.Flags.Administrator,

    run: async (client, interaction) => {
        try {
            const dadosRetorno = await paginacaoController.retornadoDeDadosJaTradados(interaction)
            const msg = await interaction.reply({ embeds: [estoqueProdutoController.embedPrincipal()], components: [dadosRetorno.menu, dadosRetorno.botoes], fetchReply: true })
            const col = msg.createMessageComponentCollector({
                filter: i => i.user.id === interaction.user.id,
                time: 240000,
                max: 20
            })

            col.on("collect", async (i) => {
                const dadosRetorno = await paginacaoController.escolherBotao(i)
                if (!dadosRetorno) return
                if (dadosRetorno.clicou && dadosRetorno.clicou === "selecionarproduto") {
                    return estoqueProdutoController.produtoSelecionadoEmbed(i, dadosRetorno.valor)
                }
                await i.update({ components: [dadosRetorno.menu, dadosRetorno.botoes] })
            })

            col.on("end", async () => {
                const canal = await interaction.guild.channels.cache.get(interaction.channelId)
                util.apagarMessage(canal, msg.id)
                col.stop()
            })

        } catch (error) {
            await interaction.channel.send({ content: `${error}`, embeds: [], components: [] })
        }
    }
}