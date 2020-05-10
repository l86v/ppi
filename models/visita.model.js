let mongoose = require("mongoose")

let VisitaSchema = new mongoose.Schema({
    imovel: { type: mongoose.SchemaTypes.ObjectId, ref: "Imovel" },
    agencia: { type: mongoose.SchemaTypes.ObjectId, ref: "Agencia" },
    proprietario: { type: mongoose.SchemaTypes.ObjectId, ref: "Proprietario" },
    visitantecpf: { type: Number, required: true },
    visitantenome: { type: String, required: true },
    dataagendadaformatada: { type: String, required: true },
    dataagendadams: { type: Number, required: true },
    dataregistro: { type: String, required: true }
})

let Visita = mongoose.model("Visita", VisitaSchema)
module.exports = Visita