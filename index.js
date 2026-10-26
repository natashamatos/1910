// Configuração inicial
require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.API_PORT || 3000;
app.use(express.json());

const db = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
app.use(cors());

// Cadastro de cliente
app.post("/Cliente", async (req, res) => {
    try {
        const Cliente = req.body;
        const senhaCRIPT = bcrypt.hashSync(Cliente.senha, 10);

        const resultado = await db.pool.query(
            `INSERT INTO Cliente (senha, celular, cpf, email, nome)
             VALUES (?, ?, ?, ?, ?)`,
            [senhaCRIPT, Cliente.celular, Cliente.cpf, Cliente.email, Cliente.nome]
        );

        res.status(201).json({
            mensagem: "Cliente cadastrado ID: " + resultado[0].insertId
        });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Login
app.post("/login", async (req, res) => {
    try {
        const user = req.body;
        const resultado = await db.pool.query(
            "SELECT id, nome, email, senha FROM Cliente WHERE email = ?",
            [user.email]
        );
        const dados_bd = resultado[0][0];

        if (!dados_bd) {
            return res.status(401).json({ msg: "Email não cadastrado!" });
        }

        const senha_valida = await bcrypt.compare(user.senha, dados_bd.senha);
        if (!senha_valida) {
            return res.status(401).json({ msg: "Credenciais inválidas!" });
        }

        const payload = { id: dados_bd.id, email: dados_bd.email };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1m" });
        return res.status(200).json({ nome: dados_bd.nome, token });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Perfil do cliente autenticado
app.get("/Cliente/perfil", autenticar, async (req, res) => {
    try {
        const id = req.usuario.id;
        const result = await db.pool.query("SELECT * FROM Cliente WHERE id = ?", [id]);
        const perfil = result[0][0];

        if (!perfil) {
            return res.status(404).json({ erro: "Cliente não encontrado." });
        }

        delete perfil.senha;
        res.status(200).json(perfil);
    } catch (error) {
        res.status(500).json({ erro: "Erro interno." });
    }
});

// Produtos: busca, categoria, faixa de preço, ordenação e paginação
app.get("/produto", async (req, res) => {
    try {
        const { busca, categoria, preco_min, preco_max, ordem, pagina } = req.query;
        const limite = 10; // quantidade fixa por página
        const numeroPagina = pagina === undefined ? 1 : Number(pagina);

        if (!Number.isSafeInteger(numeroPagina) || numeroPagina < 1) {
            return res.status(400).json({
                erro: "O parâmetro pagina deve ser um número inteiro maior que zero."
            });
        }

        const offset = (numeroPagina - 1) * limite;
        if (!Number.isSafeInteger(offset)) {
            return res.status(400).json({ erro: "Número de página muito grande." });
        }

        let where = " WHERE 1=1";
        const parametros = [];

        // Filtro por nome
        if (typeof busca === "string" && busca.trim() !== "") {
            where += " AND nome LIKE ?";
            parametros.push(`%${busca.trim()}%`);
        }

        // Filtro por categoria (a tabela usa a coluna idcategoria)
        if (categoria !== undefined) {
            const idCategoria = Number(categoria);

            if (
                typeof categoria !== "string" ||
                categoria.trim() === "" ||
                !Number.isSafeInteger(idCategoria) ||
                idCategoria < 1
            ) {
                return res.status(400).json({
                    erro: "Categoria inválida. Informe um idcategoria inteiro maior que zero."
                });
            }

            where += " AND idcategoria = ?";
            parametros.push(idCategoria);
        }

        // Filtro por preço mínimo
        let minimo;
        if (preco_min !== undefined) {
            minimo = Number(preco_min);
            if (preco_min.trim?.() === "" || !Number.isFinite(minimo) || minimo < 0) {
                return res.status(400).json({ erro: "Preço mínimo inválido." });
            }
            where += " AND preco >= ?";
            parametros.push(minimo);
        }

        // Filtro por preço máximo
        let maximo;
        if (preco_max !== undefined) {
            maximo = Number(preco_max);
            if (preco_max.trim?.() === "" || !Number.isFinite(maximo) || maximo < 0) {
                return res.status(400).json({ erro: "Preço máximo inválido." });
            }
            where += " AND preco <= ?";
            parametros.push(maximo);
        }

        if (minimo !== undefined && maximo !== undefined && minimo > maximo) {
            return res.status(400).json({
                erro: "O preço mínimo não pode ser maior que o preço máximo."
            });
        }

        // A ordenação é escolhida entre opções fixas para evitar SQL inseguro
        let orderBy = " ORDER BY nome ASC";
        if (ordem === "menor_preco") {
            orderBy = " ORDER BY preco ASC";
        } else if (ordem === "maior_preco") {
            orderBy = " ORDER BY preco DESC";
        } else if (ordem !== undefined && ordem !== "") {
            return res.status(400).json({
                erro: "Ordenação inválida. Use menor_preco ou maior_preco."
            });
        }

        // Conta todos os produtos que correspondem aos filtros, para informar a paginação
        const [contagem] = await db.pool.query(
            "SELECT COUNT(*) AS total FROM produto" + where,
            parametros
        );
        const total = Number(contagem[0].total);

        // Consulta a página solicitada
        const sql = "SELECT * FROM produto" + where + orderBy + " LIMIT ? OFFSET ?";
        const [produtos] = await db.pool.query(
            sql,
            [...parametros, limite, offset]
        );

        res.status(200).json({
            pagina: numeroPagina,
            limite,
            total,
            total_paginas: Math.ceil(total / limite),
            quantidade: produtos.length,
            produtos
        });
    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        res.status(500).json({ erro: "Erro ao consultar produtos. Verifique as colunas da tabela produto." });
    }
});

// Inicia a API
app.listen(port, () => {
    console.log("API rodando na porta: " + port);
});

// Middleware de autenticação
function autenticar(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            erro: "Token não enviado. Use Authorization: Bearer <token>."
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
        if (err) {
            return res.status(403).json({ erro: "Token inválido ou expirado." });
        }
        req.usuario = usuario;
        next();
    });
}
