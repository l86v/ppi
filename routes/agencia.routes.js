let router = require("express").Router()
let agencia = require("../controllers/agencia.controller")

router.get("/api/tudo", agencia.api_tudo)
router.post("/api/cadastro", agencia.api_cadastro)
router.post("/api/login", agencia.api_login)
router.get("/api/perfil", agencia.api_perfil)
router.post("/api/edicao/json", agencia.api_edicao_json)

module.exports = router