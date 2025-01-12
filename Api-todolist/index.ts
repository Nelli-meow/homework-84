import express from "express";
import mongoose from "mongoose";
import UsersRouter from "./routers/Users";
import TaskRouter from "./routers/Tasks";

const app = express();
const port =  8000;

app.use(express.json());



app.use('/users', UsersRouter);
app.use('/tasks', TaskRouter);

const run = async () => {

    await mongoose.connect('mongodb://localhost/todolist');

    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}

run().catch((err) => console.log(err));
