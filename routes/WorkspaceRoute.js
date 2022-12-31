import express from "express";
import {
    getWorkspace,
    getWorkspaceByID,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    joinWorkspaceByCode,
    joinWorkspaceByEmail,
    findWorkspaceByCode,
    deleteMemberOnWorkspace
} from "../controllers/WorkspaceController.js"
import {verifyToken, verifyUser} from "../middleware/AuthUser.js";
import { checkMemberWorkspace, checkMemberWorkspaceById, ownerOnly } from "../middleware/CheckMembers.js";
import { checkTypeUserForInvitedWorkspace, checkTypeUserForWorkspace } from "../middleware/CheckTypeUser.js";
const router = express.Router()

router.get('/workspace', verifyToken,checkMemberWorkspace, getWorkspace)
router.get('/workspace/:wuuid',verifyToken, checkMemberWorkspaceById,getWorkspaceByID)
router.post('/workspace', verifyToken, checkTypeUserForWorkspace, createWorkspace)
router.patch('/workspace/:wuuid', verifyToken, ownerOnly,updateWorkspace)
// router.delete('/workspace/:wuuid',ownerOnly,verifyToken, deleteWorkspace)

// router.post('/join-workspace/:code', verifyToken,joinWorkspaceByCode)
// router.get('/find-workspace/:code', verifyToken,findWorkspaceByCode)

router.delete('/workspace/:wuuid',verifyToken,ownerOnly, deleteWorkspace)
router.delete('/workspace/:wuuid/delete-members/:memid',verifyToken,ownerOnly, deleteMemberOnWorkspace)

router.post('/join-workspace/:code', verifyToken,joinWorkspaceByCode)
router.get('/find-workspace/:code', verifyToken,findWorkspaceByCode)
router.post('/join-workspace-email/:code', verifyToken,checkTypeUserForInvitedWorkspace,joinWorkspaceByEmail)
export default router