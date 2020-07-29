import express from 'express';
import ProjectRoute from './route/ProjectRoute';
import path from 'path';
import bodyparser from 'body-parser';
import cookie from 'cookie-parser';
import sesion from 'express-session';
import passport from './config/passport';
import flash from 'connect-flash';
// util
import { var_dump } from './util/varDump';
// Conexion a la DB
import db from './config/db';
import './models/Proyectos';
import './models/Tareas';
import './models/Auth';
db.sync()
    .then(() => console.log("Ha conectado correctamente"))
    .catch(error => console.log(error));
const obkect = { carro: "rum rum", puerta: 'plus plks' };
const app = express();
//app.use(express.json({ extended: true }));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use(cookie());
app.use(sesion({
    secret: 'itachi',
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
    res.locals.message = req.flash();
    res.locals.users = { ...req.user } || null;
    next();
});
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './view'));
app.use('/', ProjectRoute);
app.use('/new-project', ProjectRoute);
app.use('/pyt/:url', ProjectRoute);

app.listen(4000);