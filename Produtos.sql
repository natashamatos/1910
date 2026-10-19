CREATE TABLE Produtos
(
  id INT PRIMARY KEY,
  idcategoria INT,
  nome VARCHAR(255) NOT NULL,
  descricao VARCHAR(255) NOT NULL,
  preco FLOAT NOT NULL,
  estoque INT NOT NULL
);


INSERT INTO Produtos (
  id, idcategoria, nome, descricao, preco, estoque
) VALUES (
  1, 'skincare', 'serum', 'hidrata-efeito matte', 50.00, 10
);

DROP TABLE Produtos;


CREATE TABLE Produtos
(
  id INT PRIMARY KEY,
  idcategoria VARCHAR(255), 
  nome VARCHAR(255) NOT NULL,
  descricao VARCHAR(255) NOT NULL,
  preco FLOAT NOT NULL,
  estoque INT NOT NULL
);

INSERT INTO Produtos (
  id, idcategoria, nome, descricao, preco, estoque
) VALUES (
  1, 'skincare', 'serum', 'hidrata-efeito matte', 50.00, 10
);

INSERT INTO Produtos (
  id, idcategoria, nome, descricao, preco, estoque
) VALUES 
  (2, 'maquiagem', 'base liquida', 'alta cobertura efeito natural', 75.90, 15),
  (3, 'maquiagem', 'batom matte', 'cor vermelho intenso longa duracao', 29.90, 30),
  (4, 'maquiagem', 'mascara de cilios', 'volume maximo e a prova d agua', 42.50, 20),
  (5, 'maquiagem', 'po compacto', 'controle de oleosidade translucido', 35.00, 12),
  (6, 'maquiagem', 'corretivo liquido', 'camuflagem de olheiras hidratante', 39.90, 18);