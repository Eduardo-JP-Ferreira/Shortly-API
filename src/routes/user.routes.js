import { Router } from "express";
import { deleteUrlById, getMe, getToken, getUrlById, getUrls, postUrl, redirectUrl } from "../controllers/users.controller.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { urlObject } from "../schemas/validate.schema.js";

const userRouter = Router()

userRouter.get("/tokens", getToken)
userRouter.get("/urls", getUrls)
userRouter.get("/urls/:id", getUrlById)
userRouter.get("/urls/open/:shortUrl", redirectUrl)
userRouter.get("/users/me", getMe)

userRouter.post("/urls/shorten",validateSchema(urlObject), postUrl)

userRouter.delete("/urls/:id", deleteUrlById)


export default userRouter