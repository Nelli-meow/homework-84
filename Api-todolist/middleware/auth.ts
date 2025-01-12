import {NextFunction, Request, Response } from "express";
import {HydratedDocument} from "mongoose";
import {UserFields} from "../types";
import User from "../models/User";

export interface RequestWithUser extends Request {
    user: HydratedDocument<UserFields>;
}

const auth = async (expressReq: Request , res: Response, next: NextFunction) => {
    const req = expressReq as RequestWithUser;

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

    req.user = user;

    next();
};

export default auth;