let mongoose = require("mongoose")

let FavoritoSchema = new mongoose.Schema({
    agencia: { type: mongoose.SchemaTypes.ObjectId, ref: "Agencia" },
    imovel: { type: mongoose.SchemaTypes.ObjectId, ref: "Imovel" },
    data: { type: String, required: true }
})

let Favorito = mongoose.model("Favorito", FavoritoSchema)
module.exports = Favorito