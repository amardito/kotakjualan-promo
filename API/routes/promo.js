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


function cekSyarat(arrCari, arrToko){
    let len = arrCari.length;
    let i = 0;
    let j = 0;
    let lenToko = arrToko.length
    let rule = arrToko.length;
    //console.log(rule);
    let find = 0;
    let sta = false;
    while(i<len){
        
        // console.log("Cari : "+arrCari[i]);

        //console.log("i : "+i);

        j = 0;

        while(j<lenToko){

          
            if(arrCari[i] == arrToko[j].productID){
                find++;
                // console.log(arrToko[j].productID);
                arrToko[j].productID = undefined;
            }

            //console.log("Ketemu : "+find);  

            if(find == rule){
                // console.log("Berhenti");
                sta = true;
                break;
            }

            j++;
        }

        i++;
    }
    return sta;
}

//valid promo in cart
router.post('/cekpromo', async (req, res, next) => {
    let arrToko = new Array();
    let arrCari = new Array();
    let arrBonus = new Array();
    arrCari = req.body.idBarang;
    arrToko = req.body.idToko;
    let len =   arrToko.length;
    let i = 0;
    let totalPotongan = 0;
    while (i<len) {
        let s = await Special.find({idToko : arrToko[i]})
        if(s.length > 0){
            let lenS = s.length;
            let o = 0;
            while(o<lenS){
                //console.log(s[0].requireItem);
                let sta = cekSyarat(arrCari, s[o].requireItem);
                // console.log(sta)    
                if(sta == true){
                    totalPotongan = totalPotongan + s[o].promoPrice;
                    arrBonus = s[o].bonusItem;
                    break;
                }
                o++;
            }
        }
        i++;
    }
    // console.log(totalPotongan)
    res.status(200).send({result: totalPotongan , arrBonus})
});

module.exports = router;