const repository = require('../repository/contractRepository')
const createError = require('http-errors')

const ContractController = {
    async findById(req, res) {
        const contract = await repository.findByIdAndProfile(req.params.id, req.profile.id)
        if(!contract) throw createError(404, 'contract not found')
        res.json(contract)
    },
    async findAll(req, res) {
        const contracts = await repository.findAllNonTerminatedByProfile(req.profile.id)
        res.json(contracts || [])
    }
};

module.exports = ContractController;
