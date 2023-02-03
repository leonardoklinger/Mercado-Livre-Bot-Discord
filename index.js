require("dotenv").config()
const { GatewayIntentBits, Client, Collection, InteractionType } = require("discord.js")
const { EventoComandoHandler, LigarBot, MongoDB, ModalEvents } = require("./src/Events/")
const { PermissaoMiddleware } = require("./src/Middleware/permissao.middleware")

class BotPayment {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        })
        //-------------- Seta os comandos --------------
        this.client.slashCommands = new Collection()
        //-------------- -=                       =- --------------

        //-------------- Eventos --------------
        this.events()
        //-------------- -=       =- --------------

        this.client.on("interactionCreate", async (interaction) => {
            await new ModalEvents().eventoModal(interaction)
            const middleware = await new PermissaoMiddleware().permissaoUser(interaction)
            switch (middleware) {
                case false:
                    this.comandosCarregar(interaction)
                    break;

                case true:
                    this.comandosCarregar(interaction)
                    break;

                default:
                    break;
            }
        })
    }

    async events() {
        try {
            new LigarBot(this.client, process.env.TOKEN_DISCORD, await new EventoComandoHandler())
            new MongoDB()
        } catch (error) {
            console.error(error)
        }
    }

    async comandosCarregar(interaction) {
        try {
            const permissao = await new PermissaoMiddleware().permissaoComando(interaction)
            if (!interaction.isChatInputCommand()) return
            if (interaction.type === InteractionType.ApplicationCommand) {
                if (permissao) {
                    const cmd = this.client.slashCommands.get(interaction.commandName)
                    if (!cmd) return await interaction.reply("Error")
                    interaction["member"] = interaction.guild.members.cache.get(interaction.user.id)
                    cmd.run(this.client, interaction)
                }
            }
        } catch (error) {
            return await interaction.channel.send({ content: `${error}` })
        }
    }
}

new BotPayment()