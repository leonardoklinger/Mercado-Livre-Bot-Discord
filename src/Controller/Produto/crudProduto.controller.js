const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js')
const util = require("../../Util/configuracao")
const { CadastrarProdutoController } = require("./cadastrarProduto.controller")
const { EditarProdutoController } = require("./editarProduto.controller")

class CrudController {
    //Controlador de opções
    async controladorDeEvento(interaction, col) {
        switch (interaction.customId) {
            case "novoproduto":
                await new CadastrarProdutoController().modal(interaction)
                break;
            case "editarproduto":
                await new EditarProdutoController().editarProduto(interaction)
                break
            case "excluirproduto":
                this.nomeEmbed = "Painel Excluir"
                await this.excluirProduto(interaction)
                break;
            default:
                return col.stop()
        }
    }

    //Embed inicial do comando
    embedInicial() {
        return new EmbedBuilder()
            .setColor(util.padrao.corEmbed)
            .setTitle(`${util.padrao.nomeLoja} - Painel Crud`)
            .setDescription(`Utilize umas das opções abaixo. ${util.padrao.emoteSetaParaBaixo}`)
            .setImage(util.padrao.imagemEmbed)
            .setFooter({ text: "Você tem apenas 4 minutos ⏰ e 20 tentativas 🖱️ para utiliziar este comando. Após irá ficar inválido! ❌" })
    }

    //Os botões utilizados
    botao() {
        return new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("novoproduto")
                    .setLabel("Novo Produto")
                    .setStyle(ButtonStyle.Success)
                    .setEmoji(util.padrao.emoteProduto),
                new ButtonBuilder()
                    .setCustomId("editarproduto")
                    .setLabel("Editar Produto")
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji(util.padrao.emoteEditar),
                new ButtonBuilder()
                    .setCustomId("excluirproduto")
                    .setLabel("Excluir Produto")
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji(util.padrao.emoteLixeira),
            )
    }
}

module.exports = {
    CrudController
}