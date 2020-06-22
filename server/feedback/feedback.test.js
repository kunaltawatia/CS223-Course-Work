const request = require('supertest-as-promised');
const httpStatus = require('http-status');
const chai = require('chai');
const expect = chai.expect;
const app = require('../../index');
const testVariables = require('../tests/root.test');

chai.config.includeStack = true;

describe('## Feedback APIs', () => {
	let feedback = {
		body: 'my feedback for the instructor',
	};

	describe('# POST /api/feedback', () => {
		it('should give error while creating a new feedback', (done) => {
			feedback.instructorId = testVariables.dummyInstructors[0].databaseId;
			request(app)
				.post('/api/feedback')
				.set('Authorization', `Bearer ${testVariables.dummyStudents[0].token}`)
				.send({ ...feedback, body: '' })
				.expect(httpStatus.BAD_REQUEST)
				.then((res) => {
					expect(res.body.message).to.equal(
						'Error while creating the document.',
					);
					done();
				})
				.catch(done);
		});

		it('should create a new feedback', (done) => {
			feedback.instructorId = testVariables.dummyInstructors[0].databaseId;
			request(app)
				.post('/api/feedback')
				.set('Authorization', `Bearer ${testVariables.dummyStudents[0].token}`)
				.send(feedback)
				.expect(httpStatus.OK)
				.then((res) => {
					expect(res.body.feedback).to.be.an('object');
					expect(res.body.feedback.body).to.equal(feedback.body);
					feedback = res.body.feedback;
					done();
				})
				.catch(done);
		});
	});

	describe('# GET /api/feedback/:feedbackId', () => {
		it('should not get feedback details with unauthorised access', (done) => {
			request(app)
				.get(`/api/feedback/${feedback._id}`)
				.expect(httpStatus.UNAUTHORIZED)
				.then(() => {
					done();
				})
				.catch(done);
		});

		it('should get feedback details with all fields', (done) => {
			request(app)
				.get(`/api/feedback/${feedback._id}`)
				.set('Authorization', `Bearer ${testVariables.dummyStudents[0].token}`)
				.expect(httpStatus.OK)
				.then((res) => {
					expect(res.body.feedback).to.be.an('object');
					expect(res.body.feedback.student).to.be.an('object');
					expect(res.body.feedback.instructor).to.be.an('object');
					expect(res.body.feedback.instructor._id).to.equal(
						testVariables.dummyInstructors[0].databaseId,
					);
					expect(res.body.feedback.body).to.equal(feedback.body);
					done();
				})
				.catch(done);
		});

		it('instructor should get feedback details without student field', (done) => {
			request(app)
				.get(`/api/feedback/${feedback._id}`)
				.set(
					'Authorization',
					`Bearer ${testVariables.dummyInstructors[0].token}`,
				)
				.expect(httpStatus.OK)
				.then((res) => {
					expect(res.body.feedback).to.be.an('object');
					expect(res.body.feedback.student).not.be.an('object');
					expect(res.body.feedback.instructor).to.be.an('object');
					expect(res.body.feedback.instructor._id).to.equal(
						testVariables.dummyInstructors[0].databaseId,
					);
					expect(res.body.feedback.body).to.equal(feedback.body);
					done();
				})
				.catch(done);
		});

		it('student should not get feedback details of a different student', (done) => {
			request(app)
				.get(`/api/feedback/${feedback._id}`)
				.set('Authorization', `Bearer ${testVariables.dummyStudents[1].token}`)
				.expect(httpStatus.UNAUTHORIZED)
				.then((res) => {
					expect(res.body.message).to.equal(
						'Not allowed to view this feedback.',
					);
					done();
				})
				.catch(done);
		});

		it('instructor should not get feedback details of a different instructor', (done) => {
			request(app)
				.get(`/api/feedback/${feedback._id}`)
				.set(
					'Authorization',
					`Bearer ${testVariables.dummyInstructors[1].token}`,
				)
				.expect(httpStatus.UNAUTHORIZED)
				.then((res) => {
					expect(res.body.message).to.equal(
						'Not allowed to view this feedback.',
					);
					done();
				})
				.catch(done);
		});

		it('should report error with message - Not found, when feedback does not exists', (done) => {
			request(app)
				.get('/api/feedback/56c787ccc67fc16ccc1a5e92')
				.expect(httpStatus.BAD_REQUEST)
				.then((res) => {
					expect(res.body.message).to.equal('No such feedback exists!');
					done();
				})
				.catch(done);
		});
	});

	describe('# PUT /api/feedback/:feedbackId', () => {
		it('should give error while editing the feedback', (done) => {
			feedback.body = '';
			const { body } = feedback;
			request(app)
				.put(`/api/feedback/${feedback._id}`)
				.set('Authorization', `Bearer ${testVariables.dummyStudents[0].token}`)
				.send({ body })
				.expect(httpStatus.BAD_REQUEST)
				.then((res) => {
					expect(res.body.message).to.equal(
						'Error while updating the document.',
					);
					done();
				})
				.catch(done);
		});

		it('should unauthorize to update feedback details', (done) => {
			feedback.body = 'updated body';
			const { body } = feedback;
			request(app)
				.put(`/api/feedback/${feedback._id}`)
				.set('Authorization', `Bearer ${testVariables.dummyStudents[1].token}`)
				.send({ body })
				.expect(httpStatus.UNAUTHORIZED)
				.then((res) => {
					expect(res.body.message).to.equal(
						'Not authorized to perform this action',
					);
					done();
				})
				.catch(done);
		});

		it('should unauthorize instructor to update feedback details', (done) => {
			feedback.body = 'updated body';
			const { body } = feedback;
			request(app)
				.put(`/api/feedback/${feedback._id}`)
				.set(
					'Authorization',
					`Bearer ${testVariables.dummyInstructors[0].token}`,
				)
				.send({ body })
				.expect(httpStatus.UNAUTHORIZED)
				.then((res) => {
					expect(res.body.message).to.equal(
						'Not authorized to perform this action',
					);
					done();
				})
				.catch(done);
		});

		it('should update feedback details', (done) => {
			feedback.body = 'updated body';
			const { body } = feedback;
			request(app)
				.put(`/api/feedback/${feedback._id}`)
				.set('Authorization', `Bearer ${testVariables.dummyStudents[0].token}`)
				.send({ body })
				.expect(httpStatus.OK)
				.then((res) => {
					expect(res.body.feedback).to.be.an('object');
					expect(res.body.feedback.body).to.equal('updated body');
					done();
				})
				.catch(done);
		});
	});

	describe('# DELETE /api/feedback/', () => {
		it('should unauthorize while delete feedback', (done) => {
			request(app)
				.delete(`/api/feedback/${feedback._id}`)
				.set('Authorization', `Bearer ${testVariables.dummyStudents[1].token}`)
				.expect(httpStatus.UNAUTHORIZED)
				.then((res) => {
					expect(res.body.message).to.equal(
						'Not authorized to perform this action',
					);
					done();
				})
				.catch(done);
		});

		it('should unauthorize while delete feedback', (done) => {
			request(app)
				.delete(`/api/feedback/${feedback._id}`)
				.set(
					'Authorization',
					`Bearer ${testVariables.dummyInstructors[1].token}`,
				)
				.expect(httpStatus.UNAUTHORIZED)
				.then((res) => {
					expect(res.body.message).to.equal(
						'Not authorized to perform this action',
					);
					done();
				})
				.catch(done);
		});

		it('should delete feedback', (done) => {
			request(app)
				.delete(`/api/feedback/${feedback._id}`)
				.set('Authorization', `Bearer ${testVariables.dummyStudents[0].token}`)
				.expect(httpStatus.OK)
				.then((res) => {
					expect(res.body.feedback).to.be.an('object');
					expect(res.body.feedback.body).to.equal('updated body');
					done();
				})
				.catch(done);
		});
	});
});
