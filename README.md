# Projeto Frontend + Backend

Este projeto é composto por duas partes principais:  
- **Frontend**: desenvolvido em **Next.js**  
- **Backend**: desenvolvido em **ASP.NET**  

---
## 🗄️ Pré-requisito: Criar Banco de Dados no SQL Server

Antes de rodar o backend, crie o banco de dados `syncmed` no **SQL Server**.  
Segue o script SQL para criação:

```sql
CREATE DATABASE syncmed;
GO
```
- Após criar o banco rode o **script.sql** que esta na raiz do repositório.

## 🚀 Como rodar o Back-end

1. Abra o projeto no **Visual Studio**  
2. Execute pressionando **F5** ou clicando no botão **Executar**  

🔗 Endpoints disponíveis via **Swagger** (provavelmente):  
[https://localhost:8443/swagger/index.html](https://localhost:8443/swagger/index.html)

---

## 💻 Como rodar o Front-end

Na raiz do projeto:

```bash
cd client
npm i
npm run build
npm run dev
