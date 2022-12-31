import Label from "../models/LabelModel.js";
import { Op } from "sequelize";
import { responsePayload } from "../helpers/payload.js";
import Project from "../models/ProjectModel.js";


export const getLabel = async (req, res) => {
    try {
        let response
        const { puuid } = req.params
        const project = await Project.findOne({
            where: {
                uuid : puuid
            },
    
        })
        response = await Label.findAll({
            // attributes = ?
            where: {
                // uuid: puuid
                projectId: project.id
            },

        })
        //res.status(201).json({ response })
        responsePayload(res,201,'Berhasil Menampilkan Label', response)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

// export const createLabel= async (req, res) => {
//     // console.log(222)
//     try {
//     const { label, projectId, taskId } = req.body
//     const {p_id, t_id} = req.params
//     const islabelexists = await Label.findOne({
//         where: {
//             label:{[Op.like]: label},
//             // taskId: t_id,
//             projectId: p_id

//         }
//     })
//     if(islabelexists) return res.status(401).json({msg: "Label Sudah Ada"})
//     // console.log(p_id)
//     // console.log(222)
//         await Label.create({
//             label : label,
//             projectId: p_id
          
//         })
//     res.status(201).json({ msg: `Label ${label} Created Successfuly!` })
//     } catch (error) {
//     res.status(500).json({ msg: error})
// }
// }

// export const getLabelByID = async (req, res) => {
//     try {

//         const { p_id, s_id, t_id, l_id } = req.params
//         const label = await Label.findOne({
//             where: {
//                 id: l_id

//             },

//         })
//         if (!label) {
//             res.status(404).json({ msg: "Label Tidak Ditemukan" })
//         } else { res.status(200).json(label) }


//     } catch (error) {
//         res.status(500).json({ msg: error.message })
//     }
// }

export const updateLabel = async (req, res) => {

    const { label } = req.body
    const { p_id, s_id, t_id, luuid} = req.params
    console.log(req.params)
    const labell = await Label.findOne({
        where: {
            // projectId: p_id,
            uuid: luuid
        },
    })

    
    if (!labell) return responsePayload(res,404,'Label Tidak Ditemukan')
    //res.status(404).json({ msg: "Label Tidak Ditemukan" })
    try {
        await Label.update({
            label

        }, {
            where: {
                uuid: luuid
            }
        });

       // res.status(200).json({ msg: 'Label Berhasil di Update' })
      return responsePayload(res,201,'Label Berhasil di Update', {label :label})
       
    } catch (error) {
        res.status(403).json({ msg: error.message })
    }
}

// export const deleteLabel = async (req, res) => {
//     try {
        
//         const { label } = req.body
//         const { p_id, s_id, t_id, l_id } = req.params
//         console.log(req.params)
//         const labell = await Label.destroy({

//             where: {
                
//                 id: l_id
//             },

//         })
//         if (!labell) {
//             res.status(404).json({ msg: "Label Tidak di Temukan" })
//         }
//         else {
//             res.status(200).json({ msg: 'Label Berhasil di Hapus' })
//         }



//     } catch (error) {

//     }
// }