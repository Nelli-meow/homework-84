import express from "express";
import mongoose from "mongoose";
import UsersRouter from "./routers/Users";

const app = express();
const port =  8000;

app.use(express.json());
app.use('/users', UsersRouter);

const run = async () => {

    await mongoose.connect('mongodb://localhost/todolist');

    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}

run().catch((err) => console.log(err));
