import Auth from '../models/Auth';
import passport from 'passport';
import crypto from 'crypto';
import { Op } from 'sequelize';
import { hashSync, genSaltSync } from 'bcrypt-nodejs';
import { sendEmail } from '../handle/email';

export const authView = (req, res) => {
    res.render('auth', {
        title: "Crear Cuenta",
        sesion: "Iniciar Sesión"
    });
}

export const sesion = (req, res) => {
    const { error } = res.locals.message;
    res.render('login', {
        title: "Iniciar Sesión",
        pass: "¿Olvidaste tu contraseña?",
        sesion: "¿Aún no tienes cuenta?",
        error
    })
}

export const create_sesion = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (email.length > 0 && password.length > 0) {
            //const authValidate = await Auth.find({ email });
            //if(authValidate)
            const auth = await Auth.create({
                email,
                password
            });

            const url = `http://${req.headers.host}/confirmar/${email}`;

            const auths = {
                email
            }

            sendEmail({
                auth: auths,
                subject: 'tu cuenta Confirmar  ✔',
                url,
                archive: 'confirmar_cuenta'
            });

            if (auth) res.redirect('login');
        }
    } catch (error) {
        console.log(error)
        res.render('auth', {
            errores: error.errors,
            pagina: "Ha ocurrido un error",
            email,
            password,
        });
    }
}

// En este caso es local, porque lo hacemos local, pero si fuera por Face o Git
// Se colaria por donde inicias
export const inciar_sesion = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
    badRequestMessage: 'Error: no se permite campos vacios'
});

export const authAuthentification = (req, res, next) => {
    // El metodo authAuthentification: este nos lo ofrece passport para validar tan simple
    // como llama, aca preguntamos si el usuario esta autentificado, pasa al siguiente midleware
    // sino loggueate
    if (req.isAuthenticated()) return next();
    else res.redirect('/login');
}

export const cerrarSesion = (req, res) => {
    // session: esta variable no la ofrece express-sesion, donde la configuramos en index
    // de esta manera tan sensilla cerramos sesion
    req.session.destroy(() => {
        res.redirect('/login');
    })
}

export const restablecerPassword = (req, res) => {
    res.render('restablecer', {
        title: 'Restablecer Contraseña',
        sesion: 'Volver atras'
    })
}

export const restablecerPasswordPost = async (req, res) => {
    const { email } = req.body;
    try {
        const auth = await Auth.findOne({ where: { email } });
        if (!auth) {
            res.render('restablecer', {
                title: 'Restablecer Contraseña',
                sesion: 'Volver atras',
                message: 'La cuenta asociada no existe, intente con otra. ',
            })
        }
        auth.token = crypto.randomBytes(20).toString('hex');
        auth.expiracion = Date.now() + 3600000;

        await auth.save();

        const url = `http://${req.headers.host}/restablecer/${auth.token}`;


        /*res.redirect(restablecer);*/
        sendEmail({
            auth,
            subject: '✔ Reset Password ✔',
            url,
            archive: 'send-mail'
        });

        res.render('login', {
            message: 'Se ha enviado un correo a su bandeja de entrada.'
        });
    } catch (error) {

        console.log(error);
    }
}

export const restablecerToken = async (req, res) => {
    console.log(req.params.token)
    const auth = await Auth.findOne({ where: { token: req.params.token } });

    if (!auth) {
        res.render('restablecer', {
            title: 'Restablecer Contraseña',
            sesion: 'Volver atras',
            message: 'No valido',
        })
    };

    res.render('resetPassword', {
        title: 'Reestablecer Contraseña',
    });
}

export const restablecerTokenReset = async (req, res) => {

    // Verifica si los password son iguales
    if (req.body.password === req.body.password2) {
        // Verifica el token y la fecha de expedicion han concluido
        const auth = await Auth.findOne({
            where: {
                token: req.params.token,
                expiracion: {
                    [Op.gte]: Date.now()
                }
            }
        });
        if (!auth) {
            res.render('resetPassword', {
                title: 'Reestablecer Contraseña',
                message: 'Su token ha expedido',
            })
        }
        auth.token = null;
        auth.expiracion = null;
        auth.password = hashSync(req.body.password, genSaltSync(10));
        await auth.save();
        res.redirect('/login');;
    } else {
        res.render('resetPassword', {
            title: 'Reestablecer Contraseña',
            message: 'Las contraseñas ingresadas no son iguales',
        })
    }

}

export const changeEstadoCuenta = async (req, res) => {
    try {
        const correo = await Auth.findOne({ where: { email: req.params.estado } });
        if (!correo) res.render('auth', {
            message: 'Error, ha ocurrido un error en la activación'
        });
        correo.estado = 1;
        await correo.save();

        res.render('login', {
            title: "Iniciar Sesión",
            sesion: "Iniciar Sesión",
            message: 'Has confirmado tu cuenta inicia sesión'
        });

    } catch (error) {
        console.log(error)
    }
}