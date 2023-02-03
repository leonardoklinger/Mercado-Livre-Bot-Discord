const { ApplicationCommandType, PermissionsBitField } = require('discord.js')

module.exports = {
    name: "setar",
    description: "Setar vendas em um canal especifico. 📦",
    type: ApplicationCommandType.ChatInput,
    permissao: PermissionsBitField.Flags.Administrator,

    run: async (client, interaction) => {

    }
}