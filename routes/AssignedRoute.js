import express from 'express'
import { addAssignedToTask, deleteAssigned, getMembersOnProject } from '../controllers/AssignedController.js'
import { verifyToken } from '../middleware/AuthUser.js'

const router = express.Router()

router.get('/members/:t_id', getMembersOnProject)
router.post('/task-assigned/:tuuid',verifyToken,addAssignedToTask)
router.delete('/task/:t_id/projectMemberId/:p_id',verifyToken, deleteAssigned)


export default router