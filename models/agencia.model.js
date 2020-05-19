let mongoose = require("mongoose")

let AgenciaSchema = new mongoose.Schema({
    identificador: { type: Number, required: true },
    email: { type: String, required: true },
    senha: { type: String, required: true },
    tipo: { type: String, required: true }, // imobiliaria, corretora, administrador
    cnpj: { type: Number, required: false },
    crecinumero: { type: String, required: false },
    creciuf: { type: String, required: false },
    nomefantasia: { type: String, default: null },
    razaosocial: { type: String, default: null },
    site: { type: String, default: null },
    logo: { type: String, default: null },

    imobiliariatelefone: { type: Number, required: true },
    imobiliariacep: { type: Number, required: true },
    imobiliarialogradouro: { type: String, required: true },
    imobiliariabairro: { type: String, required: true },
    imobiliariacidade: { type: String, required: true },
    imobiliariaestado: { type: String, required: true },
    imobiliarianumero: { type: String, required: true },
    imobiliariacomplemento: { type: String, default: null },

    responsavelnome: { type: String, required: true },
    responsaveltelefone: { type: Number, required: true },
    responsavelemail: { type: String, required: true },

    datacadastro: { type: String, required: true },
    senhalinkrecuperacao: { type: String, default: null },
    senhalinkexpiraem: { type: Number, default: null }
})

let Agencia = mongoose.model("Agencia", AgenciaSchema)
module.exports = Agencia