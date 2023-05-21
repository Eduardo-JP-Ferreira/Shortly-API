import { db } from "../database/connection.js"

export async function getToken(req, res) {
    try {
        const tokens = await db.query(`SELECT * FROM tokens;`)
     
        res.send(tokens.rows)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function getUrls(req, res) {
    try {
        const urls = await db.query(`SELECT * FROM urls;`)
        console.table(urls.rows)
        res.send(urls.rows)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function postUrl(req, res) {
    const { authorization } = req.headers
    const {url} = req.body

    try {
        const token = authorization?.replace("Bearer ", "")
        if (!token) return res.status(401).send("Token Inexistente!")

        const authToken = await db.query(`SELECT * FROM tokens WHERE token = $1;`,[token])
        if (!authToken.rows[0]) return res.status(401).send("Token Inválido!")
        console.table(authToken.rows)
        res.status(201).send("OK")
    } catch (err) {
        res.status(500).send(err.message)
    }
}