import FeedbackModel from "../models/FeedbackModel.js"
import { responsePayload } from "../helpers/payload.js";
import Users from "../models/UserModel.js";
import Feedback from "../models/FeedbackModel.js";



export const createFeedback = async (req, res) => {

    try {
        const { feedback } = req.body
        const { u_id } = req.params

        const createFeedback = await Feedback.create({
            feedback: feedback,
            userId: u_id

        })
        responsePayload(res, 201, 'Berhasil Membuat Feedback', createFeedback)
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}

export const getFeedback = async (req, res) => {
    try {

        const { u_id } = req.params
        const response = await Feedback.findAll({
            attributes: ['userId', 'feedback', 'updatedAt' ],
   
        })

        responsePayload(res, 200, 'Berhasil Menampilkan Feedback', response)

    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

export const getFeedbackByUserId = async (req, res) => {
    try {

        const { p_id, s_id, u_id } = req.params

 
        const feedback = await Feedback.findAll({
            
            where: {
                userId : u_id 
            },
            attributes: ['userId', 'feedback', 'updatedAt' ]

        })
        // responsePayload(res,200,'Berhasil Menampilkan Feedback', feedback)

        if (feedback === undefined || feedback.length == 0) {
            return responsePayload(res,404,'Tidak ada feedback')
        }else{
            return responsePayload(res,200,'Berhasil Menampilkan Feedback', feedback)
        }

    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}