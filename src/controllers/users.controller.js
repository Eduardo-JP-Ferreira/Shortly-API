import { db } from "../database/connection.js"

export async function getToken(req, res) {
    try {
        const user = await db.query(`SELECT * FROM tokens;`)
     
        res.send(user.rows)
    } catch (err) {
        res.status(500).send(err.message)
    }
}