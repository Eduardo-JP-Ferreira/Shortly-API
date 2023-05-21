import { Router } from "express";
import { getToken, getUrls, postUrl } from "../controllers/users.controller.js";

const userRouter = Router()

userRouter.get("/tokens", getToken)
userRouter.get("/urls", getUrls)
userRouter.post("/urls/shorten", postUrl)

export default userRouter