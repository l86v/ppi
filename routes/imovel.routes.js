let router = require("express").Router()
let imovel = require("../controllers/imovel.controller")

router.get("/api/tudo", imovel.api_tudo)
router.get("/api/proprietario/tudo", imovel.api_proprietario_tudo)
router.post("/api/cadastro", imovel.api_cadastro)
router.get("/api/visualizar/agencia", imovel.api_visualizar_via_agencia)
router.get("/api/visualizar/simples", imovel.api_visualizar_via_simples)
router.post("/api/edicao/json", imovel.api_edicao_json)
router.post("/api/edicao/fotos", imovel.api_edicao_fotos)
router.post("/api/edicao/chaves/principal", imovel.api_edicao_chaves_principal)

module.exports = router