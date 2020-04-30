let mongoose = require("mongoose")

let VisualizacaoSchema = new mongoose.Schema({
    agencia: { type: mongoose.SchemaTypes.ObjectId, ref: "Agencia" },
    imovel: { type: mongoose.SchemaTypes.ObjectId, ref: "Imovel" },
    data: { type: String, required: true }
})

let Visualizacao = mongoose.model("Visualizacao", VisualizacaoSchema)
module.exports = Visualizacao