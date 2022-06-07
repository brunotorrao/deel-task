const controller = require('../../src/controller/balanceController')
const jobRepository = require('../../src/repository/jobRepository')
const profileRepository = require('../../src/repository/profileRepository')
const sinon = require('sinon')
const { expect, setup } = require("../setup");

describe('#controller:balance', () => {
    let profileRepoMock
    let jobRepoMock

    beforeEach(() => {
        profileRepoMock = sinon.stub(profileRepository, 'deposit')
        jobRepoMock = sinon.stub(jobRepository, 'findSumOfJobPricesByProfile')
    })

    afterEach(() => {
        profileRepoMock.restore()
        jobRepoMock.restore()
    })


    it('should deposit', async () => {
        jobRepoMock.returns(Promise.resolve(1000))
        profileRepoMock.returns(Promise.resolve({}))

        const res = {
            status: sinon.fake()
        }

        const result = await controller.deposit({params: {userId: 123}, body: { amount: 12.5}}, res)

        expect(result).to.be.undefined
        expect(jobRepoMock.getCall(0).args[0]).to.be.equal(123)
        expect(profileRepoMock.getCall(0).args[0]).to.be.equal(123)
        expect(profileRepoMock.getCall(0).args[1]).to.be.equal(12.5)
        expect(res.status.getCall(0).args[0]).to.be.deep.equal(200)
    })

    it('should not deposit if amount is less than 25% of total jobs to pay', async () => {
        jobRepoMock.returns(Promise.resolve(1000))
        profileRepoMock.returns(Promise.resolve({}))

        const res = {
            status: sinon.fake()
        }

        setup.expectThrowsAsync(() => controller.deposit({params: {userId: 123}, body: { amount: 300}}, res),
            'can\'t deposit more than 25% your total of jobs to pay')

        expect(jobRepoMock.getCall(0).args[0]).to.be.equal(123)
    })
})
