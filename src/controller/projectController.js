import { var_dump } from '../util/varDump';
import { text } from '../util/campoTxt';
import { ValidationError } from 'express-validator';
import Proyecto from '../models/Proyectos';
import Tareas from '../models/Tareas';

export const saludar = async (req, res) => {
    console.log(res.locals.users)
    const proyecto = await Proyecto.findAll({ where: { authId: res.locals.users.id } });
    res.render('index', {
        title: "Actividades - By Miguelangel Molero",
        var_dump,
        proyecto
    })
}

export const newProject = async (req, res) => {
    const proyecto = await Proyecto.findAll({ where: { authId: res.locals.users.id } });
    res.render('new-project', {
        title: "Nueva Actividad",
        proyecto,
    })
}

export const addProject = async (req, res) => {
    let errores = [];
    const { agregarproject } = req.body;
    const proyecto = await Proyecto.findAll({ where: { authId: res.locals.users.id } });

    if (agregarproject.length < 1 || typeof (agregarproject) === 'undefined' || !text.test(agregarproject)) {
        errores.push({ "error": "Este campo no es correcto" });
        res.render('new-project', {
            title: "Nueva Actividad",
            errores,
            proyecto
        });
    } else {
        const idUser = res.locals.users.id;
        const proyecto = await Proyecto.create({ nombre: agregarproject, authId: idUser });
        if (!proyecto) {
            let errores = [];
            errores.push({ "error": "Error, ha ocurrido un problema al insertar" });
            res.render('index', {
                errores,
                proyecto
            });
            res.redirect('/');
        } else res.redirect('/');
    }
}

export const obtenerProyecto = async (req, res, next) => {
    const proyectoPromise = Proyecto.findAll({ where: { authId: res.locals.users.id } });
    const proyectosPromise = Proyecto.findOne({
        where: {
            url: req.params.url
        },
    });

    const [proyecto, proyectos] = await Promise.all([proyectoPromise, proyectosPromise]);
    const tarea = await Tareas.findAll({
        where: { upTaskId: proyectos.id },
        // include: [{
        //     model: Proyecto
        // }]
    });

    if (!proyecto) return next();

    res.render('tarea', {
        task: 'Tarea en Proceso',
        proyecto,
        proyectos,
        tarea,
    });
}

export const updateProject = async (req, res) => {
    //const {newName} = req.body;
}

export const getUpdateProject = async (req, res) => {

    const proyectoPromise = Proyecto.findAll({ where: { authId: res.locals.users.id } });
    const proyectosPromise = Proyecto.findOne({ where: { id: req.params.id } });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise])

    console.log(proyecto.nombre)
    res.render('new-project', {
        name: 'Editar Proyecto',
        proyectos,
        proyecto,
    });
}

export const updateProyecto = async (req, res) => {
    let errores = [];
    const { agregarproject } = req.body;
    console.log(agregarproject)
    const proyecto = await Proyecto.findAll({ where: { authId: res.locals.users.id } });

    if (agregarproject.length < 1 || typeof (agregarproject) === 'undefined' || !text.test(agregarproject)) {
        errores.push({ "error": "Este campo no es correcto" });
        res.render('new-project', {
            title: "Nueva Actividad",
            errores,
            proyecto
        });
    } else {
        const proyecto = await Proyecto.update(
            { nombre: agregarproject },
            { where: { id: req.params.id } }
        );
        if (!proyecto) {
            let errores = [];
            errores.push({ "error": "Error, ha ocurrido un problema al insertar" });
            res.render('index', {
                errores,
                proyecto
            });
            res.redirect('/');
        } else res.redirect('/');
    }
}

export const eliminarProyecto = async (req, res, next) => {
    const { btnEliminar } = req.query
    let proyecto = await Proyecto.destroy({ where: { url: btnEliminar } });
    if (!proyecto) return next();
    res.status(200).send("Tu actividad ha sido eliminada");
}