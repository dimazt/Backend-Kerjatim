import express from "express";
import {
    // getFileByID,
    // getFileByTaskID,
    addTaskFile, 
    //deleteFile,
} from "../controllers/UploadFileControllers.js";

import { verifyToken } from "../middleware/AuthUser.js";
const router = express.Router()

// router.get('/task/:t_id/file/:f_id', verifyUser, getFileByID)
// router.get('/task/:t_id',verifyUser, getFileByTaskID)
// router.delete('/task/:t_id/file/:f_id/delete-file',verifyUser, deleteFile)
router.post('/upload',verifyToken, addTaskFile)

export default router