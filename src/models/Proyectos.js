import db from '../config/db';
import slug from 'slug';
import shortid from 'shortid';

const Sequelize = require('sequelize');

const Proyecto = db.define("upTask", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: Sequelize.STRING(100),
    },
    url: Sequelize.STRING,
}, {
    hooks: {
        beforeCreate(data) {
            const url = slug(data.nombre);
            data.url = `${url}-${shortid.generate()}`;
        }
    }
});

export default Proyecto;