import express from "express";
import { 
    createFeedback, getFeedback, getFeedbackByUserId, 
    // deleteCommentWithReply, 
    // getAllComment, 
    // replyComment 
} from "../controllers/FeedbackController.js";
import { 
    verifyToken 
} from "../middleware/AuthUser.js";


const router = express.Router()

router.get('/feedback', verifyToken, getFeedback)
router.get('/feedback/:u_id', verifyToken, getFeedbackByUserId)
router.post('/feedback/:u_id', verifyToken,  createFeedback)
// router.post('/comment/reply/:t_id', verifyToken, replyComment)
// router.delete('/comment/:commentId', verifyToken, deleteCommentWithReply)
export default router