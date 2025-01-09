
import { conprobarPassword } from '../helpers/conprobarPassword.js';
import { Veterinario } from '../models/Veterinario.js'
import { generarJWT } from '../helpers/generarJWT.js';
import { generarId } from '../helpers/generarId.js';
import { emailRegistro } from '../helpers/emailRegistro.js';
import { emailOlvidePassword } from '../helpers/emailOlvidePassword.js';

//Registrar un veterinario
export const registrar = async ( req, res ) => {

    const { email, nombre } = req.body;

    //Validar si un email existe
    const existeUsuario = await Veterinario.findOne({ email });
    if (existeUsuario) {
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({ msg: error.message });
    }

    try {
        
        //Guardar un Nuevo Veterinario
        const veterinario = new Veterinario(req.body);
        await veterinario.save();

        //Enviar el email
        emailRegistro({
            email,
            nombre,
            token: veterinario.token
        })

        res.status(201).json({ msg: 'Creado Correctamente, Revisa tu Email'});


    } catch (error) {
        console.log(error);
    }
    
}

export const perfil = ( req, res ) => {
    const { veterinario } = req;
    res.json(veterinario)
}

export const confirmar = async ( req, res ) => {
    
    const { token } = req.params;

    const usuarioConfirmado = await Veterinario.findOne({ token });
    if (!usuarioConfirmado) {
        const error = new Error('Token No Valido');
        return res.status(404).json({ msg: error.message });
    }

    try {
        usuarioConfirmado.token = null;
        usuarioConfirmado.confirmado = true;
        await usuarioConfirmado.save();
        res.json({ msg: 'Usuario Confirmado Correctamente'});

    } catch (error) {
        console.log(error)
    }
}

export const autenticar = async ( req, res ) => {
    
    const { email, password } = req.body;

    //Conprobar si el usuario existe
    const usuario = await Veterinario.findOne({ email });
    if (!usuario) {
        const error = new Error('El Usuario No Existe');
        return res.status(403).json({ msg: error.message });
    }

    //Conprobar si el usuario esta confirmado
    if (!usuario.confirmado) {
        const error = new Error('Tu Cuenta no ha sido confirmada');
        return res.status(403).json({ msg: error.message });
    }

    //Revisar el Password
    const hash = await conprobarPassword( password, usuario.password );
    if (!hash) {
        const error = new Error('El Password Incorrecto');
        return res.status(403).json({ msg: error.message });
    }

    //Autenticar el usuario
    usuario.token = generarJWT(usuario.id);
    res.json({
        _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        token: generarJWT(usuario.id),
    });
}

export const olvidePassword = async ( req, res ) => {

    const { email } = req.body;

    const existeVeterinario = await Veterinario.findOne({ email })
    if (!existeVeterinario) {
        const error = new Error('El Usuario no existe');
        return res.status(400).json({ msg: error.message });
    }

    try {

        existeVeterinario.token = generarId();
        await existeVeterinario.save();

        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        })

        res.json({ msg: 'Hemos enviado un email con las instrucciones'});
        
    } catch (error) {
        console.log(error)
    }
}

export const comprobarToken = async ( req, res ) => {
    const { token } = req.params;
    
    const tokenValido = await Veterinario.findOne({ token });
    if (tokenValido) {
        res.json({ msg: 'Token valido y el usuario existe'});
    }else{
        const error = new Error('Token no Valido');
        return res.status(400).json({ msg: error.message });
    }

}

export const nuevoPassword = async ( req, res ) => {
    
    const { token } = req.params;
    const { password } = req.body;

    const veterinario = await Veterinario.findOne({ token });
    if (!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message });
    }

    try {
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();
        return res.json({ msg: 'Password Modificado Correctamente'});
    } catch (error) {
        console.log(error)
    }
}

export const actualizarPerfil = async ( req, res ) => {
    const veterinario = await Veterinario.findById(req.params.id);

    if (!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message });
    }

    const { email } = req.body;
    if (!veterinario.email !== req.body.email) {
        const existeEmail = await Veterinario.findOne({ email });

        if (existeEmail) {
            const error = new Error('Ese email ya esta en uso');
            return res.status(400).json({ msg: error.message });
        }
    }

    try {

        veterinario.nombre = req.body.nombre 
        veterinario.email = req.body.email 
        veterinario.web = req.body.web 
        veterinario.telefono = req.body.telefono 
        const veterinarioActualizado = await veterinario.save();
        res.json(veterinarioActualizado);
        
    } catch (error) {
        console.log(error)
    }
}

export const actualizarPassword = async ( req, res ) => {
    //Leer los datos
    const { id } = req.veterinario;
    const { pwd_actual, pwd_nuevo } = req.body;

    //Comprobar que el veterinario existe
    const veterinario = await Veterinario.findById(id);
    if (!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message });
    }

    //Comprobar su password
    const passwordComprobar = await conprobarPassword(pwd_actual, veterinario.password);
    
    if (passwordComprobar) {
        //Almacenar su nuevo password
        veterinario.password = pwd_nuevo
        await veterinario.save();
        res.json({ msg: 'Password Almacenado Correctamente'});
    }else{
        const error = new Error('El Password Actual es Incorrecto');
        return res.status(400).json({ msg: error.message });
    }
}