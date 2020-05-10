let router = require("express").Router()
let proprietario = require("../controllers/proprietario.controller")

router.get("/api/tudo", proprietario.api_tudo)
router.post("/api/cadastro", proprietario.api_cadastro)
router.post("/api/login", proprietario.api_login)
router.get("/api/perfil", proprietario.api_perfil)
router.post("/api/edicao/json", proprietario.api_edicao_json)
router.post("/api/edicao/senha", proprietario.api_edicao_senha)
router.get("/api/recuperacao", proprietario.api_recuperacao)

module.exports = router