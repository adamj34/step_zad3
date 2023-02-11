import express from 'express';
import User from '../schemas/userSchema.js';
import bcrypt from "bcrypt";

const router = express.Router(); 

router.put('/', async (req, res) => {
    const data = req.body;

    //trim all the data
    const trimmedData = Object.keys(data).reduce((acc, key) => {
        acc[key] = data[key].trim();
        return acc;
    }, {});

    const {pic, name, last_name, username, email, current_password, new_password, dbId} = trimmedData;

    if (name && last_name && username && email && current_password && dbId) {

        const usernameQuery = await User.findOne({username: username})
        .catch((err) => {
            console.log(err)
            res.send('Something went wrong');
        });

        const emailQuery = await User.findOne({email: email})
        .catch((err) => {
            console.log(err)
            res.send('Something went wrong');
        });

        const dataBeforeUpdate = await User.findOne({
            _id: dbId
        })
        .catch((err) => {
            console.log(err)
            res.send('Something went wrong');
        });

        const passwdComparison = await bcrypt.compare(current_password, dataBeforeUpdate.password)
        if (!passwdComparison) {
            res.send('Wrong password');
            return;
        }
         
        const password = !new_password ? dataBeforeUpdate.password : await bcrypt.hash(new_password, 10);
        const picture = (pic === dataBeforeUpdate.picture) ? dataBeforeUpdate.picture : pic;

        if ((!usernameQuery && !emailQuery) ||
            (!usernameQuery && emailQuery._id.toString() === dbId) ||
            (!emailQuery && usernameQuery._id.toString() === dbId) ||
            (emailQuery._id.toString() === dbId && usernameQuery._id.toString() === dbId)) {

            const updatedData = {
                name: name,
                last_name: last_name,
                username: username,
                email: email,
                password: password,
                picture: picture,
                _id: dbId
            }
            
            User.updateOne( 
                {
                    _id: dbId
                }, 
                {
                    $set: {
                        name: name,
                        last_name: last_name,
                        username: username,
                        email: email,
                        password: password,
                        picture: picture
                    }
                })
                .then((user) => {
                    updatedData.password = undefined;
                    res.send({msg: 'User updated', userData: updatedData});
                    console.log(user)
                })
                .catch((err) => console.log(err));
        } else if  (emailQuery._id !== dbId) { 
            res.send('This email is already taken');
        } else if (usernameQuery._id !== dbId) {
            res.send('This username is already taken');
        }

    } else {
        res.send('Please fill out all the fields');
    }
});

router.delete('/deleteAccount', async (req, res) => {

    const data = req.body
    const {dbId, current_password} = data;

    const dataBeforeUpdate = await User.findOne({
        _id: dbId
    })
    .catch((err) => {
        console.log(err)
        res.send('Something went wrong');
    });

    const passwdComparison = await bcrypt.compare(current_password, dataBeforeUpdate.password)

    if (passwdComparison) {
        User.deleteOne( { _id: dbId } )
        .then((user) => {
            res.send('User deleted');
        })
        .catch((err) => {
            console.log(err)
            res.send('Something went wrong');
        });
    } else {
        res.send('Wrong password');
    }
    
})


export default router;