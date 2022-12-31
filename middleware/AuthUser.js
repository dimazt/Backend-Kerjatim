import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken"

export const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401).json({ msg: "Token tidak diterima !" });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403).json({ msg: "token expired!! mohon login kembali " });
        req.userId = decoded.id;
        req.name = decoded.name;
        // req.isPremiumUser = decoded.isPremiumUser
        // console.log(decoded);
    });
    // console.log(token.isPremiumUser); 
    const user = await Users.findOne({
        where: {
            id: req.userId
        }
    })
    req.isPremiumUser = user.is_user_premium

    next();
}


export const verifyUser = async (req, res, next) => {
    // Jika tidak ditemukan session userId
    if (!req.userId) {
        return res.status(401).json({ msg: "Mohon login ke akun Anda!" })
    }

    // Jika terdapat session userIdd
    // Ambil data di database sesuai dengan session userId
    const user = await Users.findOne({
        where: {
            uuid: req.userId
        }
    })

    // Jika tidak ditemukan user sesuai dengan session userId dalam database
    if (!user) return res.status(404).json({ msg: `User ddd tidak ditemukan` })

    // Jika ditemukan user sesuai dengan session userId dalam database, maka tampilkan user kedalam response
    req.userId = user.id
    req.isPremiumUser = user.is_user_premium
    next()

}