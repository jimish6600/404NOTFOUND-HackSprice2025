const mongoose = require("mongoose")

async function connectDB() {
    try{
        await mongoose.connect(process.env.MONGOOB_URL)
    }catch(error){
        console.log(error)
    }
}

module.exports = connectDB