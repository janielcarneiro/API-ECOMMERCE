const mysql = require('../mysql');

//Retornar todos os produtos
exports.getCategories = async (req, res, next)=>{
    try {
        const result = await mysql.execute("SELECT * FROM categories;")
        const response = {
            length: result.length,
            categories: result.map(category =>{
            return{
                categoryId: category.categoryId,
                nome: category.nome,
            }
        })
    }
    return res.status(200).send(response);
    } catch (error) {

        return res.status(500).send({error: error});

    }
};

exports.postCategory = async (req, res, next) => {
    try {
        const query = 'INSERT INTO categories (nome) VALUES (?)';
        const result = await mysql.execute(query, [req.body.nome]);

        const response = {
            message: 'Categoria inserido com sucesso',
            createdCategory: {
                categoryId:  result.insertId,
                nome: req.body.nome,
                request: {
                    type: 'GET',
                    description: 'Retornar todas as categorias',
                    url: 'localhost:5000/categories'
                }
            }
        }
        return res.status(201).send(response);
    } catch (error) {
        return res.status(500).send({error: error});
    }
}