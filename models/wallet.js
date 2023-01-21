const mongoose = require('mongoose')


const walletSchema = mongoose.Schema({

    walletID : {
        type : String ,
        require : true
    } , 
    balance : {
        type : Number ,
        require : true
    } , 
    transactionId : {
        type : String , 
        require : true
    } , 
    name : {
        type : String , 
        require : true
    } ,
    description : {
        type : String  ,
        default : "No description added"
    } , 
    type : {
        type : String
    } ,
    date :{
        type : Date ,
        default : Date.now
    } , 
})


module.exports = mongoose.model("wallet" , walletSchema)
