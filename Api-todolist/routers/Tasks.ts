import express from "express";
import Task from "../models/Task";
import User from "../models/User";

const TaskRouter = express.Router();

TaskRouter.get("/", async (req, res) => {
   try {
       const authToken = req.get("Authorization");

       if (!authToken) {
            res.status(400).send({ error: "Unauthorized: Token is missing" });
           return;
       }

       const user = await User.findOne({ token: authToken });

       if (!user) {
           res.status(400).send({ error: "Unauthorized: Invalid token" });
           return;
       }

       const tasks = await Task.find({ user: user._id }).populate("user");


       if (tasks.length === 0) {
            res.status(404).send({ message: "No tasks found for the user" });
           return;
       }

       res.status(200).send(tasks);

   }  catch(error) {
       res.status(400).send({error:'Error while getting tasks'});
   }
});

TaskRouter.post("/", async (req, res) => {
   try {
       const authToken = req.get("Authorization");

       if (!authToken) {
           res.status(400).send({ error: "Unauthorized: Token is missing" });
           return;
       }

       const user = await User.findOne({ token: authToken });


       if (!user) {
           res.status(400).send({ error: "Unauthorized: Token is wrong" });
           return;
       }

       const { status, description, title } = req.body;

       if (!title) {
            res.status(400).send({ error: "Title is required" });
           return;
       }

       if (status !== "new" && status !== "in_progress" && status !== "complete") {
           res.status(400).send({ error: `Wrong status code: ${status}` });
           return;
       }

       const newTask = {
           user: user._id,
           description,
           title,
           status,
       };

       const task = new Task(newTask);
       await task.save();

       res.status(200).send(task);

   } catch(error) {
       res.status(400).send({error:'Error while creating task'});
   }
});

export default TaskRouter;