const request = require('supertest-as-promised');
const httpStatus = require('http-status');
const chai = require('chai');
const expect = chai.expect;
const app = require('../../index');
const testVariables = require('../tests/root.test');

chai.config.includeStack = true;

describe('## Auth APIs', () => {
	describe('# GET /api/auth/user', () => {
		it('should give error message regarding missing header', (done) => {
			request(app)
				.get('/api/auth/user')
				.expect(httpStatus.UNAUTHORIZED)
				.then((res) => {
					expect(res.body.message).to.equal('Authorization Header Missing');
					done();
				})
				.catch(done);
		});

		it('should give wrong format', (done) => {
			request(app)
				.get('/api/auth/user')
				.set('Authorization', 'token')
				.expect(httpStatus.UNAUTHORIZED)
				.then((res) => {
					expect(res.body.message).to.equal('Authentication error: Bad Format');
					done();
				})
				.catch(done);
		});

		it('should give wrong scheme', (done) => {
			request(app)
				.get('/api/auth/user')
				.set('Authorization', 'Bear token')
				.expect(httpStatus.UNAUTHORIZED)
				.then((res) => {
					expect(res.body.message).to.equal('Authentication error: Bad Scheme');
					done();
				})
				.catch(done);
		});

		it('should give wrong scheme', (done) => {
			request(app)
				.get('/api/auth/user')
				.set('Authorization', 'Bearer random_token')
				.expect(httpStatus.UNAUTHORIZED)
				.then((res) => {
					expect(res.body.message).to.equal('Token is unauthorized');
					done();
				})
				.catch(done);
		});

		it('should allow user details for user a', (done) => {
			request(app)
				.get('/api/auth/user')
				.set('Authorization', `Bearer ${testVariables.dummyStudents[0].token}`)
				.expect(httpStatus.OK)
				.then((res) => {
					expect(res.body.user).to.be.an('object');
					expect(res.body.user.role).to.equal('student');
					done();
				})
				.catch(done);
		});

		it('should allow user details for instructor b', (done) => {
			request(app)
				.get('/api/auth/user')
				.set(
					'Authorization',
					`Bearer ${testVariables.dummyInstructors[1].token}`,
				)
				.expect(httpStatus.OK)
				.then((res) => {
					expect(res.body.user).to.be.an('object');
					expect(res.body.user.role).to.equal('instructor');
					done();
				})
				.catch(done);
		});
	});
});
