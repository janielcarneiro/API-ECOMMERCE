const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usuariosController = require('../controllers/usuarios-controller');

router.post('/cadastro',usuariosController.cadastrarUsuarios);
router.post('/login',usuariosController.loginUsuario);

module.exports = router;