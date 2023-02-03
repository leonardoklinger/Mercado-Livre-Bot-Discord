const { CadastrarProdutoController } = require("../../Controller/Produto/cadastrarProduto.controller")
const { EditarProdutoController } = require("../../Controller/Produto/editarProduto.controller")

class ModalEvents {
    async eventoModal(interaction) {
        if (!interaction.isModalSubmit()) return
        switch (interaction.customId) {
            case "crudmodal":
                await new CadastrarProdutoController().cadastrarProduto(interaction)
                break;
            case "modaleditar":
                await new EditarProdutoController().editarProdutoSubmit(interaction)
                break;
            default:
                await interaction.reply("Error modal")
                break;
        }
    }
}

module.exports = {
    ModalEvents
}