const {sequelize} = require('../model/model')
const {Op} = require("sequelize");

const {Contract} = sequelize.models

const contractRepository = {
    findByIdAndProfile(id, profileId) {
        return Contract.findOne({
            where: {
                id: id,
                [Op.or]: [{ContractorId: profileId}, {ClientId: profileId}]
            }
        })
    },

    findAllNonTerminatedByProfile(profileId) {
        return Contract.findAll({
            where: {status: {[Op.not]: 'terminated'} ,[Op.or]: [{ContractorId: profileId}, {ClientId: profileId}]}
        })
    }
}

module.exports = contractRepository
