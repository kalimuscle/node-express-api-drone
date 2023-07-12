import { Router } from 'express';
import {getConnection}  from '../db.js';

const loadMedicationOnDrone = Router();

const validateCode = (input) => {
    const regex = /^[A-Z0-9_]+$/;
    return regex.test(input);
};

const validateName = (input) => {
    const regex = /^[a-zA-Z0-9_-]+$/;
    return regex.test(input);
};

const validateBase64Image = (input) => {
    const regex = /^data:image\/(png|jpeg|jpg|gif);base64,/;
    return regex.test(input);
}

const isValidmedicationsWeigth = (drone, param) => {
    const medications = param;

    const weightPrevious =  drone.medications.reduce((total, item) => total + item['weight'], 0);

    const totalWeigthNew =  medications.reduce((total, item) => total + item['weight'], 0);

    return drone['weight_limit'] >= (weightPrevious + totalWeigthNew);
}

const updateChargeIfSameCodeMedication = (drone, param) => {
    if(drone.medications.length == 0){
        return drone;
    }
    const medications = param;

    for(let i = 0; i < medications.length; i++){
        const medication = medications[i];
        const index =  drone.medications.findIndex((item) => item['code'] == medication['code']);
    
        if(index != -1){
            drone.medications[index]['weight'] += medication['weight'];
        }
        else{
            drone = {
                ...drone,
                state: 'LOADING',
                medications: [
                    ...drone.medications, 
                    medication
                ]
            }

        }
    }

    return drone
}

const validateMedicationsFormat = (param, errorList) => {
    const medications = param;

    for(let i = 0; i < medications.length; i++){
        const item = medications[i];

        if(!('name' in item) || item['name'].trim().length == 0){
            const error = {
                medication: i,
                input: 'name',
                message: 'Required field.'
            };
    
            errorList.push(error);
        }

        if(!validateName(item['name'])){
            const error = {
                medication: i,
                input: 'name',
                message: 'Allowed only letters, numbers, -, _.'
            };
    
            errorList.push(error);
        }

        if(!('code' in item) || item['code'].trim().length == 0){
            const error = {
                medication: i,
                input: 'code',
                message: 'Required field.'
            };
    
            errorList.push(error);
        }

        if(!validateCode(item['code'])){
            const error = {
                medication: i,
                input: 'code',
                message: 'Allowed only upper case letters, underscore and numbers)'
            };
    
            errorList.push(error);
        }

        if(!('weight' in item) || isNaN(item['weight'])){
            const error = {
                medication: i,
                input: 'weigth',
                message: 'Required field.'
            };
    
            errorList.push(error);
        }

        if(!('image' in item)){
            const error = {
                medication: i,
                input: 'image',
                message: 'Required field.'
            };
    
            errorList.push(error);
        }

        if(!validateBase64Image(item['image'])){
            const error = {
                medication: i,
                input: 'image',
                message: 'Allowed only image base64 format)'
            };
    
            errorList.push(error);
        }
    }
}

//Raiz
loadMedicationOnDrone.put('/load_medication_on_drone', async (req, res) => {   
    
    const params = req.body;
    let errorList = [];

    const db = await getConnection();

    await db.read();

    let {drones} = db.data;
    let drone;

    /*********************check dron exist ****************/
    const existDrone =  drones.some((item) => item.serial_number == params['drone_code']);
    if(!existDrone){
        const error = {
            input: 'drone_code',
            message: 'Drone which you want loading not exist'
        };

        errorList.push(error); 
    }
    else{
        drone =  drones.find((item) => item.serial_number == params['drone_code']);

        const statesAccepted = ['IDLE', 'LOADING'];
        if(!statesAccepted.includes(drone.state)){
            const error = {
                input: 'state',
                message: 'Drone not idle or loading'
            };

            errorList.push(error);  
        }

        if(drone.battery_capacity <= 0.25){
            const error = {
                input: 'state',
                message: 'Drone cant be in LOADING state if battery capacity is equal or below 25%'
            };
    
            errorList.push(error);
        }

        if(!('medications' in params) || params['medications'].length == 0){
            const error = {
                input: 'medications',
                message: 'No medications for loading on drone'
            };
    
            errorList.push(error); 
        }

        if(!isValidmedicationsWeigth(drone, params['medications'])){
            const error = {
                input: 'medications',
                message: 'weigth medications exceed limit of drone.'
            };

            errorList.push(error); 
        }

        validateMedicationsFormat(params['medications'], errorList);
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
    const index = drones.findIndex((item)=> item === drone);

    drone = updateChargeIfSameCodeMedication(drone, params['medications']);

    drones[index] = drone;

    // Finally write db.data content to file
    await db.write()
    res.json(
        {
            "code": "Success!",
            "value": drone
        }
    );
});

export default loadMedicationOnDrone;