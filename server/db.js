import mongoose from "mongoose";
import dotenv from "dotenv";
mongoose.set('strictQuery', false);

class Database {

    constructor() {
        this.connect()
    }

    connect() {
        dotenv.config()
        mongoose.connect(process.env.MONGODB_URI)
            .then(() => {
                console.log('Database connection successful')
            })
            .catch(err => {
                console.error('Database connection error: ' + err)
            })
    }
}

export default new Database()