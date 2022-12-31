import express from "express";
import {
    getSection,
    createSection,
    getSectionByID,
    updateSection,
    deleteSection
} from "../controllers/SectionControllers.js";

import { verifyToken } from "../middleware/AuthUser.js";
const router = express.Router()

router.get('/project/:puuid/section', verifyToken, getSection)
router.get('/project/:puuid/section/:suuid',verifyToken, getSectionByID)
router.post('/project/:puuid/create-section', verifyToken, createSection)
router.patch('/project/:puuid/section/:suuid', verifyToken,updateSection)
router.delete('/project/section/:suuid',verifyToken, deleteSection)

export default router