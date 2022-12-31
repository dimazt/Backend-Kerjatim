import express from "express";
import {
    getTask,
    createTask,
    getTaskByID,
    updateTask,
    deleteTask
 
} from "../controllers/TaskControllers.js";

import { verifyToken } from "../middleware/AuthUser.js";
const router = express.Router()


router.get('/section/:suuid/task', verifyToken, getTask)
router.get('/section/task/:tuuid',verifyToken, getTaskByID)
router.post('/section/:suuid/create-task', verifyToken, createTask)
router.patch('/section/task/:tuuid', verifyToken,updateTask)
router.delete('/task/:t_id',verifyToken, deleteTask)


export default router