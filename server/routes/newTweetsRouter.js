import express from 'express';
import Post from '../schemas/postSchema.js';

const router = express.Router(); 

router.post('/', async (req, res) => {
    const data = req.body;

    //trim all the data
    const trimmedData = Object.keys(data).reduce((acc, key) => {
        if (typeof data[key] === 'string') {
            acc[key] = data[key].trim();
        } else {
            acc[key] = data[key];
        }
        return acc;
    }, {});

    const {tweetContent, tweetPic} = trimmedData;

    if (!tweetContent && !tweetPic) {
        res.send('Please fill out either the content or the picture field');
    } else {
        Post.create(trimmedData)
            .then((newPost) => {
                console.log(newPost);
                res.send({ msg: 'Tweet added', newPost: newPost });
            })
            .catch((err) => console.log(err));
    }

})

export default router;