import express from "express";
import {
    getLabel,
    // createLabel,
    // getLabelByID,
    updateLabel,
    // deleteLabel
} from "../controllers/LabelControllers.js";

import { verifyToken } from "../middleware/AuthUser.js";
const router = express.Router()

router.get('/project/:puuid/label', verifyToken, getLabel)
// router.get('/project/:p_id/label/:l_id',verifyToken, getLabelByID)
// router.post('/project/:p_id/create-label', verifyToken, createLabel)
router.patch('/label/:luuid', verifyToken,updateLabel)
// router.delete('/project/:p_id/task/:t_id/label/:l_id',verifyToken, deleteLabel)

export default router