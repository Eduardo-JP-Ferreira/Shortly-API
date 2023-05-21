import { Router } from "express";
import { getUsers, signup } from "../controllers/login.controller.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { signUpObject } from "../schemas/validate.schema.js";

const router = Router()
// router.use(gamesRouter)

router.get("/users", getUsers)
router.post("/signup",validateSchema(signUpObject), signup)
export default router
