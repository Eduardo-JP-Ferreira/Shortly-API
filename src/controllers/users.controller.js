import { nanoid } from "nanoid"
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
        // console.table(urls.rows)
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

        const shortUrl = nanoid(8)
        const visitCount = 0
        const userId = authToken.rows[0].userId

        const postUrls = await db.query(`
        INSERT INTO urls ("shortUrl",url,"visitCount","userId") 
        VALUES ($1, $2, $3, $4);`, [shortUrl,url,visitCount,userId])

        res.status(200).send("OK")
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function getUrlById(req, res) {
    const {id} = req.params
    try {
        const url = await db.query(`SELECT * FROM urls WHERE id=$1;`,[id])

        if(!url.rows[0]) return res.status(404).send("Url encurtada não existe")
        // console.table(urls.rows)
        res.send(url.rows)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function redirectUrl(req, res) {
    const {shortUrl} = req.params
    try {
        const url = await db.query(`SELECT * FROM urls WHERE "shortUrl"=$1;`,[shortUrl])

        if(!url.rows[0]) return res.status(404).send("url encurtada não existe")

        const newVisitCount = url.rows[0].visitCount + 1
        const updateUrl = await db.query(`
            UPDATE urls SET "visitCount"=$1
            WHERE id=$2;`, [newVisitCount, url.rows[0].id])
        // console.table(urls.rows)
        res.redirect(url.rows[0].url)
    } catch (err) {
        res.status(500).send(err.message)
    }
}