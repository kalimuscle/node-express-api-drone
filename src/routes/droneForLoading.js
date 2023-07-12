import { Router } from 'express';
import {getConnection}  from '../db.js';

const droneForLoading = Router();

//Raiz
droneForLoading.get('/drones_for_loading', async (req, res) => {   
    
    let params = req.body;

    console.log(params);
    let errorList = [];

    const db = await getConnection();

    await db.read();

    let {drones} = db.data;

    /*********************check dron exist ****************/
    drones =  drones.filter((item) => (
                                        item['battery_capacity'] > 0.25 && 
                                        item['weight_limit'] > item['medications'].reduce((total, item) => total + item['weight'], 0) &&
                                        (
                                            item['state'] == 'IDLE' || 
                                            item['state'] == 'LOADING'
                                        ))
                                    );
    
    res.status(200).json(
        {
            "code": "Success!",
            "value": drones
        }
    );
});

export default droneForLoading;