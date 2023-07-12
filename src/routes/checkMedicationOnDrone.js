import { Router } from 'express';
import {getConnection}  from '../db.js';

const checkMedicationOnDrone = Router();

//Raiz
checkMedicationOnDrone.get('/check_medication_on_drone', async (req, res) => {   
    
    let params = req.body;

    console.log(params);
    let errorList = [];

    const db = await getConnection();

    await db.read();

    let {drones} = db.data;

    /*********************check dron exist ****************/
    const drone =  drones.find((item) => item.serial_number == params['drone_code']);
    if(drone == null){
        const error = {
            input: 'drone_code',
            message: 'Drone which you want loading not exist'
        };

        errorList.push(error); 
    }
    else{

    }

    if(errorList.length > 0){
        res.status(500).json(
            {
                "code": "Error",
                "details": errorList
            }
        );

        return;
    }

    res.status(200).json(
        {
            "code": "Success!",
            "value": drone['medications']
        }
    );
});

export default checkMedicationOnDrone;