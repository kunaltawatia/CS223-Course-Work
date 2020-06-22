const mongoose = require('mongoose');
const User = require('../auth/auth.model');
const Instructor = require('../instructor/instructor.model');
const Student = require('../student/student.model');

let dynamicExport = {
	dummyStudents: [
		{
			email: 'testing.1@iitj.ac.in',
			name: 'testing_student_a',
			token: 'test_token_student_a',
			rollNumber: 'B18CSE018',
		},
		{
			email: 'testing.2@iitj.ac.in',
			name: 'testing_student_b',
			rollNumber: 'B19CSE019',
			token: 'test_token_student_b',
		},
	],
	dummyInstructors: [
		{
			email: 'testing.3@iitj.ac.in',
			name: 'testing_instructor_a',
			department: 'cse',
			token: 'test_token_instructor_a',
		},
		{
			email: 'testing.4@iitj.ac.in',
			name: 'testing_instructor_b',
			department: 'me',
			token: 'test_token_instructor_b',
		},
	],
};

/**
 * root level hooks
 */
before((done) => {
	dynamicExport.dummyStudents.map((student, index) => {
		new Student(student).save().then((studentDbEntry) => {
			new User({ ...student, databaseId: studentDbEntry._id })
				.save()
				.then((user) => {
					dynamicExport.dummyStudents[index] = {
						...user._doc,
						...studentDbEntry._doc,
					};
				});
		});
	});

	dynamicExport.dummyInstructors.map((instructor, index) => {
		new Instructor(instructor).save().then((instructorDbEntry) => {
			new User({
				...instructor,
				databaseId: instructorDbEntry._id,
				role: 'instructor',
			})
				.save()
				.then((user) => {
					dynamicExport.dummyInstructors[index] = {
						...user._doc,
						...instructorDbEntry._doc,
					};
				});
		});
	});
	done();
});

after((done) => {
	User.deleteMany({ token: /test_token_/ }, (err) => {
		if (err) console.error(err);
		Student.deleteMany({ email: /test/ }, (err) => {
			if (err) console.error(err);
			Instructor.deleteMany({ email: /test/ }, (err) => {
				if (err) console.error(err);
				// required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
				mongoose.models = {};
				mongoose.modelSchemas = {};
				mongoose.connection.close();
				done();
			});
		});
	});
});

module.exports = dynamicExport;
