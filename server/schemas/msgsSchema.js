import mongoose from "mongoose";

const Schema = mongoose.Schema;

const msgsSchema = new Schema({
    jointId: { type: String, trim: true },
    messages: { type: Array, default: [] },
}, { timestamps: true });

const Messages = mongoose.model('Messages', msgsSchema);

export default Messages;