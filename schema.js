//code for validation on the server side


const Joi = require("joi");

//for listing creation
module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title : Joi.string().required(),
        
        description :Joi.string().required(),
        
        location : Joi.string().required(),
        
        country : Joi.string().required(),
        
        price : Joi.string().required().min(0),
        
        image :[ Joi.string().required().allow("",null),
        Joi.string().required().allow("",null)
    ]
    
    }).required(),
})

//for review creation
module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        rating :Joi.number().required().min(1).max(5),
        comment : Joi.string().required(),
    }).required(),
});