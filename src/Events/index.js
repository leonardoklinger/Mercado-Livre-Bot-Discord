const { EventoComandoHandler } = require("./Handler/handler.events"),
    { LigarBot } = require("./Ligar/Bot/botLigar.events"),
    { MongoDB } = require("./Ligar/MongoDB/mongodb.events"),
    { ModalEvents } = require("./Modal/modal.events")

module.exports = {
    EventoComandoHandler,
    LigarBot,
    MongoDB,
    ModalEvents
}