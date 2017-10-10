require('dotenv').config()

var Template = function() {
    function slug(text){
        return text.toLowerCase().replace(' ', '-');
    }
    function payload(id, text){
        return `${id}___${text}`
    }
    function buttons(buttons, text) {
        return {
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "button",
                        text: text,
                        buttons: buttons.slice(0, 3)
                    }
                }
            }
        }
    }
    function generic(elements) {
        return {
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "generic",
                        elements: elements.slice(0, 10)
                    }
                }
            }
        }
    }
    function message(msg) {
        return {
            message: {
                text: msg
            }
        }
    }
    return {
        start: function(name) {
            let msg =  `Hey ${name} 😃, welcome to aqaramap. we can help you with finding where you will live next.`

            return message(msg)
        },
        section: function(data) {
            let elements = data.map(function(e, i) {
                return {
                    "type": "postback",
                    "title": e.title,
                    "payload": payload('section', e.id)
                }
            })

            return buttons(elements, 'Select Section 👇')
        },
        propertyType: function(data) {
            let elements = data.map(function(e, i) {
                return {
                    "type": "postback",
                    "title": e.title,
                    "payload": payload('propertyType', e.id)
                }
            })
            return buttons(elements, 'Select Property Type 👇')
        },
        location: function(data) {
            let elements = data.map(function(e, i) {
                return {
                    "type": "postback",
                    "title": e.nameEn,
                    "payload": payload('location', e.id),
                }
            })
            return buttons(elements, 'Select Location 👇')
        },
        subLocation: function(data) {
            let elements = data.map(function(e, i) {
                return {
                    "type": "postback",
                    "title": e.nameEn,
                    "payload": payload('subLocation', e.id)
                }
            })
            return buttons(elements, 'Select Sub-Location 👇')
        },
        listing: function(data) {
            let elements = data.map(function(e, i) {
                return {
                    title: e.title,
                    image_url: e.main_photo.file.thumbnails.large,
                    subtitle: e.description,
                    buttons: [{
                        type: "web_url",
                        url: process.env.MOONSHOT + '/' + e.id,
                        title: "View Full Description"
                    }]
                }
            })

            return generic(elements)
        },
        end: function(name) {
            let msg = `🎈 We hope you are happy ${name} For more info visit us https://aqarmap.com/ 🎈`
            return message(msg)
        },
    }
}()

module.exports = Template
