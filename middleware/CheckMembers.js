import { responsePayload } from "../helpers/payload.js"
import ProjectMembers from "../models/MemberProjectModel.js"
import Members from "../models/MembersModel.js"
import Project from "../models/ProjectModel.js"
import WorkspaceModel from "../models/WorkspaceModel.js"

// Updated V1
export const checkMemberWorkspace = async (req, res, next) => {
    const memberWorkspace = await Members.findAll({
        where: {
            userId: req.userId
        }
    })
    if (!memberWorkspace) 
    return res.status(401).json({
        meta: {
            status_code: '401',
            message: 'Akses Terlarang'
        }
    })
    let id = []
    memberWorkspace.forEach(m => {
       id.push(m.workspaceId)
    });
    req.workspaceIdbyMembers = id
    next()
}
// Updated V1
export const checkMemberWorkspaceById = async (req, res, next) => {
    const ws = await WorkspaceModel.findOne({
        where: {
            uuid: req.params.wuuid,
            deletedAt: null
        }
    })
    if(!ws) return responsePayload(res, 404, 'Workspace tidak ditemukan!')

    const memberWorkspace = await Members.findOne({
        where: {
            userId: req.userId,
            workspaceId : ws.id
        }
    })
    const memberProject = await ProjectMembers.findAll({
        where : {
            memberId : memberWorkspace.id,
        }
    })
    let idProject = []
    memberProject.forEach(m => {
        idProject.push(m.projectId)
    });
    if (!memberWorkspace) 
    return res.status(401).json({
        meta: {
            status_code: '401',
            message: 'Akses Terlarang'
        }
    })
    if (!memberProject) 
    return res.status(401).json({
        meta: {
            status_code: '401',
            message: 'Akses Terlarang'
        }
    })
    
    req.workspaceIdbyMembers = idProject
    console.log(req.workspaceIdbyMembers)
    next()
}

export const ownerOnly = async (req,res,next) => {
    // console.log(req.userId);
    try {
        let checkWorkspace
        if(req.params.wuuid != null)
        {
            checkWorkspace = await WorkspaceModel.findOne({
                where : {
                    uuid : req.params.wuuid,
                    deletedAt : null
                }
            })
            if(req.userId != checkWorkspace.ownerId) return responsePayload(res,401,'Hanya Owner yang bisa!', [])
        }else{
            const checkProject = await Project.findOne({
                where : {
                    uuid : req.params.puuid,
                    deletedAt : null
                }
            })
            if(req.userId != checkProject.ownerId) return responsePayload(res,401,'Hanya Owner yang bisa!', [])
        }
        next()
    } catch (error) {
        return res.status(500).json({msg : error.message})
    }
}
