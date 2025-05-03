//Require Mongoose
var mongoose = require('mongoose');
var crypto = require('crypto');
//Define a schema
var Schema = mongoose.Schema;

var lectureSchema = new Schema({
    lecture_createdBy_name: { type: String, description: "Required Field", required: true },
    lecture_createdBy_id: { type: String, description: "Required Field", required: true },
    lecture_created_at: { type: Date, default: Date.now() },
    status: { type: String, enum: ['pending', 'success', 'error'] },
    language: { type: String, enum: ['eng', 'hi'] },
    lectureTitle: { type: String, required: true, description: "Should have a description" },
    lectureDescription: { type: String, required: true, description: "Should have a description" },
    lectureMetaData: { type: String, required: false, description: "Should have a description" },
    assignedUsers: { type : [String], default:[]}, // Useful for giving access to both Teachers and Students
    lectureLink : {type : String, default : "",required: true},
}, { collection: 'lectures_neogurukul' });

var LectureModel = mongoose.model('Lectures', lectureSchema);

module.exports = LectureModel;
