const configuracaoSchema = require("../Model/configuracao.model")
const { emoteSucesso } = require("../../../Util/configuracao")

class ConfiguracaoRepository {
    gravarConfiguracoesServidor(idServidor) {
        const configuracao = new configuracaoSchema({
            idServidor: idServidor,
        })

        return new Promise(async (resolve, reject) => {
            try {
                const dados = await configuracao.save()
                resolve(dados)
            } catch (error) {
                reject(error)
            }
        })
    }

    buscarConfiguracoesServidor(idServidor) {
        return new Promise(async (resolve, reject) => {
            try {
                const dados = await configuracaoSchema.findOne({ idServidor: idServidor })
                resolve(dados)
            } catch (error) {
                reject(error)
            }
        })
    }

    buscarTodasConfiguracoesServidor() {
        return new Promise(async (resolve, reject) => {
            try {
                const dados = await configuracaoSchema.find()
                resolve(dados)
            } catch (error) {
                reject(error)
            }
        })
    }

    removerConfiguracoesServidor(idServidor) {
        return new Promise(async (resolve, reject) => {
            try {
                await configuracaoSchema.deleteOne({ idServidor: idServidor })
                resolve(`Dados de configuração desabilitados com sucesso ${emoteSucesso}`)
            } catch (error) {
                reject(error)
            }
        })
    }
}

module.exports = new ConfiguracaoRepository()