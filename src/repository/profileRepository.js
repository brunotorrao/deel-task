const {sequelize} = require('../model/model')
const {Op} = require("sequelize");
const queryUtil = require('../util/queryUtil')

const {Profile, Job, Contract} = sequelize.models

const profileRepository = {
    hasBalanceForPaying(profileId, jobId) {
        return Contract.count({
            include: [{
                model: Job,
                required: true,
                as: 'Jobs',
                where: {id: jobId}
            },
                {
                    model: Profile,
                    required: true,
                    as: 'Client'
                }],
            where: {ClientId: profileId, '$Client.balance$': {[Op.gte]: sequelize.col('Jobs.price')}},
        }).then(res => res > 0)
    },
    payJob(profileId, jobId) {
        return Profile.update(
            {balance: sequelize.literal(` ROUND(balance - (SELECT price FROM Jobs job where job.id = '${jobId}'), 2)`)},
            {where: {id: profileId}}
        )
    },
    deposit(profileId, amount) {
        return Profile.update(
            {balance: sequelize.literal(`'${amount}' + balance`)},
            {where: {id: profileId}}
        )
    },

    findAllBestClients(start, end, limit = 2) {
        return Contract.findAll({
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
                [sequelize.col('Client.id'), 'id']
                [sequelize.literal(`Client.firstName || ' ' || Client.lastName`), 'fullName'],
                [sequelize.fn('sum', sequelize.col('Jobs.price')), 'paid']
            ],
            group: [[sequelize.col('Client.id')]],
            order: [[sequelize.col('paid'), 'DESC']],
            subQuery: false,
            limit: limit
        })
    }
}

module.exports = profileRepository
