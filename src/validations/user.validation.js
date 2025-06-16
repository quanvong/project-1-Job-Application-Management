const Joi = require('joi');

const registerValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('user', 'admin').optional()
});

module.exports = { registerValidation };