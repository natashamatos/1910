//npm init//
// npm i dotenv
const dotenv = require("dotenv")
dotenv.config()
//npm i express//

const express = require("express")
const app = express()
const port = process.env.API_PORT
app.use(express.json())

// npm i mysql2
const db = require("./db")

// npm i bcrypt
const bcrypt = require("bcrypt")

// npm i jsonwebtoken
const jwt = require("jsonwebtoken")

// npm i cors
const cors = require("cors")
app.use(cors())

app.post("/Cliente", async (req, res ) => {
    try {
        const Cliente = req.body
        const senhaCRIPT = bcrypt.hashSync(Cliente.senha, 10)
        Cliente.senha = senhaCRIPT
        
        const resultado = await db.pool.query(
            `INSERT INTO Cliente (
                senha, celular, cpf, email, nome
             ) VALUES (?,   ?,   ?,   ?,  ?)`, 
             [Cliente.senha, Cliente.celular, Cliente.cpf,
              Cliente.email,Cliente.nome]


        )
        res.status(201). json({
            mensagem : "Cliente cadastrado ID: " + resultado[0].insertId
        })

    }catch (error) {
        res.status (500).json({erro: error.message})
    }
})

app.post("/login", async (req,res) => {
    try {
        const user = req.body
        const resultado = await db.pool.query(
            "SELECT id, nome, email, senha FROM Cliente WHERE email = ?", [user.email]
        )
        const dados_bd = resultado[0][0]
        if(!dados_bd) {
            return res.status(401).json({msg: "Email não cadastrado!"})
        }

        const senha_valida = await bcrypt.compare(user.senha, dados_bd.senha)

        if(!senha_valida) {
            return res.status(401).json({msg: "Credenciais inválidas!"})
        }

        const payload = {
            id: dados_bd.id,
            email: dados_bd.email
        } 
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1m' })
        return res.status(200).json({nome: dados_bd.nome, token: token})

    } catch (error) {
        res.status(500).json({erro: error.message})
    }
})

app.get("/Cliente/perfil", autenticar, async (req, res)=>{
    try {
        const id = req.usuario.id
        const result = await db.pool.query("SELECT * FROM Cliente WHERE id = ?", [id]);
        const perfil = result[0][0]
        delete perfil.senha
        res.status(200).json(perfil)
    } catch (err) {
        res.status(500).json({ erro: 'Erro interno' });
        throw err;
    }
})

app.listen(port, () =>{
    console.log("Api rodando porta: " + port )
})

// https://dontpad.com/backendapi
function autenticar(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null){
        return res.status(401).json({erro: "Token não enviado, usar Authorization Bearer <token>"})
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
        if (err) return res.status(403).json({erro: "Token inválido"})
        req.usuario = usuario
        next()
    })   
}

// AULA DE 18/09: TESTAR O LOGIN E A AUTENTICAÇÃO NA ROTA /cliente/perfil
