import Label from "../models/LabelModel.js";
import Label_Task from "../models/LabelTaskModel.js";
import Task from "../models/TaskModel.js";
import { responsePayload } from "../helpers/payload.js";
import { response } from "express";


export const createLabelTask = async (req, res) => {
    let l_id = req.body.label_id
    const { tuuid } = req.params
    let labeltask
    const uniqLabel = [...new Set(l_id)];
    try {
        const inimungkintask = await Task.findOne({
            where: {
                uuid : tuuid
            },

        })
        // return res.json(uniqLabel[0])
        for (let i = 0; i < uniqLabel.length; i++) {
            labeltask = await Label_Task.findOne({
                where: {
                    taskId: inimungkintask.id,
                    labelId: uniqLabel[i]

                },

            })
            // console.log(uniqLabel[i]);
            if (!labeltask) {
                labeltask = await Label_Task.create({
                    labelId: uniqLabel[i],
                    taskId: inimungkintask.id,
                })
            }

        }
        //return res.status(201).json({ msg: 'sucsess created' })
        responsePayload(res,200,'Berhasil Membuat Label')

    } catch (error) {
        res.status(500).json({ msg: error.message })

    }

}
export const getLabelByTaskID = async (req, res) => {
    try {

        const { p_id, s_id, tuuid } = req.params

        const task = await Task.findOne({
            where: {
                uuid : tuuid,
                deletedAt: null
            },
    
        })

        if(!task){
            return  responsePayload(res, 404, 'Task Tidak Ditemukan') 

        }
 
        const labeltask = await Label_Task.findAll({
            
            where: {
                taskId: task.id,
                deletedAt: null
            },
            include:[{
                model: Label,
                as: 'label',
                attributes: ['label'],
            }],

        })
        responsePayload(res,200,'Berhasil Menampilkan Label', labeltask)

    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

export const updateLabelTask = async (req, res) => {

    const { label_id, label } = req.body
    const { p_id, tuuid } = req.params

    const task = await Task.findOne({
        where: {
            uuid : tuuid
        },

    })
    const labeltask = await Label_Task.findOne({
        where: {
            // projectId: p_id,
            // id: 1,
            labelId: label_id,
            //taskId: task.id

        }

    })
    // console.log(labeltask);
    if (!labeltask) return responsePayload(res,404,'Label Tidak Ditemukan')
    //res.status(404).json({ msg: "Label Tidak Ditemukan" })

    try {
        await Label.update({
            label: label
        }, {
            where: {
                id: labeltask.labelId
            }
        })
        return responsePayload(res,200,'Label Task Berhasil di Update')
        //res.status(200).json({ msg: 'Label  Task Berhasil di Update' })
    } catch (error) {
        res.status(403).json({ msg: error.message })
    }
}

export const deleteLabelTask = async (req, res) => {
    try {

        const { t_id, l_id } = req.params
        const labeltask = await Label_Task.destroy(
 
            {

                where: {
                    taskId: t_id,
                    labelId : l_id
                },

            })
        console.log(labeltask)
        if (!labeltask) {
           // res.status(404).json({ msg: "Label Task Tidak Ditemukan" })
           responsePayload(res,404,'Label Task Tidak Ditemukan')
        }
        else {
            //res.status(200).json({ msg: "Label Task Berhasil di Hapus" })
            responsePayload(res,200,'Label Task Berhasil di Hapus')
        }

    } catch (error) {
        res.status(403).json({ msg: error.message })
    }
}