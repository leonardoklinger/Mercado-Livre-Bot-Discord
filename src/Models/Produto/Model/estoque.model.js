const mongoose = require("mongoose")

const Schema = new mongoose.Schema({
    produtoid: { type: String },
    serverid: { type: String },
    estoque: { type: String }
})

module.exports = mongoose.model("EstoqueProdutoSchema", Schema)