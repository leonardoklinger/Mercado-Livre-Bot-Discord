const { buscarConfiguracoesServidor } = require("../Models/Configuracao/Repository/configuracao.repository")
const { name } = require("../Commands/Configuracoes/configuracoes.commands")
const util = require("../Util/configuracao")

const { EmbedBuilder } = require("discord.js")

let comandoArray = []
class PermissaoMiddleware {
    guardaComandos(comandos) {
        comandoArray.push(comandos)
    }

    async permissaoUser(interaction) {
        const texto = `${interaction.user} Sinto muito, servidor não está apto para usar meus comandos!\nUse **/${name}** para habilitar meus comandos`

        if (!interaction.commandName) return
        if ((interaction.commandName === name) && !(await buscarConfiguracoesServidor(interaction.guildId))) {
            return false
        } else if (await buscarConfiguracoesServidor(interaction.guildId)) {
            return true
        } else {
            return await interaction.reply(texto)
        }
    }

    permissaoComando(interaction) {
        return new Promise((resolve) => {
            comandoArray.forEach(async element => {
                try {
                    const canal = await interaction.guild.channels.cache.get(interaction.channelId)
                    if (element.name === interaction.commandName) {
                        if (interaction.memberPermissions.has(element.permissao)) {
                            resolve(true)
                        } else {
                            const semPermissao = new EmbedBuilder()
                                .setColor("Red")
                                .setDescription("```Você não possui permissão para utilizar este comando```")
                            await interaction.reply({ embeds: [semPermissao], fetchReply: true })
                                .then(replyMessage => util.apagarMessage(canal, replyMessage.id, 3000))
                        }
                    }
                } catch (error) {
                    return await interaction.channel.send({ content: `${error}` })
                }
            })
        })
    }
}

module.exports = {
    PermissaoMiddleware
}