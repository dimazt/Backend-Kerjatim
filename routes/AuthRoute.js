import express from "express";
import {
    Login,
    logOut,
    Me
} from "../controllers/auth.js"
import {resetPassword, newPassword } from "../controllers/ResetPassword.js"
import { verifyToken } from "../middleware/AuthUser.js";
const router = express.Router()

router.get('/user/me', verifyToken, Me)
router.post('/auth/login', Login)
router.post('/auth/forgot-password', resetPassword)
router.post('/auth/create-new-password', newPassword)
router.delete('/auth/logout', logOut)

export default router