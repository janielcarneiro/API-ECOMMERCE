const mysql = require('../mysql');

exports.deleteImagem = async (req, res, next)=>{

    try {
        const query = `DELETE FROM imagens_produtos WHERE id_imagem = ?`;
        await mysql.execute(query, [req.params.id_imagem])

        //Deixar Api documentada
        const response = {
            mensagem: "imagem removido com sucesso",
            request: {
                tipo: 'POST',
                descricao: 'Insere um produto',
                url: 'http://localhost:5000/produtos/'+req.body.id_produto+ '/imagem',
                body: {
                    id_produto: 'Number',
                    imagem_produto: 'File'
                }
            }
        }
    return res.status(202).send(response);

    } catch (error) {
        return res.status(500).send({error:error});
    }
}