let router = require("express").Router()
let visualizacao = require("../controllers/visualizacao.controller")

router.get("/api/tudo", visualizacao.api_tudo)
router.get("/api/total", visualizacao.api_total)
router.get("/api/marcar", visualizacao.api_marcar)
router.get("/api/verificar", visualizacao.api_verificar)
router.delete("/api/excluir/imovel/agencia", visualizacao.api_excluir_imovel_agencia)
router.delete("/api/excluir/imovel/tudo", visualizacao.api_excluir_imovel_todos)
router.delete("/api/excluir/agencia", visualizacao.api_excluir_agencia)

module.exports = router