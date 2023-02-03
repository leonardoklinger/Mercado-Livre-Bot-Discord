const produtoSchema = require("../Model/produto.model")
const setarProdutoSchema = require("../Model/setarProduto.model")
const { emoteSucesso } = require("../../../Util/configuracao")

class ProdutoRepository {
    buscarProdutoEspecifico(idServidor, idProduto) {
        return new Promise(async (resolve, reject) => {
            if (!idServidor) return reject("Informe o id do servidor")
            if (!idProduto) return reject("Informe o id do produto")
            try {
                let produto = await produtoSchema.findOne({ serverid: idServidor, _id: idProduto })
                if (!produto) return resolve(null)
                resolve(produto)
            } catch (error) {
                reject(error)
            }
        })
    }

    buscarProdutosPaginacao(idServidor, pagina, limite) {
        return new Promise(async (resolve, reject) => {
            const paginaAtual = pagina ? pagina : 1
            const limiteAtual = limite ? limite : 10
            try {
                let produto = await produtoSchema.find({ serverid: idServidor }).skip((paginaAtual - 1) * limiteAtual).limit(limiteAtual)
                resolve({ pagina: paginaAtual, quantidadePagina: Math.ceil((await produtoSchema.find({ serverid: idServidor })).length / limite), produto: produto })
            } catch (error) {
                reject(error)
            }
        })
    }

    cadastrarProduto(nome, preco, decricao, serverid) {
        const produto = new produtoSchema({
            nome: nome,
            preco: preco,
            descricao: decricao,
            serverid: serverid,
        })

        return new Promise(async (resolve, reject) => {
            try {
                await produto.save()
                resolve(`Produto **${nome}** cadastrado com sucesso ${emoteSucesso}`)
            } catch (error) {
                reject(error)
            }
        })
    }

    editarProduto = (id, nome, preco, descricao) => {
        const produtoEditar = ({
            nome: nome,
            preco: preco,
            descricao: descricao,
        })

        return new Promise(async (resolve, reject) => {
            try {
                await produtoSchema.findByIdAndUpdate({ _id: id }, produtoEditar)
                resolve(`Produto **${nome}** editado com sucesso ${emoteSucesso}`)
            } catch (error) {
                return reject(error)
            }
        })
    }

    cadastrarProduto(nome, preco, decricao, serverid) {
        const produto = new produtoSchema({
            nome: nome,
            preco: preco,
            decricao: decricao,
            serverid: serverid,
        })

        return new Promise(async (resolve, reject) => {
            try {
                await produto.save()
                resolve(`Produto **${nome}** cadastrado com sucesso ${emoteSucesso}`)
            } catch (error) {
                reject(error)
            }
        })
    }

    setarProduto(serverid, canalId, produtoId, messageId) {
        const produto = new setarProdutoSchema({
            produtoid: produtoId,
            serverid: serverid,
            canalid: canalId,
            messageid: messageId
        })

        return new Promise(async (resolve, reject) => {
            try {
                await produto.save()
                resolve(`Produto fixado com sucesso ${emoteSucesso}`)
            } catch (error) {
                reject(error)
            }
        })
    }

    buscarProdutoEspecificoSetado(idServidor, idProduto, canalId) {
        return new Promise(async (resolve, reject) => {
            if (!idServidor) return reject("Informe o id do servidor")
            if (!idProduto) return reject("Informe o id do produto")
            if (!canalId) return reject("Informe o id do canal")
            try {
                let produto = await setarProdutoSchema.findOne({ serverid: idServidor, produtoid: idProduto, canalid: canalId })
                if (!produto) return resolve(null)
                resolve(produto)
            } catch (error) {
                reject(error)
            }
        })
    }

    deletarProduto(idServidor, idProduto) {
        return new Promise(async (resolve, reject) => {
            if (!idServidor) return reject("Informe o id do servidor")
            if (!idProduto) return reject("Informe o id do produto")
            try {
                let produto = await produtoSchema.findByIdAndDelete({ serverid: idServidor, _id: idProduto })
                if (!produto) return resolve(null)
                resolve(produto)
            } catch (error) {
                reject(error)
            }
        })
    }
}

module.exports = new ProdutoRepository()