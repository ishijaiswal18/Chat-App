const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();


const connectDB = async () => {
    try {
        const uri = "mongodb+srv://ishikaj:" + process.env.MONGO_PASSWORD + "@chatapp.pljri2x.mongodb.net/ChatApp?retryWrites=true&w=majority";
        const conn = await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        });
    
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
    } catch (err) {
        console.error(`Error: ${err.message}`.red.bold);
        process.exit(1);
    }
}

module.exports = connectDB;

