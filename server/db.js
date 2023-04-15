import mongoose from "mongoose";
import dotenv from "dotenv";
mongoose.set('strictQuery', false);

class Database {

    constructor() {
        this.connect()
    }

    connect() {
        dotenv.config()
        mongoose.connect(`mongodb://${process.env.ME_CONFIG_MONGODB_ADMINUSERNAME}:${process.env.ME_CONFIG_MONGODB_ADMINPASSWORD}@${process.env.ME_CONFIG_MONGODB_SERVER}:27017/`)
            .then(() => {
                console.log('Database connection successful')
            })
            .catch(err => {
                console.error('Database connection error: ' + err)
            })
    }
}

export default new Database()