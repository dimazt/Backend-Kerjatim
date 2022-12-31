import {Sequelize} from "sequelize"
import db from '../config/database.js';
import Users from "./UserModel.js";
import Project from "./SectionsModel.js";
import Sections from "./SectionsModel.js";
import Assigned from "./AssignedModel.js";
// import Project from "./ProjectModel.js";

const {DataTypes} = Sequelize

const Task = db.define('tb_task',{
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    tittle: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    priority: {
        type: DataTypes.STRING,
        
    },
    descriptions: {
        type: DataTypes.STRING,
    },
    start_date: {
        type: DataTypes.DATE, 
    },
    due_date: {
        type: DataTypes.DATE,
    
    },
    completed_date: {
        type: DataTypes.DATE,
    },
    
    sectionId: {
        type: DataTypes.INTEGER,
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
    updatedBy: {
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

Users.hasMany(Task)
Task.belongsTo(Users, {foreignKey: 'userId', as: 'taskOwner'})
Sections.hasMany(Task)
Task.belongsTo(Sections, {foreignKey: 'sectionId', as : 'sections'})

export default Task