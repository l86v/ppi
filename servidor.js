let configuracoes = require("./configuracoes")
let http = require("http")
let express = require("express")
let express_session = require("express-session")
let body_parser = require("body-parser")
let mongoose = require("mongoose")
let servidor = express()
let morgan = require("morgan")
let chalk = require("chalk")

servidor.use(body_parser.json({ limit: "16mb" }))
servidor.use(body_parser.urlencoded({ extended: true }))
servidor.use(morgan(`${chalk.bold.yellow("Mensagem:")} ${chalk.magentaBright(":status / :response-time ms / :date[clf]")} @ :url`))
servidor.set("view engine", "pug")
servidor.set("views", __dirname + "/views")
servidor.use(express.static(__dirname + "/views"))
servidor.use(express_session({ resave: true, secret: configuracoes.servidor.segredo, saveUninitialized: true, cookie: { secure: true } }))

let proprietario = require("./routes/proprietario.routes")
let imovel = require("./routes/imovel.routes")
let agencia = require("./routes/agencia.routes")
let favorito = require("./routes/favorito.routes")
let visualizacao = require("./routes/visualizacao.routes")
let visita = require("./routes/visita.routes")

let conexao = `mongodb://${configuracoes.db.usuario}:${configuracoes.db.senha}@${configuracoes.db.dominio}.mlab.com:${configuracoes.db.porta}/${configuracoes.db.nomedb}`
let mongoDB = process.env.MONGODB_URI || conexao
mongoose.set('useCreateIndex', true)
mongoose.set("useFindAndModify", false)
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })

mongoose.Promise = global.Promise
const db = mongoose.connection
db.on("error", console.error.bind(console, '-> Erro ao conectar com o banco de dados:'))

servidor.get(["/", "/index", "", "/pagina-inicial"], (req, res) => {
    let arquivo = "estrutura.index.pug"
    let pacote = {
        configuracoes: configuracoes,
        pagina: {
            nome: "off/index",
            titulo: `Página inicial | ${configuracoes.servidor.titulo}`
        }
    }

    res.render(arquivo, pacote)
})

servidor.use(["/imoveis", "/imovel"], imovel)
servidor.use(["/proprietarios", "/proprietario"], proprietario)
servidor.use(["/agencias", "/agencia"], agencia)
servidor.use(["/favoritos", "/favorito"], favorito)
servidor.use(["/visualizacoes", "/visualizacao"], visualizacao)
servidor.use(["/visitas", "/visita"], visita)

http.createServer(servidor).listen(configuracoes.servidor.porta)
console.log(chalk.cyan(`Servidor ligado na porta ${configuracoes.servidor.porta}!`))