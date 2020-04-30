let Agencia = require("../models/agencia.model")
let configuracoes = require("../configuracoes")
let bcrypt = require("bcryptjs")

module.exports.api_tudo = (req, res) => {
    let selecao = {
        "_id": 1,
        "identificador": 1,
        "tipo": 1,
        "nome": 1,
        "nomefantasia": 1,
        "razaosocial": 1
    }

    Agencia.find({}).select(selecao).lean().exec((erros, dados) => {
        res.json({
            erro: (erros != null && erros != undefined) ? true : false,
            mensagem: (erros != null && erros != undefined) ? configuracoes.mensagens("Er0") : (dados != null && dados != undefined && dados.length != 0) ? configuracoes.mensagens("Da1") : configuracoes.mensagens("Da0"),
            acao: (erros != null && erros != undefined) ? false : (dados != null && dados != undefined && dados.length != 0) ? true : false,
            valores: (erros != null && erros != undefined) ? erros : (dados != null && dados != undefined && dados.length != 0) ? dados : null
        })
    })
}

module.exports.api_cadastro = (req, res) => {
    let corpo = req.body

    Agencia.countDocuments((erros, numero) => {
        if (erros) {
            res.json({
                erro: true,
                mensagem: configuracoes.mensagens("Er0"),
                acao: false,
                dados: null
            })
        }
        else {
            let novaagencia = new Agencia({
                identificador: Number(numero + 1),
                email: String(corpo.email).trim(),
                senha: bcrypt.hashSync(corpo.senha, 11),
                tipo: corpo.tipo,
                cnpj: Number(configuracoes.numeros(corpo.cnpj)),
                crecinumero: corpo.crecinumero,
                creciuf: corpo.creciuf,
                nomefantasia: (corpo.nomefantasia != undefined && corpo.nomefantasia != null) ? configuracoes.numeros(corpo.nomefantasia) : null,
                razaosocial: (corpo.razaosocial != undefined && corpo.razaosocial != null) ? configuracoes.numeros(corpo.razaosocial) : null,
                site: (corpo.site != undefined && corpo.site != null) ? configuracoes.numeros(corpo.site) : null,

                imobiliariatelefone: Number(configuracoes.numeros(corpo.imobiliariatelefone)),
                imobiliariacep: Number(configuracoes.numeros(corpo.imobiliariacep)),
                imobiliarialogradouro: String(corpo.imobiliarialogradouro).trim(),
                imobiliariabairro: String(corpo.imobiliariabairro).trim(),
                imobiliariacidade: String(corpo.imobiliariacidade).trim(),
                imobiliariaestado: corpo.imobiliariaestado,
                imobiliarianumero: corpo.imobiliarianumero,
                imobiliariacomplemento: (corpo.imobiliariacomplemento != undefined && corpo.imobiliariacomplemento != null) ? configuracoes.numeros(corpo.imobiliariacomplemento) : null,

                responsavelnome: String(corpo.responsavelnome).trim(),
                responsaveltelefone: Number(configuracoes.numeros(corpo.responsaveltelefone)),
                responsavelemail: String(corpo.responsavelemail).trim(),

                datacadastro: configuracoes.agora("completo")
            })

            Agencia.findOne({ cnpj: novaagencia.cnpj }).lean().exec((erros, existe) => {
                if (erros) {
                    res.json({
                        erro: true,
                        mensagem: configuracoes.mensagens("Er0"),
                        acao: false,
                        dados: null
                    })
                }
                else {
                    if (existe) {
                        res.json({
                            erro: false,
                            mensagem: configuracoes.mensagens("Ca2"),
                            acao: false,
                            valores: null
                        })
                    }
                    else {
                        Agencia.create(novaagencia, (erros, dados) => {
                            res.json({
                                erro: (erros != null && erros != undefined) ? true : false,
                                mensagem: (erros != null && erros != undefined) ? configuracoes.mensagens("Er2") : (existe === false) ? configuracoes.mensagens("Ca2") : (dados != null && dados != undefined && dados.length != 0) ? configuracoes.mensagens("Ca1") : configuracoes.mensagens("Ca0"),
                                acao: (erros != null && erros != undefined) ? false : (existe === false) ? false : (dados != null && dados != undefined && dados.length != 0) ? true : false,
                                valores: (erros != null && erros != undefined) ? erros : (existe === false) ? null : (dados != null && dados != undefined && dados.length != 0) ? novaagencia._id : null
                            })
                        })
                    }
                }
            })
        }
    })
}

module.exports.api_login = (req, res) => {
    let email = req.body.email
    let senha = req.body.senha

    let selecao = {
        "_id": 1,
        "email": 1,
        "senha": 1
    }

    Agencia.findOne({ email: email }).select(selecao).lean().exec((erros, existe) => {
        if (erros) {
            res.json({
                erro: true,
                mensagem: configuracoes.mensagens("Er0"),
                acao: false,
                dados: null
            })
        }
        else {
            if (existe) { // simplificar aqui.
                bcrypt.compare(senha, existe.senha, (erros, resultado) => {
                    if (erros) {
                        res.json({
                            erro: false,
                            mensagem: configuracoes.mensagens("Er1"),
                            acao: false,
                            dados: null
                        })
                    }
                    else {
                        if (resultado === true) {
                            res.json({
                                erro: false,
                                mensagem: configuracoes.mensagens("Lo1"),
                                acao: true,
                                dados: existe._id
                            })
                        }
                        else {
                            res.json({
                                erro: false,
                                mensagem: configuracoes.mensagens("Lo4"),
                                acao: false,
                                dados: null
                            })
                        }
                    }
                })
            }
            else {
                res.json({
                    erro: false,
                    mensagem: configuracoes.mensagens("Lo0"),
                    acao: false,
                    dados: null
                })
            }
        }
    })
}

module.exports.api_perfil = (req, res) => {
    let agencia = req.query.agencia

    let selecao = {
        senha: 0,
        senhalinkrecuperacao: 0,
        senhalinkexpiraem: 0
    }

    Agencia.findById(agencia).select(selecao).lean().exec((erros, dados) => {
        if (erros) {
            res.json({
                erro: true,
                mensagem: configuracoes.mensagens("Er0"),
                acao: false,
                dados: erros
            })
        }
        else {
            if (dados) {
                dados.cnpj = configuracoes.formatacao(dados.cnpj, "cnpj")
                dados.imobiliariacep = configuracoes.formatacao(dados.imobiliariacep, "cep")
                dados.imobiliariatelefone = configuracoes.formatacao(dados.imobiliariatelefone, "telefone")
                dados.responsaveltelefone = configuracoes.formatacao(dados.responsaveltelefone, "celular")
                dados.datacadastro = configuracoes.data(dados.datacadastro)

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

module.exports.api_edicao_json = (req, res) => {
    let agencia = req.query.agencia
    let corpo = req.body

    Agencia.findById(agencia).lean().exec((erros, ultimosdados) => {
        if (erros) {
            res.json({
                erro: true,
                mensagem: configuracoes.mensagens("Er0"),
                acao: false,
                valores: erros
            })
        }
        else {
            if (corpo.length != 0 && ultimosdados != null) {
                corpo.imobiliariatelefone = (corpo.imobiliariatelefone != undefined && corpo.imobiliariatelefone != null) ? configuracoes.numeros(corpo.imobiliariatelefone) : ultimosdados.imobiliariatelefone
                corpo.imobiliariacep = (corpo.imobiliariacep != undefined && corpo.imobiliariacep != null) ? configuracoes.numeros(corpo.imobiliariacep) : ultimosdados.imobiliariacep
                corpo.imobiliarianumero = (corpo.imobiliarianumero != undefined && corpo.imobiliarianumero != null) ? configuracoes.numeros(corpo.imobiliarianumero) : ultimosdados.imobiliarianumero

                corpo.responsaveltelefone = (corpo.responsaveltelefone != undefined && corpo.responsaveltelefone != null) ? configuracoes.numeros(corpo.responsaveltelefone) : ultimosdados.responsaveltelefone

                Agencia.findByIdAndUpdate(agencia, { $set: corpo }).lean().exec((erros, dados) => {
                    res.json({
                        erro: (erros != null && erros != undefined) ? true : false,
                        mensagem: (erros != null && erros != undefined) ? configuracoes.mensagens("Er0") : (dados != null && dados != undefined && dados.length != 0) ? configuracoes.mensagens("Da1") : configuracoes.mensagens("Da0"),
                        acao: (erros != null && erros != undefined) ? false : (dados != null && dados != undefined && dados.length != 0) ? true : false,
                        valores: (erros != null && erros != undefined) ? erros : (dados != null && dados != undefined && dados.length != 0) ? "editado" : "naoeditado"
                    })
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