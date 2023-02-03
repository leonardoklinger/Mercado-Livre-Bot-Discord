const mongoose = require("mongoose")

const Schema = new mongoose.Schema({
    produtoid: { type: String },
    serverid: { type: String },
    canalid: { type: String },
    messageid: { type: String }
})

module.exports = mongoose.model("SetarProdutoSchema", Schema)