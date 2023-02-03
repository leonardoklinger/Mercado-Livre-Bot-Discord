const { ApplicationCommandType, PermissionsBitField } = require('discord.js')
const { CrudController } = require("../../Controller/Produto/crudProduto.controller")
const util = require("../../Util/configuracao")

module.exports = {
    name: "crudproduto",
    description: "Cadastre/edite/exclui um produto 📦",
    type: ApplicationCommandType.ChatInput,
    permissao: PermissionsBitField.Flags.Administrator,

    run: async (client, interaction) => {
        try {
            const crudController = new CrudController()
            const msg = await interaction.reply({ content: `${interaction.user}, o que você deseja fazer?`, embeds: [crudController.embedInicial()], components: [crudController.botao()], fetchReply: true })
            const col = msg.createMessageComponentCollector({
                filter: i => i.user.id === interaction.user.id,
                time: 240000,
                max: 20
            })

            col.on("collect", async (i) => {
                await crudController.controladorDeEvento(i, col)
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