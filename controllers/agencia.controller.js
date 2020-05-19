let Agencia = require("../models/agencia.model")
let configuracoes = require("../configuracoes")
let bcrypt = require("bcryptjs")
let random = require("randomatic")
let formidable = require("formidable")
let sizeOf = require("image-size")
let jimp = require("jimp")
let fs = require("fs")
let request = require("request")

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

module.exports.api_edicao_senha = (req, res) => {
    let agencia = req.query.agencia
    let senha = req.body.senha

    Agencia.findByIdAndUpdate(agencia, { $set: { senha: bcrypt.hashSync(senha, 10) } }).lean().exec((erros, dados) => {
        res.json({
            erro: (erros != null && erros != undefined) ? true : false,
            mensagem: (erros != null && erros != undefined) ? configuracoes.mensagens("Er0") : (dados != null && dados != undefined && dados.length != 0) ? configuracoes.mensagens("Ed1") : configuracoes.mensagens("Ed0"),
            acao: (erros != null && erros != undefined) ? false : (dados != null && dados != undefined && dados.length != 0) ? true : false,
            valores: (erros != null && erros != undefined) ? erros : (dados != null && dados != undefined && dados.length != 0) ? dados : null
        })
    })
}

module.exports.api_editar_logo = (req, res) => {
    var form = new formidable.IncomingForm()
    let agencia = req.query.agencia

    form.parse(req, function (erros, fields, files) {
        if (erros) {
            res.json({
                erro: true,
                acao: false,
                mensagem: configuracoes.mensagens("Er0"),
                valores: erros
            })
        }
        else {
            let selecao = {
                "_id": 1,
                "logo": 1
            }

            Agencia.findById(agencia).select(selecao).lean().exec(function (erros, existe) {
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
                        var fotobanco = existe["foto"]

                        var status = {
                            fotopresente: false,
                            fotoenviada: false,
                            fotoatualizada: null,
                            fotolink: null
                        }

                        status.fotopresente = (files["foto"] != undefined && files["foto"]["size"] != 0) ? true : false

                        if (status.fotopresente === true) {
                            let limitealtura = 1080
                            let dimensoes = sizeOf(fs.createReadStream(files["foto"]["path"])["path"])

                            var arquivofinal = `${random("A0a", 32)}.${files["foto"]["name"].split(".").pop()}`
                            status.fotolink = `${configuracoes.servidor.arquivos}/${configuracoes.padroes.pasta}/${arquivofinal}`

                            if ((Number(dimensoes["height"])) > (Number(limitealtura))) {
                                jimp.read(fs.createReadStream(files["foto"]["path"])["path"], function (erros, arquivo) {
                                    if (erros) {
                                        res.json({
                                            erro: true,
                                            acao: false,
                                            mensagem: configuracoes.mensagens("Er0"),
                                            valores: erros
                                        })
                                    }
                                    else {
                                        arquivo.resize(jimp.AUTO, limitealtura).quality(70).write(arquivofinal)
                                        configuracoes.dormir(250).then(() => {
                                            fs.readFile(arquivofinal, { encoding: "base64" }, function (erros, imagembase64) {
                                                if (erros) {
                                                    res.json({
                                                        erro: true,
                                                        acao: false,
                                                        mensagem: configuracoes.mensagens("Er0"),
                                                        valores: erros
                                                    })
                                                }
                                                else {
                                                    configuracoes.dormir(250).then(() => {
                                                        request.post({ url: configuracoes.servidor.arquivos + "/enviar.64.php", form: { destino: configuracoes.padroes.pasta, imagem: imagembase64, nome: arquivofinal }, json: true }, function (erros, envio) {
                                                            if (erros) {
                                                                res.json({
                                                                    erro: true,
                                                                    acao: false,
                                                                    mensagem: configuracoes.mensagens("Er0"),
                                                                    valores: erros
                                                                })
                                                            }
                                                            else {
                                                                if (envio["body"]["envio"] != false) {
                                                                    status.fotoenviada = true
                                                                    configuracoes.dormir(250).then(() => {
                                                                        fs.unlink(arquivofinal, function (erros) {
                                                                            if (erros) {
                                                                                res.json({
                                                                                    erro: true,
                                                                                    acao: false,
                                                                                    mensagem: configuracoes.mensagens("Er0"),
                                                                                    valores: erros
                                                                                })
                                                                            }
                                                                            else {
                                                                                if (status.fotoenviada === true && fotobanco != null) {
                                                                                    request.post({ url: `${configuracoes.servidor.arquivos}/apagar.php`, form: { arquivo: `./${fotobanco.split(configuracoes.servidor.arquivos).pop()}` }, json: true }, function (erros, resposta) {
                                                                                        if (erros) {
                                                                                            res.json({
                                                                                                erro: true,
                                                                                                acao: false,
                                                                                                mensagem: configuracoes.mensagens("Er0"),
                                                                                                valores: erros
                                                                                            })
                                                                                        }
                                                                                        else {
                                                                                            console.log({ "foto banco antiga excluída": resposta["body"]["exclusao"] })
                                                                                        }
                                                                                    })
                                                                                }
                                                                                else {
                                                                                    console.log("foto banco antiga é null, não pode ser apagada")
                                                                                }

                                                                                configuracoes.dormir(250).then(() => {
                                                                                    if (status.fotoenviada === true) {
                                                                                        Agencia.findByIdAndUpdate(agencia, { $set: { logo: status.fotolink, ativo: true } }).lean().exec(function (erros, atualizacao) {
                                                                                            if (erros) {
                                                                                                res.json({
                                                                                                    erro: true,
                                                                                                    acao: false,
                                                                                                    mensagem: configuracoes.mensagens("Er0"),
                                                                                                    valores: erros
                                                                                                })
                                                                                            }
                                                                                            else {
                                                                                                configuracoes.dormir(250).then(() => {
                                                                                                    status.fotoatualizada = ((atualizacao === null) ? false : true)
                                                                                                    res.json({
                                                                                                        erro: false,
                                                                                                        acao: true,
                                                                                                        mensagem: configuracoes.mensagens("Ed4"),
                                                                                                        valores: null
                                                                                                    })
                                                                                                })
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                    else {
                                                                                        res.json({
                                                                                            erro: false,
                                                                                            acao: false,
                                                                                            mensagem: configuracoes.mensagens("Ed7"),
                                                                                            valores: null
                                                                                        })
                                                                                    }
                                                                                })
                                                                            }
                                                                        })
                                                                    })
                                                                }
                                                                else {
                                                                    res.json({
                                                                        erro: false,
                                                                        acao: false,
                                                                        mensagem: configuracoes.mensagens("Ed7"),
                                                                        valores: null
                                                                    })
                                                                    console.log({ status }, 1, "nada bom... eu acho kkkkk")
                                                                }
                                                            }
                                                        })
                                                    })
                                                }
                                            })
                                        })
                                    }
                                })
                            }
                            else {
                                let upload = {
                                    pasta: configuracoes.padroes.pasta,
                                    nome: arquivofinal,
                                    caminho: files["foto"]["path"],
                                    arquivo: fs.createReadStream(files["foto"]["path"])
                                }

                                request.post({ url: `${configuracoes.servidor.arquivos}/enviar.PL.php`, json: true, formData: upload }, function (erros, enviofoto) {
                                    if (erros) {
                                        res.json({
                                            erro: true,
                                            acao: false,
                                            mensagem: configuracoes.mensagens("Ed0"),
                                            valores: erros
                                        })
                                    }
                                    else {
                                        status.fotoenviada = (enviofoto["body"]["envio"] === true) ? true : false

                                        if (status.fotoenviada === true && fotobanco != null) {
                                            request.post({ url: `${configuracoes.servidor.arquivos}/apagar.php`, form: { arquivo: `./${fotobanco.split(configuracoes.servidor.arquivos).pop()}` }, json: true }, function (erros, resposta) {
                                                if (erros) {
                                                    res.json({
                                                        erro: true,
                                                        acao: false,
                                                        mensagem: configuracoes.mensagens("Ed0"),
                                                        valores: erros
                                                    })
                                                }
                                                else {
                                                    console.log({ "foto antiga excluída": resposta["body"]["exclusao"] })
                                                }
                                            })
                                        }
                                        else {
                                            console.log("foto banco antiga é null, não pode ser apagada")
                                        }

                                        Agencia.findByIdAndUpdate(agencia, { $set: { logo: status.fotolink, ativo: true } }).lean().exec(function (erros, edicaofoto) {
                                            if (erros) {
                                                res.json({
                                                    erro: true,
                                                    acao: false,
                                                    mensagem: configuracoes.mensagens("Ed0"),
                                                    valores: erros
                                                })
                                            }
                                            else {
                                                if (edicaofoto) {
                                                    status.fotoatualizada = true

                                                    configuracoes.dormir(250).then(() => {
                                                        status.fotoatualizada = ((edicaofoto === null) ? false : true)
                                                        res.json({
                                                            erro: false,
                                                            acao: true,
                                                            mensagem: configuracoes.mensagens("Ed4"),
                                                            valores: null
                                                        })
                                                    })
                                                }
                                                else {
                                                    res.json({
                                                        erro: false,
                                                        acao: false,
                                                        mensagem: configuracoes.mensagens("Ed7"),
                                                        valores: null
                                                    })
                                                }
                                            }
                                        })

                                        let respostaenviofoto = (enviofoto["body"]["envio"] == true) ? console.log("envio da foto concluído") : console.log("não enviou a foto")
                                    }
                                })
                            }
                        }
                        else {
                            res.json({
                                erro: false,
                                acao: false,
                                mensagem: configuracoes.mensagens("Ed7"),
                                valores: erros
                            })
                        }
                    }
                    else {
                        res.json({
                            erro: false,
                            acao: false,
                            mensagem: configuracoes.mensagens("Ed0"),
                            valores: null
                        })

                    }
                }
            })
        }
    })
}