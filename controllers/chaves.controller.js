// adicionar local
// remover local
// editar local
// ativar local de chaves para imovel. 

let Chaves = require("../models/chaves.model")
let configuracoes = require("../configuracoes")
let request = require("request")
const { config } = require("process")

module.exports.api_tudo = (req, res) => {
    Chaves.find({}).lean().exec((erros, dados) => {
        res.json({
            erro: (erros != null && erros != undefined) ? true : false,
            mensagem: (erros != null && erros != undefined) ? configuracoes.mensagens("Er0") : (dados != null && dados != undefined && dados.length != 0) ? configuracoes.mensagens("Da1") : configuracoes.mensagens("Da0"),
            acao: (erros != null && erros != undefined) ? false : (dados != null && dados != undefined && dados.length != 0) ? true : false,
            valores: (erros != null && erros != undefined) ? erros : (dados != null && dados != undefined && dados.length != 0) ? dados : null
        })
    })
}

module.exports.api_proprietario = (req, res) => {
    let proprietario = req.query.proprietario

    Chaves.find({ proprietario: proprietario }).lean().exec((erros, dados) => {
        res.json({
            erro: (erros != null && erros != undefined) ? true : false,
            mensagem: (erros != null && erros != undefined) ? configuracoes.mensagens("Er0") : (dados != null && dados != undefined && dados.length != 0) ? configuracoes.mensagens("Da1") : configuracoes.mensagens("Da0"),
            acao: (erros != null && erros != undefined) ? false : (dados != null && dados != undefined && dados.length != 0) ? true : false,
            valores: (erros != null && erros != undefined) ? erros : (dados != null && dados != undefined && dados.length != 0) ? dados : null
        })
    })
}

module.exports.api_remover = (req, res) => {
    let local = req.query.local

    Chaves.findByIdAndRemove(local).lean().exec((erros, dados) => {
        res.json({
            erro: (erros != null && erros != undefined) ? true : false,
            mensagem: (erros != null && erros != undefined) ? configuracoes.mensagens("Er0") : (dados != null && dados != undefined && dados.length != 0) ? configuracoes.mensagens("Da1") : configuracoes.mensagens("Da0"),
            acao: (erros != null && erros != undefined) ? false : (dados != null && dados != undefined && dados.length != 0) ? true : false,
            valores: (erros != null && erros != undefined) ? erros : (dados != null && dados != undefined && dados.length != 0) ? "removido" : null
        })
    })
}

module.exports.api_adicionar = (req, res) => {
    let corpo = req.body

    let novolocal = new Chaves({
        proprietario: corpo.proprietario,
        titulo: String(corpo.titulo).trim(),
        cidade: corpo.cidade,
        bairro: corpo.bairro,
        logradouro: corpo.logradouro,
        numero: corpo.numero,
        complemento: (corpo.complemento === "" || corpo.complemento === null) ? null : corpo.complemento,
        cep: Number(String(configuracoes.numeros(corpo.cep).trim())),

        domingo: corpo.domingo,
        segunda: corpo.segunda,
        terca: corpo.terca,
        quarta: corpo.quarta,
        quinta: corpo.quinta,
        sexta: corpo.sexta,
        sabado: corpo.sabado,

        inicio: Number(corpo.inicio),
        fim: Number(corpo.fim)
    })

    console.log({ corpo, novolocal })

    Chaves.findOne({ cep: novolocal.cep, proprietario: novolocal.proprietario }).lean().exec((erros, existe) => { // aqui so checando se o local das chaves ja existe.
        if (erros) {
            res.json({
                erro: true,
                mensagem: configuracoes.mensagens("Er2"),
                acao: false,
                valores: erros
            })
        }
        else {
            if (existe) {
                res.json({
                    erro: false,
                    mensagem: configuracoes.mensagens("Ca12"),
                    acao: false,
                    valores: "cadastradoanteriormente"
                })
            }
            else {
                Chaves.create(novolocal, (erros, dados) => {
                    res.json({
                        erro: (erros != null && erros != undefined) ? true : false,
                        mensagem: (erros != null && erros != undefined) ? configuracoes.mensagens("Er2") : (existe === false) ? configuracoes.mensagens("Ca12") : (dados != null && dados != undefined && dados.length != 0) ? configuracoes.mensagens("Ca10") : configuracoes.mensagens("Ca11"),
                        acao: (erros != null && erros != undefined) ? false : (existe === false) ? false : (dados != null && dados != undefined && dados.length != 0) ? true : false,
                        valores: (erros != null && erros != undefined) ? erros : (existe === false) ? null : (dados != null && dados != undefined && dados.length != 0) ? novolocal._id : null
                    })
                })
            }
        }
    })
}