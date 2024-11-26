import { getAllPosts, createPost, updateSinglePost} from "../models/postsModel.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js";
import path from "path";
import { fileURLToPath } from "url";

// Comando await espera "ASYNC"
export async function listAllPosts (req, res, collectioname){
    // Recebendo resultados do Banco de Dados e passando para formato JSON
    const allpost = await getAllPosts(collectioname);
    res.status(200).json(allpost);
}

export async function sendPosts(req, res){
    // Pega o conteúdo que está no corpo da requisição
    const newPost = req.body;

    try {
        const createNewPost = await createPost(newPost, "posts");
        //const updateImage = 
        res.status(200).json(createNewPost);    
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha na requisição"});
    }
}

export async function uploadImagem(req, res){
    // Formatação para muller/postman incluir imagem direto no banco
    const newPost = {
        descricao: "",
        imgurl: req.file.originalname,
        alt: ""
    };
    
    try {
        const createNewPost = await createPost(newPost, "posts");
        // Extrai o nome da extensão utilizada na imagem
        const fileExtension = req.file.originalname.split('.').pop();
        const updateImg = `uploads/${createNewPost.insertedId}.${fileExtension}`;
        // Atualiza o nome do arquivo local com o ID atribuido pelo DB
        fs.renameSync(req.file.path, updateImg);
        res.status(200).json(createNewPost);    

    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha na requisição"});
    }
}

export async function uploadImagens(req, res){

    try {
        // Verifica se foram enviados arquivos
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'Nenhuma imagem enviada' });
        }
    
        const newPosts = [];
        
        for (const file of req.files) {
            console.log(file.filename);
            const newPost = {
              descricao: "", // Preencha a descrição conforme necessário
              imgurl: path.join('/uploads', file.filename), // Caminho completo da imagem,
              alt: "" // Preencha o alt text conforme necessário
            };
            
            const createNewPost = await createPost(newPost, "fotos");
            const insertedId = createNewPost.insertedId;
            const caminho = path.join('uploads', file.filename);
            const updateImg = `uploads/${insertedId}.png`;
            // Preenchendo o Array para devolver o arquivo JSON da requisição
            newPosts.push(createNewPost);
            console.log(caminho, updateImg);
            await fs.promises.rename(caminho, updateImg);
        }

        res.status(200).json(newPosts);
    }catch (error) {
        console.error(error.message);
        res.status(500).json({"Erro": "Falha na requisição" });
      }        
}

export async function updateNewPost(req, res){
    const id = req.params.id;
    // Extrai o nome da extensão utilizada na imagem
    const urlimage = `ls/${id}.png`;

    try {
        const imgBuffer = fs.readFileSync(`uploads/${id}.png`);
        const descricao = await gerarDescricaoComGemini(imgBuffer);

        const post = {
            descricao: descricao,
            imgurl: urlimage,
            alt: req.body.alt
        }

        const updatePost = await updateSinglePost(id, post, "posts");
        res.status(200).json(updatePost);   
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha na requisição"});        
    };
}

export async function updateAllFotos(req, res) {
    const todasAsImagens = await getAllPosts("fotos");
    const updateFotos = [];

    try {
        for (const imagem of todasAsImagens) {
        
            const id = imagem._id.toHexString();
            // Obter o buffer da imagem (supondo que você tenha uma função para isso)
            const imgBuffer = fs.readFileSync(`uploads/${id}.png`);

            // Gerando Descrição e texto alt
            const descricao = await gerarDescricaoComGemini(imgBuffer);
            const urlimage = `https://imersaobackendalura-770467420355.southamerica-east1.run.app/${id}.png`;

            const fotos = {
                descricao: descricao,
                imgurl: urlimage,
                alt: req.body.alt
            }
            const updatePost = await updateSinglePost(id, fotos, "fotos");
            updateFotos.push(updatePost);
            
        } 
        res.status(200).json(updateFotos);
    } catch (error) {
        console.error(`Erro ao atualizar imagem:`, error);
    }
}