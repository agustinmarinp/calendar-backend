/*
    Rutas de Usuarios / Auth
    host + /api/auth
*/

const express = require('express');
const { check } = require('express-validator')
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require ('../middlewares/validar-jwt');

const router = express.Router();

router.post(
    '/new',
    [
        check('name', 'El Nombre es obligatorio').not().isEmpty(), // esto quiere decir que el nombre es obligatorio y que no esté vacío
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'La constraseña debe de ser de 6 carácteres').isLength({ min: 6 }),
        validarCampos
        
    ], 
    crearUsuario
);


router.post(
    '/',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'La constraseña debe de ser de 6 carácteres').isLength({ min: 6 }),
        validarCampos 
    ], 
    loginUsuario
);


router.get('/renew', validarJWT, revalidarToken );


module.exports = router;