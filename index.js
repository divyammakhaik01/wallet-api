const express = require('express')
const db = require('./config/db')

const app = express();

const PORT = process.env.PORT || 4000 ;

app.use(express.json())


app.use('/api' , require('./routers/walletRoutes'))





app.listen(PORT , ()=>{
    console.log(`server running on PORT : ${PORT}`);
    db()
})