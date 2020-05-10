let router = require("express").Router()
let visita = require("../controllers/visita.controller")

router.get("/api/tudo", visita.api_tudo)
router.post("/api/agendar", visita.api_agendar)
router.get("/api/visualizar", visita.api_visualizar)
router.get("/api/geral", visita.api_geral)
router.post("/api/editar", visita.api_editar)
router.get("/api/cancelar", visita.api_cancelar)

module.exports = router