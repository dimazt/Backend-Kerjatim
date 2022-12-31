import { responsePayload } from "../helpers/payload.js"
import Assigned from "../models/AssignedModel.js"
import ProjectMembers from "../models/MemberProjectModel.js"
import Members from "../models/MembersModel.js"
import Sections from "../models/SectionsModel.js"
import Task from "../models/TaskModel.js"
import Users from "../models/UserModel.js"

export const getMembersOnProject = async (req, res) => {
    let idMember = []
    // let getMembers
    try {
        const checkMembersOnProject = await ProjectMembers.findAll({
            where: {
                id: req.params.t_id
            },
            include: [{
                model : Members,
                as : 'members',
                attributes: ['id','userId'],
                include : [{
                    model : Users,
                    as : 'detail_members',
                    attributes : ['id','name','email']
                }]
            }]
        })
        if (!checkMembersOnProject) return res.status(404).json({ msg: "Member not found!" })
        //res.status(200).json({ members: checkMembersOnProject })
        responsePayload(res,200,'Berhasil Menampilkan Member!', { members: checkMembersOnProject })

    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

export const addAssignedToTask = async (req,res) =>{
    const {suuid,tuuid} = req.params
    // const checkSectionByUUID = await Sections.findOne({
    //     where : {
    //         uuid : suuid,
    //         deletedAt : null
    //     }
    // })
    const checkTaskByUUID = await Task.findOne({
        where : {
            uuid : tuuid,
            // sectionId : checkSectionByUUID.id,
            deletedAt : null
        }
    })
    // if(!checkSectionByUUID) return responsePayload(res,404,'Section tidak ditemukan',[])
    if(!checkTaskByUUID) return responsePayload(res,404,'Task tidak ditemukan!',[])
    try {
        const checkMembers = await ProjectMembers.findOne({
            attributes : ['id','role'],
            where : {
                memberId : req.body.memberId
            },
            include : [{
                model : Members,
                as : 'members',
                attributes : ['id','userId']
            }]
        })
        if(!checkMembers) return responsePayload(res,404,'Data Member Salah!',[])
        const addAssigned = await Assigned.create({
            taskId : checkTaskByUUID.id,
            projectMemberId : checkMembers.members.userId
        })
        return responsePayload(res,201,'Assigned berhasil dibuat!',addAssigned)
    } catch (error) {
        return responsePayload(res,500,error.message)
    }
}



export const deleteAssigned = async (req, res) => {
    try {

        const { t_id, p_id } = req.params
        //console.log(req.params)
        //const labeltask = await Label_Task.update({
        const assigned = await Assigned.destroy(

            {
                where: {
                    taskId: t_id,
                    projectMemberId: p_id
                },

            })
        if (!assigned) {

           responsePayload(res,404,'Data Tidak Ditemukan')
        }
        else {
            //res.status(200).json({ msg: "Label Task Berhasil di Hapus" })
            responsePayload(res,200,'Member Berhasil Di Hapus Dari Task')
        }

    } catch (error) {
        res.status(403).json({ msg: error.message })
    }
}