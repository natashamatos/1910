const db = require("./db")

async function criar_tabelas() {
    try {
        await db.pool.query(`
            DROP TABLE IF EXISTS Cliente;
            CREATE TABLE Cliente (
                    id int(11) NOT NULL AUTO_INCREMENT,
                    nome varchar(100) NOT NULL,
                    cpf char(14) NOT NULL,
                    celular char(14) NOT NULL,
                    email varchar(100) NOT NULL,
                    senha varchar(512) NOT NULL,
                    PRIMARY KEY (id),
                    UNIQUE KEY cpf (cpf),
                    UNIQUE KEY email (email)
                ) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
            INSERT INTO Cliente VALUES 
            (11, 'Natasha Matos', '712.669.552-93', '(42)99820-7398', 'natashaquero0508@gmail.com', '123456'),
            (13, 'Natasha Matos', '555.666.777.88', '(42)99829-2234', 'natashaa@gmail.com', '$2b$10$xcL527GxdPh6jPNvvF2W9ecbTr0YVWshZvf3GihiEGEyaSM3m1IlW'),
            (14, 'Nat Mat', '111.222.333.44', '(77)15987-2234', 'nata@gmail.com', '$2b$10$qxyEngSdndH1V4LdtWdePuAypISSBuG0enm.ZYwcQdyNFXbS5L3Qu'),
            (15, 'alexa quero', '125.325.785.98', '(55)45698-4587', 'alex@gmail.com', '$2b$10$JDFpLip3ruzVfX0zG4X5geIQc.EQODSgt21.I8rAWrsUak0jHpgrW'),
            (19, 'Natasha Matos', '555.666.777.98', '(42)99829-2234', 'natash@gmail.com', '$2b$10$yD73ijdDSYkFBExBwc7.NO6aQAXjEiJjqq5Wupdjq57gGaTH/Q2CS'),
            (20, 'Alexandra Quero', '555.666.722.33', '(42)99829-9876', 'alexandra@gmail.com', '$2b$10$WX6myBV4F2Xd0GRv2TNtvemAdNUIrlycZthbqZWFuu.9t/6RW.vhK'),
            (21, 'wesley souza', '16281718984', '42988157961', 'antoniowesley@gmail.com', '$2b$10$4f3f6wjoSk8JYshdwI..tO4ovUqYTyC6K2tDAox3O2j0JJOPKdJAK');
            `)
        console.log("Estrutura e dados da tabela 'cliente' criado com sucesso!")
        process.exit(0);
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}
criar_tabelas()
