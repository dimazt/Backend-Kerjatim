import express from "express";
import {
    // getLabel,
    createLabelTask,
    getLabelByTaskID,
    updateLabelTask,
    deleteLabelTask
} from "../controllers/LabelTaskController.js";

import { verifyToken } from "../middleware/AuthUser.js";
const router = express.Router()

// router.get('/project/:p_id/section/:s_id/task', verifyToken, getTask)
router.get('/task/:tuuid/label-task',verifyToken, getLabelByTaskID)
router.post('/task/:tuuid/create-label-task', verifyToken, createLabelTask)
router.patch('/task/:tuuid', verifyToken,updateLabelTask)
router.delete('/task/:t_id/label/:l_id',verifyToken, deleteLabelTask)
export default router