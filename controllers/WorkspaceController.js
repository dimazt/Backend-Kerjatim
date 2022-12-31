import Workspace from "../models/WorkspaceModel.js";
import Members from "../models/MembersModel.js";
import Users from "../models/UserModel.js";
import urid from "urid";
import { transporterGmail, transporterMailTrap } from "../helpers/SendEmail.js";
import hbs from "nodemailer-express-handlebars";
import path from 'path'
import fs from "fs";
import { responsePayload } from "../helpers/payload.js";
import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Sections from "../models/SectionsModel.js";
import ProjectMembers from "../models/MemberProjectModel.js";
import Project from "../models/ProjectModel.js";

// const id = urid()


export const getWorkspace = async (req, res) => {
    try {
        // Version 2
        if (req.workspaceIdbyMembers == '') return responsePayload(res, 200, 'Belum memiliki workspace', [])
        const workspace = await Workspace.findAll({
            where: {
                id: req.workspaceIdbyMembers,
                deletedAt: null
            }
        })
        if (!workspace) return res.status(404).json({
            meta: {
                status_code: 404,
                message: 'Workspace Tidak Ditemukan!'
            }
        })

        return responsePayload(res, 200, 'Berhasil', workspace)

    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}
export const getWorkspaceByID = async (req, res) => {
    // Mencoba mengambil data dari tabel workspace
    // Data yang ditampilkan diatur dalam method attribute
    try {
        // console.log(req.params.id)

        const workspace = await Workspace.findOne({
            where: {
                uuid: req.params.wuuid
            },
            include: [{
                model: Users,
                as: 'owner',
                attributes: ['name', 'is_user_premium'],
            }]
        })
        if (!workspace) return res.status(404).json({ msg: "Workspace tidak ditemukan!" })
        // console.log(workspace)
        const member = await Members.findAll({
            attributes: ['id', 'userId', 'workspaceId', 'role'],
            where: {
                workspaceId: workspace.id
            },
            include: [{
                model: Users,
                as: 'detail_members',
                attributes: ['id', 'name', 'email']

            }]
        })

        responsePayload(res, 200, 'Berhasil menampilkan get workspace', { workspace: workspace, member: member })
    } catch (error) {
        res.status(500).json({ msg: error.message })

    }
}

export const createWorkspace = async (req, res) => {
    let token = urid(7, 'num')
    const { ws_name } = req.body
    let defaultLogo = 'kerjatim_default.png'
    let file = req.files
    let url = `${req.protocol}://${req.get("host")}/public/images/logo/${defaultLogo}`
    const t = await db.transaction();
    console.log(file)
    try {
        if (file != null) {
            // defaultLogo = file
            const file = req.files.file;
            const fileSize = file.data.length;
            const ext = path.extname(file.name);
            defaultLogo = file.md5 + ext;
            url = `${req.protocol}://${req.get("host")}/public/images/logo/${defaultLogo}`;
            const allowedType = ['.png', '.jpg', '.jpeg'];
            if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid Images" });
            if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5 MB" });

            await file.mv(`./public/images/logo/${defaultLogo}`)
        }

        const workspace = await Workspace.create({
            workspace_name: ws_name,
            workspace_logo: defaultLogo,
            workspace_code: token,
            ownerId: req.userId,
            logo_path: url
        }, { transaction: t })

        await Members.create({
            role: 'user-workspace',
            workspaceId: workspace.id,
            userId: req.userId
        }, { transaction: t })

        await t.commit()
        res.status(201).json({ meta: { status_code: '201', message: 'Berhasil Membuat Workspace' }, data: { workspace: workspace.uuid } })
    } catch (error) {
        await t.rollback()
        return responsePayload(res, 500, error.message)
    }
}

export const findWorkspaceByCode = async (req, res) => {
    // Mencoba mengambil data dari tabel workspace
    // Data yang ditampilkan diatur dalam method attribute
    try {
        // console.log(req.params.id)

        const workspace = await Workspace.findOne({
            where: {
                workspace_code: req.params.code
            },
            include: [{
                model: Users,
                as: 'owner',
                attributes: ['name'],
            }]
        })
        if (!workspace) return res.status(404).json({ msg: "Workspace tidak ditemukan!" })
        // console.log(workspace)

        responsePayload(res, 200, 'Berhasil menampilkan get workspace', { workspace: workspace })
    } catch (error) {
        res.status(500).json({ msg: error.message })

    }
}
export const joinWorkspaceByCode = async (req, res) => {
    try {
        
        const ws_code = req.params.code
        const t = await db.transaction();
        const workspace = await Workspace.findOne({
            where: {
                workspace_code: ws_code
            }
        })
        const project = await Project.findAll({
            where: {
                workspaceId: workspace.id
            }
        })
        if (!workspace)
            return res.status(404).json({ msg: `Token tidak valid!` })
        const members = await Members.findOne({
            where: {
                userId: req.userId,
                workspaceId: workspace.id
            }
        })
        if (workspace.ownerId == req.userId) {
            return res.status(200).json({ msg: `Anda adalah Owner dari workspace ${workspace.workspace_name}!` })
        } else if (members) {
            return res.status(200).json({ msg: `Anda sudah ada di workspace ${workspace.workspace_name}!` })
        } else {
            const newMem = await Members.create({
                role: 'user-workspace',
                workspaceId: workspace.id,
                userId: req.userId
            }, {transaction : t})
            project.forEach(m => {
                ProjectMembers.create({
                    role: 'user',
                    memberId: newMem.id,
                    projectId: m.id
                }, {transaction : t})
            });
            await t.commit()
            return responsePayload(res, 200, `Anda berhasil bergabung kedalam workspace ${workspace.workspace_name} sebagai ${newMem.role}`, { wuuid: workspace.uuid })
        }
    } catch (error) {
        await t.rollback()
        res.status(403).json({ msg: error.message })
    }
}

export const joinWorkspaceByEmail = async (req, res) => {
    let email = req.body.email

    const workspace = await Workspace.findOne({
        where: {
            workspace_code: req.params.code
        },
        include: [
            {
                model: Users,
                as: 'owner',
            }
        ]
    })
    if (!workspace) return responsePayload(res, 404, 'Workspace tidak ditemukan', [])
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
        subject: `${workspace.owner.name} Invites you into the Workspace ${workspace.workspace_name}`,
        template: 'invitation', // the name of the template file i.e email.handlebars
        context: {

            link: `${process.env.FRONT_END_PROD}/join-workspace/${workspace.workspace_code}`,
            position_name: workspace.workspace_name,
            position: 'Workspace',
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

export const updateWorkspace = async (req, res) => {
    const user = await Users.findOne({
        where: {
            id: req.userId
        }
    })
    const workspace = await Workspace.findOne({

        where: {
            uuid: req.params.wuuid
        }
    })
    // Jika token tidak ditemukan
    if (!workspace) return res.status(404).json({ msg: `Workspace tidak ditemukan!` })

    // Jika validasi selesai 
    // Mengambil data dari body
    const { ws_name } = req.body
    let fileName = "";
    if (req.files === null) {
        fileName = workspace.workspace_logo;
    } else {
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        fileName = file.md5 + ext;
        const allowedType = ['.png', '.jpg', '.jpeg'];

        if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid Images" });
        if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5 MB" });

        const filepath = `./public/images/logo/${workspace.workspace_logo}`;
        const filepathDefault = `./public/images/logo/kerjatim_default.png`;
        if (filepath === !filepathDefault) {
            fs.unlinkSync(filepath);
        }

        file.mv(`./public/images/logo/${fileName}`, (err) => {
            if (err) return res.status(500).json({ msg: err.message });
        });
    }
    const url = `${req.protocol}://${req.get("host")}/public/images/logo/${fileName}`;
    try {
        await Workspace.update({
            workspace_name: ws_name,
            workspace_logo: fileName,
            logo_path: url
        }, {
            where: {
                uuid: req.params.wuuid
            }
        })
        const uuid = workspace.uuid
        responsePayload(res, 202, `Berhasil di ubah oleh ${user.name}`, { wuuid: uuid })
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
    // Maka lakukan proccess update

}
export const deleteWorkspace = async (req, res) => {

    const checkWorkspace = await Workspace.destroy({
        where: {
            uuid: req.params.wuuid
        },
    })
    if (!checkWorkspace) return responsePayload(res, 404, 'Workspace tidak ditemukan!', '')
    return responsePayload(res, 200, 'Workspace Deleted!', '')
}
export const deleteMemberOnWorkspace = async (req, res) => {
    const checkMembersOnWorkspace = await Members.destroy({
        where: {
            id: req.params.memid,
            deletedAt: null
        },
    })
    if (!checkMembersOnWorkspace) return responsePayload(res, 404, 'Members tidak ditemukan!', '')
    await ProjectMembers.destroy({
        where: {
            memberId: checkMembersOnWorkspace.id,
            deletedAt : null
        }
    })
    return responsePayload(res, 200, 'Members Deleted!', [])
}
