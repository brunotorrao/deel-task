const controller = require('../../src/controller/jobController')
const repository = require('../../src/repository/jobRepository')
const profileRepository = require('../../src/repository/profileRepository')
const sinon = require('sinon')
const { expect, setup } = require("../setup")

describe('#controller:job', () => {
    let findAllUnpaidMock
    let hasBalanceForPayingMock
    let payMock
    let payJobMock

    beforeEach(() => {
        findAllUnpaidMock = sinon.stub(repository, 'findAllUnpaid')
        hasBalanceForPayingMock = sinon.stub(profileRepository, 'hasBalanceForPaying')
        payMock = sinon.stub(repository, 'pay')
        payJobMock = sinon.stub(profileRepository, 'payJob')
    })

    afterEach(() => {
        findAllUnpaidMock.restore()
        hasBalanceForPayingMock.restore()
        payMock.restore()
        payJobMock.restore()
    })

    it(`should find all unpaid`, async () => {
        findAllUnpaidMock.returns(Promise.resolve([{description: 'desc', price: 12.5, paid: true, paymentdate: '2022-02-02'}]))

        const res = {
            json: sinon.fake()
        }

        const result = await controller.findAllUnpaid({profile: {id: 123}}, res)

        expect(result).to.be.undefined
        expect(findAllUnpaidMock.getCall(0).args[0]).to.be.equal(123)
        expect(res.json.getCall(0).args[0]).to.be.deep.equal([{description: 'desc', price: 12.5, paid: true, paymentdate: '2022-02-02'}])
    })

    it(`should pay`, async () => {
        hasBalanceForPayingMock.returns(Promise.resolve(true))
        payMock.returns(Promise.resolve({}))
        payJobMock.returns(Promise.resolve({}))

        const res = {
            status: sinon.fake()
        }

        const result = await controller.pay({params: { jobId: 111 }, profile: { id: 123 } }, res)

        expect(result).to.be.undefined
        expect(hasBalanceForPayingMock.getCall(0).args[0]).to.be.equal(123)
        expect(hasBalanceForPayingMock.getCall(0).args[1]).to.be.equal(111)
        expect(payMock.getCall(0).args[0]).to.be.equal(111)
        expect(payJobMock.getCall(0).args[0]).to.be.equal(123)
        expect(payJobMock.getCall(0).args[1]).to.be.equal(111)
        expect(res.status.getCall(0).args[0]).to.be.deep.equal(200)
    })

    it(`should not pay if job id is not a number`, async () => {
        setup.expectThrowsAsync(() => controller.pay({params: { jobId: 'add' }, profile: { id: 123 } }, {}),
            'jobId is not a valid number')
    })


    it(`should not pay if client doesn't have balance`, async () => {
        hasBalanceForPayingMock.returns(Promise.resolve(false))
        payMock.returns(Promise.resolve({}))
        payJobMock.returns(Promise.resolve({}))

        const res = {
            status: sinon.fake()
        }

        setup.expectThrowsAsync(() => controller.findAllUnpaid({params: { jobId: 111 }, profile: { id: 123 } }, res),
            'not enough balance for paying job')
    })
})
