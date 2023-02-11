import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {type: String, required: true, trim: true},
    last_name: {type: String, required: true, trim: true},
    username: {type: String, required: true, trim: true, unique: true},
    email: {type: String, required: true, trim: true, unique: true},
    password: {type: String, required: true},
    picture: {type: String, default: ''},
    following: {type: Array, default: []},
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;