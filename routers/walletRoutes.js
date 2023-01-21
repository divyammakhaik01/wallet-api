const express = require('express')
const walletRouter = express.Router();
const {walletSetup , walletDetails , productListing ,
     addCreditToWallet , listTransaction , purchaseProduct}  = require('../Controller/walletController')


walletRouter.post('/wallet', walletSetup)

walletRouter.get('/wallet/:walletID' , walletDetails)

walletRouter.get('/products' ,productListing)

walletRouter.get('/wallet/:walletID/transaction' , listTransaction)


/////////////////////////////////////////////////////////////////////////////////
/////////////////// require lock to avoide race problems ///////////////////////
////////////////////////////////////////////////////////////////////////////////

walletRouter.post('/wallet/:walletID/transaction' , addCreditToWallet)
 
walletRouter.post('/wallet/:walletID/purchase' , purchaseProduct)
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////




module.exports = walletRouter ;