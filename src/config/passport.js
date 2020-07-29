import passport from 'passport';
const LocalStrategy = require('passport-local').Strategy;
import Auth from '../models/Auth';
// Tus credenciales propias para la autentificacion
passport.use(
    new LocalStrategy(
        // Por default espera un E-Mail y un Password
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        async (email, password, done) => {
            try {
                const auth = await Auth.findOne({ where: { email, estado: 1 } });
                if (!auth.validarPass(password, auth.password)) {
                    return done(null, false, {
                        message: "Password incorrecto."
                    })
                }
                return done(null, auth);
            } catch (error) {
                console.log(error);
                return done(null, false, {
                    message: "Error el usuario ingresado no existe."
                })
            }
        }
    )
)

// Serializar
passport.serializeUser((auth, callback) => {
    callback(null, auth);
})

// Deserializar
passport.deserializeUser((auth, callback) => {
    callback(null, auth);
});

export default passport;