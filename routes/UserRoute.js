import express from "express";
import {
    getUser,
    getUserByID,
    createUser,
    updateUser,
    deleteUser,
    verifyEmail,
    changePassword
} from "../controllers/Users.js"
import { verifyToken} from "../middleware/AuthUser.js";
const router = express.Router()

// verifyToken berfungsi untuk memfilter endpoint 
// User wajib login sebelum mengakses endpoint
router.get('/users/verify-email', verifyEmail)
router.get('/users', verifyToken, getUser)
router.get('/users/:id', verifyToken, getUserByID)
router.post('/users/registration',  createUser)
router.patch('/users/:uuid/profile', verifyToken, updateUser)
router.delete('/users/:id', verifyToken, deleteUser)
router.post('/users/:uuid/change-password', verifyToken, changePassword)


export default router