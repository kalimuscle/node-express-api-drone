import { Router } from 'express';
import {getDatabase}  from '../db.js';

const router = Router();

//Raiz
router.get('/', (req, res) => {    
    res.json(
        {
            "Title": "Hola mundo usando rutas!"
        }
    );
});

export default router;