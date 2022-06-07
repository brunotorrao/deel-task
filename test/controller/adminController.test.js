const controller = require('../../src/controller/adminController')
const jobRepository = require('../../src/repository/jobRepository')
const profileRepository = require('../../src/repository/profileRepository')
const sinon = require('sinon')
const { expect } = require("../setup");

describe('#controller:admin', () => {
    let profileRepoMock
    let jobRepoMock

    beforeEach(() => {
        profileRepoMock = sinon.stub(profileRepository, 'findAllBestClients')
        jobRepoMock = sinon.stub(jobRepository, 'findBestProfession')
    })

    afterEach(() => {
        profileRepoMock.restore()
        jobRepoMock.restore()
    })


    it('should get the best profession', async () => {
        jobRepoMock.returns(Promise.resolve({clientProfession: 'Hacker', prices: 1000}))

        const res = {
            json: sinon.fake()
        }

        const result = await controller.findBestProfession({params: {start: '2022-01-01', end: '2022-01-01'}}, res)

        expect(result).to.be.undefined
        expect(jobRepoMock.getCall(0).args[0]).to.be.equal('2022-01-01')
        expect(jobRepoMock.getCall(0).args[1]).to.be.equal('2022-01-01')
        expect(res.json.getCall(0).args[0]).to.be.deep.equal({clientProfession: 'Hacker', prices: 1000})
    })

    it('should find the best clients', async () => {
        profileRepoMock.returns(Promise.resolve([{id: 123, fullName: 'Bruno Torrao', paid: 2000 }]))

        const res = {
            json: sinon.fake()
        }

        const result = await controller.findBestClients({params: {start: '2022-01-01', end: '2022-01-01', limit: 1}}, res)

        expect(result).to.be.undefined
        expect(profileRepoMock.getCall(0).args[0]).to.be.equal('2022-01-01')
        expect(profileRepoMock.getCall(0).args[1]).to.be.equal('2022-01-01')
        expect(profileRepoMock.getCall(0).args[2]).to.be.equal(1)
        expect(res.json.getCall(0).args[0]).to.be.deep.equal([{id: 123, fullName: 'Bruno Torrao', paid: 2000 }])
    })
})
