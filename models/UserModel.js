import {Sequelize} from "sequelize"
import db from '../config/database.js';

const {DataTypes} = Sequelize

const Users = db.define('tb_users',{
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true,
            len: 7
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
            len: [3,100]
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
   verifyEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    is_Verify: {
        type: DataTypes.BOOLEAN
        
    },
    is_user_premium:{
        type: DataTypes.BOOLEAN
    },
    profile_path:{
        type: DataTypes.STRING
    }

},{
    freezeTableName: false,
    // paranoid: true,
})

// Users.sync({force: true})
export default Users