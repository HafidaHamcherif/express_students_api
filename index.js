require('dotenv').config();
const express = require("express");
const mongoose = require ("mongoose");

const {PORT, MONGODB_URI} = process.env

const port = PORT || 3000;

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

//configuration DB
const schema = {
    firstName: String,
    surname: String,
    age: Number,
    grade: String,
    favoriteSubjects: [String]
};

const Schema = new mongoose.Schema(schema);
const StudentModel = mongoose.model("student",Schema);

mongoose.connect(MONGODB_URI || "mongodb://localhost:27017/studentsapi",{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err)=>{
    if(err !== null){
        console.log('DB is not connected err:',err)
        return;
    }
    console.log('DB is connected')
});


app.get('/students', (req,res)=>{
    console.log('get/students');
    StudentModel.find({}, (err , students)=>{
        if(err !== null) {
            res.json({
                success: false,
                message:err.toString()
            });
            return;
        }
        res.json({
            success: true,
            data: students
        });
    });
});

app.post('/students',(req,res)=>{
    console.log('post/students');
    console.log('post/students req.body',req.body);

    const {
        firstName = '',
        surname = '',
        age = '',
        favoriteSubjects = []
    } = req.body;
    const student = new StudentModel({
        firstName,
        surname,
        age,
        favoriteSubjects
    });
    student.save((err, student) => {
        if(err !== null) {
            res.json({
                success: false,
                message:err.toString()
            });
            return;
        }
        res.json({
          success: true,
          data: student
        });
    });
});

app.get("/students/:id", (req, res)=>{
    console.log('get/students/:id');
    console.log('get/students/:id req.params', req.params);
    StudentModel.findById(req.params.id, (err , student)=>{
        if(err !== null) {
            res.json({
                success: false,
                message:err.toString()
            });
            return;
        }
        res.json({
            success: true,
            data: student
        });
    });
}) 

 


app.listen(port,()=>{
    console.log(`server started in port : ${port}`);
})