import db from '../config/db';
import Sequelize from 'sequelize';
import Proyectos from './Proyectos';

const Tareas = db.define('Tarea', {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: Sequelize.STRING(100),
    estado: Sequelize.INTEGER,
});

Tareas.belongsTo(Proyectos);

export default Tareas;