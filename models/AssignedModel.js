import {Sequelize} from "sequelize"
import db from '../config/database.js';
import ProjectMembers from "./MemberProjectModel.js"
import Task from "./TaskModel.js";
import Users from "./UserModel.js";

const {DataTypes} = Sequelize

const Assigned = db.define('tb_asigned',{
    taskId : {
        type : DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: true
        }
    },
    projectMemberId : {
        type : DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: true
        }
    }
},{
    freezeTableName: true,
    paranoid: true
})


ProjectMembers.hasMany(Assigned)
Assigned.belongsTo(ProjectMembers, {foreignKey: 'projectMemberId', as: 'detailMembersAsigned'})
// Assigned.belongsTo(Task, {foreignKey: 'taskId', as: 'assignedTo'})
Task.hasMany(Assigned)
Assigned.belongsTo(Task, {foreignKey: 'taskId', as: 'assignedTo'})

export default Assigned