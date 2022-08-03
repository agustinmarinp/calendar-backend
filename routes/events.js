/*

Event Routes
/api/events

*/


const { Router } = require('express');
const { check } = require('express-validator');
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { isDate } = require('../helpers/isDate');

const router = Router();

// todas tienen que pasar por la validación del JWT
router.use( validarJWT );


router.get( '/', getEventos );


router.post( 
    '/', 
    [
        check('title', 'Título es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom( isDate ),
        check('end', 'Fecha de fin es obligatoria').custom( isDate ),
        validarCampos
    ],
    crearEvento 
);


router.put('/:id', actualizarEvento );


router.delete('/:id', eliminarEvento)



module.exports = router;
