const mongoose = require("mongoose")

async function connectDB() {
    try {
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
            socketTimeoutMS: 45000, // Increase socket timeout
            maxPoolSize: 10, // Maximum number of connections in the connection pool
            minPoolSize: 5, // Minimum number of connections in the connection pool
        };

        await mongoose.connect("mongodb+srv://jimishpately50:XBGF1CDi70SMfDaG@quizgenius.vydld.mongodb.net/quizgenius?retryWrites=true&w=majority&appName=quizgenius", options);
        
        // Set up connection event handlers
        mongoose.connection.on('connected', () => {
            console.log('MongoDB connected successfully');
        });

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

        // Handle process termination
        process.on('SIGINT', async () => {
            try {
                await mongoose.connection.close();
                console.log('MongoDB connection closed through app termination');
                process.exit(0);
            } catch (err) {
                console.error('Error closing MongoDB connection:', err);
                process.exit(1);
            }
        });

    } catch(error) {
        console.error('MongoDB connection error:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
}

module.exports = connectDB