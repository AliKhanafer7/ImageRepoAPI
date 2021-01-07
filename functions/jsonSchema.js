var Validator = require('jsonschema').Validator;
var v = new Validator();

var imageSchema =
{
    "$schema": "http://json-schema.org/draft-04/schema#",
    "$id": "localhost:3000/api/images",
    "title": "Image",
    "description": "Image(s) in the repository",
    "type": "object",
    "properties": {
        "description": {
            "description": "A few words describing what's in the image",
            "type": "string",
        },
        "photographerName": {
            "description": "Name of the person who took the picture",
            "type": "string",
            "pattern": ""
            //Add Regex pattern to validate
        },
        "colors": {
            "description": "main colors in the image",
            "type": "array",
            "items": { "type": "string" }
        },
        "keywords": {
            "description": "keywords that describe the image",
            "type": "array",
            "items": { "type": "string" }
        },
        "dateTaken": {
            "description": "Date the image was taken",
            "type": "",
            "pattern": ""
            //Add Regex pattern to validate
        },
        "storageLocation": {
            "description": "Location of the image in google cloud storage",
            "type": "string"
        },
        "downloadableLink": {
            "description": "Link to the actual imgage for download",
            "type": "string"
        }
    },
    "required": ["photographerName", "colors", "keywords"]
}

module.exports = function validateSchema(instance) {
    v.validate(instance, imageSchema, { throwFirst: true })
}

