var mongoose = require('mongoose')

var schema = mongoose.Schema({
    user: {},
    query: {},
    preferences: {}
})

const Bot = mongoose.model('Bot', schema)

module.exports = {
    getBots: function(cb) {
        Bot.find({}, function(err, bots) {
            cb(bots)
        });
    },
    addBot: function(data, cb) {
        Bot.create(data, function(err, instance) {
            cb(instance)
        })
    },
    getCount: function(cb){
        Bot.count({}, function( err, count){
            cb(count)
        })
    }
}
