let Proprietario = require("../models/proprietario.model")
let configuracoes = require("../configuracoes")
let bcrypt = require("bcryptjs")

module.exports.api_tudo = (req, res) => {
    let selecao = {
        "_id": 1,
        "identificador": 1,
        "nome": 1,
        "cidade": 1,
        "estado": 1
    }

    Proprietario.find({}).select(selecao).lean().exec((erros, dados) => {
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

    Proprietario.countDocuments((erros, numero) => {
        if (erros) {
            res.json({
                erro: true,
                mensagem: configuracoes.mensagens("Er0"),
                acao: false,
                dados: null
            })
        }
        else {
            let novoproprietario = new Proprietario({
                identificador: Number(numero + 1),
                nome: String(corpo.nome).trim(),
                email: String(corpo.email).trim(),
                senha: bcrypt.hashSync(corpo.senha, 11),
                telefone: (corpo.telefone != undefined && corpo.telefone != null) ? configuracoes.numeros(corpo.telefone) : null,
                celular: (corpo.celular != undefined && corpo.celular != null) ? configuracoes.numeros(corpo.celular) : null,

                cep: Number(configuracoes.numeros(corpo.cep)),
                logradouro: String(corpo.logradouro).trim(),
                bairro: String(corpo.bairro).trim(),
                cidade: String(corpo.cidade).trim(),
                estado: corpo.estado,
                numero: corpo.numero,
                complemento: (corpo.complemento != undefined && corpo.complemento != null) ? configuracoes.numeros(corpo.complemento) : null,

                datacadastro: configuracoes.agora("completo")
            })

            Proprietario.findOne({ email: novoproprietario.email }).lean().exec((erros, existe) => {
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
                        Proprietario.create(novoproprietario, (erros, dados) => {
                            res.json({
                                erro: (erros != null && erros != undefined) ? true : false,
                                mensagem: (erros != null && erros != undefined) ? configuracoes.mensagens("Er2") : (existe === false) ? configuracoes.mensagens("Ca2") : (dados != null && dados != undefined && dados.length != 0) ? configuracoes.mensagens("Ca1") : configuracoes.mensagens("Ca0"),
                                acao: (erros != null && erros != undefined) ? false : (existe === false) ? false : (dados != null && dados != undefined && dados.length != 0) ? true : false,
                                valores: (erros != null && erros != undefined) ? erros : (existe === false) ? null : (dados != null && dados != undefined && dados.length != 0) ? novoproprietario._id : null
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

    Proprietario.findOne({ email: email }).select(selecao).lean().exec((erros, existe) => {
        if (erros) {
            res.json({
                erro: true,
                mensagem: configuracoes.mensagens("Er0"),
                acao: false,
                dados: erros
            })
        }
        else {
            if (existe) {
                bcrypt.compare(senha, existe.senha, (erros, resultado) => {
                    res.json({
                        erro: (erros != undefined && erros != null) ? true : false,
                        acao: (erros != undefined && erros != null && resultado === true) ? true : false,
                        mensagem: (erros != undefined && erros != null) ? configuracoes.mensagens("Er1") : (resultado === true) ? configuracoes.mensagens("Lo1") : configuracoes.mensagens("Lo4"),
                        valores: (erros != undefined && erros != null) ? erros : (resultado === true) ? existe._id : null
                    })
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
    let proprietario = req.query.proprietario

    let selecao = {
        senha: 0,
        senhalinkrecuperacao: 0,
        senhalinkexpiraem: 0
    }

    Proprietario.findById(proprietario).select(selecao).lean().exec((erros, dados) => {
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
                dados.cep = configuracoes.formatacao(dados.cep, "cep")
                dados.telefone = configuracoes.formatacao(dados.telefone, "telefone")
                dados.celular = configuracoes.formatacao(dados.celular, "celular")
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
    let proprietario = req.query.proprietario
    let corpo = req.body

    Proprietario.findById(proprietario).lean().exec((erros, ultimosdados) => {
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
                corpo.telefone = (corpo.telefone != undefined && corpo.telefone != null) ? configuracoes.numeros(corpo.telefone) : ultimosdados.telefone
                corpo.celular = (corpo.celular != undefined && corpo.celular != null) ? configuracoes.numeros(corpo.celular) : ultimosdados.celular
                corpo.cep = (corpo.cep != undefined && corpo.cep != null) ? configuracoes.numeros(corpo.cep) : ultimosdados.cep
                corpo.numero = (corpo.numero != undefined && corpo.numero != null) ? configuracoes.numeros(corpo.numero) : ultimosdados.numero

                Proprietario.findByIdAndUpdate(proprietario, { $set: corpo }).lean().exec((erros, dados) => {
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

module.exports.api_edicao_senha = (req, res) => {
    let proprietario = req.query.proprietario
    let senha = req.body.senha

    Proprietario.findByIdAndUpdate(proprietario, { $set: { senha: bcrypt.hashSync(senha, 10) } }).lean().exec((erros, dados) => {
        res.json({
            erro: (erros != null && erros != undefined) ? true : false,
            mensagem: (erros != null && erros != undefined) ? configuracoes.mensagens("Er0") : (dados != null && dados != undefined && dados.length != 0) ? configuracoes.mensagens("Ed1") : configuracoes.mensagens("Ed0"),
            acao: (erros != null && erros != undefined) ? false : (dados != null && dados != undefined && dados.length != 0) ? true : false,
            valores: (erros != null && erros != undefined) ? erros : (dados != null && dados != undefined && dados.length != 0) ? dados : null
        })
    })
}

module.exports.api_recuperacao = (req, res) => {
    let metodo = req.query.metodo

    if (metodo === "solicitar") {
        Proprietario.findOne({ email: req.query.email }).lean().exec((erros, existe) => {
            if (erros) {
                res.json({
                    erro: true,
                    acao: false,
                    mensagem: configuracoes.mensagens("Er0"),
                    valores: erros
                })
            }
            else {
                if (existe) {
                    Proprietario.findOneAndUpdate({ email: req.query.email }, { $set: { senhalinkrecuperacao: configuracoes.gerarlinkrecuperacaosenha(), senhalinkexpiraem: configuracoes.agora("ms").milissegundos } }).lean().exec((erros, dados) => {
                        res.json({
                            erro: (erros != null && erros != undefined) ? true : false,
                            mensagem: (erros != null && erros != undefined) ? configuracoes.mensagens("Er0") : (dados != null && dados != undefined && dados.length != 0) ? configuracoes.mensagens("Re1") : configuracoes.mensagens("Re0"),
                            acao: (erros != null && erros != undefined) ? false : (dados != null && dados != undefined && dados.length != 0) ? true : false,
                            valores: (erros != null && erros != undefined) ? erros : (dados != null && dados != undefined && dados.length != 0) ? dados : null
                        })
                    })
                }
                else {
                    res.json({
                        erro: false,
                        acao: false,
                        mensagem: configuracoes.mensagens("Re2"),
                        valores: "0s"
                    })
                }
            }
        })
    }
    if (metodo === "verificar") {
        Proprietario.findOne({ senhalinkrecuperacao: req.query.link }).lean().exec((erros, existe) => {
            if (erros) {
                res.json({
                    erro: true,
                    acao: false,
                    mensagem: configuracoes.mensagens("Er0"),
                    valores: erros
                })
            }
            else {
                if (existe) {
                    if (Number(existe.senhalinkexpiraem) < configuracoes.agora("ms").milissegundos) { // isso deve ser coisa boa.
                        res.json({
                            erro: false,
                            acao: true,
                            mensagem: configuracoes.mensagens("Re4"),
                            valores: null
                        })
                    }
                    else {
                        res.json({
                            erro: false,
                            acao: false,
                            mensagem: configuracoes.mensagens("Re2"),
                            valores: "1s"
                        })
                    }
                }
                else {
                    res.json({
                        erro: false,
                        acao: false,
                        mensagem: configuracoes.mensagens("Re2"),
                        valores: "2s"
                    })
                }
            }
        })
    }
    if (metodo === "redefinir") {
        Proprietario.findOne({ email: req.query.email, senhalinkrecuperacao: req.query.link }).lean().exec((erros, dados) => {
            if (erros) {
                res.json({
                    erro: true,
                    acao: false,
                    mensagem: configuracoes.mensagens("Re0"),
                    valores: erros
                })
            }
            else {
                if (dados && Number(dados.senhalinkexpiraem) < configuracoes.agora("ms").milissegundos) {
                    Proprietario.findOneAndUpdate({ email: req.query.email, senhalinkrecuperacao: req.query.link }, { $set: { senha: bcrypt.hashSync(req.body.senha, 10), senhalinkrecuperacao: null, senhalinkexpiraem: null } }).lean().exec((erros, dados) => {
                        res.json({
                            erro: (erros != null && erros != undefined) ? true : false,
                            mensagem: (erros != null && erros != undefined) ? configuracoes.mensagens("Er0") : (dados != null && dados != undefined && dados.length != 0) ? configuracoes.mensagens("Re1") : configuracoes.mensagens("Re0"),
                            acao: (erros != null && erros != undefined) ? false : (dados != null && dados != undefined && dados.length != 0) ? true : false,
                            valores: (erros != null && erros != undefined) ? erros : (dados != null && dados != undefined && dados.length != 0) ? dados : null
                        })
                    })
                }
                else {
                    res.json({
                        erro: false,
                        acao: false,
                        mensagem: configuracoes.mensagens("Re2"),
                        valores: "3s"
                    })
                }
            }
        })
    }
}