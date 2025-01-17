import express from "express";
import Task from "../models/Task";
import auth, {RequestWithUser} from "../middleware/auth";

const TaskRouter = express.Router();

TaskRouter.get("/", auth, async (req, res) => {
   try {
       const user = (req as RequestWithUser).user;

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

TaskRouter.post("/", auth , async (req, res) => {
   try {
       const user = (req as RequestWithUser).user;

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

TaskRouter.put("/:id", auth,  async (req, res) => {
   try {
       const id = req.params.id;

       const user = (req as RequestWithUser).user;

       const task = await Task.findById(id);

       if (!task) {
            res.status(404).send({ error: "Task not found" });
           return;
       }

       if (task.user.toString() !== user._id.toString()) {
           res.status(403).send({ error: "You cant edit this task" });
           return;
       }

       if (req.body.user) {
           res.status(403).send({ error: "You can't edit the user field" });
           return;
       }

       const { status, description, title } = req.body;

       task.status = status || task.status;
       task.description = description || task.description;
       task.title = title || task.title;

       await task.save();

       res.status(200).send(task);

   } catch (error) {
       res.status(400).send({ error: "Error while updating task" });
   }
});

TaskRouter.delete("/:id", auth,  async (req, res) => {
    try {
        const id = req.params.id;
        const user = (req as RequestWithUser).user;

        const task = await Task.findById(id);

        if (!task) {
            res.status(404).send({ error: "Task not found" });
            return;
        }

        if (task.user.toString() !== user._id.toString()) {
            res.status(403).send({ error: "You can't delete this task" });
            return;
        }

        await Task.findByIdAndDelete(id);

        res.status(200).send({ message: "Task deleted successfully" });

    } catch (error) {
        console.error(error);
        res.status(400).send({ error: "Error while deleting task" });
    }
});


export default TaskRouter;