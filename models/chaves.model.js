let mongoose = require("mongoose")

let ChavesSchema = new mongoose.Schema({
    proprietario: { type: mongoose.SchemaTypes.ObjectId, ref: "Proprietario", required: true },
    titulo: { type: String, required: true },
    cidade: { type: String, required: true },
    bairro: { type: String, required: true },
    logradouro: { type: String, required: true },
    numero: { type: String, required: true },
    complemento: { type: String, default: null },
    cep: { type: Number, required: true },

    domingo: { type: Boolean, required: true, default: false },
    segunda: { type: Boolean, required: true, default: false },
    terca: { type: Boolean, required: true, default: false },
    quarta: { type: Boolean, required: true, default: false },
    quinta: { type: Boolean, required: true, default: false },
    sexta: { type: Boolean, required: true, default: false },
    sabado: { type: Boolean, required: true, default: false },

    inicio: { type: Number, required: true },
    fim: { type: Number, required: true }
})

let Chaves = mongoose.model("Chaves", ChavesSchema)
module.exports = Chaves

