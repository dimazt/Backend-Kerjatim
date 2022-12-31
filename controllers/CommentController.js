
import { responsePayload } from "../helpers/payload.js"
import Comment from "../models/CommentModel.js"
import Task from "../models/TaskModel.js"
import Users from "../models/UserModel.js"
import { Op } from 'sequelize'

export const getAllComment = async (req, res) => {
    try {
        const checkAllComment = await Comment.findAll({
            where: {
                taskId: req.params.t_id,
                deletedAt: null
            },
            include: [{
                attributes: ['name','email', 'profile_path'],
                model: Users,
                as: 'nama_user'
            }]
        })
        // if(checkAllComment.task_detail.id !== req.params.t_id) return res.status(404).json({msg : 'Task not found'})
        if (!checkAllComment) return res.status(404).json({ msg: 'Not Found' })
        responsePayload(res,200,'Berhasil menampilkan comment', {comment : checkAllComment})
    } catch (error) {
        res.status(403).json({ msg: error.message })
    }
}

export const createComment = async (req, res) => {
    const { t_id } = req.params
    //const file = req.uploadedFile;
    const { comment, file } = req.body

    try {
        const newComment = await Comment.create({
            taskId: t_id,
            comment: comment,
            file: file,
            commentParentId: 0,
            userId: req.userId
        })
        responsePayload(res,201,'Comment berhasil dibuat!', newComment)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}
export const replyComment = async (req, res) => {
    const { t_id } = req.params
    const checkComment = await Comment.findOne({
        where: {
            id: req.body.commentId,
            taskId: t_id
        }
    })
    if (!checkComment) return res.status(404).json({ msg: 'ID Not Found' })
    try {
        const comment = await Comment.create({
            taskId: t_id,
            comment: req.body.comment,
            commentParentId: req.body.commentId,
            file: req.body.file,
            userId: req.userId
        })
        responsePayload(res,201,'Comment berhasil direply!',comment)
    } catch (error) {
        res.status(403).json({ msg: error.message })
    }
}

export const deleteCommentWithReply = async (req, res) => {
    const { commentId } = req.params
    try {
        const comment = await Comment.findOne({
            where: {
                [Op.or]: [
                    { id: commentId },
                    { commentParentId: commentId }
                ]
            }
        })
        if (!comment) return responsePayload(res, 404, 'Comment not found!', '')
        await Comment.destroy({
            where: {
                [Op.or]: [
                    { id: comment.id },
                    { commentParentId: comment.id }
                ]
            }
        })
        responsePayload(res, 200, 'Comment berhasil dihapus!', '')
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
export const updateCommentar = async (req, res) => {
    const { commentId } = req.params
    try {
        const commentar = await Comment.update({
            comment: req.body.comment,
            file: req.body.file

        }, {
            where: {
                id: commentId
            }
        })
        if (!commentar) responsePayload(res, 404, 'Comment Tidak Ditemukan')
        //res.status(404).json({ msg: "Project Tidak Ditemukan" })


        //res.status(200).json({ msg: 'Nama Project Berhasil di Update' })
        responsePayload(res, 200, 'Comment Berhasil di Update')
    } catch (error) {
        res.status(403).json({ msg: error.message })
    }
}