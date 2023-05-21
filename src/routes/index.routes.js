import { Router } from "express";
import { getUsers, signIn, signUp } from "../controllers/auth.controller.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { signInObject, signUpObject } from "../schemas/validate.schema.js";

const router = Router()
// router.use(gamesRouter)

router.get("/users", getUsers)
router.post("/signup",validateSchema(signUpObject), signUp)
router.post("/signin",validateSchema(signInObject), signIn)
export default router
