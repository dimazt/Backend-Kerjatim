import express from "express";
import { createComment, deleteCommentWithReply, getAllComment, replyComment, updateCommentar } from "../controllers/CommentController.js";
import { verifyToken } from "../middleware/AuthUser.js";
//import { addTaskFile } from "../middleware/FileUpload.js";

const router = express.Router()

// router.get('/project/:s_id/task', verifyToken, getTask)
router.get('/comment/:t_id', verifyToken, getAllComment)
router.post('/comment/:t_id', verifyToken,  createComment)
router.post('/comment/reply/:t_id', verifyToken, replyComment)
router.patch('/edit-comment/:commentId', verifyToken, updateCommentar)
router.delete('/comment/:commentId', verifyToken, deleteCommentWithReply)
export default router