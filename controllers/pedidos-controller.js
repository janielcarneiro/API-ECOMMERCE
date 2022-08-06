const mysql = require('../mysql').pool;

exports.getPedidos = (req, res, next)=>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error: error});}
        conn.query(`
        SELECT  
            pedidos.id_pedido,
            pedidos.quantidade,
            produtos.id_produto,
            produtos.nome,
            produtos.preco
        FROM pedidos 
        INNER JOIN produtos
        ON produtos.id_produto = pedidos.id_produto`,
        (error, resultado, fields) => {
            if(error){return res.status(500).send({error:error})}

            //Deixara API bem documentada
            const response = {
                //quantidade: resultado.length,
                pedidos: resultado.map(pedido =>{
                    return{
                        id_pedido: pedido.id_pedido,
                        quantidade: pedido.quantidade,

                        produto: {
                            id_produto: pedido.id_produto,
                            nome: pedido.nome,
                            preco: pedido.preco
                        },

                        request: {
                            tipo: 'GET',
                            descricao: 'Retornar todos os pedidos',
                            url: 'http://localhost:5000/pedidos/' + pedido.id_pedido,
                        }
                    }
                })
            }


            return res.status(200).send({response});
        })
    });
};


exports.postPedidos = (req, res, next)=>{

    mysql.getConnection((error, conn) => {
        if(error) {return res.status(300).send({error: error})}
        conn.query('SELECT * FROM produtos WHERE id_produto = ?',
        [req.body.id_produto],
        (error, result, field) => {
            //conn.release();
            if(error){return res.status(500).send({error: error})}
            if(result.length == 0){
                return res.status(404).send({
                    mensagem: 'produto não encontrado'
                })
            }
            conn.query(
                'INSERT INTO pedidos (id_produto, quantidade) VALUES (?,?);',
                [req.body.id_produto, req.body.quantidade],
                (error, result, field) =>{
                    conn.release();//liberar a conexão
    
                    if(error){
                        return res.status(500).send({
                            error: error,
                            response: null
                        })
                    }
                    //Deixar a api documentada
                    const response = {
                        mensagem: 'Pedido inserido com sucesso',
                        pedidoCriado: {
                            id_pedido: result.id_pedido,
                            id_produto: req.body.id_produto,
                            quantidade: req.body.quantidade,
                            request: {
                                tipo: 'GET',
                                descricao: 'Pedido salvo com sucesso',
                                url: 'http://localhost:5000/pedidos'
                            }
                        }
                    }

                    return res.status(201).send(response);
                }
            )

        }
        )
    })

};

exports.getUmPedido = (req, res, next)=>{
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})}
        conn.query('SELECT * FROM pedidos WHERE id_pedido = ?',
        [req.params.id_pedido],
        (error, resultado, fields) => {
            if(error){return res.status(500).send({error:error})}
            //verificar encontrou alhum produto
            if(resultado.length == 0){
                return res.status(404).send({
                    mensagem: 'Não foi encontrado nemhum pedido com esse ID'
                })
            }
            //Deixar a api documentada
            const response = {
                mensagem: 'Pedido retornado com sucesso',
                pedido: {
                    id_pedido: resultado[0].id_pedido,
                    id_produto: resultado[0].id_produto,
                    quantidade: resultado[0].quantidade,
                    request: {
                        tipo: 'GET',
                        descricao: 'Retornar um Pedido',
                        url: 'http://localhost:5000/pedido'
                    }
                }
            }

            return res.status(200).send(response);
        })
    }) 
};

exports.deletePedido = (req, res, next)=>{
    mysql.getConnection((error, conn)=> {
        if(error){return res.status(500).send({error: error})}
        conn.query(
            `DELETE FROM pedidos WHERE id_pedido = ?`,
            [req.body.id_pedido],
            (error, resultado, field) => {
                conn.release();
                if(error){return res.status(500).send({error:error})}

                //Deixar Api documentada
                const response = {
                    mensagem: "Pedido removido com sucesso",
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um pedido',
                        url: 'http://localhost:5000/pedidos',
                        body: {
                            id_produto: 'Number',
                            quantidade: 'Number'
                        }
                    }
                }
                return res.status(202).send(response);
            }
        )
    })
}