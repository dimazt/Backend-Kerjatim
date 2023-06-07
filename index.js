import express from "express";
import cors from "cors";
import session, { Store } from "express-session";
import dotenv from "dotenv";
import db from "./config/database.js";
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js";
import WorkspaceRoute from "./routes/WorkspaceRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import ProjectRoute from "./routes/ProjectRoute.js";
import SectionRoute from "./routes/SectionRoute.js";
import TaskRoute from "./routes/TaskRoute.js"
import LabelRoute from "./routes/LabelRoute.js"
import CommentRoute from "./routes/CommentRoutes.js"
import FileUpload from "express-fileupload"
import AssignedRoute from "./routes/AssignedRoute.js"
import LabelTaskRoute from "./routes/LabelTaskRoute.js"
import TaskListRoute from "./routes/TaskListRoute.js";
import UploadFileRoute from "./routes/UploadFileRoute.js";
import FeedbackRoute from "./routes/FeedbackRoute.js"

import path, { dirname } from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// import Label from "./models/LabelModel.js";
// import Task from "./models/TaskModel.js";
// import filemodel from "./models/FileModel.js"
// import Payment from "./models/PaymentModel.js";
// import Users from "./models/UserModel.js"

dotenv.config()
const app = express();

// const sessionStore = new SequelizeStore(session.Store)
// const store = new sessionStore({
//     db: db
// });
// Syncron Database
// // Funcion Untuk Mengenerate Tabel Secara Otomatis
(async () => {
    await db.sync()
})()
// Session
app.use('/public', express.static(path.join(__dirname, 'public')));

// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
//     store: store,
//     cookie: {
//         secure: 'auto'
//     }
// }))
// Middleware
app.use(cors({
    credentials: true,
    origin: ('app.kerjatim.id')
}))
app.use(express.json())
const versionAPP = '/v1'
app.use(FileUpload());
app.use('/public',express.static("public"));
//app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(versionAPP, AuthRoute)
app.use(versionAPP, UserRoute)
app.use(versionAPP, WorkspaceRoute)
app.use(versionAPP, ProjectRoute)
app.use(versionAPP, SectionRoute)
app.use(versionAPP, TaskRoute)
app.use(versionAPP, CommentRoute)
app.use(versionAPP, LabelRoute)
app.use(versionAPP, AssignedRoute)
app.use(versionAPP, LabelTaskRoute)
app.use(versionAPP, TaskListRoute)
app.use(versionAPP, UploadFileRoute)
app.use(versionAPP, FeedbackRoute)

app.listen(process.env.APP_PORT, () => {
    console.log('Server up and running...');
})
