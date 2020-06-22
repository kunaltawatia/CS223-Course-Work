const request = require('supertest-as-promised');
const httpStatus = require('http-status');
const chai = require('chai');
const expect = chai.expect;
const app = require('../../index');
const testVariables = require('../tests/root.test');

chai.config.includeStack = true;

describe('## Instructor APIs', () => {
	describe('# GET /api/instructor/:instructorId', () => {
		it('should give instructor details for instructor a', (done) => {
			request(app)
				.get(`/api/instructor/${testVariables.dummyInstructors[0].databaseId}`)
				.expect(httpStatus.OK)
				.then((res) => {
					expect(res.body.profile).to.be.an('object');
					expect(res.body.profile.email).to.equal(
						testVariables.dummyInstructors[0].email,
					);
					done();
				})
				.catch(done);
		});

		it('should give instructor details for instructor b', (done) => {
			request(app)
				.get(`/api/instructor/${testVariables.dummyInstructors[1].databaseId}`)
				.expect(httpStatus.OK)
				.then((res) => {
					expect(res.body.profile).to.be.an('object');
					expect(res.body.profile.email).to.equal(
						testVariables.dummyInstructors[1].email,
					);
					done();
				})
				.catch(done);
		});

		it('should give bad request', (done) => {
			request(app)
				.get('/api/instructor/5ece7d2a81fc4873df8cf248')
				.expect(httpStatus.BAD_REQUEST)
				.then(() => {
					done();
				})
				.catch(done);
		});
	});
});
