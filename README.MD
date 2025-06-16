# Programação Web

# AMPHI

Um Fórum de conversas escrito em React.  
Link: https://amphi.zuraaa.com/  
API: https://api.zuraaa.com/amphi/

# Funcionalidades desenvolvidas:

## Boards:

![alt text](https://i.imgur.com/XW5Tocp.png "Board")

Se reuna aos outros usuarios em grupos temáticos para discutir seus tópicos favoritos

---

## Contas:

Crie novas contas ou registre-se com uma conta existente de forma facil e rapida

![alt text](https://i.imgur.com/S4Yphsg.png "Login")
![alt text](https://i.imgur.com/UERiI4d.png "Membros")

---

## Interação:

Crie suas próprias postagens, avalie a de seus amigos ou dê inicio a inúmeras conversas através dos comentários

![alt text](https://i.imgur.com/xmQcmwn.png "Post")
![alt text](https://i.imgur.com/nuTSTUf.png "Comentario")

### Outras funcionalidades incluem: Contas de administradores & configurações de grupos.

---

# Tecnologias utilizadas:

-   React
-   Prime
-   Node

---

# Como rodar:

## Backend

-   git clone https://github.com/Yummiii/amphi.git
-   crie um arquivo .env na pasta backend com o seguinte conteúdo

```
DATABASE_URL=
R2_ENDPOINT=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY="
R2_BUCKET_NAME=
R2_PUBLIC_URL=
```

-   npx prisma generate
-   yarn "start:migrate:prod"

## Frontend

-   crie um arquivo .env na pasta frontend com o seguinte conteúdo

```
VITE_API_URL=https://api.zuraaa.com/amphi/
```

-   yarn install
-   yarn run start:dev

---

# Laboratório de Banco de Dados

Foram implementados procedures, inserção de dados, criação de tables e consultas práticas

Arquivos criados:

-   Chamadas_Consultas_Rede_Social.sql
-   Consultas_Rede_Social.sql
-   Criacao_DB_Rede_Social.sql
-   Insertions_Rede_Social.sql
-   MelhoresPosts.sql
-   select_birthdays.sql

---

Obs:  
Yummi é o nome de usuário do aluno Leo Peters  
Purrleterian é o nome de usuário do aluno Júlio César Oliveira
