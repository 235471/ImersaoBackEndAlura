import express from "express";
import routes from "./src/routes/postsRoutes.js";

//Verificando se variavel de ambiente esta acessivel.
//console.log(process.env.STRING_CONEXAO);

const app = express();
app.use(express.static("uploads"));
routes(app);
// Inicia o servidor na porta 3000
app.listen(3000, () => {
    console.log("Servidor escutando...");
});