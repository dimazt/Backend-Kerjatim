import Users from "../models/UserModel.js";
import argon2 from 'argon2';
import nodemailer from "nodemailer";
import crypto from "crypto";
import db from "../config/database.js";
import { transporterGmail } from "../helpers/SendEmail.js";
import hbs from "nodemailer-express-handlebars";
import path from 'path'
export const resetPassword = async (req, res) => {

    // Mengambil data dari body
    const { email } = req.body
    // Membuat token verify email
    let verifyEmail = crypto.randomBytes(64).toString('hex');

    // Jika proses validasi telah selesai
    // Create data kedalam tabel user
    try {
        const response = await Users.findOne({
            where: {
                email: email
            }
        })
        if(response){
            await Users.update({
                verifyEmail: verifyEmail
            }, {
                where: {
                    email: email
                }
            })
        }
        // Jika Di Dalam tabel tidak ditemukan data sesuai dengan id
        if (!response) return res.status(404).json({ msg: "Email Tidak Terdaftar di Kerjatim!" })

        // Jika terdapat data maka tampilkan 
        // res.status(200).json({ msg: `Token telah dikirimkan ke account ${email}` })
        // var mailOptions = {
        //     from: ` "Forgot Password " <smtp.mailtrap.io> `,
        //     to: email,
        //     subject: 'Kerjatim | Create New Password !',
        //     html: `<h2> ${response.name} ! Thanks for registering on our Site </h2>
        //     <h4> please klik link below to continue .. </h4>
        //     <a href="http://localhost:3000/auth/new-password?token=${verifyEmail}"> Create new Password </a>`
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
            subject: 'Reset Your Password',
            template: 'reset-password', // the name of the template file i.e email.handlebars
            context: {
                link: `app.kerjatim.id/auth/new-password?token=${verifyEmail}`,
                users_name: response.name,
                logo: 'http://api.kerjatim.id/public/images/logo/kerjatim_logo.png'
            }
        }
        transporterGmail.sendMail(mailOptions, function (error, info) {
            if (error) {
                res.send(500).json({ msg: error.message })
            }
        });
        // Jika berhasil maka tampilkan status berhasil
        res.status(201).json({ msg: "Token Verification email link is sent to your email" });
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}

export const newPassword = async (req, res) => {
    try {
        // Mengambil token dari query
        const token = req.query.token;
        
        // Mengambil parameter password dari body
        const { password, confPassword } = req.body

        // Validasi confirm password
        if (password !== confPassword) return res.status(400).json({ msg: "Password dan Confirm Password tidak cocok!" })

        // Jika sama maka lakukan hash
        const hashPassword = await argon2.hash(password)

        // Cari token di database
        const user = await Users.findOne({
            where:{
                verifyEmail: token
            }
        });
        if(!user) return res.status(404).json({msg : 'Permintaan tidak dapat diproses!'})
        // Jika token yang dikirim tidak sesuai dengan token pada database
        if(token !== user.verifyEmail) return res.status(404).json({msg: "Token tidak valid!!"})
        if (user) {
            // await Users.update({
            //     password: hashPassword
            // })
            // res.status(201).json({ msg: "Password berhasil di update !" });
            // Update password dan mereset token
            await db.query(`update tb_users set password = '${hashPassword}',verifyEmail = 0 where verifyEmail = '${token}'`, {
                raw: true,
                type: db.QueryTypes.UPDATE
            });

            res.status(201).json({ msg: "Password berhasil di update! !" });
        }


    } catch (error) {
        console.log(error);
    }
}