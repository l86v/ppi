let Imovel = require("../models/imovel.model")
let configuracoes = require("../configuracoes")
let request = require("request")
let random = require("randomatic")
let formidable = require("formidable")
let sizeOf = require("image-size")
let jimp = require("jimp")
let fs = require("fs")
const { config } = require("process")

module.exports.api_tudo = (req, res) => {
    let selecao = {
        "_id": 1,
        "identificador": 1,
        "titulo": 1,
        "cidade": 1,
        "estado": 1
    }

    Imovel.find({}).select(selecao).lean().exec((erros, dados) => {
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

    Imovel.countDocuments((erros, numero) => {
        if (erros) {
            res.json({
                erro: true,
                mensagem: configuracoes.mensagens("Er0"),
                acao: false,
                dados: null
            })
        }
        else {
            let novoimovel = new Imovel({
                identificador: Number(numero + 1),
                proprietario: corpo.proprietario,
                documentocartorio: corpo.documentocartorio,
                matricula: Number(configuracoes.numeros(corpo.matricula)),
                descricao: String(corpo.descricao).trim(),

                cep: configuracoes.numeros(corpo.cep),
                logradouro: String(corpo.logradouro).trim(),
                bairro: String(corpo.bairro).trim(),
                cidade: String(corpo.cidade).trim(),
                estado: corpo.estado,
                numero: corpo.numero,
                complemento: (corpo.complemento != undefined && corpo.complemento != null) ? configuracoes.numeros(corpo.complemento) : null,

                dormitorios: configuracoes.numeros(corpo.dormitorios),
                vagas: configuracoes.numeros(corpo.vagas),
                suites: configuracoes.numeros(corpo.suites),
                banheiros: configuracoes.numeros(corpo.banheiros),

                valorvenda: configuracoes.numeros(corpo.valorvenda),
                valorlocacao: configuracoes.numeros(corpo.valorlocacao),
                valorcondominio: configuracoes.numeros(corpo.valorcondominio),
                condicaoiptu: String(corpo.condicaoiptu).trim(),

                medidatotal: configuracoes.numeros(corpo.medidatotal),
                medidautil: configuracoes.numeros(corpo.medidautil),
                medidafrente: configuracoes.numeros(corpo.medidafrente),
                medidalateral: configuracoes.numeros(corpo.medidalateral),
                medidafundos: configuracoes.numeros(corpo.medidafundos),
                medidaconstruida: configuracoes.numeros(corpo.medidaconstruida),
                areatopografia: String(corpo.areatopografia).trim(),

                finalidade: corpo.finalidade,
                categoria: corpo.categoria,
                subcategoria: corpo.subcategoria,
                condominio: (corpo.condominio === "sim") ? true : false,
                andar: Number(configuracoes.numeros(corpo.andar)),

                piscina: (corpo.piscina === "sim") ? true : false,
                salaestar: (corpo.salaestar === "sim") ? true : false,
                escritorio: (corpo.escritorio === "sim") ? true : false,
                churrasqueira: (corpo.churrasqueira === "sim") ? true : false,

                datacadastro: configuracoes.agora("completo")
            })

            console.log({ novoimovel })

            Imovel.create(novoimovel, (erros, dados) => {
                res.json({
                    erro: (erros != null && erros != undefined) ? true : false,
                    mensagem: (erros != null && erros != undefined) ? configuracoes.mensagens("Er4") : (dados != null && dados != undefined && dados.length != 0) ? configuracoes.mensagens("Ca4") : configuracoes.mensagens("Ca0"),
                    acao: (erros != null && erros != undefined) ? false : (dados != null && dados != undefined && dados.length != 0) ? true : false,
                    valores: (erros != null && erros != undefined) ? erros : (dados != null && dados != undefined && dados.length != 0) ? novoimovel._id : null
                })
            })
        }
    })
}

module.exports.api_visualizar_via_agencia = (req, res) => {
    let imovel = req.query.imovel
    let agencia = req.query.agencia

    request.get({ url: `${configuracoes.servidor.endereco}:${configuracoes.servidor.porta}/visualizacao/api/marcar?agencia=${agencia}&imovel=${imovel}`, json: true }, (erros, dados) => {
        console.log(`marcando visualizacao... imovel ${imovel} para a agencia ${agencia}`)
    })

    request.get({ url: `${configuracoes.servidor.endereco}:${configuracoes.servidor.porta}/favorito/api/verificar?agencia=${agencia}&imovel=${imovel}`, json: true }, (erros, dados) => {
        console.log(`verificando favorito... imovel ${imovel} para a agencia ${agencia}`)
        if (erros) {
            res.json({
                erro: true,
                mensagem: configuracoes.mensagens("Er0"),
                acao: false,
                valores: erros
            })
        }
        else {
            request.get({ url: `${configuracoes.servidor.endereco}:${configuracoes.servidor.porta}/visualizacao/api/total?imovel=${imovel}`, json: true }, (errosvisualizacao, dadosvisualizacao) => {
                console.log(`resgatando informacao de total de views... imovel ${imovel}, total de ${dadosvisualizacao['body']['valores']}`)

                let populacao = [
                    { path: "proprietario", select: ["nome", "foto"] }
                ]

                let favorito = (dados["body"]["valores"])

                Imovel.findById(imovel).populate(populacao).lean().exec((erros, dados) => {
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
                            dados.visualizacoes = dadosvisualizacao["body"]["valores"]
                            dados.favorito = favorito
                            dados.cep = configuracoes.formatacao(dados.cep, "cep")
                            dados.valorvenda = configuracoes.conversao_valores(dados.valorvenda, "dinheiro")
                            dados.valorlocacao = configuracoes.conversao_valores(dados.valorlocacao, "dinheiro")
                            dados.valorcondominio = configuracoes.conversao_valores(dados.valorcondominio, "dinheiro")
                            dados.salaestar = (dados.salaestar === true) ? "Sim" : "Não"
                            dados.escritorio = (dados.escritorio === true) ? "Sim" : "Não"
                            dados.piscina = (dados.piscina === true) ? "Sim" : "Não"
                            dados.churrasqueira = (dados.churrasqueira === true) ? "Sim" : "Não"
                            dados.condominio = (dados.condominio === true) ? "Sim" : "Não"

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
            })
        }
    })
}

module.exports.api_visualizar_via_simples = (req, res) => {
    let imovel = req.query.imovel

    Imovel.findById(imovel).lean().exec((erros, dados) => {
        if (dados != undefined) {
            dados.foto = dados.fotos[0]
            dados.valorvendaformatado = configuracoes.conversao_valores(dados.valorvenda, "dinheiro")
        }

        console.log(imovel, dados)

        res.json({
            erro: (erros != null && erros != undefined) ? true : false,
            mensagem: (erros != null && erros != undefined) ? configuracoes.mensagens("Er0") : (dados != null && dados != undefined && dados.length != 0) ? configuracoes.mensagens("Da1") : configuracoes.mensagens("Da0"),
            acao: (erros != null && erros != undefined) ? false : (dados != null && dados != undefined && dados.length != 0) ? true : false,
            valores: (erros != null && erros != undefined) ? erros : (dados != null && dados != undefined && dados.length != 0) ? dados : null
        })
    })
}

module.exports.api_edicao_json = (req, res) => {
    let imovel = req.query.imovel
    let corpo = req.body

    Imovel.findById(imovel).lean().exec((erros, ultimosdados) => {
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
                corpo.matriculanumero = (corpo.matriculanumero != undefined && corpo.matriculanumero != null) ? configuracoes.numeros(corpo.matriculanumero) : ultimosdados.matriculanumero
                corpo.cep = (corpo.cep != undefined && corpo.cep != null) ? configuracoes.numeros(corpo.cep) : ultimosdados.cep

                corpo.vagas = (corpo.vagas != undefined && corpo.vagas != null) ? configuracoes.numeros(corpo.vagas) : ultimosdados.vagas
                corpo.suites = (corpo.suites != undefined && corpo.suites != null) ? configuracoes.numeros(corpo.suites) : ultimosdados.suites
                corpo.quartos = (corpo.quartos != undefined && corpo.quartos != null) ? configuracoes.numeros(corpo.quartos) : ultimosdados.quartos
                corpo.banheiros = (corpo.banheiros != undefined && corpo.banheiros != null) ? configuracoes.numeros(corpo.banheiros) : ultimosdados.banheiros

                corpo.valorvenda = (corpo.valorvenda != undefined && corpo.valorvenda != null) ? configuracoes.numeros(corpo.valorvenda) : ultimosdados.valorvenda
                corpo.valorlocacao = (corpo.valorlocacao != undefined && corpo.valorlocacao != null) ? configuracoes.numeros(corpo.valorlocacao) : ultimosdados.valorlocacao
                corpo.valorcondominio = (corpo.valorcondominio != undefined && corpo.valorcondominio != null) ? configuracoes.numeros(corpo.valorcondominio) : ultimosdados.valorcondominio

                corpo.areatotal = (corpo.areatotal != undefined && corpo.areatotal != null) ? configuracoes.numeros(corpo.areatotal) : ultimosdados.areatotal
                corpo.areautil = (corpo.areautil != undefined && corpo.areautil != null) ? configuracoes.numeros(corpo.areautil) : ultimosdados.areautil
                corpo.areamedidafrente = (corpo.areamedidafrente != undefined && corpo.areamedidafrente != null) ? configuracoes.numeros(corpo.areamedidafrente) : ultimosdados.areamedidafrente
                corpo.areamedidalateral = (corpo.areamedidalateral != undefined && corpo.areamedidalateral != null) ? configuracoes.numeros(corpo.areamedidalateral) : ultimosdados.areamedidalateral

                corpo.salaestar = (corpo.salaestar != undefined && corpo.salaestar != null) ? (corpo.salaestar === "Sim") ? true : false : ultimosdados.salaestar
                corpo.escritorio = (corpo.escritorio != undefined && corpo.escritorio != null) ? (corpo.escritorio === "Sim") ? true : false : ultimosdados.escritorio
                corpo.piscina = (corpo.piscina != undefined && corpo.piscina != null) ? (corpo.piscina === "Sim") ? true : false : ultimosdados.piscina
                corpo.churrasqueira = (corpo.churrasqueira != undefined && corpo.churrasqueira != null) ? (corpo.churrasqueira === "Sim") ? true : false : ultimosdados.churrasqueira

                corpo.churrasqueira = (corpo.condominio != undefined && corpo.condominio != null) ? (corpo.condominio === "Sim") ? true : false : ultimosdados.condominio
                corpo.andar = (corpo.andar != undefined && corpo.andar != null) ? configuracoes.numeros(corpo.andar) : ultimosdados.andar

                Imovel.findByIdAndUpdate(imovel, { $set: corpo }).lean().exec((erros, dados) => {
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

module.exports.api_edicao_fotos = (req, res) => {
    // para apagar, tem que ser foto por foto em uma api diferente.
    // para reorganizar tem que ser uma api diferente.

    var form = new formidable.IncomingForm()
    let imovel = req.query.imovel

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
            var final = 7
            var arquivos_submetidos = []

            for (var a = 0; a <= final; a++) {
                var arquivo_atual = `foto_${String(a)}`
                var decisao = (files[arquivo_atual] != undefined) ? (files[arquivo_atual]["path"] != undefined) ? arquivos_submetidos.push({ arquivo_transacao: arquivo_atual, arquivo_novonome: `${imovel}_${random("0", 3)}.${files[arquivo_atual]["name"].split(".").pop()}`, arquivo_dados: files[arquivo_atual], arquivo_enviado: false }) : null : null
                console.log(decisao != null ? `decisão true!! (${arquivo_atual})` : `decisão false. (${arquivo_atual})`)
            }

            arquivos_submetidos.forEach((arquivo_candidato) => {
                if (arquivo_candidato.arquivo_enviado === false) {
                    console.log("oie.")
                }
                else {
                    console.log("ja enviado.")
                }
                let limitealtura = 1080
                let dimensoes = sizeOf(fs.createReadStream(arquivo_candidato["arquivo_dados"]["path"])["path"])

                if ((Number(dimensoes["height"])) > (Number(limitealtura))) {
                    console.log(`foto atual (${arquivo_candidato['arquivo_novonome']}) maior que ${limitealtura} de altura, base 64.`)

                    jimp.read(fs.createReadStream(arquivo_candidato["arquivo_dados"]["path"])["path"], function (erros, arquivo) {
                        if (erros) {
                            console.log({ erros, local: 0, arquivo: arquivo_candidato["arquivo_dados"]["name"] })
                        }
                        else {
                            arquivofinal = arquivo_candidato["arquivo_novonome"]
                            arquivo.resize(jimp.AUTO, limitealtura).quality(70).write(arquivofinal)
                            configuracoes.dormir(25).then(() => {
                                fs.readFile(arquivofinal, { encoding: "base64" }, function (erros, imagembase64) {
                                    if (erros) {
                                        console.log({ erros, local: 1, arquivo: arquivo_candidato["arquivo_dados"]["name"] })
                                    }
                                    else {
                                        configuracoes.dormir(25).then(() => {
                                            request.post({ url: configuracoes.servidor.arquivos + "/enviar.64.php", form: { destino: configuracoes.padroes.pasta, imagem: imagembase64, nome: arquivofinal }, json: true }, function (erros, envio) {
                                                if (erros) {
                                                    console.log({ erros, local: 2, arquivo: arquivo_candidato["arquivo_dados"]["name"] })
                                                }
                                                else {
                                                    if (envio["body"]["envio"] != false) {
                                                        configuracoes.dormir(25).then(() => {
                                                            fs.unlink(arquivofinal, function (erros) {
                                                                if (erros) {
                                                                    console.log({ erros, local: 3, arquivo: arquivo_candidato["arquivo_dados"]["name"] })
                                                                }
                                                                else {
                                                                    arquivo_candidato.arquivo_enviado = true
                                                                    var respostaenviofoto = { mensagem: "sucesso...", local: 0, arquivo: arquivo_candidato["arquivo_dados"]["name"] }
                                                                    console.log(`envio 64...`, respostaenviofoto)
                                                                }
                                                            })
                                                        })
                                                    }
                                                    else {
                                                        console.log({ mensagem: "nao foi...", local: 0, arquivo: arquivo_candidato["arquivo_dados"]["name"] })
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
                    console.log(`foto ${arquivo_candidato['arquivo_novonome']} menor que ${limitealtura} de altura, plano.`)
                    arquivofinal = arquivo_candidato["arquivo_novonome"]

                    let upload = {
                        pasta: configuracoes.padroes.pasta,
                        nome: arquivofinal,
                        caminho: arquivo_candidato["arquivo_dados"]["path"],
                        arquivo: fs.createReadStream(arquivo_candidato["arquivo_dados"]["path"])
                    }

                    request.post({ url: `${configuracoes.servidor.arquivos}/enviar.PL.php`, json: true, formData: upload }, function (erros, enviofoto) {
                        if (erros) {
                            console.log({ erros, local: 4, arquivo: arquivo_candidato["arquivo_dados"]["name"] })
                        }
                        else {
                            var respostaenviofoto = (enviofoto["body"]["envio"] == true) ? { mensagem: "sucesso...", local: 1, arquivo: arquivo_candidato["arquivo_dados"]["name"] } : { mensagem: "nao foi...", local: 0, arquivo: arquivo_candidato["arquivo_dados"]["name"] }

                            console.log(`envio plano...`, respostaenviofoto)
                            arquivo_candidato.arquivo_enviado = true
                        }
                    })
                }
            })
        }

        configuracoes.dormir(100).then(() => {
            let novasfotos = []

            arquivos_submetidos.forEach(item => {
                novasfotos.push(`${configuracoes.servidor.arquivos}/${configuracoes.padroes.pasta}/${item.arquivo_novonome}`)
            })

            console.log(novasfotos)

            Imovel.findByIdAndUpdate(imovel, { $set: { fotos: novasfotos } }).lean().exec((erros, dados) => {
                res.json({
                    erro: (erros != null && erros != undefined) ? true : false,
                    mensagem: (erros != null && erros != undefined) ? configuracoes.mensagens("Er0") : (dados != null && dados != undefined && dados.length != 0) ? configuracoes.mensagens("Ed3") : configuracoes.mensagens("Ed6"),
                    acao: (erros != null && erros != undefined) ? false : (dados != null && dados != undefined && dados.length != 0) ? true : false,
                    valores: (erros != null && erros != undefined) ? erros : (dados != null && dados != undefined && dados.length != 0) ? "editado" : "naoeditado"
                })
            })
        })
    })
}

module.exports.api_edicao_chaves_principal = (req, res) => {
    res.json(req.body)
}

module.exports.api_proprietario_tudo = (req, res) => {
    let proprietario = req.query.proprietario

    Imovel.find({ proprietario: proprietario }).lean().exec((erros, dados) => {
        if (dados != null) {
            dados.forEach(item => {
                item.foto = (item.fotos != []) ? (item.fotos[0]) : null
                return item
            })
        }

        res.json({
            erro: (erros != null && erros != undefined) ? true : false,
            mensagem: (erros != null && erros != undefined) ? configuracoes.mensagens("Er0") : (dados != null && dados != undefined && dados.length != 0) ? configuracoes.mensagens("Da1") : configuracoes.mensagens("Da0"),
            acao: (erros != null && erros != undefined) ? false : (dados != null && dados != undefined && dados.length != 0) ? true : false,
            valores: (erros != null && erros != undefined) ? erros : (dados != null && dados != undefined && dados.length != 0) ? dados : null
        })
    })
}