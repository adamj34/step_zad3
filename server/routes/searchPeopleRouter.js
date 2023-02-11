import express from 'express';
import User from '../schemas/userSchema.js';

const router = express.Router(); 

router.get('/', async (req, res) => {
    const queryParam = req.query.queryParam;
    
    User.find(
        {
            $or: [
                {username: {$regex: `.*${queryParam}.*`, $options: 'i'}},
                {last_name: {$regex: `.*${queryParam}.*`, $options: 'i'}},
            ]
        },
        {
            _id: 1, name: 1, last_name: 1, username: 1, picture: 1
        }
    )
    .sort(
        { 
            last_name: 1,
            username: 1 
        }
    )
    .then((users) => {
        res.send({ msg: 'Users found', users: users})
    })
    .catch((err) => console.log(err))
})

export default router;