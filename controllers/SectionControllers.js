
import Project from "../models/ProjectModel.js";
import Sections from "../models/SectionsModel.js";
import Users from "../models/UserModel.js";
import { Op } from "sequelize"
import { responsePayload } from "../helpers/payload.js"
import Task from "../models/TaskModel.js";
import Assigned from "../models/AssignedModel.js";
import Label_Task from "../models/LabelTaskModel.js";
import TaskList from "../models/TaskListModel.js";
import Comment from "../models/CommentModel.js";



export const getSection = async (req, res) => {
    try {

        const { puuid } = req.params
        const response = await Sections.findAll({
            attributes: ['id', 'uuid', 'project_status', "deletedAt"],
            // where: {
            //     uuid: puuid
            // },
            include: {
                model: Project,
                as: 'project',
                where: {
                    uuid: puuid
                },
                include: {
                    model: Users,
                    as: 'owner',
                    attributes: ['id', 'name', 'email']

                }
            }

        })

        responsePayload(res, 200, 'Berhasil Menampilkan Sections', { section: response })

    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

export const createSection = async (req, res) => {

    try {
        const { project_name, workspaceId, project_status } = req.body
        const { w_id, p_id } = req.params
        const project = await Project.findOne({
            where: {
                uuid: req.params.puuid
                // project_name : req.userId
            }
        })
        if (!project) return responsePayload(res, 404, 'Project tidak ditemukan!')
        //console.log(project.id)
        const section = await Sections.findOne({
            where: {
                project_status: { [Op.like]: project_status },
                projectId: project.id

            }
        })
        if (section) return responsePayload(res, 400, 'Sections Sudah Ada', { section: ` ${project_status}` })
        //res.status(400).json({ msg: "Section Sudah Ada" })

        const sectionNew = await Sections.create({
            project_status: project_status,
            projectId: project.id

        })
        responsePayload(res, 201, 'Berhasil Membuat Sections', { section: project_status, uuid: sectionNew.uuid })
        //res.status(201).json({ msg: `sections ${project_status} Created Successfuly!` })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error })
    }
}


export const getSectionByID = async (req, res) => {
    try {

        const { p_id, suuid } = req.params
        const sections = await Sections.findOne({
            // include: [{
            //     model: ProjectModel
            // }],
            where: {
                //projectId: p_id,
                uuid: suuid

            },

        })
        //console.log(sections)
        if (!sections) return res.status(404).json({ msg: "Sections Tidak Ditemukan" })
        responsePayload(res, 200, 'Berhasil menampilkan section', { sections: sections })
        //res.status(200).json(sections)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}


export const updateSection = async (req, res) => {

    try {
        const { project_status } = req.body
        const { p_id, suuid } = req.params
        //console.log(req.params)
        const section = await Sections.findOne({
            where: {
                // projectId: p_id,
                uuid: suuid
            },
        })

        if (!section) res.status(404).json({ msg: "Sections Tidak Ditemukan" })

        await section.set({
            project_status
        });
        await section.save();
        responsePayload(res, 200, 'Berhasil Update Sections', { section: ` ${project_status}` })
        //res.status(200).json({ msg: 'Nama Sections Berhasil di Update' })
    } catch (error) {
        res.status(403).json({ msg: error.message })
    }
}



export const deleteSection = async (req, res) => {
    try {

        const { puuid, suuid } = req.params
        //console.log(req.params)
        const checkSection = await Sections.findOne({
            where: {

                uuid: suuid
            },
        })
        if (!checkSection) {
            return responsePayload(res, 404, 'Section Tidak Ditemukan')
        }
        console.log(checkSection.taskId);
        const checkTask = await Task.findAll({
            where: {
                sectionId: checkSection.id
            }
        })
        // return res.status(200).json({checkSection, checkTask})
        checkTask.forEach(async (data ) => {
            const assigned = await Assigned.update({
                deletedAt: new Date()
            }, {
                where: {
                    taskId: data.id
                },
            })
            const labelTask = await Label_Task.update({
                deletedAt: new Date()
            }, {
                where: {
                    taskId: data.id
                },
            })
            const taskList = await TaskList.update({
                deletedAt: new Date()
            }, {
                where: {
                    taskId: data.id
                },
            })
            const comment = await Comment.update({
                deletedAt: new Date()
            }, {
                where: {
                    taskId: data.id
                },
            })
            
        })
        
    
        const task = await Task.update({
        deletedAt: new Date()
    }, {
        where: {
            sectionId: checkSection.id
        },
    })

    const section = await Sections.update({
        deletedAt: new Date()
    }, {

        where: {
            uuid: suuid
        },

    })


    //console.log(section)
    if (!section[0]) {
        //res.status(404).json({ msg: "Section Tidak Ditemukan" })
        responsePayload(res, 404, 'Section Tidak Ditemukan')
    }
    else {
        responsePayload(res, 200, 'Berhasil menghapus section')
    }



} catch (error) {
    res.status(403).json({ msg: error.message })
}
}