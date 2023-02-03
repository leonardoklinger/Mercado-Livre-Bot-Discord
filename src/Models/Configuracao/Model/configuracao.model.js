const mongoose = require("mongoose")

const Schema = new mongoose.Schema({
    idServidor: { type: String }
})

module.exports = mongoose.model("ConfiguracaoSchema", Schema)