const supertest = require('supertest')
const chai = require('chai')
const sinonChai = require('sinon-chai')
const app = require('../src/app')

chai.use(sinonChai);
const { expect } = chai;
const server = supertest.agent(app);
const BASE_URL = '/';

const setup = {
  async expectThrowsAsync(method, errorMessage) {
    let error = null
    try {
      await method()
    }
    catch (err) {
      error = err
    }
    expect(error).to.be.an('Error')
    if (errorMessage) {
      expect(error.message).to.equal(errorMessage)
    }
  }
}

module.exports = {
  expect, server, BASE_URL, setup
}
