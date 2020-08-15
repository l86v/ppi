let router = require("express").Router()
let proposta = require("../controllers/proposta.controller")

router.get("/api/tudo", proposta.api_tudo)
router.post("/api/salvar", proposta.api_salvar)
router.get("/api/remover", proposta.api_remover)
router.get("/api/imovel", proposta.api_imovel)

module.exports = router