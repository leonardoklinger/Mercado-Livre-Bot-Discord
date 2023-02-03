const color = require("colors")

class LigarBot {
    constructor(client, token, comandosArrayCheck) {
        client.on("ready", async () => {//Evento quando o bot liga
            console.log(`${client.user.tag + color.green.bold(`ligado com sucesso!`)}\n--------------------------------`)
            console.log(" Comandos carregados:".bold)

            try {
                const files = await comandosArrayCheck
                if (!files) return console.log(" Não foi possivel carregar meus comandos".red + "\n--------------------------------")
                files.map(files => { //Imprime todos os comandos carregados com sucesso
                    console.log(`  ${files.name} ✅`.green)
                    client.slashCommands.set(files?.name, files)
                })

                console.log("--------------------------------")
                client.guilds.cache.forEach(guild => guild.commands.set(files))//Seta os comandos no servidor
            } catch (error) {
                console.log(color.red(error))
            }
        })

        client.login(token)//Liga o bot
    }
}

module.exports = {
    LigarBot
}