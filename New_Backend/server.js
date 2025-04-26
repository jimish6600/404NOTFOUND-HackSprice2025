const express = require('express')
const cors = require('cors')
require('dotenv').config()
const connectDB = require('./config/db');
const Authrouter = require('./routes/auth');
const fileUpload = require('express-fileupload');
const Createtestrouter = require('./routes/Createtest');
const Runtestrouter = require('./routes/Runtest');
const Sharetestrouter = require('./routes/Sharetest');
const Testdetailsrouter = require('./routes/Testdetails');
const pdf = require('pdf-parse');


const app = express();
app.use(cors());
app.use(fileUpload());



app.use(express.json())
//routes
app.use('/auth',Authrouter)
app.use('/createtest',Createtestrouter)
app.use('/runtest',Runtestrouter)
app.use('/sharetest',Sharetestrouter)
app.use('/testdetails',Testdetailsrouter)

const PORT = process.env.PORT || 8080 


// Enable express-fileupload



connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("connect")
        console.log(`Server is runing${PORT}`)
    })
})
