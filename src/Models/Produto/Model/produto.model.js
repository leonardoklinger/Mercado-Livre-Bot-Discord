const mongoose = require("mongoose")

const Schema = new mongoose.Schema({
    nome: { type: String },
    preco: { type: Number },
    descricao: { type: String },
    serverid: { type: String }
})

module.exports = mongoose.model("ProdutoSchema", Schema)