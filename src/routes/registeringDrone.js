import { Router } from 'express';
import {getConnection}  from '../db.js';

const routerRegisterDrone = Router();

//Raiz
routerRegisterDrone.post('/registering_drone', async (req, res) => {   
    
    let params = req.body;
    let errorList = [];

    const db = await getConnection();

    await db.read();

    let {drones} = db.data;

    /********** Validation seria_number **** */

    if (!('serial_number' in params) || params['serial_number'].trim().length == 0) {
        const error = {
            input: 'serial_number',
            message: 'Required field.'
        };

        errorList.push(error);
    }

    if(params['serial_number'].trim().length > 100){
        const error = {
            input: 'serial_number',
            message: 'Field exceed max long of 100 characters.'
        };

        errorList.push(error);
    }

    const existItem =  drones.some((item) => item.serial_number == params['serial_number']);
    if(existItem){
        const error = {
            input: 'serial_number',
            message: 'Item exist in database'
        };

        errorList.push(error); 

        console.log(error)
    }

    /********** Validation model **** */

    if (!('model' in params) || params['model'].trim().length == 0) {
        const error = {
            input: 'model',
            message: 'Required field.'
        };

        errorList.push(error);
    }

    const modelValues = ['Lightweight', 'Middleweight', 'Cruiserweight', 'Heavyweight'];

    if(!modelValues.includes(params['model'])){
        const error = {
            input: 'model',
            message: 'Value is not correct. Must be Lightweight, Middleweight, Cruiserweight or Heavyweight'
        };

        errorList.push(error);
    }

    /********** Validation weight_limit **** */

    if (!('weight_limit' in params) || isNaN( params['weight_limit'])) {
        const error = {
            input: 'weight_limit',
            message: 'Required field.'
        };

        errorList.push(error);
    }

    if (params['weight_limit'] <= 0) {
        const error = {
            input: 'weight_limit',
            message: 'Field must be greater than 0.'
        };

        errorList.push(error);
    }

    if(params['weight_limit'] > 500){
        const error = {
            input: 'weight_limit',
            message: 'Field exceed max value of 500.'
        };

        errorList.push(error);
    }

    /********** Validation battery_capacity **** */

    if (!('battery_capacity' in params) || isNaN( params['battery_capacity'])) {
        const error = {
            input: 'battery_capacity',
            message: 'Required field.'
        };

        errorList.push(error);
    }

    if(params['battery_capacity'] < 0 || params['battery_capacity'] > 1  ){
        const error = {
            input: 'battery_capacity',
            message: 'Field must be between 0 and 1.'
        };

        errorList.push(error);
    }

    /********** Validation state **** */

    if (!('state' in params) || params['state'].trim().length == 0) {
        const error = {
            input: 'state',
            message: 'Required field.'
        };

        errorList.push(error);
    }

    const statelValues = ['IDLE', 'LOADING', 'LOADED', 'DELIVERING', 'DELIVERED', 'RETURNING'];

    if(!statelValues.includes(params['state'])){
        const error = {
            input: 'state',
            message: 'Value is not correct. Must be IDLE, LOADING, LOADED, DELIVERING, DELIVERED or RETURNING'
        };

        errorList.push(error);
    }

    if(params['state'] == statelValues[1] && params['battery_capacity'] <= 0.25){
        const error = {
            input: 'state',
            message: 'Drone cant be in LOADING state if battery capacity is equal or below 25%'
        };

        errorList.push(error);
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

    params = {
        ...params,
        medications: []
    };

    drones.push(params);

    await db.write();
    res.status(201).json(
        {
            "code": "Success!",
            "value": params
        }
    );
});

export default routerRegisterDrone;