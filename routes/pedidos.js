const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const pedidosController = require('../controllers/pedidos-controller')

//Retornar todos os pedidos
router.get('/',pedidosController.getPedidos);
//inserir um pedido
router.post('/', pedidosController.postPedidos);
//retornar os dados de um pedido
router.get('/:id_pedido', pedidosController.getUmPedido);
//DELETAR UM Pedido
router.delete('/',pedidosController.deletePedido);

module.exports = router;