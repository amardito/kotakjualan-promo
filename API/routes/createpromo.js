const express = require('express');
const router = express.Router();
const Special = require('../models/special');

//show all promos created
router.get('/', async (req, res, next) => {
    await Special.find()
    .select("idToko promoName requireItem bonusItem promoPrice")
    .then(doc => {
        res.status(200).json(doc);
    });
});

//create a promos
router.post('/', async (req, res, next) => {
    const special = new Special({
        idToko : req.body.idToko,
        promoName: req.body.promoName,
        requireItem: req.body.requireItem,
        bonusItem: req.body.bonusItem,
        promoPrice: req.body.promoPrice
    });
    await special.save();
    res.status(201).json({
        message: 'handle create idpacket',
        createdSpecial : special
    });
});

//search for specific promos
router.get('/:cpromo', async (req, res, next) => {
    await Special.findById({_id : req.params.cpromo})
    .then(doc => {
        if(doc){
            res.status(200).json(doc);
        }else{
            res.status(404).json({
                error : 'Not Found'
            });
        }
    });
});


//update some specific promos
router.put('/:cpromo', async (req, res, next) => {
    await Special.updateOne({_id : req.params.cpromo}, {$set : req.body.data})
    res.status(200).send({updating : req.body.data});
});
//delete specific promos
router.delete('/:cpromo', async (req, res, next) => {
   await Special.remove({_id : req.params.cpromo})
   .then(result => {
       res.status(201).json(result);
   });
});

module.exports = router;