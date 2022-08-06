const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const multer = require('multer');
const login = require('../middleware/login');
const produtosController = require('../controllers/produtos-controller');

//Para vem o nome correto do arquivo
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads');
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString() + file.originalname);
    }
})

//regras para a imagem albedecer
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    }else{
        cb(null, false);
    }
}

//aonde vai salvar o arquivo
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 6
    },
    fileFilter: fileFilter
});

//Retornar todos os produtos
router.get('/', produtosController.getProdutos);
//inserir um produto
router.post(
            '/',
            login.obrigatorio, 
            upload.single('produto_imagem'),
            produtosController.postProduto
);
//retornar os dados de um produto
router.get('/:id_produto',produtosController.getUmProduto);
//ALTERAR UM PRODUTO
router.patch('/',login.obrigatorio, produtosController.updateProduto);
//DELETAR UM PRODUTO
router.delete('/',login.obrigatorio, produtosController.deleteProduto);
//ADICIONAR VARIAS IMAGENS DE UMA POR UMA
router.post(
        '/:id_produto/imagem',
        login.obrigatorio,
        upload.single('produto_imagem'),
        produtosController.postImagem
)
//TRAZER TODAS AS IMAGENS DO MEU PRODUTO
router.get(
    '/:id_produto/imagens',
    produtosController.getImagens)

module.exports = router;