import express from "express";
import {
    getTaskList,
    createTaskList,
    getTaskListById,
    updateTaskList,
    deleteTaskList,
    statusTaskList
} from "../controllers/TaskListControllers.js";

import { verifyToken } from "../middleware/AuthUser.js";
const router = express.Router()

router.get('/task/:tuuid/task-list', verifyToken, getTaskList)
router.get('/task/:tuuid/task-list/:tluuid',verifyToken, getTaskListById)
router.post('/task/:tuuid/create-task-list', verifyToken, createTaskList)
router.patch('/task/:tuuid/task-list/:tluuid', verifyToken,updateTaskList)
router.delete('/task/:tuuid/task-list/:tluuid',verifyToken, deleteTaskList)
router.post('/task-list/:tluuid/status', verifyToken, statusTaskList)

export default router