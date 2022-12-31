import {Sequelize} from "sequelize"
import db from '../config/database.js';
import Project from "./ProjectModel.js";
import Members from "./MembersModel.js";
import Users from "./UserModel.js";
const {DataTypes} = Sequelize

const ProjectMembers = db.define('tb_project_members',{
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    memberId: {
        type: DataTypes.INTEGER,
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
    projectId: {
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

Project.hasMany(ProjectMembers)
ProjectMembers.belongsTo(Project, {foreignKey: 'projectId'})

Members.hasMany(ProjectMembers)
ProjectMembers.belongsTo(Members,{foreignKey: 'memberId', as : 'members'})

// Users.hasMany(ProjectMembers)
// ProjectMembers.belongsTo(Users,{foreignKey: 'projectMemberId', as : 'detailUsers'})
export default ProjectMembers