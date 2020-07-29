import express from 'express';
import {
    saludar,
    newProject,
    addProject,
    obtenerProyecto,
    getUpdateProject,
    updateProject,
    updateProyecto,
    eliminarProyecto,
} from '../controller/projectController';
import {
    agregarTarea,
    updateEstado,
    deleteTarea,
} from '../controller/tareaController';
import {
    authView,
    sesion,
    create_sesion,
    inciar_sesion,
    authAuthentification,
    cerrarSesion,
    restablecerPassword,
    restablecerPasswordPost,
    restablecerToken,
    restablecerTokenReset,
    changeEstadoCuenta,
} from '../controller/authController';
import { check } from 'express-validator'
const route = express.Router();

// Proyectos
route.get('/', authAuthentification, saludar);
route.get('/new-project', authAuthentification, newProject);
route.post('/add-project',
    authAuthentification,
    [
        check("agregarproject", "Este valor no puede estar en blanco").not().isEmpty().trim().escape(),
    ],
    addProject);
route.get('/pyt/:url', authAuthentification, obtenerProyecto);
route.delete('/pyt/:url', authAuthentification, eliminarProyecto);
route.get('/getUpdateProject/:id', authAuthentification, getUpdateProject)
route.put('/update-project',
    authAuthentification,
    [
        check("newName", "Este valor no puede estar en blanco").not().isEmpty().trim().escape(),
    ],
    updateProject
)
route.post('/add-project/:id',
    authAuthentification,
    [
        check("agregarproject", "Este valor no puede estar en blanco").not().isEmpty().trim().escape(),
    ],
    updateProyecto);

// Tarea
route.post('/pyt/:url',
    authAuthentification,
    [
        check("tarea", "Este campo no se permite quedar  vacio").not().isEmpty().escape()
    ],
    agregarTarea);
route.patch('/pyt/:id', authAuthentification, updateEstado);
route.delete('/tarea/:id', authAuthentification, deleteTarea);

// Auth
route.get('/auth', authView);
route.post('/auth', create_sesion);
route.get('/login', sesion);
route.post('/login', inciar_sesion);
route.get('/cerrar_sesion', cerrarSesion);
route.get('/restablecer', restablecerPassword);
route.post('/restablecer', restablecerPasswordPost);
route.get('/restablecer/:token', restablecerToken);
route.post('/restablecer/:token', restablecerTokenReset);
route.get('/confirmar/:estado', changeEstadoCuenta);

export default route;