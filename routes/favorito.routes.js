let router = require("express").Router()
let favorito = require("../controllers/favorito.controller")

router.get("/api/tudo", favorito.api_tudo)
router.get("/api/verificar", favorito.api_verificar)
router.get("/api/acao", favorito.api_acao)
router.get("/api/agencia", favorito.api_agencia)

module.exports = router