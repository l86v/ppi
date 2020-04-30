let Visualizacao = require("../models/visualizacao.model")
let configuracoes = require("../configuracoes")

module.exports.api_tudo = (req, res) => {
    Visualizacao.find({}).lean().exec((erros, dados) => {
        res.json({
            erro: (erros != null && erros != undefined) ? true : false,
            mensagem: (erros != null && erros != undefined) ? configuracoes.mensagens("Er0") : (dados != null && dados != undefined && dados.length != 0) ? configuracoes.mensagens("Da1") : configuracoes.mensagens("Da0"),
            acao: (erros != null && erros != undefined) ? false : (dados != null && dados != undefined && dados.length != 0) ? true : false,
            valores: (erros != null && erros != undefined) ? erros : (dados != null && dados != undefined && dados.length != 0) ? dados : null
        })
    })
}

module.exports.api_total = (req, res) => {
    let imovel = req.query.imovel

    Visualizacao.find({ imovel: imovel }).countDocuments().lean().exec((erros, dados) => {
        res.json({
            erro: (erros != null && erros != undefined) ? true : false,
            mensagem: (erros != null && erros != undefined) ? configuracoes.mensagens("Er0") : (dados != null && dados != undefined && dados.length != 0) ? configuracoes.mensagens("Da1") : configuracoes.mensagens("Da0"),
            acao: (erros != null && erros != undefined) ? false : (dados != null && dados != undefined && dados.length != 0) ? true : false,
            valores: (erros != null && erros != undefined) ? erros : (dados != null && dados != undefined && dados.length != 0) ? dados : null
        })
    })
}

module.exports.api_verificar = (req, res) => {
    let imovel = req.query.imovel
    let agencia = req.query.agencia

    Visualizacao.find({ imovel: imovel, agencia: agencia }).countDocuments().lean().exec((erros, dados) => {
        res.json({
            erro: (erros != null && erros != undefined) ? true : false,
            mensagem: (erros != null && erros != undefined) ? configuracoes.mensagens("Er0") : (dados != null && dados != undefined && dados.length != 0) ? configuracoes.mensagens("Da1") : configuracoes.mensagens("Da0"),
            acao: (erros != null && erros != undefined) ? false : (dados != null && dados != undefined && dados.length != 0) ? true : false,
            valores: (erros != null && erros != undefined) ? erros : (dados != null && dados != undefined && dados.length != 0) ? (dados != 0) ? true : false : null
        })
    })
}

module.exports.api_marcar = (req, res) => {
    let imovel = req.query.imovel
    let agencia = req.query.agencia

    console.log("marcando visualizacao...")

    Visualizacao.findOne({ imovel: imovel, agencia: agencia }).lean().exec((erros, dados) => {
        if (erros) {
            res.json({
                erro: true,
                mensagem: configuracoes.mensagens("Er0"),
                acao: false,
                valores: null
            })
        }
        else {
            if (dados) {
                // isso significa que a visualizacao ja existe.
                console.log("criada anteriormente.")
                res.json({
                    erro: false,
                    mensagem: configuracoes.mensagens("Da1"),
                    acao: false,
                    valores: "anteriormente"
                })
            }
            else {
                // isso significa que a visualizacao ainda nao existe.
                console.log("nao criada anteriormente.")
                Visualizacao.create({ imovel: imovel, agencia: agencia, data: configuracoes.agora("completo") }, (erros, dados) => {
                    res.json({
                        erro: (erros != null && erros != undefined) ? true : false,
                        mensagem: (erros != null && erros != undefined) ? configuracoes.mensagens("Er0") : (dados != null && dados != undefined && dados.length != 0) ? configuracoes.mensagens("Da1") : configuracoes.mensagens("Da0"),
                        acao: (erros != null && erros != undefined) ? false : (dados != null && dados != undefined && dados.length != 0) ? true : false,
                        valores: (erros != null && erros != undefined) ? erros : (dados != null && dados != undefined && dados.length != 0) ? "realizado" : null
                    })
                })
            }
        }
    })
}

module.exports.api_excluir_imovel_agencia = (req, res) => { // exclui a visualizacao da agencia especificada no imovel
    let agencia = req.query.agencia
    let imovel = req.query.imovel

    Visualizacao.findOneAndRemove({ agencia: agencia, imovel: imovel }).lean().exec((erros, dados) => {
        res.json({
            erro: (erros != null && erros != undefined) ? true : false,
            mensagem: (erros != null && erros != undefined) ? configuracoes.mensagens("Er0") : (dados != null && dados != undefined && dados.length != 0) ? configuracoes.mensagens("Da1") : configuracoes.mensagens("Da0"),
            acao: (erros != null && erros != undefined) ? false : (dados != null && dados != undefined && dados.length != 0) ? true : false,
            valores: (erros != null && erros != undefined) ? erros : (dados != null && dados != undefined && dados.length != 0) ? "realizado" : null
        })  
    })
}

module.exports.api_excluir_imovel_todos = (req, res) => { // exclui todas as visualizacoes de um imovel
    let imovel = req.query.imovel

    Visualizacao.find({ imovel: imovel }).lean().exec((erros, dados) => {
        res.json({
            erro: (erros != null && erros != undefined) ? true : false,
            mensagem: (erros != null && erros != undefined) ? configuracoes.mensagens("Er0") : (dados != null && dados != undefined && dados.length != 0) ? configuracoes.mensagens("Da1") : configuracoes.mensagens("Da0"),
            acao: (erros != null && erros != undefined) ? false : (dados != null && dados != undefined && dados.length != 0) ? true : false,
            valores: (erros != null && erros != undefined) ? erros : (dados != null && dados != undefined && dados.length != 0) ? "realizado" : null
        })
    })
}

module.exports.api_excluir_agencia = (req, res) => { // exclui todas as visualizacoes de uma agencia
    let agencia = req.query.agencia

    Visualizacao.find({ agencia: agencia }).lean().exec((erros, dados) => {
        res.json({
            erro: (erros != null && erros != undefined) ? true : false,
            mensagem: (erros != null && erros != undefined) ? configuracoes.mensagens("Er0") : (dados != null && dados != undefined && dados.length != 0) ? configuracoes.mensagens("Da1") : configuracoes.mensagens("Da0"),
            acao: (erros != null && erros != undefined) ? false : (dados != null && dados != undefined && dados.length != 0) ? true : false,
            valores: (erros != null && erros != undefined) ? erros : (dados != null && dados != undefined && dados.length != 0) ? "realizado" : null
        })
    })
}

