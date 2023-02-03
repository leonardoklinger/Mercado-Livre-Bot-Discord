const color = require("colors")
const mongoose = require("mongoose")

class MongoDB {
    constructor() {
        mongoose.connect(process.env.URL_MONGODB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            console.log(`Banco de dados ${color.green.bold("ligado com sucesso")}`)
        }).catch((error) => {
            console.error(color.red(error))
        })
    }
}

module.exports = {
    MongoDB
}