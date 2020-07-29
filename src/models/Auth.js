import db from '../config/db';
import Sequelize from 'sequelize';
import Proyectos from './Proyectos';
import { hashSync, genSaltSync, compareSync } from 'bcrypt-nodejs';

const Auth = db.define(('auth'), {
    id: {
        type: Sequelize.INTEGER(5),
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: Sequelize.STRING(60),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: "No es un email valido",
            },
            notEmpty: {
                msg: "Este campo no puede ir vacio"
            },
        },
        unique: {
            args: true,
            msg: "Usuario ya registrado",
        }
    },
    password: {
        type: Sequelize.STRING(60),
        validate: {
            notEmpty: {
                msg: "Este campo no puede ir vacio"
            }
        }
    },
    estado: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    token: Sequelize.STRING,
    expiracion: Sequelize.DATE,
}, {
    hooks: {
        beforeCreate(auth) {
            auth.password = hashSync(auth.password, genSaltSync(10));
        },
    }
});

Auth.prototype.validarPass = (password, passwordbd) => {
    return compareSync(password, passwordbd);
}

Auth.hasMany(Proyectos);

export default Auth;