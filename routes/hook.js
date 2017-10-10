const express = require('express');
const router = express.Router();
const bot = require('../lib/bot')

router.get('/', function(req, res, next) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    } else {
        res.send('Error, wrong token')
    }
});

router.post('/', function(req, res, next) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i]
        let sender = event.sender.id

        if (event.message && event.message.text) {
            // emitter.emit('text', sender)
            // console.log(bot.log());
            continue
        }

        if (event.postback && event.postback.payload) {
            let fn = event.postback.payload.split("___")[0]
            bot[fn](sender, event.postback)
            continue
        }
    }
    res.sendStatus(200)
})

module.exports = router;
