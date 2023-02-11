import express from 'express';
import User from '../schemas/userSchema.js';
import bcrypt from "bcrypt";

const router = express.Router(); 

router.post('/', async (req, res) => {
    //remove termsAccepted from req.body
    const reqCopy = Object.assign({}, req.body);
    delete reqCopy.termsAccepted
    const data = reqCopy;

    //trim all the data
    const trimmedData = Object.keys(data).reduce((acc, key) => {
        acc[key] = data[key].trim();
        return acc;
    }, {});

    const {name, last_name, username, email, password} = trimmedData;

    if (name && last_name && username && email && password) {

        const userQuery = await User.findOne({
            $or: [
                {username: username},
                {email: email}
            ]
        })
        .catch((err) => {
            console.log(err)
            res.send('Something went wrong');
        });

        if (!userQuery) {

            trimmedData.password = await bcrypt.hash(password, 10);
            
            User.create(trimmedData)
                .then((user) => {
                    user.password = undefined;
                    res.send({msg: 'User created', userData: user});
                    console.log(user)
                })
                .catch((err) => console.log(err));
        } else {
            userQuery.username === username ? res.send('This username already exists') : res.send('This email already exists');
        }

    } else {
        res.send('Please fill out all the fields');
    }
});


export default router;