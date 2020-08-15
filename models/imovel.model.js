let mongoose = require("mongoose")

let ImovelSchema = new mongoose.Schema({
    identificador: { type: Number, required: true },
    proprietario: { type: mongoose.SchemaTypes.ObjectId, ref: "Proprietario" },
    chaves: { type: mongoose.SchemaTypes.ObjectId, ref: "Chaves", required: false },
    fotos: { type: Array, default: [] },

    finalidade: { type: String, required: true },
    categoria: { type: String, required: true },
    subcategoria: { type: String, required: true },
    condominio: { type: Boolean, default: false },
    andar: { type: Number, default: 0 },

    cidade: { type: String, required: true },
    bairro: { type: String, required: true },
    logradouro: { type: String, required: true },
    numero: { type: String, required: true },
    complemento: { type: String, default: false },
    cep: { type: String, required: true },

    valorvenda: { type: String, required: true },
    valorlocacao: { type: String, required: true },
    valorcondominio: { type: String, required: true },
    condicaoiptu: { type: String, required: true },

    documentocartorio: { type: String },
    matricula: { type: String },
    cartoriocidade: { type: String },
    cartorionumero: { type: String },
    iptunumero: { type: String },

    medidatotal: { type: String },
    medidaconstruida: { type: String },
    medidautil: { type: String },
    medidafrente: { type: String },
    medidalateral: { type: String },
    medidafundos: { type: String },
    medidatopografia: { type: String },

    dormitorios: { type: String },
    suites: { type: String },
    banheiros: { type: String },
    vagas: { type: String },
    tipogaragem: { type: String },

    piscina: { type: Boolean, default: false },
    churrasqueira: { type: Boolean, default: false },
    salaestar: { type: Boolean, default: false },
    escritorio: { type: Boolean, default: false },

    descricao: { type: String }
})

let Imovel = mongoose.model("Imovel", ImovelSchema)
module.exports = Imovel