const estoqueSchema = require("../Model/estoque.model")

class EstoqueRepository {
    adicionarEstoque(idProduto, serverId, estoque) {
        return new Promise(async (resolve, reject) => {
            try {
                const dados = estoque.map(element => ({ "produtoid": idProduto, "serverid": serverId, "estoque": element }))
                await estoqueSchema.insertMany(dados)
                resolve()
            } catch (error) {
                reject(error)
            }
        })
    }

    buscarEstoqueProdutoPaginacao(idProduto, serverId, pagina, limite) {
        return new Promise(async (resolve, reject) => {
            const paginaAtual = pagina ? pagina : 1
            const limiteAtual = limite ? limite : 10
            try {
                const estoque = await estoqueSchema.find({ produtoid: idProduto, serverid: serverId }).skip((paginaAtual - 1) * limiteAtual).limit(limiteAtual)
                resolve({ pagina: paginaAtual, quantidadePagina: Math.ceil((await estoqueSchema.find({ produtoid: idProduto, serverid: serverId })).length / limite), estoque: estoque })
            } catch (error) {
                reject(error)
            }
        })
    }

    buscarEstoqueEspecifico(idProduto) {
        return new Promise(async (resolve, reject) => {
            try {
                const dados = await estoqueSchema.findById({ _id: idProduto })
                resolve(dados)
            } catch (error) {
                reject(error)
            }
        })
    }

    buscarTodosEstoqueProdutoEspecifico(idProduto, serverId) {
        return new Promise(async (resolve, reject) => {
            try {
                const dados = await estoqueSchema.find({ produtoid: idProduto, serverid: serverId })
                resolve(dados)
            } catch (error) {
                reject(error)
            }
        })
    }

    removerEstoque(idProduto, serverId) {
        return new Promise(async (resolve, reject) => {
            try {
                let IdsArray = []
                idProduto.forEach(async (element) => {
                    const dados = await this.buscarEstoqueEspecifico(element)
                    if (!dados) {
                        IdsArray.push(element)
                    }
                })
                await estoqueSchema.deleteMany({ _id: idProduto, serverid: serverId })
                resolve(IdsArray)
            } catch (error) {
                reject(error)
            }
        })
    }
}

module.exports = {
    EstoqueRepository
}