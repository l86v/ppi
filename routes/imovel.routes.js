let router = require("express").Router()
let imovel = require("../controllers/imovel.controller")

router.get("/api/tudo", imovel.api_tudo)
router.post("/api/cadastro", imovel.api_cadastro)
router.get("/api/visualizar/agencia", imovel.api_visualizar_via_agencia)
router.get("/api/visualizar/simples", imovel.api_visualizar_via_simples)
router.post("/api/edicao/json", imovel.api_edicao_json)

module.exports = router