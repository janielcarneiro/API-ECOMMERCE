const jwt = require('jsonwebtoken');

//AQUE O TOKEN VAI SER OBRIGATORIO PARA ACESSAR A ROTA
exports.obrigatorio = (req, res, next) => {
    try {     

        const token = req.headers.authorization.split(' ')[1]
        //token decodificado
        const decode = jwt.verify(token, process.env.JWT_KEY)
        req.usuario = decode;
        next();

    } catch (error) {
        return res.status(401).send({mensagem: 'Falha na Autenticação'});
    }

}

//AQUE O TOKEN VAI SER OPCIONAL PARA ACESSAR A ROTA
exports.opcional = (req, res, next) => {
    try {
        
        const token = req.headers.authorization.split(' ')[1];
        //token decodificado
        const decode = jwt.verify(token, process.env.JWT_KEY);
        req.usuario = decode;
        next();

    } catch (error) {
        next();
    }
}