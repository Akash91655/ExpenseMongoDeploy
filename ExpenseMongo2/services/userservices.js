// used for any network call

const getExpenses = (req, where) => {
    return req.user.getExpenses(where);
} 

module.exports = {
    getExpenses
}