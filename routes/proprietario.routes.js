let router = require("express").Router()
let proprietario = require("../controllers/proprietario.controller")

router.get("/api/tudo", proprietario.api_tudo)
router.post("/api/cadastro", proprietario.api_cadastro)
router.post("/api/login", proprietario.api_login)
router.post("/api/web/login", proprietario.api_web_login)
router.get("/api/perfil", proprietario.api_perfil)
router.post("/api/edicao/json", proprietario.api_edicao_json)
router.post("/api/edicao/senha", proprietario.api_edicao_senha)
router.post("/api/edicao/foto", proprietario.api_editar_foto)
router.get("/api/recuperacao", proprietario.api_recuperacao)

router.get("/login", proprietario.pug_login)
router.get("/cadastrar", proprietario.pug_cadastro)
router.get("/pagina-inicial", proprietario.pug_index)
router.get("/meus-imoveis", proprietario.pug_imoveis_todos)
router.get("/meus-imoveis/visualizar", proprietario.pug_imoveis_visualizar)
router.get("/meus-imoveis/cadastro", proprietario.pug_imoveis_cadastro)
router.get("/meus-imoveis/chaves", proprietario.pug_imoveis_chaves_principal)

module.exports = router