import { and } from "sequelize";
import { responsePayload } from "../helpers/payload.js"
import ProjectMembers from "../models/MemberProjectModel.js";
import Project from "../models/ProjectModel.js";
import Users from "../models/UserModel.js";
import WorkspaceModel from "../models/WorkspaceModel.js"

export const checkTypeUserForWorkspace = async (req,res,next) => {
    const countWorkspaceByUser = await WorkspaceModel.findAndCountAll({
        where : {
            ownerId : req.userId
        }
    })
    
    // console.log(req.isPremiumUser);
    if(req.isPremiumUser == false && countWorkspaceByUser.count >= 3)
    return responsePayload(res,401,'Free Users hanya dapat membuat 3 Workspace!','')
    next()
}
export const checkTypeUserForProject = async (req,res,next) => {
    const countProjectByUser = await Project.findAndCountAll({
        where : {
            ownerId : req.userId
        }
    })
   
    if(req.isPremiumUser == false && countProjectByUser.count >= 100)
    // if(req.isPremiumUser == false && countProjectByUser.count == 100)
    return responsePayload(res,401,'Free Users hanya dapat membuat 100 Project!','')
    next()
}
export const checkTypeUserForInvitedWorkspace = async (req,res,next) => {
    
    if(req.isPremiumUser == false )
    return responsePayload(res,401,'Free Users tidak dapat menambahkan member kedalam Workspace!','')
    next()
}
export const checkTypeUserForInvitedProject = async (req,res,next) => {
    const checkProject = await Project.findOne({
        where : {
            project_code : req.params.code,
            deletedAt : null
        }
    })
    if(!checkProject) return responsePayload(res, 404, 'Project tidak ditemukan!', [])
    const checkMembersOnProject = await ProjectMembers.findAndCountAll({
        where : {
            projectId : checkProject.id,
            role : 'user'
        }
    })
    
    if(req.isPremiumUser == false && checkMembersOnProject.count == 5)
    return responsePayload(res,401,'Free Users hanya dapat menambahkan 5 member kedalam Project!','')
    next()
}