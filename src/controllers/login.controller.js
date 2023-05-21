import { db } from "../database/connection.js"

export async function getUsers(req, res) {
    try {
        const user = await db.query(`SELECT * FROM users;`)
     
        res.send(user.rows)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function signup(req, res) {
    const {name,email,password,confirmPassword} = req.body

    try {
        const user = await db.query(`SELECT * FROM users WHERE email = $1;`,[email])

        if(user.rows[0]){
            res.status(409).send("Email já cadastrado")
        }
        else{
            if(password===confirmPassword){
                const postUser = await db.query(`
                INSERT INTO users (name,email,password) 
                VALUES ($1, $2, $3);`, [name,email,password])
            }else{
                res.status(422).send("Senhas distintas")
            }          
        }
        res.status(201).send("Created")
    } catch (err) {
        res.status(500).send(err.message)
    }
}