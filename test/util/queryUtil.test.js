const queryUtil = require('../../src/util/queryUtil')
const {expect} = require('../setup')

describe('#util:query', () => {

    it('should return between query', () => {
        const result = queryUtil.getWhereWithDates('123', '456')
        expect(result).to.be.deep.equal({createdAt: {between: ['123', '456']}})
    })

    it('should return greater than query', () => {
        const result = queryUtil.getWhereWithDates('123', null)
        expect(result).to.be.deep.equal({createdAt: {gte: '123'}})
    })

    it('should return lesser than query', () => {
        const result = queryUtil.getWhereWithDates(null, '456')
        expect(result).to.be.deep.equal({createdAt: {lte: '456'}})
    })

    it('should return null', () => {
        const result = queryUtil.getWhereWithDates(null, null)
        expect(result).to.be.deep.equal(null)
    })
})
