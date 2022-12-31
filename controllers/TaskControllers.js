
import Sections from "../models/SectionsModel.js";
import Task from "../models/TaskModel.js";
import { responsePayload } from "../helpers/payload.js"
import TaskList from "../models/TaskListModel.js";
import Label_Task from "../models/LabelTaskModel.js";
import Assigned from "../models/AssignedModel.js";
import ProjectMembers from "../models/MemberProjectModel.js";
import Members from "../models/MembersModel.js";
import Label from "../models/LabelModel.js";
import db from "../config/database.js";
import Comment from "../models/CommentModel.js";
import Users from "../models/UserModel.js";


export const getTask = async (req, res) => {
    try {
        let response
        const { suuid } = req.params
        const section = await Sections.findOne({
            // attributes = ?
            where: {
                uuid: suuid,
                deletedAt: null
            },

        })
        response = await Task.findAll({
            // attributes = ?
            where: {
                sectionId: section.id
            }, include: [
                {
                    model: Sections,
                    as: 'sections',
                    attributes: ['project_status']
                }
            ]
        })
        responsePayload(res, 201, 'Berhasil Menampilkan Task', response)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

export const createTask = async (req, res) => {
    try {
        const { tittle, priority, descriptions, start_date, due_date, completed_date, label_id, member_id, task_list, sectionId } = req.body
        const t = await db.transaction();
        const section = await Sections.findOne({
            where: {
                uuid: req.params.suuid
            }
        })


        if (!section) return responsePayload(res, 404, 'Section tidak ditemukan!')
        if (member_id.length) {
            const checkMembers = await ProjectMembers.findOne({
                attributes: ['id', 'role'],
                where: {
                    memberId: member_id
                },
                include: [{
                    model: Members,
                    as: 'members',
                    attributes: ['id', 'userId']
                }]
            })
            if (!checkMembers) return responsePayload(res, 404, 'Data Member Salah Pada Assigned!')
        //     member_id.forEach(async function (data, index) {
        //         const addAssigned = await Assigned.create({
        //             taskId: task.id,
        //             projectMemberId: checkMembers.members.userId

        //         })
        //     }, { transaction: t });
        }
        label_id.forEach(async function (data, index) {

            const labeltask = await Label_Task.findOne({
                where: {
                    labelId: data

                }
            })
            if (!labeltask) return responsePayload(res, 404, 'Label Tidak Ditemukan')
            // if(labeltask) return responsePayload(res, 404, 'Label Sudah Digunakan')
        });

        const task = await Task.create({
            tittle: tittle,
            priority: priority,
            descriptions: descriptions,
            start_date: start_date,
            due_date: due_date,
            completed_date: completed_date,
            userId: req.userId,
            updatedBy: req.userId,
            sectionId: section.id

        }, { transaction: t })
        label_id.forEach(async function (data, index) {

            const labeltask = await Label_Task.create({
                labelId: data,
                taskId: task.id

            })
        }, { transaction: t });

        member_id.forEach(async function (data, index) {
            const addAssigned = await Assigned.create({
                taskId: task.id,
                projectMemberId: data

            })
        }, { transaction: t });
    
        task_list.forEach(async function (data, index) {

            const taskList = await TaskList.create({
                task_list: data,
                taskId: task.id,

            })
        }, { transaction: t });

        // const taskList = await TaskList.create({
        // task_list: task_list,
        // taskId: task.id,


        // }, { transaction: t })

        await t.commit()
        return responsePayload(res, 201, 'Berhasil Membuat Task', { task: task })
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}

export const getTaskByID = async (req, res) => {
    try {

        const { p_id, s_id, tuuid } = req.params
        const task = await Task.findOne({
            where: {
                uuid: tuuid
            }, include: [
                {
                    model: Sections,
                    as: 'sections',
                    attributes: ['project_status']
                }
            ]


        })
        const labeltask = await Label_Task.findAll({
            attributes: ['labelId'],
            include: [{
                model: Label,
                as: 'label',
                attributes: ['id', 'label'],
            }],
            where: {
                taskId: task.id

            },

        })
        const assigned = await Assigned.findAll({
            attributes: ['projectMemberId'],
            include: [{
                model: ProjectMembers,
                as: 'detailMembersAsigned',
                attributes: ['memberId', 'role'],
                include: [{
                    model : Members,
                    as: 'members',
                    attributes: ['userId'],
                    include: [{
                        model : Users,
                        as : 'detail_members',
                        attributes: ['name', 'profile_path']
                        

                    }]
                }]
            }],
            where: {
                taskId: task.id

            },

        })
        if (!task) {
            responsePayload(res, 404, 'Task Tidak Ditemukan')
            //res.status(404).json({ msg: "Task Tidak Ditemukan" })
        } else {
            //res.status(200).json(task) 
            const userTask = await Users.findOne({
                attributes: ['id', 'name'],
                where: {
                    id: task.userId
                }
            });
            const taskUpdated = await Users.findOne({
                attributes: ['id', 'name'],
                where: {
                    id: task.updatedBy
                }
            });

            
            responsePayload(res, 200, 'Berhasil Menampilkan Task', { task: task, labeltask, assigned,
                createdBy : {
                    id: userTask.id,
                    name: userTask.name,
                    at: task.createdAt
                },
                updatedBy: {
                    id: taskUpdated.id,
                    name: taskUpdated.name,
                    at: task.updatedAt

                }
            })
        }


    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

export const updateTask = async (req, res) => {

    const { tittle, priority, descriptions, start_date, due_date, completed_date, label_id, memberId, task_list, sectionId } = req.body
    const { p_id, s_id, tuuid } = req.params

    //console.log(req.params)
    const task = await Task.findOne({
        where: {
            uuid: tuuid
        },
    })

    if (!task) responsePayload(res, 404, 'Task Tidak Ditemukan')
    try {

        const section = await Sections.findOne({
            where: {
                id: task.sectionId,
            }
        });

        const sectionDone = await Sections.findOne({
            where: {
                projectId: section.projectId,
                project_status: "done"
            }
        })
         task.set({
            tittle, priority, descriptions, start_date, due_date, completed_date, sectionId, updatedBy: req.userId

        })

        if (label_id.length) {
            label_id.forEach(async function (data, index) {

                const label = await Label_Task.findOne({
                    where: {
                        labelId: data,
                        taskId: task.id

                    }
                })
                if (!label) {
                    const labeltask = await Label_Task.create({
                        labelId: data,
                        taskId: task.id

                    })
                }
            });

        }

        if (task_list.length) {
            task_list.forEach(async function (data, index){
                const tasklist = await TaskList.findOne({
                    where: {
                        task_list: data,
                        taskId: task.id
    
                    }
                })
    
                if (!tasklist) {
                    const labeltask = await TaskList.create({
                        task_list: data,
                        taskId: task.id
    
                    })
                }

            })
            

        }

        if (memberId.length) {
            memberId.forEach(async function (data, index) {
                const checkMembers = await ProjectMembers.findOne({
                    attributes: ['id', 'role'],
                    where: {
                        memberId: req.body.memberId
                    },
                    include: [{
                        model: Members,
                        as: 'members',
                        attributes: ['id', 'userId']
                    }]
                })
                if (!checkMembers) return responsePayload(res, 404, 'Data Member Salah Pada Assigned!', [])
                const addAssigned = await Assigned.findOne({
                    attributes: ['taskId', 'projectMemberId', 'id'],
                    where: {
                        taskId: task.id,
                        projectMemberId: checkMembers.members.userId
                        // id: 1
                    }
                })
                if (!addAssigned) {
                    const labeltask = await Assigned.create({
                        taskId: task.id,
                        projectMemberId: data
                    })
                }
            });

        }


        if (completed_date) {
            await task.update({
                sectionId: sectionDone.id
            }, {
                where: {
                    uuid: task.uuid
                }
            });

        }

        await task.save();
        responsePayload(res, 200, 'Task Berhasil di Update', task)
    } catch (error) {
        res.status(403).json({ msg: error.message })
    }
}

export const deleteTask = async (req, res) => {
    try {
        // res.status(200).json({msg: 'Task Berhasil di Hapus'})
        const { tittle, priority, descriptions, start_date, due_date, sectionId, userId } = req.body
        const { p_id, s_id, t_id } = req.params
        const checkTask = await Task.findOne({
            where: {
                id: req.params.t_id
            }
        })
        console.log(checkTask);
        if (!checkTask) {
            return responsePayload(res, 404, 'Task Tidak Ditemukan')
            // res.status(404).json({ msg: "Task Tidak Ditemukan" })
        }

        const assigned = await Assigned.update({
            deletedAt: new Date()
        }, {
            where: {
                taskId: t_id
            },
        })
        const labelTask = await Label_Task.update({
            deletedAt: new Date()
        }, {
            where: {
                taskId: t_id
            },
        })
        const taskList = await TaskList.update({
            deletedAt: new Date()
        }, {
            where: {
                taskId: t_id
            },
        })
        const comment = await Comment.update({
            deletedAt: new Date()
        }, {
            where: {
                taskId: t_id
            },
        })


        const task = await Task.update({
            deletedAt: new Date()
        }, {
            where: {
                id: t_id
            },
        })
        return responsePayload(res, 200, 'Task Berhasil di Hapus')
        //res.status(200).json({ msg: 'Task Berhasil di Hapus' })

    } catch (error) {
        res.status(403).json({ msg: error.message })
    }
}

// export const uploadTaskFile = multer({
//     storage: multer.diskStorage({
//         destination: 'upload/taskFile/',
//         filename: (req, file, cb) => {
//             cb(null, file.originalname);
//         }
//     }),
//     // limits: {
//     //     fileSize: 1048576
//     // }
// });


// export const addTaskFile = async (req, res) => {
//     try {
//         const { task_file } = req.body
//         //console.log(tittle)
//         const { filename } = req.file;
//         const { t_id } = req.params;

//         const filemodel = await Task_File.create({
//             task_file  : filename,
//             taskId : t_id


//         })
//         res.status(201).json({ msg: "File Telah Terupload" })
//     } catch (error) {
//         res.status(500).json({ msg: error.message })
//     }
// }


//for android(mobile)
