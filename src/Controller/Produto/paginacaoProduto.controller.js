const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SelectMenuBuilder } = require('discord.js')
const { buscarProdutosPaginacao } = require("../../Models/Produto/Repository/produto.repository")
const { EstoqueRepository } = require("../../Models/Produto/Repository/estoque.repository")
const { Types } = require("mongoose")
const util = require("../../Util/configuracao")

const estoqueRepository = new EstoqueRepository()

class PaginacaoController {
    constructor() {
        this.paginaAtual = 1
        this.totalDePaginas = 1
        this.limitePorPagina = 20
    }

    async escolherBotao(i) {
        var ultimoClick = null
        switch (i.customId) {
            case "voltartodosprodutos":
                this.paginaAtual = 1
                return this.retornadoDeDadosJaTradados(i)
            case "botaovoltarproduto":
                this.paginaAtual--
                return this.retornadoDeDadosJaTradados(i)
            case "botaopassarproduto":
                this.paginaAtual++
                return this.retornadoDeDadosJaTradados(i)
            case "passartodosprodutos":
                this.paginaAtual = this.totalDePaginas
                return this.retornadoDeDadosJaTradados(i)
            default:
                return ultimoClick = { clicou: i.customId, valor: i.values }
        }
    }

    async escolherBotaoEstoque(i, idProduto) {
        var ultimoClick = null
        switch (i.customId) {
            case "voltartodosprodutos":
                this.paginaAtual = 1
                return this.retornadoDeDadosJaTradadosEstoque(i, idProduto)
            case "botaovoltarproduto":
                this.paginaAtual--
                return this.retornadoDeDadosJaTradadosEstoque(i, idProduto)
            case "botaopassarproduto":
                this.paginaAtual++
                return this.retornadoDeDadosJaTradadosEstoque(i, idProduto)
            case "passartodosprodutos":
                this.paginaAtual = this.totalDePaginas
                return this.retornadoDeDadosJaTradadosEstoque(i, idProduto)
            default:
                return ultimoClick = { clicou: i.customId, valor: i.values }
        }
    }

    buscarDadosNoBDPorPaginacao(serverId) {
        return new Promise(async (resolve, reject) => {
            try {
                let options = []
                let dados = await buscarProdutosPaginacao(serverId, this.paginaAtual, 10)
                if (!dados.produto.length) return reject("Não tenho nenhum produto cadastrado.")
                dados.produto.map((resp, index) => {
                    const transformarNumberEmReal = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(resp.preco)
                    options.push({
                        label: resp.nome + " | Preço: " + transformarNumberEmReal,
                        description: resp.decricao ? resp.decricao : `Sem descrição ❔`,
                        value: JSON.stringify({ id: Types.ObjectId(resp._id).toString(), nome: resp.nome }),
                        emoji: util.padrao[index + 1]
                    })
                })
                resolve({ options: options, dados: dados })
            } catch (error) {
                reject(error)
            }
        })
    }

    buscarDadosNoBDPorPaginacaoEstoque(idProduto, serverId) {
        return new Promise(async (resolve, reject) => {
            try {
                let options = []
                let dados = await estoqueRepository.buscarEstoqueProdutoPaginacao(idProduto, serverId, this.paginaAtual, 10)
                dados.estoque.map((resp, index) => {
                    options.push({
                        label: resp.estoque,
                        description: resp.id ? `ID - ${Types.ObjectId(resp._id).toString()}` : `Sem descrição ❔`,
                        value: JSON.stringify({ id: Types.ObjectId(resp._id).toString() }),
                        emoji: util.padrao[index + 1]
                    })
                })
                resolve({ options: options, dados: dados })
            } catch (error) {
                reject(error)
            }
        })
    }

    async menuListagemPaginacao(dadosDB, quantidadeMaxima = 1) {
        try {
            const produtos = await dadosDB.options
            return new ActionRowBuilder()
                .addComponents(
                    new SelectMenuBuilder()
                        .setCustomId("selecionarproduto")
                        .setPlaceholder("Clique aqui para listar meus produtos 🖱️")
                        .setMinValues(1)
                        .setMaxValues(quantidadeMaxima)
                        .addOptions(produtos),
                )
        } catch (error) {
            return error
        }
    }

    botaoPaginacao() {
        try {
            const paginaAtual = this.paginaAtual
            const totalDePaginas = this.totalDePaginas
            return new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("voltartodosprodutos")
                        .setStyle(ButtonStyle.Success)
                        .setEmoji(util.padrao.emoteSetaVoltarTudo)
                        .setDisabled(paginaAtual === 1),
                    new ButtonBuilder()
                        .setCustomId("botaovoltarproduto")
                        .setStyle(ButtonStyle.Success)
                        .setEmoji(util.padrao.emoteSetaParaEsquerda)
                        .setDisabled(paginaAtual === 1),
                    new ButtonBuilder()
                        .setCustomId("paginaatual")
                        .setLabel(`${paginaAtual}|${totalDePaginas}`)
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setCustomId("botaopassarproduto")
                        .setStyle(ButtonStyle.Success)
                        .setEmoji(util.padrao.emoteSetaParaDireita)
                        .setDisabled(paginaAtual >= totalDePaginas),
                    new ButtonBuilder()
                        .setCustomId("passartodosprodutos")
                        .setStyle(ButtonStyle.Success)
                        .setEmoji(util.padrao.emoteSetaPassarTudo)
                        .setDisabled(paginaAtual >= totalDePaginas),
                )
        } catch (error) {
            return error
        }
    }

    async retornadoDeDadosJaTradados(i) {
        const dados = await this.buscarDadosNoBDPorPaginacao(i.guildId)
        this.paginaAtual = dados.dados.pagina
        this.totalDePaginas = dados.dados.quantidadePagina
        const menu = await this.menuListagemPaginacao(dados)
        const botoes = await this.botaoPaginacao()
        return dados.dados.produto.length !== 0 ? { menu: menu, botoes: botoes } : false
    }

    async retornadoDeDadosJaTradadosEstoque(i, idProduto) {
        const dados = await this.buscarDadosNoBDPorPaginacaoEstoque(idProduto, i.guildId)
        this.paginaAtual = dados.dados.pagina
        this.totalDePaginas = dados.dados.quantidadePagina
        const menu = await this.menuListagemPaginacao(dados, dados.dados.estoque.length)
        const botoes = await this.botaoPaginacao()
        return dados.dados.length !== 0 ? { menu: menu, botoes: botoes } : false
    }

}

module.exports = {
    PaginacaoController
}