const {sequelize} = require('../model/model')
const {Op} = require("sequelize");
const queryUtil = require("../util/queryUtil");

const {Job, Contract, Profile} = sequelize.models

const jobRepository = {
    findAllUnpaid(profileId) {
        return Job.findAll({
            include: [{
                model: Contract,
                required: true,
                where: {status: 'in_progress', [Op.or]: [{ContractorId: profileId}, {ClientId: profileId}]},
                attributes: []
            }],
            where: {'paid': {[Op.not]: true}}
        })
    },

    pay(jobId) {
        return Job.update(
            {'paid': true},
            {where: {id: jobId}}
        )
    },

    findSumOfJobPricesByProfile(profileId) {
        return Job.findOne({
            include: [{
                model: Contract,
                required: true,
                where: {ClientId: profileId},
                attributes: []
            }],
            attributes: [[sequelize.fn('sum', sequelize.col('price')), 'totalAmount']]
        }).then(result => result.dataValues.totalAmount)
    },

    findBestProfession(start, end) {
        return Contract.findOne({
            include: [{
                model: Job,
                required: true,
                where: queryUtil.getWhereWithDates(start, end),
                attributes: []
            },
            {
                model: Profile,
                required: true,
                as: 'Client',
                attributes: []
            }],
            attributes: [
                [sequelize.col('Client.profession'), 'clientProfession'],
                [sequelize.fn('sum', sequelize.col('Jobs.price')), 'prices']
            ],
            group: [[sequelize.col('Client.profession')]],
            order: [[sequelize.col('prices'), 'DESC']],
            subQuery: false,
            limit: 1
        })
    }

}

module.exports = jobRepository
