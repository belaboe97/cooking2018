const mongoose = require('mongoose'); 

// Model für das Speichern von Gerichten 

const gerichtSchema = mongoose.Schema({
    ObjectId: mongoose.Types.ObjectId,
    name: String,
    author: String, 
    anleitung : String, 
    personen : Number, 
    zutat: [String],
    menge: [Number],
    mengeneinheit: [String],
    text : String,
    gerichtImage: {type: String, required: true},
    rating : [Number]
})

module.exports = mongoose.model('Gericht', gerichtSchema)

