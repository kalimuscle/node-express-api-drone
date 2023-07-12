import express from 'express';
const app = express();
import morgan from 'morgan';
import routerRegisterDrone from './routes/registeringDrone.js';
import loadMedicationOnDrone from './routes/loadMedicationOnDrone.js';
import checkMedicationOnDrone from './routes/checkMedicationOnDrone.js';
import droneForLoading from './routes/droneForLoading.js';
import checkDroneBattery from './routes/checkDroneBattery.js';
import { logDroneBatteryLevels  } from './logDronesbattery.js';

import {createConnection}  from './db.js';

createConnection();

  
  
const intervalInMinutes = 0.1;
setInterval(logDroneBatteryLevels, intervalInMinutes * 60 * 1000);

//Configuraciones
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2)
 
//Middleware
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use(routerRegisterDrone);
app.use(loadMedicationOnDrone);
app.use(checkMedicationOnDrone);
app.use(droneForLoading);
app.use(checkDroneBattery);
 
//Iniciando el servidor
app.listen(app.get('port'),()=>{
    console.log(`Server listening on port ${app.get('port')}`);
});