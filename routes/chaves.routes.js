let router = require("express").Router()
let chaves = require("../controllers/chaves.controller")

router.get("/api/tudo", chaves.api_tudo)
router.get("/api/proprietario", chaves.api_proprietario)
router.post("/api/adicionar", chaves.api_adicionar)
router.get("/api/remover", chaves.api_remover)

module.exports = router