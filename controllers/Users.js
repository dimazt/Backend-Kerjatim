import Users from "../models/UserModel.js";
import argon2 from 'argon2';
import nodemailer from "nodemailer";
import crypto from "crypto";
import db from "../config/database.js";
import { transporterGmail} from "../helpers/SendEmail.js";
import { responsePayload } from "../helpers/payload.js"
import hbs from "nodemailer-express-handlebars";
import path from 'path'

export const getUser = async (req, res) => {
    // Mengambil data dari tabel users
    try {
        const response = await Users.findAll({
            attributes: ['uuid', 'name', 'email']
        })
        if (!response) return res.status(404).json({ msg: "Tidak Ditemukan data apapun!" })

        // Jika terdapat data maka tampilkan 
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ msg: error.message })

    }
}
export const getUserByID = async (req, res) => {
    // Mencoba mengambil data dari tabel users
    // Data yang ditampilkan diatur dalam method attribute
    try {
        const response = await Users.findOne({
            attributes: ['id', 'uuid', 'name', 'email'],
            where: {
                uuid: req.params.id
            }
        })
        // Jika Di Dalam tabel tidak ditemukan data sesuai dengan id
        if (!response) return res.status(404).json({ msg: "User yy Tidak Ditemukan!" })
        // Jika terdapat data maka tampilkan 
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ msg: error.message })

    }
}

export const createUser = async (req, res) => {

    // Mengambil data dari body
    const { name, email, password, confPassword } = req.body
    const checkEmail = await Users.findOne({
        where: {
            email: email
        }
    })
    if (checkEmail) return res.status(400).json({ msg: "Email sudah terdaftar! Gunakan Email lain!" })
    // Jika password dan confirm password tidak sama
    if (password !== confPassword) return res.status(400).json({ msg: "Password dan Confirm Password tidak cocok!" })

    // Jika sama maka lakukan hash
    const hashPassword = await argon2.hash(password)

    // Membuat token verify email
    let verifyEmail = crypto.randomBytes(64).toString('hex');

    // Jika proses validasi telah selesai
    // Create data kedalam tabel user
    try {
        await Users.create({
            name: name,
            email: email,
            password: hashPassword,
            is_Verify: false,
            is_user_premium : 0,
            verifyEmail: verifyEmail
        })
        // console.log(email);
        // var mailOptions = {
        //     from: ` "Verify your email " <kerjatimid@gmail.com> `,
        //     to: email,
        //     subject: 'Kerjatim | Verify Your Email !',
        //     html: `<h2> ${name} ! Thanks for registering on our Site </h2>
        //     <h4> please verify your email to continue .. </h4>
        //     <a href="http://localhost:3000/auth/email-validation?token=${verifyEmail}"> Verify your email here </a>`
        // }
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
            to: email,
            subject: 'Welcome to Kerjatim.id | Email verification is required!',
            template: 'verify-email', // the name of the template file i.e email.handlebars
            context: {
                link: `app.kerjatim.id/auth/email-validation?token=${verifyEmail}`,
                users_name: name,
                logo: 'http://api.kerjatim.id/public/images/logo/kerjatim_logo.png'
            }
        }
        transporterGmail.sendMail(mailOptions, function (error, info) {
            if (error) {
                res.status(500).json({msg: error.message})
            }
            else
                console.log(info);
        });
        // Jika berhasil maka tampilkan status berhasil
        res.status(201).json({ msg: "Verification email link is sent to your email" });
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}

export const verifyEmail = async (req, res) => {
    try {
        // Mengambil token dari query
        const token = req.query.token;
        const user = await Users.findOne({
            verifyEmail: token
        });
        if (user) {
            await db.query(`update tb_users set is_Verify = 1 where verifyEmail = '${token}'`, {
                raw: true,
                type: db.QueryTypes.UPDATE
            });
            res.status(201).json({ msg: "Email is verified !" });
        } else {
            res.status(201).json({ msg: "Token tidak valid !" });
        }
    } catch (error) {
        console.log(error);
    }
}

export const updateUser = async (req, res) => {
    const uuid = req.params.uuid
    const user = await Users.findOne({
        where: {
            uuid: uuid
        }
    })
    if (!user) return responsePayload(res, 404, 'Not Found')
    //res.status(404).json({ msg: "User  Tidak Ditemukan" })
    //const { name, email, password, confPassword } = req.body
    // let hashPassword
    // if (password === "" || password === "null") {
    //     hashPassword = user.password
    // } else {
    //     hashPassword = await argon2.hash(password)
    // }
    // if (password !== confPassword) return res.status(400).json({ msg: "Password dan Confirm Password tidak cocok!" })
    const { name, file } = req.body
    // Jika validasi telah selesai
    // Maka lakukan proccess update
    try {
        await Users.update({
            name: name,
            profile_path: file
            // email: email,
            // password: hashPassword
        }, {
            where: {
                id: user.id
            }
        })
        //res.status(200).json({ msg: "User Updated" })
        responsePayload(res, 200, 'Berhasil Update', { user: { uuid, name, email: user.email, profile_path: file } })
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }

}
export const deleteUser = async (req, res) => {
    const user = await Users.findOne({
        where: {
            id: req.params.id
        }
    })
    if (!user) res.status(404).json({ msg: "User Tidak Ditemukan" })

    try {
        await Users.destroy({
            where:
            {
                id: user.id
            }
        })
        res.status(201).json({ msg: "User Deleted" })
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}

export const changePassword = async (req, res) => {

    try {
        const uuid = req.params.uuid
        const { oldPassword, newPassword, confPassword } = req.body
        const user = await Users.findOne({
            where: {
                uuid: uuid
            }
        })
        let hashPassword
        if (!user) return responsePayload(res, 404, 'Not Found')
        //console.log(1);
        if (!await (argon2.verify(user.password, oldPassword))) return responsePayload(res, 400, 'Password Lama Salah')
        if (oldPassword === "" || oldPassword === "null") {
            hashPassword = user.Password
        } else {
            hashPassword = await argon2.hash(newPassword)
        }
        //console.log(3);
        if (newPassword !== confPassword) return responsePayload(res, 400, 'Password dan Confirm Password tidak cocok!')
        //res.status(400).json({ msg: "Password dan Confirm Password tidak cocok!" })
        //console.log(4);
       user.update({password: hashPassword},{
            where: uuid

        })
        
        responsePayload(res, 200, 'Berhasil Update')
    } catch (error) {
        res.status(400).json({ msg: error.message })

    }
}