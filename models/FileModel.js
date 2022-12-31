import {Sequelize} from "sequelize"
import db from '../config/database.js';

const {DataTypes} = Sequelize

const File = db.define('tb_file',{
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    file: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    file_path:{
        type: DataTypes.STRING
    },

},{
    freezeTableName: true,
    paranoid: true
})


export default File