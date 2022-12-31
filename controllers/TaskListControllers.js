import TaskList from "../models/TaskListModel.js";
import Task from "../models/TaskModel.js";
import { responsePayload } from "../helpers/payload.js"

export const getTaskList = async (req, res) => {
    try {
        //  let response
        const { tuuid } = req.params
        const task = await Task.findOne({
            where: {
                uuid: tuuid
            },
        })
        const response = await TaskList.findAll({
            // attributes = ?
            where: {
                taskId: task.id
            },

        })
        //res.status(201).json({ response })
        //console.log(tuuid)
        //console.log(response);
        responsePayload(res, 201, 'Berhasil Menampilkan Task List', { task_list: response })
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

export const createTaskList = async (req, res) => {
    try {
        const { task_list, taskId } = req.body
        // console.log(tittle)
        const task = await Task.findOne({
            where: {
                uuid: req.params.tuuid
                // project_name : req.userId
            }
        })
        //console.log(task);
        if (!task) return responsePayload(res, 404, 'Task tidak ditemukan!')

        const taskList = await TaskList.create({
            task_list: task_list,
            taskId: task.id,


        })
        responsePayload(res, 201, 'Berhasil Membuat Task List', { task_list: task_list, uuid : taskList.uuid })
        //res.status(201).json({ msg: `Task List ${task_list} Created Successfuly!` })
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

export const getTaskListById = async (req, res) => {
    try {

        const { p_id, s_id, t_id, tluuid } = req.params
        const tasklist = await TaskList.findOne({
            where: {
                uuid: tluuid

            },

        })
        if (!tasklist) {
            //res.status(404).json({ msg: "Task List Tidak Ditemukan" })
            responsePayload(res, 404, 'Task List  Tidak Ditemukan')
        } else { 
            responsePayload(res, 201, 'Berhasil Menampilkan Task List', { task_list: tasklist })
        }

    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}
export const statusTaskList = async (req, res) => {
    try {

        const { tluuid } = req.params
        const checkTasklist = await TaskList.findOne({
            where: {
                
                uuid: tluuid
            },
        })
        if (!checkTasklist)
        {
            return responsePayload(res, 404, 'Task List Tidak Ditemukan') 
        }
        const tasklist = await TaskList.update({
            status: req.body.status
        }, {
            where: {
                uuid: tluuid
            },
        })
        // console.log(req.body.status)
        // if (!tasklist) {
        //     //res.status(404).json({ msg: "Task List Tidak Ditemukan" })
        //     responsePayload(res, 404, 'Task List Tidak Ditemukan')
        // } else { 
        //     // res.status(200).json(req.body.status) 
        //     responsePayload(res, 201, 'Task List Selesai')
        // }
        if (req.body.status == 1){
            return responsePayload(res, 200, 'Task List Sudah Dikerjakan', req.body.status)
        }else if (req.body.status == 0){
            return responsePayload(res, 200, 'Task List Belum Dikerjakan', req.body.status)

        }


    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}


export const updateTaskList = async (req, res) => {

    const { task_list } = req.body
    const { tluuid } = req.params
    //console.log(req.params)
    const tasklist = await TaskList.findOne({
        where: {
            // projectId: p_id,
            uuid: tluuid
        },
    })


    if (!tasklist) responsePayload(res, 404, 'Task List Tidak Ditemukan')
    //res.status(404).json({ msg: "Task List Tidak Ditemukan" })
    try {
        await TaskList.update({
            task_list

        }, {
            where: {
                uuid: tluuid
            }
        });

        //res.status(200).json({ msg: 'Task list Berhasil di Update' })
        responsePayload(res, 200, 'Task list Berhasil di Update' , { task_list: tasklist })
    } catch (error) {
        res.status(403).json({ msg: error.message })
    }
}

export const deleteTaskList = async (req, res) => {
    try {
        // res.status(200).json({msg: 'Task Berhasil di Hapus'})
        //const { task_list } = req.body
        const { tluuid } = req.params
        //console.log(req.params)
        const tasklist = await TaskList.destroy({

            where: {
                // projectId: p_id,
                uuid: tluuid
            },

        })
        if (!tasklist) {
            //res.status(404).json({ msg: "Task List Tidak Ditemukan" })
            responsePayload(res, 404, 'Task List Tidak Ditemukan')
        }
        else {
            //res.status(200).json({ msg: 'Task List Berhasil di Hapus' })
            responsePayload(res, 200, 'Task list Berhasil di Hapus')
        }

    } catch (error) {
        // res.status(403).json({msg: error.message})
    }
}
