let mongoose = require("mongoose")

let ProprietarioSchema = new mongoose.Schema({
    identificador: { type: Number, required: true },
    nome: { type: String, required: true },
    email: { type: String, required: true },
    foto: { type: String, default: null },
    senha: { type: String, required: true },
    telefone: { type: Number, required: true },
    celular: { type: Number, required: true },
    // cpf: { type: Number, required: true },
    // rg: { type: Number, required: true },

    cep: { type: Number, required: true },
    logradouro: { type: String, required: true },
    bairro: { type: String, required: true },
    cidade: { type: String, required: true },
    estado: { type: String, required: true },
    numero: { type: String, required: true },
    complemento: { type: String, default: null },

    datacadastro: { type: String, required: true },
    senhalinkrecuperacao: { type: String, default: null },
    senhalinkexpiraem: { type: Number, default: null }
})

let Proprietario = mongoose.model("Proprietario", ProprietarioSchema)
module.exports = Proprietario