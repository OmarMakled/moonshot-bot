const request = require('request')

require('dotenv').config()

var access_token;
const MOONSHOT_API = process.env.MOONSHOT_API
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SERVER = process.env.CLIENT_SERVER
const GRANT_TYPE = process.env.GRANT_TYPE

var Moonshot = function() {
    function token(cb) {
        request({
            url: MOONSHOT_API + 'oauth/token',
            qs: {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SERVER,
                grant_type: GRANT_TYPE
            },
            method: 'GET',
            json: {}
        }, function(err, res, body) {
            access_token = body.access_token
            cb()
        })
    }
    function get(opt, cb) {
        opt = {
            url: MOONSHOT_API + opt.url,
            qs: Object.assign({
                access_token: access_token
            }, opt.qs),
            method: opt.method || 'GET',
            json: opt.json || {},
            headers: {
                "Accept-Language": "en"
            }
        }
        request(opt, function(err, res, body) {
            if (body.err) {
                token(function() {
                    console.log("[refresh token] " + access_token)
                    get(opt, cb)
                });
            } else {
                cb(body)
            }
        })
    }
    return {
        init: function() {
            token(function(){
                console.log("[generate new token] " + access_token)
            })
        },
        section: function(cb) {
            get({
                url: 'section'
            }, data => cb(data.sections))
        },
        propertyType: function(cb) {
            get({
                url: 'property_type'
            }, data => cb(data.property_types))
        },
        location: function(cb) {
            get({
                url: 'estimates/locations'
            }, data => cb(data.locations))
        },
        subLocation: function(id, cb) {
            get({
                url: 'estimates/locations',
                qs: {
                    parent: id
                }
            }, data => cb(data.locations))
        },
        listing: function(qs, cb) {
            get({
                    url: 'listing',
                    qs: Object.assign({
                        photo: 1
                    }, qs)
                },
                data => cb(data.listings ? data.listings.items : [])
            )
        }
    }
}()

// init new token
Moonshot.init()

module.exports = Moonshot
