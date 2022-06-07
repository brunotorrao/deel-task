const repository = require('../repository/jobRepository')
const profileRepository = require('../repository/profileRepository')
const createError = require('http-errors')


const validateInput = (jobId) => {
    if (isNaN(jobId)) throw createError(400, 'jobId is not a valid number')
}

const jobController = {
    async findAllUnpaid(req, res) {
        const jobs = await repository.findAllUnpaid(req.profile.id)
        res.json(jobs || [])
    },

    async pay(req, res) {
        const jobId = req.params.jobId
        const profileId = req.profile.id
        validateInput(jobId)

        const clientHasBalance = await profileRepository.hasBalanceForPaying(profileId, jobId)
        if (clientHasBalance) {
            await repository.pay(jobId)
            await profileRepository.payJob(profileId, jobId)
            res.status(200)
        } else {
            throw createError(400, 'not enough balance for paying job')
        }

    }
}

module.exports = jobController
