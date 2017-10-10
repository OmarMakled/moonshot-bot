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
            let msg = `Hi ${name}`
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

            return buttons(elements, 'Select section')
        },
        propertyType: function(data) {
            let elements = data.map(function(e, i) {
                return {
                    "type": "postback",
                    "title": e.title,
                    "payload": payload('propertyType', e.id)
                }
            })
            return buttons(elements, 'Select property type')
        },
        location: function(data) {
            let elements = data.map(function(e, i) {
                return {
                    "type": "postback",
                    "title": e.nameEn,
                    "payload": payload('location', e.id),
                }
            })
            return buttons(elements, 'Select location')
        },
        subLocation: function(data) {
            let elements = data.map(function(e, i) {
                return {
                    "type": "postback",
                    "title": e.nameEn,
                    "payload": payload('subLocation', e.id)
                }
            })
            return buttons(elements, 'Select sub location')
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
                        title: "View Website"
                    }]
                }
            })

            return generic(elements)
        },
        end: function(name) {
            let msg = `we hope we are happy ${name} For more info`
            return message(msg)
        },
    }
}()

module.exports = Template
