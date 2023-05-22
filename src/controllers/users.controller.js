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
    const token = authorization?.replace("Bearer ", "")
    if (!token) return res.status(401).send("Token Inexistente!")

    const authToken = await db.query(`SELECT * FROM tokens WHERE token = $1;`,[token])
    if (!authToken.rows[0]) return res.status(401).send("Token Inválido!")

    try {      
        const shortUrl = nanoid(8)
        const visitCount = 0
        const userId = authToken.rows[0].userId

        const postUrls = await db.query(`
        INSERT INTO urls ("shortUrl",url,"visitCount","userId") 
        VALUES ($1, $2, $3, $4);`, [shortUrl,url,visitCount,userId])

        const urls = await db.query(`SELECT * FROM urls WHERE "shortUrl" = $1;`,[shortUrl])
        const object = {
            id: urls.rows[0].id,
            shortUrl
        }
        res.status(201).send(object)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function getUrlById(req, res) {
    const {id} = req.params
    try {
        const url = await db.query(`SELECT * FROM urls WHERE id=$1;`,[id])

        if(!url.rows[0]) return res.status(404).send("Url encurtada não existe")
        const sendObject = {
            id: url.rows[0].id,
            shortUrl: url.rows[0].shortUrl,
            url: url.rows[0].url
        }
        res.send(sendObject)
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

export async function deleteUrlById(req, res) {
    const { authorization } = req.headers
    const {id} = req.params
    const token = authorization?.replace("Bearer ", "")
    if (!token) return res.status(401).send("Token Inexistente!")

    const authToken = await db.query(`SELECT * FROM tokens WHERE token = $1;`,[token])
    if (!authToken.rows[0]) return res.status(401).send("Token Inválido!")

    try {      
        const url = await db.query(`SELECT * FROM urls WHERE id=$1;`,[id])
        if(!url.rows[0]) return res.status(404).send("url não existe")

        if(authToken.rows[0].userId !== url.rows[0].userId){
            return res.status(401).send("url não pertence ao usuário")
        }
        
        const deleteUrl = await db.query(`DELETE FROM urls WHERE id = $1;`, [id])
        res.sendStatus(204)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function getMe(req, res) {
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", "")
    if (!token) return res.status(401).send("Token Inexistente!")

    const authToken = await db.query(`SELECT * FROM tokens WHERE token = $1;`,[token])
    if (!authToken.rows[0]) return res.status(401).send("Token Inválido!")

    try {      
        const url = await db.query(`SELECT * FROM urls WHERE "userId"=$1;`,[authToken.rows[0].userId])
        const user = await db.query(`SELECT * FROM users WHERE id=$1;`,[authToken.rows[0].userId])
        if(!url.rows[0]) return res.status(404).send("url não existe")
        let soma=0
        const shortenedUrls = []
        for(let i=0; i<url.rows.length;i++){
            soma+= url.rows[i].visitCount
            const object = {
                id: url.rows[i].id,
                shortUrl: url.rows[i].shortUrl,
                url: url.rows[i].url,
                visitCount: url.rows[i].visitCount
            }
            shortenedUrls.push(object)
        }

        const finalObject = {
            id: authToken.rows[0].userId,
            name: user.rows[0].name,
            visitCount: soma,
            shortenedUrls
        }
        
        res.status(200).send(finalObject)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function getRanking(req, res) {
    try {
        const rank = await db.query(`
        SELECT users.id, users.name, COUNT(urls.id) AS "linksCounts", COALESCE(SUM(urls."visitCount"), 0) AS "totalVisitCount"
        FROM users
        LEFT JOIN urls ON users.id = urls."userId"
        GROUP BY users.id, users.name
        ORDER BY "totalVisitCount" DESC
        LIMIT 10
        ;`);   
     
        res.send(rank.rows)
    } catch (err) {
        res.status(500).send(err.message)
    }
}