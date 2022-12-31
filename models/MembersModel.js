import {Sequelize} from "sequelize"
import db from '../config/database.js';
import Users from "./UserModel.js";
import Workspace from "./WorkspaceModel.js";
const {DataTypes} = Sequelize

const Members = db.define('tb_members',{
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    workspaceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    }
},{
    freezeTableName: true,
    paranoid: true
})

// Workspace.hasMany(Members)
// Members.belongsTo(Workspace, {foreignKey: 'workspaceId', as : 'workspace_data'})

Users.hasMany(Members)
Members.belongsTo(Users,{foreignKey: 'userId', as: 'detail_members'})
export default Members