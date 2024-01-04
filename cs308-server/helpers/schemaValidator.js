const Joi = require('joi');

const schemaValidator = (schema) => (payload) => schema.validate(payload, { abortEarly: false })

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

exports.validateRegister = schemaValidator(registerSchema);
exports.validateLogin = schemaValidator(loginSchema);