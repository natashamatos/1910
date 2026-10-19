CREATE TABLE Cliente
(
    id INT PRIMARY KEY AUTO_INCREMENT,
    senha VARCHAR(512) NOT NULL,
    Celular CHAR(14) NOT NULL,
    cpf CHAR (14) NOT NULL,
    email VARCHAR(50) NOT NULL,
    nome VARCHAR(50) NOT NULL,
    UNIQUE (cpf,email)
);

DROP TABLE Cliente;

INSERT INTO `Cliente` (
    senha, Celular, cpf, email, nome
) VALUES (
    "123456", "(42)99820-7398",
    "712.669.552-93", "natashaquero0508@gmail.com", "Natasha"
)

INSERT INTO Cliente (senha, celular, cpf, email, nome) VALUES
('$2b$12$K3v8x...', '(11)98765-4321', '123.456.789-00', 'carlos.silva@email.com', 'Carlos Silva'),
('$2b$12$M9n2b...', '(21)99888-7766', '234.567.890-11', 'ana.oliveira@email.com', 'Ana Oliveira'),
('$2b$12$P4f7g...', '(31)98877-6655', '345.678.901-22', 'bruno.santos@email.com', 'Bruno Santos'),
('$2b$12$Q1w2e...', '(41)99777-5544', '456.789.012-33', 'mariana.costa@email.com', 'Mariana Costa'),
('$2b$12$R5t6y...', '(51)99666-4433', '567.890.123-44', 'ricardo.almeida@email.com', 'Ricardo Almeida'),
('$2b$12$T7u8i...', '(61)99555-3322', '678.901.234-55', 'juliana.lima@email.com', 'Juliana Lima'),
('$2b$12$U9i0o...', '(71)99444-2211', '789.012.345-66', 'fernando.rodrigues@email.com', 'Fernando Rodrigues'),
('$2b$12$V1b2n...', '(81)99333-1100', '890.123.456-77', 'camila.pereira@email.com', 'Camila Pereira'),
('$2b$12$W3e4r...', '(85)99222-0099', '901.234.567-88', 'lucas.martins@email.com', 'Lucas Martins'),
('$2b$12$X5t6y...', '(91)99111-8877', '012.345.678-99', 'beatriz.gomes@email.com', 'Beatriz Gomes');

SELECT email, senha FROM `Cliente`;


SELECT email, senha FROM `Cliente` WHERE email = "juliana.lima@email.com;"

SELECT * FROM `Cliente` WHERE id <= 30 AND LENGTH(senha) >20;

SELECT * FROM Cliente;

DELETE FROM `Cliente` WHERE id = 37;

UPDATE `Cliente` SET nome = "Natasha Matos", email = "natashaquero0508@gmail.com" WHERE id = 35