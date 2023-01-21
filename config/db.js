require('dotenv').config();
const mongoose = require('mongoose')

const URL = process.env.MONGO_DB_URL;


module.exports = db = ()=>{
    console.log(URL);
    mongoose.connect(URL) ;
    const conn = mongoose.connection ;

    conn.once('open' , () => {
            console.log("database connected");
        }) 
    conn.once('error' , (error)=>{
            console.log(`error found : ${error}`);
        })
}
