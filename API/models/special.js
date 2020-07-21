const mongoose = require('mongoose');

// const specialschema = mongoose.Schema();
const specialschema = mongoose.Schema({
    idToko : {type : String},
    promoName: {type: String},
    requireItem: {type: Array},
    bonusItem: {type : Array},
    promoPrice: {type: Number}
});

module.exports = mongoose.model('Special', specialschema);