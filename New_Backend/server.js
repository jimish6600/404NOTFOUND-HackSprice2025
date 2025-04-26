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
const courseRoutes = require('./routes/courseRoutes');

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
app.use('/api/courses', courseRoutes);

const PORT = process.env.PORT || 8080 

// Connect to MongoDB and start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("MongoDB connected successfully");
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
});
