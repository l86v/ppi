let Visita = require("../models/visita.model")
let configuracoes = require("../configuracoes")

module.exports.api_tudo = (req, res) => {
    let populacao = [
        { path: "proprietario", select: ["nome"] },
        { path: "agencia", select: ["nome", "crecinumero", "nomefantasia", "razaosocial"] },
        { path: "imovel", select: ["titulo", "fotos", "valorvenda", "cidade"] }
    ]

    Visita.find({}).populate(populacao).lean().exec((erros, dados) => {
        res.json({
            erro: (erros != null && erros != undefined) ? true : false,
            mensagem: (erros != null && erros != undefined) ? configuracoes.mensagens("Er0") : (dados != null && dados != undefined && dados.length != 0) ? configuracoes.mensagens("Da1") : configuracoes.mensagens("Da0"),
            acao: (erros != null && erros != undefined) ? false : (dados != null && dados != undefined && dados.length != 0) ? true : false,
            valores: (erros != null && erros != undefined) ? erros : (dados != null && dados != undefined && dados.length != 0) ? dados : null
        })
    })
}

module.exports.api_agendar = (req, res) => { // / VOLTAR AQUI... MAS NAO AGORA, CHUCHU...
    let corpo = req.body

    let novavisita = {
        imovel: corpo.imovel,
        agencia: corpo.agencia,
        proprietario: corpo.proprietario,
        visitantecpf: Number(configuracoes.numeros(corpo.visitantecpf)),
        visitantenome: corpo.visitantenome,
        dataagendadaformatada: corpo.dataagendada,
        dataagendadams: Number(configuracoes.data(corpo.dataagendada).milissegundos),
        dataregistro: configuracoes.agora("completo")
    }

    Visita.create(novavisita, (erros, dados) => { // aqui tem que voltar e fazer verificacao de outros agendamentos...
        res.json({
            erro: (erros != null && erros != undefined) ? true : false,
            mensagem: (erros != null && erros != undefined) ? configuracoes.mensagens("Er0") : (dados != null && dados != undefined && dados.length != 0) ? configuracoes.mensagens("Ag1") : configuracoes.mensagens("Ag0"),
            acao: (erros != null && erros != undefined) ? false : (dados != null && dados != undefined && dados.length != 0) ? true : false,
            valores: (erros != null && erros != undefined) ? erros : (dados != null && dados != undefined && dados.length != 0) ? "ok" : "nf"
        })
    })
}

module.exports.api_geral = (req, res) => { // visualizar visitas, independente da data, com opcao de alvo ("imovel, proprietario, agencia").
    let alvo = req.query.alvo
    let id = req.query.id
    let periodo = (req.query.periodo != undefined && req.query.periodo != null) ? (req.query.periodo === "prx") ? { $gte: Number(configuracoes.agora("ms").milissegundos) } : (req.query.periodo === "ant") ? { $lte: Number(configuracoes.agora("ms").milissegundos) } : { $ne: null } : { $ne: null }
    let sintaxeprincipal = (alvo === "proprietario") ? { proprietario: id } : (alvo === "agencia") ? { agencia: id } : (alvo === "imovel") ? { imovel: id } : { _id: { $ne: null } }
    sintaxeprincipal.dataagendadams = periodo

    let populacao = [
        { path: "proprietario", select: ["nome"] },
        { path: "agencia", select: ["nome", "crecinumero", "nomefantasia", "razaosocial"] },
        { path: "imovel", select: ["titulo", "fotos", "valorvenda", "cidade"] }
    ]

    Visita.find(sintaxeprincipal).populate(populacao).lean().exec((erros, dados) => {
        dados.forEach(item => {
            item.dataagendadaformatada = configuracoes.data(item.dataagendadaformatada)
        })

        res.json({
            erro: (erros != null && erros != undefined) ? true : false,
            mensagem: (erros != null && erros != undefined) ? configuracoes.mensagens("Er0") : (dados != null && dados != undefined && dados.length != 0) ? configuracoes.mensagens("Da1") : configuracoes.mensagens("Da0"),
            acao: (erros != null && erros != undefined) ? false : (dados != null && dados != undefined && dados.length != 0) ? true : false,
            valores: (erros != null && erros != undefined) ? erros : (dados != null && dados != undefined && dados.length != 0) ? dados : null
        })
    })
}

module.exports.api_editar = (req, res) => {
    let id = req.query.id
    let corpo = req.body

    if (corpo.dataagendadaformatada != undefined && corpo.dataagendadaformatada != null) {
        corpo.dataagendadams = Number(configuracoes.data(corpo.dataagendadaformatada).milissegundos)
    }

    Visita.findByIdAndUpdate(id, { $set: corpo }).lean().exec((erros, dados) => {
        res.json({
            erro: (erros != null && erros != undefined) ? true : false,
            mensagem: (erros != null && erros != undefined) ? configuracoes.mensagens("Er0") : (dados != null && dados != undefined && dados.length != 0) ? configuracoes.mensagens("Da1") : configuracoes.mensagens("Da0"),
            acao: (erros != null && erros != undefined) ? false : (dados != null && dados != undefined && dados.length != 0) ? true : false,
            valores: (erros != null && erros != undefined) ? erros : (dados != null && dados != undefined && dados.length != 0) ? "ok" : "nf"
        })
    })
}

module.exports.api_cancelar = (req, res) => {
    let id = req.query.id

    Visita.findByIdAndRemove(id).lean().exec((erros, dados) => {
        res.json({
            erro: (erros != null && erros != undefined) ? true : false,
            mensagem: (erros != null && erros != undefined) ? configuracoes.mensagens("Er0") : (dados != null && dados != undefined && dados.length != 0) ? configuracoes.mensagens("Da1") : configuracoes.mensagens("Da0"),
            acao: (erros != null && erros != undefined) ? false : (dados != null && dados != undefined && dados.length != 0) ? true : false,
            valores: (erros != null && erros != undefined) ? erros : (dados != null && dados != undefined && dados.length != 0) ? "ok" : "nf"
        })
    })
}

module.exports.api_visualizar = (req, res) => {
    let id = req.query.id

    let populacao = [
        { path: "proprietario", select: ["nome"] },
        { path: "agencia", select: ["nome", "crecinumero", "nomefantasia", "razaosocial"] },
        { path: "imovel", select: ["titulo", "fotos", "valorvenda", "cidade"] }
    ]

    
    Visita.findById(id).populate(populacao).lean().exec((erros, dados) => {
        if (dados) {
            dados.dataagendadaformatada = configuracoes.data(dados.dataagendadaformatada)
        }

        res.json({
            erro: (erros != null && erros != undefined) ? true : false,
            mensagem: (erros != null && erros != undefined) ? configuracoes.mensagens("Er0") : (dados != null && dados != undefined && dados.length != 0) ? configuracoes.mensagens("Da1") : configuracoes.mensagens("Da0"),
            acao: (erros != null && erros != undefined) ? false : (dados != null && dados != undefined && dados.length != 0) ? true : false,
            valores: (erros != null && erros != undefined) ? erros : (dados != null && dados != undefined && dados.length != 0) ? dados : null
        })
    })
}