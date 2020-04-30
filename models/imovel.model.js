let mongoose = require("mongoose")

let ImovelSchema = new mongoose.Schema({
    // identificacao
    identificador: { type: Number, required: true },
    proprietario: { type: mongoose.SchemaTypes.ObjectId, ref: "Proprietario" },
    titulo: { type: String, required: true },
    descricao: { type: String, required: true },
    fotos: { type: Array, default: [] },
    matriculanumero: { type: Number, required: true },
    matriculacartorio: { type: String, required: true },

    // localizacao
    cep: { type: Number, required: true },
    logradouro: { type: String, required: true },
    bairro: { type: String, required: true },
    cidade: { type: String, required: true },
    estado: { type: String, required: true },
    numero: { type: String, required: true },
    complemento: { type: String, default: null },

    // detalhes
    vagas: { type: Number, required: true },
    suites: { type: Number, required: true },
    quartos: { type: Number, required: true },
    banheiros: { type: Number, required: true },

    valorvenda: { type: Number, required: true },
    valorlocacao: { type: Number, required: true },
    valorcondominio: { type: Number, required: true },
    condicaopagamentoiptu: { type: String, required: true },

    areatotal: { type: Number, required: true },
    areautil: { type: Number, required: true },
    areamedidafrente: { type: Number, required: true },
    areamedidalateral: { type: Number, required: true },
    areatopografia: { type: String, required: true }, // aclive, bla bla bla.

    salaestar: { type: Boolean, required: false, default: false },
    escritorio: { type: Boolean, required: false, default: false },
    piscina: { type: Boolean, required: false, default: false },
    churrasqueira: { type: Boolean, required: false, default: false },
    tipogaragem: { type: String, required: true }, // fixa, livre (select options)

    finalidade: { type: String, default: null }, // venda, locacao, venda/locacao (oi?)
    categoria: { type: String, default: null }, // residencial, comercial, bla bla bla.
    subcategoria: { type: String, default: null }, // apartamento, casa
    condominio: { type: Boolean, required: false, default: false }, // ainda nao entendi se isso eh um boolean ou uma string
    andar: { type: Number, default: 1 },

    datacadastro: { type: String, required: true },
    agendamentos: { type: Array, default: [] } // tenso... mas eh o jeito.
})

let Imovel = mongoose.model("Imovel", ImovelSchema)
module.exports = Imovel