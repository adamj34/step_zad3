import express from 'express';
import User from '../schemas/userSchema.js';
import Post from '../schemas/postSchema.js';
import Messages from '../schemas/msgsSchema.js';

const router = express.Router(); 

router.get('/:userId', async (req, res) => {
    const userId = req.params.userId;

    User.findOne(
        {
            _id: userId
        },
        {
            _id: 1, name: 1, last_name: 1, username: 1, picture: 1, following: 1
        }
    )
    .then((user) => {
        res.send({user: user})
    })
    .catch((err) => console.log(err))
})

router.get('/posts/:userId', async (req, res) => {
    const userId = req.params.userId;
    const isFollower = req.query.isFollower;

    if (isFollower === 'true') {
        Post.aggregate([
            {
                $match: {
                    postedBy: userId,
                }
            },
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
                    _id: 1, postedBy: 1, tweetContent: 1, authorUsername: 1, tweetPic: 1, likes: 1, likedBy: 1, comments: 1, "author.picture": 1, createdAt: 1
                }
            },
            {
                $sort: { 
                    createdAt: -1
                }
            }
        ])
        .then((posts) => {
            res.send({ posts: posts })
        })
        .catch((err) => console.log(err))
    } else {
        Post.aggregate([
            {
                $match: {
                    postedBy: userId,
                    private: false
                }
            },
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
                    _id: 1, postedBy: 1, tweetContent: 1, authorUsername: 1, tweetPic: 1, likes: 1, likedBy: 1, comments: 1, "author.picture": 1, createdAt: 1 
                }
            },
            {
                $sort: { 
                    createdAt: -1
                }
            }
        ])
        .then((posts) => {
            res.send({ posts: posts })
        })
        .catch((err) => console.log(err))
    }
})

router.get('/likedPosts/:userId', async (req, res) => {
    const userId = req.params.userId;
    Post.aggregate([
        {
            $match: {
                likedBy: userId,
            }
        },
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
                _id: 1, postedBy: 1, tweetContent: 1, authorUsername: 1, tweetPic: 1, likes: 1, likedBy: 1, comments: 1, "author.picture": 1, createdAt: 1
            }
        },
        {
            $sort: { 
                createdAt: -1
            }
        }
    ])
    .then((posts) => {
        res.send({ posts: posts })
    })
    .catch((err) => console.log(err))
})


router.post('/follow/:userId', async (req, res) => {
    const userId = req.params.userId;
    const { followerId, action } = req.body;
    if (action === 'follow') {
    User.updateOne(
        {
            _id: followerId
        },
        {
            $push: { 
                following: userId
            }
        }
        )
        .catch((err) => console.log(err))
    } else if (action === 'unfollow') {
        User.updateOne(
            {
                _id: followerId
            },
            {
                $pull: { 
                    following: userId
                }
            }
        )
        .catch((err) => console.log(err))
    }
})

router.post('/chat/messages', async (req, res) => {
    const data = req.body;
    const { message, jointId } = data
    console.log(message, jointId)
    Messages.updateOne(
        {
            jointId: jointId
        },
        {
            $push: {
                messages: message
            }
        },
        {
            upsert: true
        }
    )
    .catch((err) => console.log(err))
})

router.get('/chat/messages', async (req, res) => {
    const jointId = req.query.jointId;
    Messages.findOne(
        {
            jointId: jointId
        },
        {
            _id: 0, messages: 1
        }
    )
    .then((msgs) => {
        console.log(msgs)
        res.send(msgs)})
    .catch((err) => console.log(err))
})


export default router;