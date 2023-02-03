const fs = require("fs")//Biblioteca nativa para carregar os arquivos
const { PermissaoMiddleware } = require('../../Middleware/permissao.middleware')

class EventoComandoHandler {
    constructor() {
        let SlashsArray = []
        return new Promise((resolve, reject) => {//Cria uma promise
            fs.readdir(`./src/Commands`, (error, folder) => {//Entra dentro da pasta Commands
                if (!folder) return console.log("Não achei a pasta distanada para os comandos!\n".bgRed)
                folder.forEach(subfolder => {//Percorre as sub pastas
                    fs.readdir(`./src/Commands/${subfolder}/`, (error, files) => {//Entra dentro dentro das sub pastas
                        files.forEach(files => {//Carrega os arquivos dentro das pastas
                            if (!files?.endsWith('.js')) return//Verifica se o formatado é JS
                            files = require(`../../Commands/${subfolder}/${files}`)//Chama o arquivo
                            if (!files?.name) return//Verifica se existe esse arquivo realmente
                            SlashsArray.push(files)//Lança o arquivo no array
                            resolve(SlashsArray)//Depois manda o array preenchido
                            new PermissaoMiddleware().guardaComandos(files)
                        })
                    })
                })
            })
        })
    }
}

module.exports = {
    EventoComandoHandler
}