const { ActionRowBuilder, SelectMenuBuilder, EmbedBuilder } = require("discord.js")
const { buscarConfiguracoesServidor, gravarConfiguracoesServidor, buscarTodasConfiguracoesServidor, removerConfiguracoesServidor } = require("../../Models/Configuracao/Repository/configuracao.repository")
const { corEmbed, nomeLoja, emoteSetaParaBaixo } = require("../../Util/configuracao")
const util = require("../../Util/configuracao")

class ConfiguracaoController {
    async qualComando(interaction) {
        switch (interaction.values.toString()) {
            case "habilitar_comandos":
                await this.habilitarComandos(interaction)
                break;

            case "desabilitar_comandos":
                await this.desabilitarComandos(interaction)
                break;
            default:
                break;
        }
    }

    menuConfiguracao() {
        return new ActionRowBuilder()
            .addComponents(
                new SelectMenuBuilder()
                    .setCustomId("setarservidor")
                    .setPlaceholder("Selecione uma das opções")
                    .setMinValues(1)
                    .setMaxValues(1)
                    .addOptions(
                        {
                            label: "🔐Habilitar meus comandos",
                            description: "Utilize para deixar seu servidor apto para utilizar meus comandos.",
                            value: "habilitar_comandos",
                        },
                        {
                            label: "🔓 Desabilitar meus comandos",
                            description: "Desative meus comandos.",
                            value: "desabilitar_comandos",
                        },
                    ),
            )
    }

    embedConfiguracao(client) {
        return new EmbedBuilder()
            .setColor(corEmbed)
            .setAuthor({ name: `${nomeLoja} - Configurações ⚙️`, iconURL: client.user.displayAvatarURL() })
            .setDescription(`Selecione uma configuração no **menu** abaixo. ${emoteSetaParaBaixo}`)
            .setFooter({ text: `${nomeLoja} - clique abaixo para configurar seu servidor` })
    }

    async habilitarComandos(interaction) {
        try {
            const configuracao = await buscarTodasConfiguracoesServidor()

            if (!await buscarConfiguracoesServidor(interaction.guildId)) {
                if (configuracao.length >= 1) return await this.messageReply(interaction, `${interaction.user}, infelizmente só posso utilizar meus comandos em apenas 1 servidor!`, 2000)

                await this.messageReply(interaction, `${interaction.user}, agora seu servidor está apto para receber meus comandos.`, 2000)

                return await gravarConfiguracoesServidor(interaction.guildId, true)
            } else {
                await this.messageReply(interaction, `${interaction.user}, seu servidor já está apto para receber meus comandos`, 2000)
            }
        } catch (error) {
            await interaction.channel.send({ content: `${error}`, components: [] })
        }

    }

    async desabilitarComandos(interaction) {
        try {
            const configuracao = await buscarConfiguracoesServidor(interaction.guildId)
            if (!configuracao) return await this.messageReply(interaction, `${interaction.user}, não encontrei nenhum comando habilitado para este servidor!`, 2000)

            const removerConfiguracao = await removerConfiguracoesServidor(interaction.guildId)
            await this.messageReply(interaction, `${removerConfiguracao}`, 2000)
        } catch (error) {
            await interaction.channel.send({ content: `${error}`, components: [] })
        }
    }

    async messageReply(interaction, message, tempo) {
        const msg = await interaction.reply({ content: message, components: [], fetchReply: true })
        const canal = await interaction.guild.channels.cache.get(interaction.channelId)
        util.apagarMessage(canal, msg.id, tempo)
    }
}

module.exports = {
    ConfiguracaoController
}