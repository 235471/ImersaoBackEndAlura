import 'dotenv/config';
import { ObjectId } from "mongodb";
import conectarAoBanco from "../config/dbConfig.js";
// Conexão com o banco de dados
const conexao = await conectarAoBanco(process.env.STRING_CONEXAO);

//Função para buscar todos os dados da coleção no banco de dados
export async function getAllPosts(collection){
    // DB recebe nome do banco de dados como parametro
    const db = conexao.db("instabyte");
    // Collection recebe as coleções existente no banco como parametro
    const colecao = db.collection(collection);
    // Convertando os objetos para Array
    return colecao.find().toArray();
};
// Incluindo um objeto no banco de dadosMongo
export async function createPost(newPost, collection) {
    const db = conexao.db("instabyte");
    const colecao = db.collection(collection);
    return colecao.insertOne(newPost);

}

/* export async function updateSinglePost(id, newPost, collectioname) {
    const db = conexao.db("instabyte");
    const colecao = db.collection(collectioname);
    console.log('ID recebido para conversão:', id);
    const objID = ObjectId.createFromHexString(id);
    return colecao.updateOne({_id: new ObjectId(objID)}, {$set:newPost});
}*/
   export async function updateSinglePost(id, newPost, collectioname) {
    const db = conexao.db("instabyte");
    const colecao = db.collection(collectioname);
  // Verifique se o ID tem exatamente 24 caracteres e é uma string hexadecimal válida
    if (id.length === 24 && /^[a-f0-9]+$/i.test(id)) {
        const objID = new ObjectId(id);  // Aqui criamos diretamente o ObjectId
        console.log('ObjectId gerado:', objID);
        return colecao.updateOne({ _id: objID }, { $set: newPost });
    } 
    else {
    throw new Error(`ID inválido: ${id}`);
    }
}