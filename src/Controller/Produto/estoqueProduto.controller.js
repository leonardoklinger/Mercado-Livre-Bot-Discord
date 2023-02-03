const moment = require("moment")
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder } = require("discord.js")
const util = require("../../Util/configuracao")
const { EstoqueRepository } = require("../../Models/Produto/Repository/estoque.repository")
const { PaginacaoController } = require("./paginacaoProduto.controller")

const estoqueRepository = new EstoqueRepository()
const paginacaoController = new PaginacaoController()

moment.locale("pt-br")

class EstoqueProdutoController {
    embedPrincipal() {
        return new EmbedBuilder()
            .setColor(util.padrao.corEmbed)
            .setTitle(`${util.padrao.nomeLoja} - Sistema de Estoque`)
            .setImage(util.padrao.imagemEmbed)
    }

    embedEstoque(nomeProduto) {
        return new EmbedBuilder()
            .setColor(util.padrao.corEmbed)
            .setTitle(`Gerencia o estoque do produto: __${nomeProduto}__`)
            .setImage("https://media.discordapp.net/attachments/895665781566754850/1055575387058470922/estoque-pronto.png?width=496&height=496")
            .setFooter({ text: "Você tem 4 minutos ⏰ para utilizar este comando." })
    }

    embedExclusao() {
        return new EmbedBuilder()
            .setColor(util.padrao.corEmbed)
            .setTitle(`Painel Exclusão`)
            .setDescription(`❗ **Atenção** ❗\nEstoques que foram removidos utilizando este comandos será permanentemente excluidos (Sem recuperação de dados)\nAntes de fazer qualquer alteração utilize o comando **Backup**.`)
            .setFooter({ text: "Você tem 4 minutos ⏰ para utilizar este comando." })
    }

    botoesEstoque() {
        return new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("adicionarestoque")
                    .setLabel("Adicionar")
                    .setEmoji(util.padrao.emoteAdicionar)
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("limparestoque")
                    .setLabel("Remover")
                    .setEmoji(util.padrao.emoteSubtrair)
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId("backupestoque")
                    .setLabel("Backup")
                    .setEmoji(util.padrao.emoteBackup)
                    .setStyle(ButtonStyle.Secondary),
            )
    }

    async produtoSelecionadoEmbed(i, produto) {
        try {
            await i.deferUpdate()
            const canal = await i.guild.channels.cache.get(i.channelId)
            const msg = await i.followUp({ embeds: [this.embedEstoque(JSON.parse(produto).nome)], components: [this.botoesEstoque()] })
            const col = msg.createMessageComponentCollector({
                filter: interaction => interaction.user.id === i.user.id,
                time: 240000
            })

            col.on("collect", async (i) => {
                this.estoqueControlador(i, produto)
            })

            col.on("end", async () => {
                util.apagarMessage(canal, msg.id)
                col.stop()
            })
        } catch (error) {
            await i.channel.send({ content: `${error}`, components: [] })
        }
    }

    estoqueControlador(i, produto) {
        switch (i.customId) {
            case "adicionarestoque":
                this.adicionarEstoque(i, produto)
                break
            case "limparestoque":
                this.limparEstoque(i, produto)
                break
            case "backupestoque":
                this.backupEstoque(i, produto)
                break
            default:
                break
        }
    }

    async adicionarEstoque(i, produto) {
        const canal = await i.guild.channels.cache.get(i.channelId)

        await i.deferUpdate()
        i.followUp({ content: `${util.padrao.emoteCarregando}| Envie seus novos produtos`, fetchReply: true })
            .then((msg) => {
                i.channel.awaitMessages({ filter: message => message.author.id === i.user.id, max: 1, time: 240000, errors: ['time'] })
                    .then(async collected => {
                        try {
                            const arrayProduto = collected.first().content.split(/\r?\n|\r/g).filter(p => p.length !== 0)
                            const { id, nome } = JSON.parse(produto)
                            const quantidadeProduto = arrayProduto.length

                            await estoqueRepository.adicionarEstoque(id, i.guildId, arrayProduto)
                            const estoqueMessage = await i.followUp({ content: `${i.user}, você adicionou **${quantidadeProduto}** ${quantidadeProduto > 1 ? "estoques" : "estoque"} para o produto __${nome}__ com sucesso ${util.padrao.emoteSucesso}` })

                            util.apagarMessage(canal, collected.first().id)//Apaga msg user
                            util.apagarMessage(canal, msg.id)//Apaga mensagem Envie seus novos produtos
                            util.apagarMessage(canal, estoqueMessage.id, 5000)//Apaga mensagem de estoque cadastro com sucesso

                        } catch (error) {
                            await i.followUp({ content: `${error}` })
                        }
                    }).catch(() => {
                        this.apagarMessage(canal, msg.id)
                    })
            })
    }

    async limparEstoque(i, produto) {
        try {
            const idProduto = JSON.parse(produto).id
            const canal = await i.guild.channels.cache.get(i.channelId)
            const dadosRetorno = await paginacaoController.retornadoDeDadosJaTradadosEstoque(i, idProduto)
            const msg = await i.reply({ embeds: [this.embedExclusao()], components: [dadosRetorno.menu, dadosRetorno.botoes], fetchReply: true })
            const col = msg.createMessageComponentCollector({
                filter: interaction => interaction.user.id === i.user.id,
                time: 240000,
                max: 20
            })

            col.on("collect", async (i) => {
                const dadosRetorno = await paginacaoController.escolherBotaoEstoque(i, idProduto)
                if (!dadosRetorno) return
                if (dadosRetorno.clicou && dadosRetorno.clicou === "selecionarproduto") {
                    let removerEstoqueEspecifico = i.values.map(estoque => JSON.parse(estoque).id)
                    const tamanhoEstoque = removerEstoqueEspecifico.length
                    const estoqueRemovido = await estoqueRepository.removerEstoque(removerEstoqueEspecifico, i.guildId)

                    await i.deferUpdate()
                    if (estoqueRemovido.length > 0) {
                        const messageExclusao = await i.followUp({ content: `${i.user}, você acaba de remover **${tamanhoEstoque - estoqueRemovido.length}** estoque do produto __${JSON.parse(produto).nome}__ ${util.padrao.emoteSucesso}\nPorém os seguintes estoques (ID) não foram encontrados -> **${estoqueRemovido.map(estoque => estoque)}**` })
                        return util.apagarMessage(canal, messageExclusao.id, 10000)
                    }
                    const messageExclusao = await i.followUp({ content: `${i.user}, você acaba de remover **${tamanhoEstoque}** estoque do produto __${JSON.parse(produto).nome}__ ${util.padrao.emoteSucesso}` })
                    util.apagarMessage(canal, messageExclusao.id, 3000)
                    return
                }
                await i.update({ components: [dadosRetorno.menu, dadosRetorno.botoes] })
            })

            col.on("end", async () => {
                const canal = await i.guild.channels.cache.get(i.channelId)
                util.apagarMessage(canal, msg.id)
                col.stop()
            })

        } catch (error) {
            await i.channel.send({ content: `${error}`, embeds: [], components: [] })
        }
    }

    async backupEstoque(i, produto) {
        try {
            let estoqueString = `Backup realizado com sucesso no dia ${moment().format('L')} as ${moment().format('LTS')} pelo usuario - ${i.user.username}\n\n`
            const { id, nome } = JSON.parse(produto)
            const canal = await i.guild.channels.cache.get(i.channelId)
            let backupEstoque = await estoqueRepository.buscarTodosEstoqueProdutoEspecifico(id, i.guildId)
            let quantidade = 1

            backupEstoque.forEach(estoque => {
                estoqueString += `${quantidade++} - ID: ${estoque.id} | Estoque: ${estoque.estoque}\n`
            })

            const bufferTxt = Buffer.from(estoqueString, "utf-8")
            const arquivoEstoque = new AttachmentBuilder(Buffer.from(bufferTxt), { name: "estoque.txt" })
            await i.user.send({ content: `${i.user}, aqui está seu backup ${util.padrao.emoteBackup} do produto  ID -> **${nome}**`, files: [arquivoEstoque] })
            await i.deferUpdate()
            const messageBackup = await i.followUp({ content: `${i.user}, Backup foi enviado para sua **DM** ${util.padrao.emoteSucesso}` })
            util.apagarMessage(canal, messageBackup.id, 3000)
        } catch (error) {
            await i.channel.send({ content: `${error}`, embeds: [], components: [] })
        }
    }
}

module.exports = {
    EstoqueProdutoController
}