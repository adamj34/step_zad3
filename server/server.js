import express from 'express';
import fs from 'fs';
import https from 'https';
import cors from 'cors';
import db from './db.js';
import signInRouter from './routes/signInRouter.js';
import logInRouter from './routes/logInRouter.js';
import editProfileRouter from './routes/editProfileRouter.js';
import newTweetsRouter from './routes/newTweetsRouter.js';
import timelineTweetsRouter from './routes/timelineTweetsRouter.js';
import searchPeopleRouter from './routes/searchPeopleRouter.js';
import userPageRouter from './routes/userPageRouter.js';
import rankingRouter from './routes/rankingRouter.js';

const options = {
    key: fs.readFileSync('./certs/key.pem'),
    cert: fs.readFileSync('./certs/cert.pem'),
};

const app = express();
app.use(cors());
app.use(express.json( {limit: '10mb'} )); 


app.use('/signIn', signInRouter);
app.use('/logIn', logInRouter);
app.use('/mainPage/editProfile', editProfileRouter);
app.use('/mainPage/profile/', userPageRouter);
app.use('/mainPage/newTweet', newTweetsRouter);
app.use('/mainPage/timelineTweets', timelineTweetsRouter);
app.use('/mainPage/searchPeople', searchPeopleRouter);
app.use('/mainPage/ranking', rankingRouter);

app.use('*', (req, res) => {
    res.status(404).json({message: 'Not Found\n'});
})

const server = https.createServer(options, app);


const port = process.env.PORT || 8000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

