// aqui eh responsavel por adicionar as imobiliarias, remover as imobiliarias que tem acesso aos dados.
// o imovel deve passar por aqui pra ser publicado e anunciado pelas imobiliarias.




// que ideia estupida.




let Proposta = require("../models/proposta.model")
let configuracoes = require("../configuracoes")
let random = require("randomatic")

module.exports.api_tudo = (req, res) => {
    Proposta.find({}).lean().exec((erros, dados) => {
        res.json({
            erro: (erros != null && erros != undefined) ? true : false,
            mensagem: (erros != null && erros != undefined) ? configuracoes.mensagens("Er0") : (dados != null && dados != undefined && dados.length != 0) ? configuracoes.mensagens("Da1") : configuracoes.mensagens("Da0"),
            acao: (erros != null && erros != undefined) ? false : (dados != null && dados != undefined && dados.length != 0) ? true : false,
            valores: (erros != null && erros != undefined) ? erros : (dados != null && dados != undefined && dados.length != 0) ? dados : null
        })
    })
}

module.exports.api_salvar = (req, res) => {
    // essa api eh responsavel pelo salvamento de dados, ou seja...
    // quando o proprietario selecionar uma imobiliaria pra um imovel, tem que passar por aqui o id do imovel e o id da imobiliaria.

    let imovel = req.query.imovel
    let corpo = req.body

    if (corpo.imobiliarias.length != 0) {
        console.log("imobiliarias identificadas.")

        var lista_imobiliarias = []

        corpo.imobiliarias = corpo.imobiliarias.forEach((item) => {
            lista_imobiliarias.push({
                agencia: item
            })
        })

        var novaproposta = new Proposta({
            codigointerno: random("aA0", 7),
            imovel: imovel,
            imobiliarias: lista_imobiliarias
        })

        Proposta.findOne({ imovel: imovel }).lean().exec((erros, dados) => {
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
                    // significa que esse corpo ja existe.
                    console.log("dados ja existem na proposta.")

                    Proposta.findOneAndUpdate({ imovel: imovel }, { $set: { imobiliarias: lista_imobiliarias } }).lean().exec((erros, dados) => {
                        res.json({
                            erro: (erros != null && erros != undefined) ? true : false,
                            mensagem: (erros != null && erros != undefined) ? configuracoes.mensagens("Er4") : (dados != null && dados != undefined && dados.length != 0) ? configuracoes.mensagens("Ca17") : configuracoes.mensagens("Ca18"),
                            acao: (erros != null && erros != undefined) ? false : (dados != null && dados != undefined && dados.length != 0) ? true : false,
                            valores: (erros != null && erros != undefined) ? erros : (dados != null && dados != undefined && dados.length != 0) ? dados._id : null
                        })
                    })

                    console.log(dados)
                }
                else {
                    console.log("dados nao existem na proposta.")
                    // significa que tem criar o corpo.
                    Proposta.create(novaproposta, (erros, dados) => {
                        res.json({
                            erro: (erros != null && erros != undefined) ? true : false,
                            mensagem: (erros != null && erros != undefined) ? configuracoes.mensagens("Er4") : (dados != null && dados != undefined && dados.length != 0) ? configuracoes.mensagens("Ca13") : configuracoes.mensagens("Ca14"),
                            acao: (erros != null && erros != undefined) ? false : (dados != null && dados != undefined && dados.length != 0) ? true : false,
                            valores: (erros != null && erros != undefined) ? erros : (dados != null && dados != undefined && dados.length != 0) ? novaproposta._id : null
                        })
                    })
                }
            }
        })
    }
    else {
        console.log("sem imobiliarias identificadas.")
        res.json({
            erro: false,
            mensagem: configuracoes.mensagens("Ca19"),
            acao: false,
            valores: null
        })
    }
}

module.exports.api_remover = (req, res) => {
    let imovel = req.query.imovel

    Proposta.findOneAndRemove({ imovel: imovel }).lean().exec((erros, dados) => {
        res.json({
            erro: (erros != null && erros != undefined) ? true : false,
            mensagem: (erros != null && erros != undefined) ? configuracoes.mensagens("Er0") : (dados != null && dados != undefined && dados.length != 0) ? configuracoes.mensagens("Ca15") : configuracoes.mensagens("Ca16"),
            acao: (erros != null && erros != undefined) ? false : (dados != null && dados != undefined && dados.length != 0) ? true : false,
            valores: (erros != null && erros != undefined) ? erros : (dados != null && dados != undefined && dados.length != 0) ? "removido" : null
        })
    })
}

module.exports.api_imovel = (req, res) => { // ver as imobiliarias que podem ter acesso aos dados do imovel.
    let imovel = req.query.imovel

    let populacao = [
        { path: "imovel", select: ["cidade", "bairro", "valorvenda"] },
        { path: "imobiliarias.agencia", select: ["imobiliariacidade", "nomefantasia", "logo"] }
    ]

    Proposta.findOne({ imovel: imovel }).populate(populacao).lean().exec((erros, dados) => {
        res.json({
            erro: (erros != null && erros != undefined) ? true : false,
            mensagem: (erros != null && erros != undefined) ? configuracoes.mensagens("Er0") : (dados != null && dados != undefined && dados.length != 0) ? configuracoes.mensagens("Da1") : configuracoes.mensagens("Da0"),
            acao: (erros != null && erros != undefined) ? false : (dados != null && dados != undefined && dados.length != 0) ? true : false,
            valores: (erros != null && erros != undefined) ? erros : (dados != null && dados != undefined && dados.length != 0) ? dados : null
        })
    })
}