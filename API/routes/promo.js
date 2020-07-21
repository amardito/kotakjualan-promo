const express = require('express');
const router = express.Router();
const Special = require('../models/special');

//show all availabe promos
router.get('/', async (req, res, next) => {
    await Special.find()
    .select("promoName requireItem bonusItem promoPrice")
    .then(doc => {
        res.status(200).json(doc);
    });
});

//search an available promos
router.get('/:promoid', async (req, res, next) => {
    await Special.findById({_id : req.params.promoid})
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

// search require idBarang which exist by idToko
function cekSyarat(arrCari, arrToko){
    let len = arrCari.length;
    let lenToko = arrToko.length;
    let rule = arrToko.length;
    let i = 0;
    let j = 0;
    let find = 0;
    let sta = false;
    while(i<len){
        j = 0;
        while(j<lenToko){
            if(arrCari[i] == arrToko[j].idBarang){
                find++;
                arrToko[j].idBarang = undefined;
            }
            if(find == rule){ //fulfilled qualify total finded
                sta = true;
                break;
            }
            j++;
        }
        i++;
    }
    return sta; //reset sta
}

//valid promo in cart
router.post('/cekpromo', async (req, res, next) => {
    let arrToko = new Array();
    let arrCari = new Array();
    let arrBonus = new Array();
    let tmpIdBarang = new Array()
    arrCari = req.body.idBarang;
    arrToko = req.body.idToko;
    let len =   arrToko.length;
    let i = 0;
    let totalPotongan = 0;
    while (i<len) {
        let s = await Special.find({idToko : arrToko[i]})
        if(s.length > 0){ // condition check , is idToko available?
            let lenS = s.length; // total value from idToko
            let o = 0; // for array index and loop condition
            while(o<lenS){
                tmpIdBarang = []; //declare as array
                let sta = cekSyarat(arrCari, s[o].requireItem);
                let lengBonusItem = s[o].bonusItem.length;//get length from bonusitem
                let p = 0;
                while(p<lengBonusItem){
                    tmpIdBarang.push(s[o].bonusItem[p].idBarang)// all values from bonusitem will be array
                    p++
                }
                let objItemBonus = { // make structure for result
                    idToko : s[o].idToko,
                    idBarang : tmpIdBarang
                }
                if(sta == true){
                    totalPotongan = totalPotongan + s[o].promoPrice;
                    arrBonus.push(objItemBonus) // the structure will be array
                    break;
                }
                o++;
            }
        }
        i++;
    }
    res.status(200).send({result: totalPotongan , arrBonus})
});

module.exports = router;