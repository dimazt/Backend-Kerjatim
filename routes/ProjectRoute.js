import express from "express";
import { getMembersOnProject } from "../controllers/AssignedController.js";
import {
    getProject,
    createProject,
    getProjectByID,
    updateProject,
    joinProjectByCode,
    projectPin,
    findProjectByCode,
    joinProjectByEmail,
    deleteProject,
    deleteMemberOnProject
} from "../controllers/ProjectControllers.js";

import { verifyToken } from "../middleware/AuthUser.js";
import { checkMemberWorkspace, checkMemberWorkspaceById, ownerOnly } from "../middleware/CheckMembers.js";
import { checkTypeUserForInvitedProject, checkTypeUserForProject } from "../middleware/CheckTypeUser.js";
const router = express.Router()

router.get('/workspace/:wuuid/project', verifyToken,checkMemberWorkspaceById, getProject)
router.get('/workspace/:wuuid/project/:puuid',verifyToken, getProjectByID)
router.post('/workspace/:wuuid/create-project', verifyToken,checkTypeUserForProject, createProject)
router.patch('/workspace/project/:puuid', verifyToken,updateProject)
router.post('/join-project/:code', verifyToken,joinProjectByCode)
router.post('/project/:puuid/pin', verifyToken, projectPin)
router.get('/find-project/:code', verifyToken,findProjectByCode)
router.post('/join-project-email/:code', verifyToken,checkTypeUserForInvitedProject,joinProjectByEmail)
router.delete('/workspace/:wuuid/project/:puuid',verifyToken,ownerOnly, deleteProject)
router.delete('/project/:puuid/delete-members/:memid',verifyToken,ownerOnly, deleteMemberOnProject)

// router.delete('/user/workspace/:id',verifyToken, deleteWorkspace)

export default router