use syncmed;

CREATE TABLE dbo.[users] (
  [id]                      INT IDENTITY(1,1) PRIMARY KEY,
  [email]                   NVARCHAR(256) NOT NULL UNIQUE,
  [password_hash]           VARBINARY(256) NOT NULL,
  [password_salt]           VARBINARY(128) NOT NULL,
  [role]                    NVARCHAR(50)   NULL,
  [refresh_token]           NVARCHAR(200)  NULL,
  [refresh_token_expires]   DATETIME2      NULL,
  [created_at]              DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME(),
  [updated_at]              DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE TABLE patient (
    id               INT IDENTITY(1,1) PRIMARY KEY,
    [name]           NVARCHAR(120) NOT NULL,
    cpf              VARCHAR(11)   NOT NULL UNIQUE,
    birthDate        DATE          NOT NULL,
    contact          VARCHAR(15)   NULL,
    contactSecundary VARCHAR(15)   NULL,
    email            NVARCHAR(254) NULL
);

CREATE TABLE specialty (
    id               INT IDENTITY(1,1) PRIMARY KEY,
    [name]           NVARCHAR(120) NOT NULL UNIQUE
);


CREATE TABLE professional (
    id                 INT IDENTITY(1,1) PRIMARY KEY,
    [name]             NVARCHAR(120) NOT NULL,
    contact            VARCHAR(15)   NULL,
    contactSecundary  VARCHAR(15)   NULL,
    email              NVARCHAR(254) NULL,
    idSpecialty       INT           NOT NULL,
    CONSTRAINT FK_professional_specialty
        FOREIGN KEY (idSpecialty) REFERENCES dbo.[specialty](id)
);

CREATE INDEX IX_professional_idSpecialty ON dbo.[professional](idSpecialty);

CREATE TABLE schedulling (
    id             INT IDENTITY(1,1) PRIMARY KEY,
    [date]         DATE NOT NULL,
    [hour]         TIME(0) NOT NULL, 
    idPatient      INT NOT NULL,
    idProfessional INT NOT NULL,
    obs            NVARCHAR(500) NULL,
    
    CONSTRAINT FK_schedulling_patient
        FOREIGN KEY (idPatient) REFERENCES dbo.patient(id),
    CONSTRAINT FK_schedulling_professional
        FOREIGN KEY (idProfessional) REFERENCES dbo.professional(id)
);



-- INSERT DE DADOS

INSERT INTO patient ([name], cpf, birthDate, contact, contactSecundary, email) VALUES
( N'João Silva',              '12345678901', '1988-05-12', '11987654321', NULL,               N'joao.silva@example.com'),
( N'Ana Júlia Santos',        '98765432100', '1995-11-03', '21988776655', '21999887766',      N'ana.julia.santos@example.com'),
( N'Lucas Rodrigues',         '32165498700', '1990-03-23', '11991234567', NULL,               N'lucas.rodrigues@example.com'),
( N'Beatriz Almeida',         '65498732111', '2001-07-19', '31987651234', '31987659876',      N'beatriz.almeida@example.com'),
( N'Carlos Eduardo Souza',    '74185296340', '1982-01-02', '11999887766', NULL,               N'carlos.eduardo@example.com'),
( N'Mariana Oliveira',        '85296374155', '1998-09-14', '11977776666', NULL,               N'mariana.oliveira@example.com'),
( N'Pedro Henrique Costa',    '96374185222', '1986-12-29', '21988445566', '21988556677',      N'pedro.costa@example.com'),
( N'Gabriela Rocha',          '36925814731', '1992-04-08', '31998112233', NULL,               N'gabriela.rocha@example.com'),
( N'Rafaela Fernandes',       '25814736942', '2000-10-01', '41990001122', NULL,               N'rafaela.fernandes@example.com'),
( N'Bruno Carvalho',          '14736925873', '1984-02-15', '11995554433', '11992223344',      N'bruno.carvalho@example.com'),
( N'Fernanda Ribeiro',        '15935728460', '1993-06-27', '11987001234', NULL,               N'fernanda.ribeiro@example.com'),
( N'Rodrigo Pires',           '75315948602', '1989-08-09', '21991230011', NULL,               N'rodrigo.pires@example.com'),
( N'Letícia Gomes',           '95135725861', '1997-05-17', '31999998877', '31991112222',      N'leticia.gomes@example.com'),
( N'Matheus Barros',          '85274196313', '2002-03-05', '62988887777', NULL,               N'matheus.barros@example.com'),
( N'Patrícia Azevedo',        '35715984269', '1981-07-30', '41987651230', NULL,               N'patricia.azevedo@example.com');

IF NOT EXISTS (SELECT 1 FROM dbo.specialty)
BEGIN
    SET IDENTITY_INSERT dbo.specialty ON;

    INSERT INTO dbo.specialty (id, [name]) VALUES
    (1,  N'Alergologia e Imunologia'),
    (2,  N'Anestesiologia'),
    (3,  N'Angiologia'),
    (4,  N'Cardiologia'),
    (5,  N'Cirurgião'),
    (6,  N'Dermatologia'),
    (7,  N'Endocrinologia e Metabologia'),
    (8,  N'Endoscopia'),
    (9,  N'Gastroenterologia'),
    (10, N'Geriatria'),
    (11, N'Ginecologia'),
    (12, N'Hematologia e Hemoterapia'),
    (13, N'Infectologia'),
    (14, N'Mastologia'),
    (15, N'Medicina do Trabalho'),
    (16, N'Medicina Esportiva'),
    (17, N'Fisioterapia'),
    (18, N'Nefrologia'),
    (19, N'Neurocirurgia'),
    (20, N'Neurologia'),
    (21, N'Nutrologia'),
    (22, N'Oftalmologia'),
    (23, N'Oncologia Clínica'),
    (24, N'Ortopedia'),
    (25, N'Otorrinolaringologia'),
    (26, N'Patologia'),
    (27, N'Pediatria'),
    (28, N'Pneumologia'),
    (29, N'Psiquiatria'),
    (30, N'Radiologia'),
    (31, N'Radioterapia'),
    (32, N'Reumatologia'),
    (33, N'Urologia');

    SET IDENTITY_INSERT dbo.specialty OFF;

    DBCC CHECKIDENT ('dbo.specialty', RESEED, 33);
END
ELSE
BEGIN
    PRINT 'Exclua os dados da tabela specialty, para o sucesso do relacionamento com dbo.professional.';
END


INSERT INTO dbo.professional ([name], contact, contactSecundary, email, idSpecialty) VALUES
(N'João Silva',             '11960010001', NULL,               N'joao.silva@exemplo.com',            1),
(N'Ana Júlia Santos',      '11960010002', '11960020002',      N'ana.julia@exemplo.com',             2),
(N'Lucas Rodrigues',        '11960010003', NULL,               N'lucas.rodrigues@exemplo.com',       3),
(N'Beatriz Almeida',       '11960010004', '11960020004',      N'beatriz.almeida@exemplo.com',       4),
(N'Carlos Eduardo Souza',   '11960010005', NULL,               N'carlos.souza@exemplo.com',          5),
(N'Mariana Oliveira',      '11960010006', NULL,               N'mariana.oliveira@exemplo.com',      6),
(N'Pedro Henrique Costa',   '11960010007', '11960020007',      N'pedro.costa@exemplo.com',           7),
(N'Gabriela Rocha',        '11960010008', NULL,               N'gabriela.rocha@exemplo.com',        8),
(N'Rafaela Fernandes',     '11960010009', NULL,               N'rafaela.fernandes@exemplo.com',     9),
(N'Bruno Carvalho',         '11960010010', '11960020010',      N'bruno.carvalho@exemplo.com',        10),
(N'Fernanda Ribeiro',      '11960010011', NULL,               N'fernanda.ribeiro@exemplo.com',      11),
(N'Rodrigo Pires',          '11960010012', NULL,               N'rodrigo.pires@exemplo.com',         12),
(N'Letícia Gomes',         '11960010013', '11960020013',      N'leticia.gomes@exemplo.com',         13),
(N'Matheus Barros',         '11960010014', NULL,               N'matheus.barros@exemplo.com',        14),
(N'Patrícia Azevedo',      '11960010015', NULL,               N'patricia.azevedo@exemplo.com',      15),
(N'Gustavo Martins',        '11960010016', '11960020016',      N'gustavo.martins@exemplo.com',       16),
(N'Camila Moraes',         '11960010017', NULL,               N'camila.moraes@exemplo.com',         17),
(N'Felipe Araújo',          '11960010018', NULL,               N'felipe.araujo@exemplo.com',         18),
(N'Aline Castro',          '11960010019', '11960020019',      N'aline.castro@exemplo.com',          19),
(N'Ricardo Teixeira',       '11960010020', NULL,               N'ricardo.teixeira@exemplo.com',      20),
(N'Daniela Nogueira',      '11960010021', NULL,               N'daniela.nogueira@exemplo.com',      21),
(N'Thiago Monteiro',        '11960010022', '11960020022',      N'thiago.monteiro@exemplo.com',       22),
(N'Priscila Duarte',       '11960010023', NULL,               N'priscila.duarte@exemplo.com',       23),
(N'Eduardo Lima',           '11960010024', NULL,               N'eduardo.lima@exemplo.com',          24),
(N'Simone Figueiredo',     '11960010025', '11960020025',      N'simone.figueiredo@exemplo.com',     25),
(N'André Vasconcelos',      '11960010026', NULL,               N'andre.vasconcelos@exemplo.com',     26),
(N'Carla Menezes',         '11960010027', NULL,               N'carla.menezes@exemplo.com',         27),
(N'Marcelo Tavares',        '11960010028', '11960020028',      N'marcelo.tavares@exemplo.com',       28),
(N'Vivian Prado',          '11960010029', NULL,               N'vivian.prado@exemplo.com',          29),
(N'Renato Moreira',         '11960010030', NULL,               N'renato.moreira@exemplo.com',        30),
(N'Helena Cardoso',        '11960010031', '11960020031',      N'helena.cardoso@exemplo.com',        31),
(N'Rafael Batista',         '11960010032', NULL,               N'rafael.batista@exemplo.com',        32),
(N'Sofia Freitas',         '11960010033', NULL,               N'sofia.freitas@exemplo.com',         33);
