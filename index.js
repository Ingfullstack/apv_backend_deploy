import express from "express";
import veterinarioRoutes from './routes/veterinarioRoutes.js'
import pacienteRoutes from './routes/pacienteRoutes.js';
import { conectarDB } from "./config/db.js";
import 'dotenv/config'
import colors from 'colors'
import cors from 'cors';

const app = express();

app.use(express.json());

conectarDB();

//dominiosPermitidos
const dominiosPermitidos = [process.env.FRONTEND_URL];
const corsOptions = {
    origin: function (origin, callback) {
        if (dominiosPermitidos.indexOf(origin) !== -1) {
          callback(null, true)
        } else {
          callback(new Error('No Permitido Por Cors'))
        }
      }
};

app.use(cors(corsOptions))

//Routing
app.use('/api/veterinarios', veterinarioRoutes );
app.use('/api/pacientes', pacienteRoutes );

const PORT = process.env.PORT || 4000;
app.listen( PORT, () => {
    console.log(colors.cyan.bold(`Servidor Funcionando en el puerto: ${ PORT }`))
})