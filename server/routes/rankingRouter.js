import express from 'express';
import Post from '../schemas/postSchema.js';

const router = express.Router(); 

router.get('/interactions', async (req, res) => {
    Post.aggregate([
        {
            $group: {
                _id: "$authorUsername",
                totalLikes: { $sum: "$likes" },
                totalComments: { $sum: { $size: "$comments" } }
            }
        },
        {
            $project: {
                _id: 0,
                username: "$_id",
                totalScore: { $add: [ "$totalLikes", "$totalComments" ] }
            }
        },
        {
            $sort: { 
                totalScore: -1
            }
        },
        {
            $limit: 3
        }
    ])
    .then((users) => {
        res.send({ users: users });
    })
    .catch((err) => console.log(err));
});

router.get('/activity', async (req, res) => {
    Post.aggregate([
        {
            $group: {
                _id: "$authorUsername",
                totalScore: { $count: {} }
            }
        },
        {
            $project: {
                _id: 0,
                username: "$_id",
                totalScore: 1
            }
        },
        {
            $sort: { totalScore: -1 }
        },
        {
            $limit: 3
        }
    ])
    .then((users) => {
        res.send({ users: users });
    })
    .catch((err) => console.log(err));
});


export default router;