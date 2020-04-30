let Favorito = require("../models/favorito.model")
let configuracoes = require("../configuracoes")

module.exports.api_tudo = (req, res) => {
    Favorito.find({}).lean().exec((erros, dados) => {
        res.json({
            erro: (erros != null && erros != undefined) ? true : false,
            mensagem: (erros != null && erros != undefined) ? configuracoes.mensagens("Er0") : (dados != null && dados != undefined && dados.length != 0) ? configuracoes.mensagens("Da1") : configuracoes.mensagens("Da0"),
            acao: (erros != null && erros != undefined) ? false : (dados != null && dados != undefined && dados.length != 0) ? true : false,
            valores: (erros != null && erros != undefined) ? erros : (dados != null && dados != undefined && dados.length != 0) ? dados : null
        })
    })
}

module.exports.api_verificar = (req, res) => {
    let agencia = req.query.agencia
    let imovel = req.query.imovel

    Favorito.findOne({ agencia: agencia, imovel: imovel }).countDocuments().lean().exec((erros, dados) => {
        res.json({
            erro: (erros != null && erros != undefined) ? true : false,
            mensagem: (erros != null && erros != undefined) ? configuracoes.mensagens("Er0") : (dados != null && dados != undefined && dados.length != 0) ? configuracoes.mensagens("Da1") : configuracoes.mensagens("Da0"),
            acao: (erros != null && erros != undefined) ? false : (dados != null && dados != undefined && dados.length != 0) ? true : false,
            valores: (erros != null && erros != undefined) ? erros : (dados != null && dados != undefined && dados.length != 0) ? (dados != 0) ? true : false : null
        })
    })
}

module.exports.api_acao = (req, res) => {
    let agencia = req.query.agencia
    let imovel = req.query.imovel

    Favorito.findOne({ agencia: agencia, imovel: imovel }).lean().exec((erros, dados) => {
        if (erros) {
            res.json({
                erro: true,
                mensagem: configuracoes.mensagens("Er0"),
                acao: false,
                valores: erros
            })
        }
        else {
            if (dados != null) {
                Favorito.findOneAndRemove({ agencia: agencia, imovel: imovel }).lean().exec((erros, dados) => {
                    res.json({
                        erro: (erros != null && erros != undefined) ? true : false,
                        mensagem: (erros != null && erros != undefined) ? configuracoes.mensagens("Er0") : (dados != null && dados != undefined && dados.length != 0) ? configuracoes.mensagens("Da1") : configuracoes.mensagens("Da0"),
                        acao: (erros != null && erros != undefined) ? false : (dados != null && dados != undefined && dados.length != 0) ? true : false,
                        valores: (erros != null && erros != undefined) ? erros : (dados != null && dados != undefined && dados.length != 0) ? "removido" : null
                    })
                })
            }
            else {
                Favorito.create({ agencia: agencia, imovel: imovel, data: configuracoes.agora("completo") }, (erros, dados) => {
                    res.json({
                        erro: (erros != null && erros != undefined) ? true : false,
                        mensagem: (erros != null && erros != undefined) ? configuracoes.mensagens("Er0") : (dados != null && dados != undefined && dados.length != 0) ? configuracoes.mensagens("Da1") : configuracoes.mensagens("Da0"),
                        acao: (erros != null && erros != undefined) ? false : (dados != null && dados != undefined && dados.length != 0) ? true : false,
                        valores: (erros != null && erros != undefined) ? erros : (dados != null && dados != undefined && dados.length != 0) ? "adicionado" : null
                    })
                })
            }
        }
    })
}

module.exports.api_agencia = (req, res) => { // imoveis favoritados por uma agencia (vendedor ou imobiliaria)
    let agencia = req.query.agencia

    let populacao = [
        { path: "imovel", select: ["titulo", "identificador", "foto", "valorvenda", "valorlocacao", "cidade", "estado", "finalidade", "categoria"] }
    ]

    Favorito.find({ agencia: agencia }).populate(populacao).lean().exec((erros, dados) => {
        if (erros) {
            res.json({
                erro: true,
                mensagem: configuracoes.mensagens("Er0"),
                acao: false,
                valores: erros
            })
        }
        else {
            if (dados) {
                dados.forEach(item => {
                    item.imovel.estado = configuracoes.estado(item.imovel.estado)
                    item.imovel.valorvenda = configuracoes.conversao_valores(item.imovel.valorvenda, "dinheiro")
                    item.imovel.valorlocacao = configuracoes.conversao_valores(item.imovel.valorlocacao, "dinheiro")
                })

                res.json({
                    erro: false,
                    mensagem: configuracoes.mensagens("Da1"),
                    acao: true,
                    valores: dados
                })
            }
            else {
                res.json({
                    erro: false,
                    mensagem: configuracoes.mensagens("Da0"),
                    acao: false,
                    valores: null
                })
            }
        }
    })
}