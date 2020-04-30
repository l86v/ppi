let Imovel = require("../models/imovel.model")
let configuracoes = require("../configuracoes")
let request = require("request")

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
                titulo: String(corpo.titulo).trim(),
                descricao: String(corpo.descricao).trim(),
                matriculanumero: Number(configuracoes.numeros(corpo.matriculanumero)),
                matriculacartorio: String(corpo.matriculacartorio).trim(),

                cep: Number(configuracoes.numeros(corpo.cep)),
                logradouro: String(corpo.logradouro).trim(),
                bairro: String(corpo.bairro).trim(),
                cidade: String(corpo.cidade).trim(),
                estado: corpo.estado,
                numero: corpo.numero,
                complemento: (corpo.complemento != undefined && corpo.complemento != null) ? configuracoes.numeros(corpo.complemento) : null,

                vagas: Number(configuracoes.numeros(corpo.vagas)),
                suites: Number(configuracoes.numeros(corpo.suites)),
                quartos: Number(configuracoes.numeros(corpo.quartos)),
                banheiros: Number(configuracoes.numeros(corpo.banheiros)),

                valorvenda: Number(configuracoes.numeros(corpo.valorvenda)),
                valorlocacao: Number(configuracoes.numeros(corpo.valorlocacao)),
                valorcondominio: Number(configuracoes.numeros(corpo.valorcondominio)),
                condicaopagamentoiptu: String(corpo.condicaopagamentoiptu).trim(),

                areatotal: Number(configuracoes.numeros(corpo.areatotal)),
                areautil: Number(configuracoes.numeros(corpo.areautil)),
                areamedidafrente: Number(configuracoes.numeros(corpo.areamedidafrente)),
                areamedidalateral: Number(configuracoes.numeros(corpo.areamedidalateral)),
                areatopografia: String(corpo.areatopografia).trim(),

                salaestar: (corpo.salaestar === "Sim") ? true : false,
                escritorio: (corpo.escritorio === "Sim") ? true : false,
                piscina: (corpo.piscina === "Sim") ? true : false,
                churrasqueira: (corpo.churrasqueira === "Sim") ? true : false,
                tipogaragem: corpo.tipogaragem,

                finalidade: corpo.finalidade,
                categoria: corpo.categoria,
                subcategoria: corpo.subcategoria,
                condominio: (corpo.condominio === "Sim") ? true : false,
                andar: Number(configuracoes.numeros(corpo.andar)),

                datacadastro: configuracoes.agora("completo")
            })

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

module.exports.api_visita_agendar = (req, res) => {
    // vai ter que rodar um foreach pra nao dar encontro no mesmo
    // imovel no mesmo dia e mesma hora, assim como no eoff,
    // na presenca ou na entrada. nao me lembro bem agora.
}