import express from 'express';
import User from '../models/User';
import {Error} from 'mongoose';

const UsersRouter = express.Router();

UsersRouter.post('/', async (req, res) => {
    try {
        const user = new User({
            username: req.body.username,
            password: req.body.password
        });

        user.generateToken();

        await user.save();
        res.send(user);
    } catch (error) {
        if (error instanceof Error.ValidationError) {
            res.status(400).send(error);
            return;
        }
    }
});

UsersRouter.post('/sessions', async (req, res) => {
    try {
        const user = await User.findOne({
            username: req.body.username,
        });

        if (!user) {
            res.status(400).send({error:'Username Not Found'});
            return;
        }

        const isMatch = await user.checkPassword(req.body.password);

        if(!isMatch) {
            res.status(400).send({error:'Password is incorrect'});
            return;
        }

        user.generateToken();
        await user.save();

        res.send({message: 'Username and password are correct!', user});

    } catch (error) {
        if (error instanceof Error.ValidationError) {
            res.status(400).send(error);
            return;
        }
    }
});

export default UsersRouter;