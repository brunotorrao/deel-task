
const queryUtil = {
    getWhereWithDates(start, end) {
        if (start && end) {
            return {createdAt: {between: [start, end]}}
        } else if (start) {
            return {createdAt: {gte: start}}
        } else if (end) {
            return {createdAt: {lte: end}}
        } else {
            return null
        }
    }
}

module.exports = queryUtil
