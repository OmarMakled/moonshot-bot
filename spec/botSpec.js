var chai = require('chai');
var expect = require('chai').expect;
var bot = require('../lib/bot')
const id = "1877636535585008"
describe('Bot', function() {
    it('returns it gets sections and make tamplate', function(){
        bot.start(id)
    })
    it('returns it gets sections and make tamplate', function(){
        bot.section(id)
    })
    it('returns it gets sections and make tamplate', function(){
        bot.propertyType(id, "propertyType___20")
    })
    it('foo bar', function(){
        // let fn = "location___12"
        // fn = fn.replace(/[^a-z]/gi, '');
        bot.location(id, "location___20")
    })
    it.only('parse payload', function(){
        bot.section(id, {
            "payload": "subLocation___1",
            "title": "For Sale"
        })
        // assert
        console.log(bot.log());
    })
})
