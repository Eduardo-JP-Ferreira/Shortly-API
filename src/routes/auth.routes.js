import { Router } from "express";
import { getUsers, signIn, signUp } from "../controllers/auth.controller.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { signInObject, signUpObject } from "../schemas/validate.schema.js";

const authRouter = Router()

authRouter.get("/users", getUsers)
authRouter.post("/signup",validateSchema(signUpObject), signUp)
authRouter.post("/signin",validateSchema(signInObject), signIn)
export default authRouter