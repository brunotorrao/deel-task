const controller = require('../../src/controller/contractController')
const repository = require('../../src/repository/contractRepository')
const sinon = require('sinon')
const { expect, setup } = require("../setup");

describe('#controller:contract', () => {
    let findByIdAndProfileMock
    let findAllNonTerminatedByProfileMock

    beforeEach(() => {
        findByIdAndProfileMock = sinon.stub(repository, 'findByIdAndProfile')
        findAllNonTerminatedByProfileMock = sinon.stub(repository, 'findAllNonTerminatedByProfile')
    })

    afterEach(() => {
        findByIdAndProfileMock.restore()
        findAllNonTerminatedByProfileMock.restore()
    })

    it('should find by id', async () => {
        findByIdAndProfileMock.returns(Promise.resolve({terms: 'term', status: 'in_progress', ClientId: 1, ContractorId: 2}))

        const res = {
            json: sinon.fake()
        }

        const result = await controller.findById({params: {id: 234}, profile: {id: 123}}, res)

        expect(result).to.be.undefined
        expect(findByIdAndProfileMock.getCall(0).args[0]).to.be.equal(234)
        expect(findByIdAndProfileMock.getCall(0).args[1]).to.be.equal(123)
        expect(res.json.getCall(0).args[0]).to.be.deep.equal({terms: 'term', status: 'in_progress', ClientId: 1, ContractorId: 2})
    })

    it('should find all non terminated', async () => {
        findAllNonTerminatedByProfileMock.returns(Promise.resolve([{terms: 'term', status: 'in_progress', ClientId: 1, ContractorId: 2}]))

        const res = {
            json: sinon.fake()
        }

        const result = await controller.findAll({profile: {id: 123}}, res)

        expect(result).to.be.undefined
        expect(findAllNonTerminatedByProfileMock.getCall(0).args[0]).to.be.equal(123)
        expect(res.json.getCall(0).args[0]).to.be.deep.equal([{terms: 'term', status: 'in_progress', ClientId: 1, ContractorId: 2}])
    })

    it('should return not found if there is no contract for this id', async () => {
        findByIdAndProfileMock.returns(Promise.resolve(null))

        setup.expectThrowsAsync(() => controller.findById({params: {id: 234}, profile: {id: 123}, body: { amount: 12.5}}),
            'contract not found')
    })
})
