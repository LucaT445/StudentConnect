import fs from 'node:fs';
import mongoose from '../../application/node_modules/mongoose/index.js';
import User from '../../application/backend/models/User.mjs';
import Class from '../../application/backend/models/Classes.mjs';
import Forum from '../../application/backend/models/QAForum.mjs';
import Task from '../../application/backend/models/ToDoList.mjs';
await mongoose.connect('mongodb://127.0.0.1:27017/studentconnect_synthetic');
const password='StudyTogether26!';
async function person(username,firstName,lastName,role,pronouns){
 let u=await User.findOne({username});
 const email=username+'@campus.example.test';
 if(u && u.email!==email)throw new Error('Existing username belongs to a different fixture; stopping');
 if(!u)u=await User.create({username,email,password,firstName,lastName,role,pronouns,dateJoined:new Date('2026-08-24T12:00:00Z')});
 return u;
}
const teacher=await person('prof.rivera','Alex','Rivera','teacher','they/them');
const student=await person('maya.chen','Maya','Chen','student','she/her');
const peer=await person('jordan.patel','Jordan','Patel','student','they/them');
async function course(classID,className){
 let c=await Class.findOne({classID});if(c && String(c.teacher)!==String(teacher._id))throw new Error('Course fixture collision');
 if(!c)c=await Class.create({classID,className,teacher:teacher._id,students:[student._id,peer._id]});return c;
}
const c=await course('CSC648-FA26','CSC 648 — Software Engineering');
await course('CSC675-FA26','CSC 675 — Database Systems');
async function post(author,title,message,type,questionID,date){
 return Forum.findOneAndUpdate({courseID:c._id,authorID:author._id,title,type},{$setOnInsert:{message,questionID,datePosted:new Date(date)}},{upsert:true,new:true,runValidators:true});
}
await post(teacher,'Sprint 2 check-in and office hours','Please bring your updated API contracts and database diagrams to Thursday’s sprint check-in. Office hours are Wednesday, 2–3 p.m. Come with one integration question your team would like to discuss.','announcement',undefined,'2026-11-09T16:00:00Z');
const q=await post(student,'Which status code should we return for a duplicate enrollment?','Our enrollment endpoint works, but I’m deciding how to handle a student joining the same course twice. Should that return 400 Bad Request or 409 Conflict? I want the frontend to show a useful message.','question',undefined,'2026-11-09T17:00:00Z');
await post(peer,'Handling duplicate enrollment','I would use 409 Conflict because the request is valid, but it conflicts with an existing enrollment. Return a clear message such as “You’re already enrolled in this course,” and check membership before saving so the student isn’t added twice.','reply',q._id,'2026-11-09T17:20:00Z');
await post(teacher,'Agree on the API contract','409 is a reasonable choice here. Document the response in your API contract so the frontend can handle it consistently. Also consider what should happen if two enrollment requests arrive at the same time.','reply',q._id,'2026-11-09T17:40:00Z');
for(const [task,completed] of [['Review the Sprint 2 backlog',true],['Document enrollment API responses',false],['Prepare questions for Wednesday office hours',false]])await Task.updateOne({authorId:student._id,task},{$setOnInsert:{completed}},{upsert:true});
function publicUser(u){return {id:String(u._id),username:u.username,email:u.email,firstName:u.firstName,lastName:u.lastName,role:u.role,pronouns:u.pronouns,dateJoined:u.dateJoined,karmaPoints:u.karmaPoints};}
fs.writeFileSync('/tmp/studentconnect-portfolio-users.json',JSON.stringify({teacher:publicUser(teacher),student:publicUser(student),course:c.toObject(),question:q.toObject(),password},null,2));
console.log('Prepared fictional instructor, two students, two courses, a discussion and study tasks.');await mongoose.disconnect();
