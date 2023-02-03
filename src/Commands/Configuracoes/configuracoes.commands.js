const { ApplicationCommandType, PermissionsBitField } = require("discord.js")
const { ConfiguracaoController } = require("../../Controller/Configuracao/configuracao.controller")

module.exports = {
    name: "configuracao",
    description: "Configure seu bot do seu jeito ⚙️",
    type: ApplicationCommandType.ChatInput,
    permissao: PermissionsBitField.Flags.Administrator,
    run: async (client, interaction) => {
        try {
            const controllerConfig = new ConfiguracaoController()

            const msg = await interaction.reply({ embeds: [controllerConfig.embedConfiguracao(client)], components: [controllerConfig.menuConfiguracao()], fetchReply: true })
            const collector = msg.createMessageComponentCollector({
                filter: i => i.user.id === interaction.user.id,
                time: 120000,
                max: 5
            })

            collector.on("collect", async (i) => {
                await controllerConfig.qualComando(i)
            })
        } catch (error) {
            await interaction.channel.send({ content: `${error}`, components: [] })
        }
    }
}