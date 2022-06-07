const jobRepository = require('../repository/jobRepository')
const profileRepository = require('../repository/profileRepository')


const adminController = {
    async findBestProfession(req, res) {
        const result = await jobRepository.findBestProfession(req.params.start, req.params.end)
        res.json(result || [])
    },
    async findBestClients(req, res) {
        const result = await profileRepository.findAllBestClients(req.params.start, req.params.end, req.params.limit)
        res.json(result || [])
    }
}

module.exports = adminController
