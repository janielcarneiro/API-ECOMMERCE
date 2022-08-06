const mysql = require('../mysql');

//Retornar todos os produtos
exports.getProdutos = async (req, res, next)=>{
    try {
        console.log(req.query.nome);
        let nome = '';
        if(req.query.nome){
            nome = req.query.nome;
        }

        const query = `SELECT * FROM produtos WHERE categoryId = ?
                    AND (
                        nome LIKE '%${nome}%')`;

        const result = await mysql.execute(query, [
            req.query.categoryId
        ])
        const response = {
            quantidade: result.length,
            produtos: result.map(prod =>{
            return{
                id_produto: prod.id_produto,
                nome: prod.nome,
                preco: prod.preco,
                imagem_produto: prod.imagem_produto,
                request: {
                    tipo: 'GET',
                    descricao: 'Retornar todos os produtos',
                    url: 'http://localhost:5000/produtos/' + prod.id_produto
                }
            }
        })
    }
    return res.status(200).send(response);
    } catch (error) {

        return res.status(500).send({error: error});

    }
};

exports.postProduto = async (req, res, next)=>{

    try {

        const query = 'INSERT INTO produtos (nome, preco, imagem_produto, categoryId) VALUES (?,?,?,?)';
        const result = await mysql.execute(query, [
            req.body.nome, 
            req.body.preco,
            req.file.path,
            req.body.categoryId,
        ]);

        const response = {
            mensagem: 'Produto inserido com sucesso',
            produtoCriado: {
                id_produto: result.id_produto,
                nome: req.body.nome,
                preco: req.body.preco,
                imagem_produto: req.file.path,
                categoryId: req.body.categoryId,
                request: {
                    tipo: 'POST',
                    descricao: 'Produto salvo com sucesso',
                    url: 'http://localhost:5000/produtos'
                }
            }
        }
        return res.status(201).send(response);

    } catch (error) {
        return res.status(500).send({error: error});
    }

};

//retornar os dados de um produto
exports.getUmProduto = async (req, res, next)=>{
    try {
        const query = 'SELECT * FROM produtos WHERE id_produto = ?';
        const result = await mysql.execute(query, [req.params.id_produto]);

        if(result.length == 0){
            return res.status(404).send({
                mensagem: 'Não foi encontrado produto com este ID'
            })
        }

        const response = {
            mensagem: 'Produto retornado com sucesso',
            produto: {
                id_produto: result[0].id_produto,
                nome: result[0].nome,
                preco: result[0].preco,
                imagem_produto: result[0].imagem_produto,
                request: {
                    tipo: 'GET',
                    descricao: 'Retornar um Produto',
                    url: 'http://localhost:5000/produtos'
                }
            }
        }

        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({error: error});
    }
};


exports.updateProduto = async (req, res, next)=>{

    try {
        const query = `UPDATE produtos
                       SET nome      = ?,
                            preco     = ?
                       WHERE id_produto = ?`;
        await mysql.execute(query, [
            req.body.nome, 
            req.body.preco,
            req.body.id_produto
        ]);
        const response = {
            mensagem: 'Produto atualizado com sucesso',
            produtoAtualizado: {
                id_produto: req.body.id_produto,
                nome: req.body.nome,
                preco: req.body.preco,
                request: {
                    tipo: 'PATCH',
                    descricao: 'Produto atualizado com sucesso',
                    url: 'http://localhost:5000/produtos' + req.body.id_produto
                }
            }
        }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({error: error});
    }
};

exports.deleteProduto = async (req, res, next)=>{

    try {
        const query = `DELETE FROM produtos WHERE id_produto = ?`;
        await mysql.execute(query, [req.body.id_produto])

        //Deixar Api documentada
        const response = {
            mensagem: "produto removido com sucesso",
            request: {
                tipo: 'POST',
                descricao: 'Insere um produto',
                url: 'http://localhost:5000/produtos',
                body: {
                    nome: 'String',
                    preco: 'NUMBER'
                }
            }
        }
    return res.status(202).send(response);

    } catch (error) {
        return res.status(500).send({error:error});
    }
}


//ADICIONAR VARIAS IMAGENS
exports.postImagem = async (req, res, next)=>{

    try {

        const query = 'INSERT INTO imagens_produtos (id_produto, caminho) VALUES (?,?)';
        const result = await mysql.execute(query, [
            req.params.id_produto, 
            req.file.path
        ]);

        const response = {
            mensagem: 'Imagem inserida com sucesso',
            imagemCriado: {
                id_produto: parseInt(req.params.id_produto),
                id_imagem: result.insertId,
                imagem_produto: req.file.path,
                request: {
                    tipo: 'GET',
                    descricao: 'Retornar todas as imagens',
                    url: 'http://localhost:5000/produtos/' + req.params.id_produto + '/imagens'
                }
            }
        }
        return res.status(201).send(response);

    } catch (error) {
        return res.status(500).send({error: error});
    }

};


//RETORNAR TODAS AS IMAGENS DE UM DETERMINADO PRODUTO
exports.getImagens = async (req, res, next)=>{
    try {
        const query = "SELECT * FROM imagens_produtos WHERE id_produto = ?;";
        const result = await mysql.execute(query, [req.params.id_produto]);
        
        const response = {
            quantidade: result.length,
            imagens: result.map(img =>{
            return{
                id_produto: parseInt(req.params.id_produto),
                id_imagem: img.id_imagem,
                caminho: 'http://localhost:5000/' + img.caminho,
            }
        })
    }
    return res.status(200).send(response);
    } catch (error) {

        return res.status(500).send({error: error});

    }
};