const request = require('request')
const template = require('./template')
const moonshot = require('./moonshot')
const model = require('../models/bot')

require('dotenv').config()

const FB_TOKEN = process.env.FB_TOKEN
const FB_API = process.env.FB_API
const FB_API_MSG = process.env.FB_API_MSG

var Bot = function() {
    var log = {
        user: {},
        preferences: {},
        query: {}
    }
    function send(id, payload) {
        let opt = {
            url: FB_API_MSG,
            qs: {
                access_token: FB_TOKEN
            },
            method: 'POST',
            json: Object.assign({
                recipient: {
                    id: id
                }
            }, payload)
        }

        request(opt, function(err, res, body) {
        })
    }
    function profile(opt, cb){
        opt = {
            url: FB_API + opt.id,
            qs: {
                access_token: FB_TOKEN,
                fields: opt.fields || "first_name,last_name"
            },
            method: 'GET',
            json: {}
        }

        request(opt, function(err, res, body) {
            cb(body)
        })
    }
    function logUser(user){
        log.user = user
    }
    function logPreferences(postback) {
        // payload has key__id__slug (eg) location__1__cairo
        let arr = postback.payload.split("___")

        // hook to deal with location and sublocation
        let key = (arr[0] === 'subLocation') ? 'location' : arr[0]

        log.preferences[key] = {
            id: arr[1],
            title: postback.title
        }

        log.query[key] = arr[1]
    }
    return {
        start: function(id, postback) {
            profile({id: id}, function(user){
                logUser(user)

                send(id, template.start(user.first_name))
            })

            moonshot.section(function(data) {
                send(id, template.section(data))
            })
        },
        section: function(id, postback){
            logPreferences(postback)

            moonshot.propertyType(function(data){
                send(id, template.propertyType(data))
            })
        },
        propertyType: function(id, postback){
            logPreferences(postback)

            moonshot.location(function(data){
                send(id, template.location(data))
            })
        },
        location: function(id, postback){
            logPreferences(postback)

            moonshot.subLocation(log.query.location, function(data){
                send(id, template.subLocation(data))
            })
        },
        subLocation: function(id, postback){
            logPreferences(postback)

            moonshot.listing(log.query, function(data){
                send(id, template.listing(data))
                send(id, template.end(log.user.first_name))
            })

            model.addBot(log, function(instance) {
            });
        },
        getLog: function(){
            return log;
        }
    }
}();

module.exports = Bot
