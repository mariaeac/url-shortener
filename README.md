# URL Shortener


![Java](https://img.shields.io/badge/Java-21-blue?style=for-the-badge&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3-green?style=for-the-badge&logo=springboot)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen?style=for-the-badge&logo=mongodb)

Este projeto é um encurtador de URLs desenvolvido com Spring Boot e MongoDB, baseado no desafio disponível em [backend-br/desafios. ](https://github.com/backend-br/desafios/blob/master/url-shortener/PROBLEM.md)

![image](https://github.com/user-attachments/assets/1c12f568-3858-4fc5-a696-92b37e7e0a45)



## 🚀 Tecnologias Utilizadas

- **Java 21**
- **Spring Boot**
- **MongoDB**
- **Docker** (para MongoDB opcionalmente)

## 📌 Funcionalidades

- Criar um link encurtado a partir de uma URL longa
- Redirecionar automaticamente ao acessar a URL encurtada
- Definir tempo de expiração para URLs
- Remover URLs expiradas

## 🔗 Endpoints

### 📌 Criar uma URL encurtada

- **Método:** `POST`
- **Endpoint:** `/api/shorten-url`
- **Corpo da requisição:**

  ```json
  {
    "url": "https://www.google.com"
  }
  ```

- **Resposta:**

  ```json
  {
    "url": "http://localhost:8080/abc123"
  }
  ```

### 🔄 Redirecionar para a URL original

- **Método:** `GET`
- **Endpoint:** `/api/{shortUrl}`
- **Exemplo:** `GET http://localhost:8080/abc123`
- **Resposta:** Redireciona para a URL longa original







