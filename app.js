const express = require('express');
const app = express();
//monitorar toda as requisição GET, POST etc.
//e escrever no terminal
const morgan = require('morgan');
//para trabalhar com o corpo da requisição
const bodyParser = require('body-parser');

//importando minha rotas de produtos
const rotaProdutos = require('./routes/produtos');
const rotasPedidos = require('./routes/pedidos');
const rotasUsuarios = require('./routes/usuarios');
const rotasImagens = require('./routes/imagens');
const categoryRoute = require('./routes/category_route');

app.use(morgan('dev'));
//para deixar minha pasta UPLOAD PUBLICA
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));//apenas dados simples
app.use(bodyParser.json());//formato json de entrada

//CORS aplicar restrição para quem vai acessar a API
app.use((req, res, next) =>{
    //servidores que vão ser aceito
    res.header('Access-Control-Allow-Origin', '*');
    //os tipos de cabeçalho aceito
    res.header(
        'Access-Control-Allow-Header', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    //os metodos que vão poder ser retornado
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).send({})
    }

    next();
    
});


app.use('/produtos', rotaProdutos);
app.use('/pedidos', rotasPedidos);
app.use('/usuarios', rotasUsuarios);
app.use('/imagens', rotasImagens);
app.use('/categories', categoryRoute);

//QUANDO NÃO ENCONTRAR NENHUMA ROTA EXISTENTE
app.use((req, res, next)=> {
    const erro = new Error('Não encontrado');
    erro.status = 404;
    next(erro);
});

//CASO DER UM ERRO NA MINHA FUNÇÃO COM BANCO DE DADOS OU ETC.
app.use((error, req, res, next)=> {
    res.status(error.status || 500);
    return res.send({
        error: {
            mensagem: error.message
        }
    })
});

module.exports = app;