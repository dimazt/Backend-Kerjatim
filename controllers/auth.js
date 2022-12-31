import Users from "../models/UserModel.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

// Controller Auth
// Funcion Login

export const Login = async (req, res) => {
    const user = await Users.findOne({
        where: {
            email: req.body.email
        }
    })
    if (!user) return res.status(404).json({ msg: `User tidak ditemukan` })
    //  Verifikasi Password yang dikirim dengan yang ada di database
    const match = await argon2.verify(user.password, req.body.password)
    // Jika Password tidak sesuai
    if (!match) return res.status(400).json({ msg: "Wrong Password" })
    // Jika user belum verifikasi email
    if (user.is_Verify != 1) return res.status(400).json({ msg: "Email anda belum di verifikasi, silahkan cek email Anda!" })


    // Jika Password sesuai
    // req.userId = user.uuid
    // req.isPremiumUser = user.is_userPremium
    
    // Membuat parameter dari database sebagai response
    const id = user.id
    const uuid = user.uuid
    const name = user.name
    const email = user.email
    const isPremiumUser = user.is_user_premium
    // console.log(isPremiumUser);
    const accessToken = jwt.sign({ id, name}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '7d' //6jam
    })

// console.log(req.isPremiumUser); 
    // Menampilkan response
    res.status(200).json({ msg: "Berhasil Login", user: { id, uuid, name, email, isPremiumUser }, token: accessToken })


}

// Funcion get user saat login
export const Me = async (req, res) => {
    // Jika tidak ditemukan session userId
    if (!req.userId) {
        return res.status(401).json({ msg: "Mohon login ke akun Anda!" })
    }
    // Jika terdapat session userIdd
    // Ambil data di database sesuai dengan session userId
    const user = await Users.findOne({
        attributes: ['id', 'uuid', 'name', 'email', 'profile_path'],
        where: {
            id: req.userId
        }
    })

    // Jika tidak ditemukan user sesuai dengan session userId dalam database
    if (!user) return res.status(404).json({ msg: "User tidak ada" })

    // Jika ditemukan user sesuai dengan session userId dalam database, maka tampilkan user kedalam response
    res.status(200).json(user)

}

// Funcion Logout
export const logOut = (req, res) => {
    // Menghapus sesi user
    req.destroy((err) => {
        // Jika proses logout mengalami eror
        if (err) return res.status(400).json({ msg: "Tidak dapat logout" })
        // Jika proses logout berhasil
        res.status(200).json({ msg: "Anda telah logout" })
    })

}