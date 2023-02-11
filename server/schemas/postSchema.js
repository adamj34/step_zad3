import mongoose from "mongoose";

const Schema = mongoose.Schema;

const postSchema = new Schema({
    tweetContent: { type: String, trim: true },
    postedBy: { type: String, trim: true },
    authorUsername: { type: String, trim: true },
    tweetPic: { type: String, default: '' },
    likes: { type: Number, default: 0 },
    likedBy: { type: Array, default: [] },
    comments: { type: Array, default: [] },
    private: { type: Boolean, default: false },
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

export default Post;