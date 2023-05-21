import { Router } from "express";
import { getToken } from "../controllers/users.controller.js";

const userRouter = Router()

userRouter.get("/urls", getToken)

export default userRouter