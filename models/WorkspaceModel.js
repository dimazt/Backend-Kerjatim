import {Sequelize} from "sequelize"
import db from '../config/database.js';
import Members from "./MembersModel.js";
import Users from "./UserModel.js";
const {DataTypes} = Sequelize

const WorkspaceModel = db.define('tb_workspace',{
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    workspace_code: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    workspace_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    workspace_logo: {
        type: DataTypes.STRING
    },
    logo_path:{
        type: DataTypes.STRING
    },
    ownerId: {
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
WorkspaceModel.hasMany(Members)
Members.belongsTo(WorkspaceModel, {foreignKey: 'workspaceId', as : 'workspace_data'})

Users.hasMany(WorkspaceModel)
WorkspaceModel.belongsTo(Users, {foreignKey: 'ownerId', as: 'owner'})

export default WorkspaceModel