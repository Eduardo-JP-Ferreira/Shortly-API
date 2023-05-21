import { db } from "../database/connection.js"

export async function authToken(req, res, next) {
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", "")
    if (!token) return res.status(401).send("token!")

    try {
        res.locals.session = session

        next()
    } catch (err) {
        res.status(500).send(err.message)
    }
}