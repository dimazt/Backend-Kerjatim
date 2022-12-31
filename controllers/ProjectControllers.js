import Project from "../models/ProjectModel.js";
import crypto from "crypto";
import Workspace from "../models/WorkspaceModel.js";
import Users from "../models/UserModel.js";
import urid from "urid";
import Sections from "../models/SectionsModel.js";
import Members from "../models/MembersModel.js";
import ProjectMembers from "../models/MemberProjectModel.js";
import Label from "../models/LabelModel.js";
import { responsePayload } from "../helpers/payload.js";
import db from "../config/database.js";

export const getProject = async (req, res) => {
    try {

        const project = await Project.findAll({
            where: {
                id: req.workspaceIdbyMembers,
                deletedAt: null
            },
            include: [{
                model: Users,
                as: 'owner',
                attributes: ['name']
            }]
        })
        let id = []
        project.forEach(m => {
            id.push(m.id)
        });
        // let countSection
        // if (project == '') return responsePayload(res, 200, 'Belum memiliki project', [])

        const countSection = await Sections.findAll({
            where: {
                projectId: id
            }
        })

        let idInSection = []
        countSection.forEach(m => {
            idInSection.push(m.projectId)
        });
       
        const occurrences = idInSection.reduce(function (acc, curr) {
            return acc[`project ${curr}`] ? ++acc[`project ${curr}`] : acc[`project ${curr}`] = 1, acc
          }, {});
          
        responsePayload(res, 200, 'Berhasil get project', {project : project,countSectionByIdProject : occurrences})
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}
export const getProjectByID = async (req, res) => {
    const ws = req.params.wuuid
    try {
        const workspace = await Workspace.findOne({
            where: {
                uuid: ws
            }
        })
        if (!workspace) return responsePayload(res, 404, 'Workspace tidak ditemukan!', [])
        const checkMembers = await Members.findOne({
            where: {
                userId: req.userId,
                workspaceId: workspace.id
            }
        })

        if (!checkMembers) return res.status(401).json({ msg: "Anda bukan bagian dari member dari workspace ini" })

        const project = await Project.findOne({
            where: {
                uuid: req.params.puuid,
                deletedAt: null
            }
        })
        if (!project) return responsePayload(res, 404, 'Project tidak ditemukan!',[])
        const checkMembersProject = await ProjectMembers.findOne({
            where: {
                memberId: checkMembers.id,
                projectId: project.id
            }
        })
        //console.log(checkMembersProject);
        if (!checkMembersProject) return res.status(401).json({ msg: "Anda bukan bagian dari member dari project ini" })
        // const section = await Sections.findAll({
        //     attributes: ['project_status'],
        //     where: {
        //         projectId: project.id
        //     }
        // })
        const checkAllMembers = await Members.findAll({
            where: {
                workspaceId: workspace.id
            }
        })
        let idMembers = []
        checkAllMembers.forEach(m => {
            idMembers.push(m.id)
        });
        const membersProject = await ProjectMembers.findAll({
            attributes: ['id','role'],
            where: {
                projectId: project.id,
                memberId: idMembers
            },
            include: [{
                model: Members,
                attributes: ['id'],
                as: 'members',
                include: [{
                    model: Users,
                    as: 'detail_members',
                    attributes: ['name', 'email', 'profile_path']
                }]
            }]
        })
        // console.log("MEMBER ID",checkMembers.id);
        responsePayload(res, 200, 'Berhasil masuk kedalam project', { project: project, members: membersProject })
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}
export const createProject = async (req, res) => {
    let project_token = crypto.randomBytes(64).toString('hex');

    const { project_name } = req.body
    const t = await db.transaction();
    try {

        const workspace = await Workspace.findOne({
            where: {
                uuid: req.params.wuuid
                // project_name : req.userId
            }
        })
        if (!workspace) return responsePayload(res, 404, 'Workspace tidak ditemukan!')
        // console.log(333)
        const project = await Project.create({
            project_name: project_name,
            project_code: urid(7, 'num'),
            ownerId: req.userId,
            workspaceId: workspace.id
        }, {transaction : t})

        const member = await Members.findAll({
            where: {
                workspaceId: workspace.id,
                role : 'user-workspace'
            }
        })
        if(!member) return responsePayload(res, 404, 'Workspace tidak ditemukan!', [])
        member.forEach(async m => {
            await ProjectMembers.create({
                role: 'user',
                projectId: project.id,
                memberId: m.id
            }, {transaction : t})
        });
        
        // console.log(444)
        const sectionsStatus = ['to do', 'in progress', 'testing', 'done']
        for (let i = 0; i < sectionsStatus.length; i++) {
            await Sections.create({
                project_status: sectionsStatus[i],
                projectId: project.id
            }, {transaction : t})
        }
        const labelStatus = ['Merah', 'Kuning', 'Hijau', 'Biru']
        for (let i = 0; i < labelStatus.length; i++) {
            await Label.create({
                label: labelStatus[i],
                projectId: project.id

            }, {transaction : t})
        }
        await t.commit()
        responsePayload(res, 201, 'Berhasil membuat project', { puuid: project.uuid })
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}
export const updateProject = async (req, res) => {
    try {
        const user = await Project.update({
            project_name: req.body.pname
        }, {
            where: {
                uuid: req.params.puuid
            }
        })
        if (!user) responsePayload(res, 404, 'Project Tidak Ditemukan')
        //res.status(404).json({ msg: "Project Tidak Ditemukan" })


        //res.status(200).json({ msg: 'Nama Project Berhasil di Update' })
        responsePayload(res, 200, 'Nama Project Berhasil di Update')
    } catch (error) {
        res.status(403).json({ msg: error.message })
    }
}

export const deleteProject = async (req, res) => {
    const checkProject = await Project.destroy({
        where:{
            uuid : req.params.puuid
        },
    })
    if(!checkProject) return responsePayload(res,404,'Project tidak ditemukan!', '')
    return responsePayload(res, 200, 'Project Deleted!', '')
}
export const findProjectByCode = async (req, res) => {
    // Mencoba mengambil data dari tabel workspace
    // Data yang ditampilkan diatur dalam method attribute
    try {
        // console.log(req.params.id)

        const project = await Project.findOne({
            where: {
                project_code: req.params.code
            },
            include: [{
                model: Users,
                as: 'owner',
                attributes: ['name'],
            }]
        })
        if (!project) return res.status(404).json({ msg: "Project tidak ditemukan!" })
        // console.log(workspace)
        const workspace = await Workspace.findOne({
            where : {
                id : project.workspaceId
            }
        })
        responsePayload(res, 200, 'Berhasil menampilkan get workspace', { project: project , wuuid : workspace.uuid})
    } catch (error) {
        res.status(500).json({ msg: error.message })

    }
}
export const joinProjectByCode = async (req, res) => {
    try {
        // Request Uniq Code yang di input Users
        const pr_code = req.params.code
        // Mencari Uniq Code 
        const project = await Project.findOne({
            where: {
                project_code: pr_code
            }
        })
        if(!project) return responsePayload(res,404,'project')
        const workspace = await Workspace.findOne({
            where: {
                id : project.workspaceId
            }
        })
        if(!workspace) return responsePayload(res,404,'workspace')

        // const members = await Members.findOne({
        //     where: {
        //         userId: req.userId
        //     }
        // })
    
        // const membersProject = await ProjectMembers.findOne({
        //     where: {
        //         memberId: members.id
        //     }
        // })
        // if(!membersProject) return responsePayload(res,404,'members project')

        if (!project) {
            return res.status(404).json({ msg: `Token ${pr_code} tidak valid!` })
        } else if (project.ownerId == req.userId) {
            return res.status(200).json({ msg: `Anda adalah Owner dari project ${project.project_name}!` })
        // } else if (membersProject) {
        //     return res.status(200).json({ msg: `Anda sudah ada di project ${project.project_name}!` })
        } else {
            const newMemWorkspace = await Members.create({
                role: 'user',
                workspaceId: workspace.id,
                userId: req.userId
            })
            const newMem = await ProjectMembers.create({
                role: 'user',
                projectId: project.id,
                memberId: newMemWorkspace.id
            })
            res.status(201).json({ msg: `Anda berhasil bergabung kedalam project ${project.project_name} sebagai ${newMem.role}` })
        }
    } catch (error) {
        res.status(403).json({ msg: error.message })
    }
}

export const projectPin = async (req, res) => {
    try {

        const { puuid } = req.params
        const checkProject = await Project.findOne({
            where: {

                uuid: puuid
            },
        })
        if (!checkProject) {
            return responsePayload(res, 404, 'Project Tidak Ditemukan')
        }
        await Project.update({
            project_pin: req.body.pin
        }, {
            where: {

                uuid: puuid
            },
        })

        if (req.body.pin == 1) {
            return responsePayload(res, 200, 'Project Berhasil di Pin', req.body.pin)
        } else if (req.body.pin == 0) {
            return responsePayload(res, 200, 'Project Berhasil di Unpin', req.body.pin)

        }




    } catch (error) {
        res.status(500).json({ msg: error.message })
    }

}
export const joinProjectByEmail = async (req, res) => {
    let email = req.body.email
    if(email.length > 5 && req.isPremiumUser == false) return responsePayload(res, 403, 'Free user hanya dapat menambahkan 5 member',[])
    const project = await Project.findOne({
        where: {
            project_code: req.params.code
        },
        include: [
            {
                model: Users,
                as: 'owner',
            }
        ]
    })
    if (!project) return responsePayload(res, 404, 'project tidak ditemukan', [])
    // console.log(project.owner.name);
    // // for (let index = 0; index < email.length; index++) {

    // const element = array[index];
    const checkEmail = await Users.findAll({

        where: {
            email: email,
            is_Verify: 1
        }
    })

    const existingData = checkEmail.map(result => result.email)
    const nonExistingData = email.filter(val => !existingData.includes(val))

    const handlebarOptions = {
        viewEngine: {
            partialsDir: path.resolve('./views-email/'),
            defaultLayout: false,
        },
        viewPath: path.resolve('./views-email/'),
    };

    // // use a template file with nodemailer
    transporterGmail.use('compile', hbs(handlebarOptions))

    var mailOptions = {
        from: ` "Kerjatim " <kerjatimid@gmail.com> `,
        to: existingData,
        subject: `${project.owner.name} Invites you into the Project ${project.project_name}`,
        template: 'invitation', // the name of the template file i.e email.handlebars
        context: {
           
            link: `app.kerjatim.id/join-workspace/${project.project_code}`,
            position_name: project.project_name,
            position: 'Project',
            logo: 'http://api.kerjatim.id/public/images/logo/kerjatim_logo.png'
        }
    }

    transporterGmail.sendMail(mailOptions, function (error, info) {
        if (error) {
            res.status(500).json({ msg: error.message })
        }
    });

    return responsePayload(res, 200, `Invited to ${existingData} successfully!!`, { emailNotRegistered: nonExistingData })

}

export const deleteMemberOnProject = async (req, res) => {
    const checkMembersOnProject = await ProjectMembers.destroy({
        where: {
            id: req.params.memid,
            deletedAt : null
        }
    })
    if (!checkMembersOnProject) return responsePayload(res, 404, 'Members tidak ditemukan!', '')
    return responsePayload(res, 200, 'Members Deleted!', [])
}