import express from 'express';
import User from '../schemas/userSchema.js';
import bcrypt from "bcrypt";

const router = express.Router(); 

router.post('/', async (req, res) => {
    const reqCopy = Object.assign({}, req.body);
    const data = reqCopy;

    //trim all the data
    const trimmedData = Object.keys(data).reduce((acc, key) => {
        acc[key] = data[key].trim();
        return acc;
    }, {});

    const {email, password} = trimmedData;

    if (email && password) {

        const userQuery = await User.findOne({
            email: email
        })
        .catch((err) => {
            console.log(err)
            res.send('Something went wrong');
        });

        if (userQuery) {
            const passwdComparison = await bcrypt.compare(password, userQuery.password)
            userQuery.password = undefined;
            passwdComparison ? res.send({msg: 'User logged in', userData: userQuery}) : res.send('Wrong password');
        } else {
            res.send('Account with this email does not exist');
        }
    } else {
        res.send('Please fill out all the fields');
    }
});


export default router;