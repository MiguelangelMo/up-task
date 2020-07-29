import Tareas from '../models/Tareas';
import Proyectos from '../models/Proyectos';

export const agregarTarea = async (req, res, next) => {
    const { tarea } = req.body;
    try {
        const proyectos = await Proyectos.findOne({ where: { url: req.params.url } });
        if (tarea && tarea.length > 0) {
            const tareas = await Tareas.create({ nombre: tarea, estado: false, upTaskId: proyectos.id });
            if (!tareas) return next();
            //res.status(200).send("Se ha agregado correctamente")
            res.redirect(`/pyt/${req.params.url}`);
        }
    } catch (error) {
        console.log(error);
        res.status(400).send("Se ha roto algo");
    }
}

export const updateEstado = async (req, res, next) => {
    try {
        const tarea = await Tareas.findOne({ id: req.params.id });
        let estado = 0;
        if (tarea.estado === estado) estado = 1;
        tarea.estado = estado;
        const tareas = await tarea.save();
        if (!tareas) return next();
        res.status(200).send('Todo bien!')

    } catch (error) {
        console.log(error);
    }
}

export const deleteTarea = async (req, res,) => {

    try {
        const tarea = await Tareas.destroy({ where: { id: req.params.id } });
        if (!tarea) return next();
        res.status(200).send("Todo bien");
    } catch (error) {
        console.log(error);
    }
}