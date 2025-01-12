import mongoose from 'mongoose'
import config from "./config";
import Task from "./models/Task";
import User from "./models/User";
import {randomUUID} from "crypto";

const run = async () => {
    await mongoose.connect(config.db);

    const db =  mongoose.connection;

    try {
        await db.dropCollection('tasks');
        await db.dropCollection('users');
    } catch(err) {
        console.log(err);
    }

    const [nelli, pasha, malenia] = await User.create(
        {
            username: 'Nelli',
            password: '123',
            token: randomUUID(),
        },
        {
            username: 'Pasha',
            password: '321',
            token: randomUUID(),
        },
        {
            username: 'Malenia',
            password: '666',
            token: randomUUID(),
        }
    );

     await Task.create(
        {
            user: nelli._id,
            title: 'Coding task',
            description: 'To do list meow',
            status: 'in_progress',
        },
        {
            user: pasha._id,
            title: 'Well theres something there',
            description: 'NOT To do list meow',
            status: 'new',
        },
        {
            user: malenia._id,
            title: 'Blade of Miquella',
            description: 'meow',
            status: 'complete',
        }
    );

    await db.close();
};

run().catch(console.error);