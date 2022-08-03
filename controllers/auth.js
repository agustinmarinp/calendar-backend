const { response } = require("express");
const bcrypt = require('bcryptjs');
const Usuario = require("../models/Usuario");
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req, res = response) => {
  
  const { email, password } = req.body;

  try {
   
    let usuario = await Usuario.findOne({ email: email })
    
    if( usuario ) {
      return res.status(400).json({
        ok: false,
        msg: 'El usuario ya existe'
      })
    }

    usuario = new Usuario(req.body);

    // encriptar constraseña 
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync( password, salt );


    await usuario.save();

    // generar JWT
    const token = await generarJWT( usuario.id, usuario.name )

    res.status(201).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token: token
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
        ok: false,
        msg:'Por favor hable con al administrador'
    });
  }
};



const loginUsuario = async (req, res = response) => {
 
  const { email, password } = req.body;

  try {
    
    const usuario = await Usuario.findOne({ email: email })
    
    if( !usuario ) {
      return res.status(400).json({
        ok: false,
        msg: 'El usuario no existe con ese email'
      })
    };

    //confirmar las contraseñas
    const validPassword = bcrypt.compareSync( password, usuario.password );

    if(!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'Contraseña incorrecta'
      })
    };

    //Generar nuestro JWT
    const token = await generarJWT( usuario.id, usuario.name );

    res.json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token: token
    })


  } catch (error) {
    res.status(500).json({
      ok: false,
      msg:'Por favor hable con al administrador'
    });
  }


};



const revalidarToken = async (req, res = response) => {

  const { uid, name } = req;

  // generar nuevo JWT y retonarlo en esta petición
  const token = await generarJWT( uid, name );

  res.json({
    ok: true,
    uid, 
    name,
    token
  });
};



module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken,
};
