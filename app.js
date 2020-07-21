const express = require('express');
const app = express();
const promoRoutes = require('./API/routes/promo');
const CpromoRoutes = require('./API/routes/createpromo');
const bp = require('body-parser');
const mongoose = require('mongoose');

app.use(bp.json());
mongoose.connect('mongodb://localhost/promos', { useNewUrlParser: true, useUnifiedTopology: true });

//router use
app.use('/promo', promoRoutes);
app.use('/cpromo', CpromoRoutes);

//error message edit
app.use((req, res, next) => {
    const error = new Error('not found');
    res.status(404).json({
        error: error.message
    });
})

module.exports = app;

