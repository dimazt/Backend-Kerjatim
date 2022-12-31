import {Sequelize} from "sequelize"
import db from '../config/database.js';
import Users from "./UserModel.js";
import Workspace from "./WorkspaceModel.js";
const {DataTypes} = Sequelize

const Project = db.define('tb_project',{
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    project_code: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    project_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    project_pin: {
        type: DataTypes.BOOLEAN
        
    },
    workspaceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
},{
    freezeTableName: true,
    paranoid: true
})

Workspace.hasMany(Project)
Project.belongsTo(Workspace, {foreignKey: 'workspaceId'})
Users.hasMany(Project)
Project.belongsTo(Users, {foreignKey: 'ownerId', as : 'owner'})

export default Project