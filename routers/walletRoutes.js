const express = require('express')
const {v4} = require('uuid');
const product = require('../models/products');
const wallet = require('../models/wallet')
const walletRouter = express.Router();
const Lock = require('../services/Lock')

let lock = new Lock();

walletRouter.post('/wallet', async(req,res)=>{

    try {
        const {balance , name} = req.body ;

        if(!balance || !name){
            return res.json({
                "status" : "false", 
                "message" : "balance or name not found"
            })
        }
        console.log("#1");

        const walletID = v4();
        console.log("walletID : " , walletID);

        const transactionId = v4();

        const createWallet = await wallet.create({
            walletID , 
            balance , 
            transactionId , 
            name 
        } )

        return res.json({
            createWallet
        })
        
                
    } catch (error) {
        return res.json({
            "status" :"false" ,
            "message" : error
        })
    }
    
})

walletRouter.get('/wallet/:walletID' , async(req,res)=>{

    try {

        const {walletID} = req.params ;

        if(!walletID){
            return res.json({
                "status" :"false" ,
                "message" :"walletID not found"
            })
        }

        const requiredWallet = await wallet.findOne({
            walletID
        })

        return res.json({
            walletId : requiredWallet.walletID , 
            balance : requiredWallet.balance , 
            name : requiredWallet.name , 
            createdAt : requiredWallet.date
        })
        
    } catch (error) {
        return res.json({
            "status" :"false" ,
            "message" : error
        })         
    }
    
})

walletRouter.get('/products' , async(req,res)=>{

    try {

        const requiredProducts = await product.find()
        
        return res.json({
            requiredProducts
        })
        
    } catch (error) {
        return res.json({
            "status" :"false" ,
            "message" : error
        })         
    }
    
})

walletRouter.get('/wallet/:walletID/transaction' , async(req,res)=>{
    try {

        const {walletID} = req.params ;

        if(!walletID){
            return res.json({
                "status" :"false" ,
                "message" :"walletID not found"
            })
        }

        const requiredWallet = await wallet.findOne({
            walletID
        })

        return res.json({
            balance : requiredWallet.balance , 
            transactionId : requiredWallet.transactionId , 
            description : requiredWallet.description , 
            type : requiredWallet.type , 
            createdAt : requiredWallet.date
        })
        
    } catch (error) {
        return res.json({
            "status" :"false" ,
            "message" : error
        })         
    }
})

/////////////////////////////////////////////////////////////////////////////////
/////////////////// require lock to avoide race problems ///////////////////////
////////////////////////////////////////////////////////////////////////////////

walletRouter.post('/wallet/:walletID/transaction' , async(req,res)=>{

    try {

        const {walletID} = req.params ;
        const {amount  , description} = req.body ; 

        if(!walletID){
            return res.json({
                "status" :"false" ,
                "message" :"walletID not found"
            })
        }

        if(!amount || !description){
            return res.json({
                "status" :"false" ,
                "message" : "amount or description not found "
             })
        }

        const _wallet = await wallet.findOne({
            walletID : walletID
        })
        if(!_wallet){
            return res.json({
                "status" :`not wallet found with walletID ${walletID} `
            })
        }

        // acquire lock 
        await lock.acquire();
        
        const requiredWallet = await wallet.findOneAndUpdate({
            walletID : walletID
        } , {
            balance : _wallet.balance + amount , 
            description : description  , 
            type : "credit"
        },{new:true})

        // release lock
        lock.release();

        return res.json({
            balance : requiredWallet.balance , 
            transactionId : requiredWallet.transactionId , 
            description : requiredWallet.description , 
            type : requiredWallet.description , 
            createdAt : requiredWallet.date 
        })
    } catch (error) {
        return res.json({
            "status" :"false" ,
            "message" : error
        })        
    }
    
})
 
walletRouter.post('/wallet/:walletID/purchase' , async(req,res)=>{

    try {

        const {walletID} = req.params ;
        const {productID} = req.body ; 

        // check whether productID  entered or not
        
        if(!productID ){
            return res.json({
                "status" :"false" ,
                "message" :"productID not found"
            })
        }

        // check whether  walletID entered or not

        if(!walletID){
            return res.json({
                "status" :"false" ,
                "message" :"walletID not found"
            })
        }

        // fetch product
        
        const findProduct = await product.findOne({
            productID
        })
        
        // check whether product exists or not
        
        if(!findProduct){
            return res.json({
                "status" :"false" ,
                "message" :"no product found "
            })
        }
        
        const checkWallet = await wallet.findOne({
            walletID 
        })

        // check whether wallet exists or not
        if(!checkWallet){
            return res.json({
                "status" :"false" ,
                "message" :"no wallet found "
            })
        }        
        
        // check sufficient balance

        if(checkWallet.balance < findProduct.amount){
            return res.json({
                "status" : "false" ,
                "message" : "insufficient balance in wallet"
            })
        }

        await lock.acquire();
        
        // updated balance
        let updatedBalance = Number(Number(checkWallet.balance) - Number(findProduct.amount)) ;

        const updateWallet = await wallet.findOneAndUpdate({
            walletID 
        } , {
            balance : updatedBalance
        }).populate('balance transactionId description type date')

        lock.release();

        return res.json({
            "list" : {updateWallet,
                      productID
                }
        })
        
    } catch (error) {
        return res.json({
            "status" :"false" ,
            "message" : error
        })         
    }
    
})
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////




module.exports = walletRouter ;