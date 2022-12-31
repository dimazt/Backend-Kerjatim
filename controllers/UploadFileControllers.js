import File from "../models/FileModel.js";
import path from "path";
import fileUpload from "express-fileupload";
import { responsePayload } from "../helpers/payload.js";

export const addTaskFile = async (req, res) => {
    try {
        const { type } = req.query;
        let file;
        let url;
        let destination;
        let uploadedFile;
        let fileName;
        let fileSize;
        let fileType;
        
        let ext;

        if (type != 'file-comment' && type != 'profile') {
            return responsePayload(res, 403, 'Request Tidak Tersedia')
        } else if (type === 'file-comment') {
            file = req.files.task_file;
            url = `/public/file/`
            destination = "./public/file/";
            
            ext = path.extname(file.name);
            const allowedType = ['.png', '.jpg', '.jpeg', '.pdf', '.docs', '.docx', '.doc'];
            if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid File" });
            if (file.data.length > 10000000) return res.status(422).json({ msg: "File must be less than 10 MB" });
            fileName = file.name;
            fileSize = file.size
            fileType = file.mimetype,
            //ext = file.mimetype.split('/').pop()
           //console.log(ext);
           ext = path.extname(file.name);
            uploadedFile = {
                fileName,
                url: url + file.md5 + ext,
                fileSize,
                fileType

            }
        } else if (type === 'profile') {
            //const ext = path.extname(file.name);
            //ext = path.extname(file.name);
            file = req.files.profile_img;
            url = `/public/images/logo/`
            destination = "./public/images/logo/";
            fileName = file.md5;
            fileSize = file.size
            fileType = file.mimetype,
            ext = path.extname(file.name);
            uploadedFile = {
                fileName,
                //url: url + fileName + '.' + ext,
                url: url + file.md5 + ext,
                fileSize,
                fileType

            }
        }
        // console.log(uploadedFile)
        if (file != null) {
            await file.mv(`${destination}${file.md5  + ext}`)
            const bebas = await File.create({
                file: file.name,
                file_path: url + file.md5  + ext,
            })
            //console.log(bebas)
            responsePayload(res, 200, 'Berhasil Upload', uploadedFile)
        } else {
            responsePayload(res, 500, 'File Tidak ada')
            //res.status(500).json({ msg: "File Tidak ada" })
        }
    } catch (error) {
        //console.log(error.message);
        res.status(422).json({ error })
    }
}

// export const getFileByTaskID = async (req, res) => {
//     try {

//         const { p_id, s_id, t_id, l_id } = req.params
//         //console.log(req.params)
//         const file = await Task_File.findAll({
//             where: {
//                 taskId: t_id

//             },

//         })
//         //console.log(file)
//         if (!file) {
//             res.status(404).json({ msg: "File Tidak Ditemukan" })
//         } else { res.status(200).json(file) }


//     } catch (error) {
//         res.status(500).json({ msg: error.message })
//     }
// }
// export const getFileByID = async (req, res) => {
//     try {

//         const { p_id, s_id, f_id } = req.params
//         const file = await Task_File.findOne({
//             where: {
//                 id: f_id

//             },

//         })
//         if (!file) {
//             res.status(404).json({ msg: "FileTidak Ditemukan" })
//         } else { res.status(200).json(file) }


//     } catch (error) {
//         res.status(500).json({ msg: error.message })
//     }
// }

// export const deleteFile = async (req, res) => {
//     try {
//         const { p_id, s_id, f_id } = req.params
//         //console.log(req.params)
//         const file = await Task_File.destroy({

//             where: {
//                 id: f_id
//             },

//         })
//         if (!file) {
//             res.status(404).json({ msg: "File Tidak Ditemukan" })
//         }
//         else {
//             res.status(200).json({ msg: "File Berhasil di Hapus" })
//         }

//     } catch (error) {
//         res.status(403).json({msg: error.message})
//     }
// }