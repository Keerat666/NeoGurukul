//Require Mongoose
var mongoose = require('mongoose');
var crypto = require('crypto');
//Define a schema
var Schema = mongoose.Schema;

var classSchema = new Schema({
    class_createdBy_name: { type: String, description: "Required Field", required: true },
    class_createdBy_id: { type: String, description: "Required Field", required: true },
    class_teacher_id: { type: String, description: "Required Field", required: true },
    class_created_at: { type: Date, default: Date.now() },
    status: { type: String, enum: ['in-session', 'class-completed'] },
    classTitle: { type: String, required: true, description: "Should have a description" },
    classDescription: { type: String, required: true, description: "Should have a description" },
    classSessionYear: { type: String, required: true, description: "Should have a session year" },
    classMetaData: { type: String, required: false, description: "used to capture additional metadata" },
    assignedStudents: { type : [String], default:[]}, // Useful for giving access to both Teachers and Students
    assignedTeachers: { type : [String], default:[]} // Useful for tracking teachers
}, { collection: 'class_neogurukul' });

var ClassMappingModel = mongoose.model('ClassMapping', classSchema);

module.exports = ClassMappingModel;
