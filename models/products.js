const mongoose = require('mongoose')


const productSchema = mongoose.Schema({

    productID : {
        type : String , 
        require : true
    } , 
    amount :{
        type : Number , 
        require : true
    } , 
    description : {
        type : String , 
        require : true
    }
    
})


module.exports = mongoose.model("product" , productSchema)
