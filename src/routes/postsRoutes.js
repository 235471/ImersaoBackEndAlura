import express from "express";
import multer from "multer";
import cors from "cors";
import { listAllPosts, sendPosts, uploadImagem, updateNewPost, uploadImagens, updateAllFotos } from "../controllers/postsController.js";

const corsOptions = {
    origin: ["https://instabytes-git-main-235471s-projects.vercel.app", "https://instabytes-235471s-projects.vercel.app", "https://instabytes-steel.vercel.app"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};

// Configuração necessária para windows
const storage = multer.diskStorage({
    // Define o diretório de destino para os arquivos carregados
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    // Define o nome do arquivo no destino
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ dest: "./uploads" , storage});
const uploads = multer({dest: "./uploads", storage: storage }).array('images', 5);

const routes = (app) => {
    // Permite que o servidor interprete requisições no formato JSON
    app.use(express.json());
    app.use(cors(corsOptions));

    // Rota para buscar todos os posts e fotos
    app.get("/posts", (req, res) => listAllPosts(req, res, "posts"));
    app.get("/fotos", (req, res) => listAllPosts(req, res, "fotos"));

    // Rota para criar um post
    app.post("/posts", sendPosts);
    // Rota para fazer upload de uma imagem
    // O middleware `upload.single('imagem')` configura o multer para lidar com um único arquivo
    // com o nome de campo "imagem" no formulário    
    //app.post("/upload", upload.single("imagem"), uploadImagem);

    // Fazer upload de varias imagens
    app.post("/upload", uploads, uploadImagens);
    // Atualizando informações de um post
    app.put("/upload/:id", updateNewPost);
    app.put("/upload", updateAllFotos);
}

// Exportando a função que configura as rotas para ser utilizada em outros módulos
export default routes;
