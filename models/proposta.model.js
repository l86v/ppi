let mongoose = require("mongoose")

let PropostaSchema = new mongoose.Schema({
    codigointerno: { type: String, required: true },
    imovel: { type: mongoose.SchemaTypes.ObjectId, ref: "Imovel", required: true },
    imobiliarias: [{
        _id: false,
        agencia: { type: mongoose.SchemaTypes.ObjectId, ref: "Agencia" },
    }]
})

let Proposta = mongoose.model("Proposta", PropostaSchema)
module.exports = Proposta