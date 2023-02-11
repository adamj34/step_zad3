import express from 'express';
import Post from '../schemas/postSchema.js';

const router = express.Router(); 

router.get('/', async (req, res) => {

    Post.aggregate([
        {
            $addFields: {
                postedByObjId: {
                    $toObjectId: '$postedBy'
                }
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'postedByObjId',
                foreignField: '_id',
                as: 'author'
            }
        },
        {
            $project: {
                tweetContent: 1,
                postedBy: 1,
                authorUsername: 1,
                tweetPic: 1,
                likes: 1,
                likedBy: 1,
                comments: 1,
                private: 1,
                createdAt: 1,
                "author.picture": 1,
            }
        }
    ])
    .then((tweets) => {
        res.send(tweets);
    })
    .catch((err) => console.log(err))   
})

router.put('/singleTweet/likes', async (req, res) => {
    const data = req.body;
    console.log(data);

    const {postId, likes, likedBy, operationOnlikedBy} = data;
    console.log(likes);

    if (operationOnlikedBy === 'push') {
        Post.updateOne(
            {
                _id: postId 
            },
            { 
                $set: {
                    likes: likes
                },
                $push: { 
                    likedBy: likedBy
                }
            }
        )
        .then((updatedPost) => {
            res.send({ msg: 'Likes updated', updatedPost: updatedPost });
            console.log(updatedPost)
        })
        .catch((err) => console.log(err))
    } else if (operationOnlikedBy === 'pull') {
        Post.updateOne(
            {
                _id: postId 
            },
            { 
                $set: {
                    likes: likes
                },
                $pull: { 
                    likedBy: likedBy
                }
            }
        )
        .then((updatedPost) => {
            res.send({ msg: 'Likes updated', updatedPost: updatedPost });
            console.log(updatedPost)
        })
        .catch((err) => console.log(err))
    }
})

router.post('/singleTweet/comment', async (req, res) => {
    const data = req.body;
    console.log(data);

    const {postId, comment} = data;

    Post.updateOne(
        {
            _id: postId
        },
        {
            $push: {
                comments: comment
            }
        }
    )
    .catch((err) => console.log(err))
})

router.delete('/singleTweet/delete/:id', async (req, res) => {
    const id = req.params.id;

    Post.deleteOne(
        {
            _id: id
        }
    )
    .then((deletedPost) => {
        res.send('Post deleted');
    })
    .catch((err) => console.log(err))

})

export default router;