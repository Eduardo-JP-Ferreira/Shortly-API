import joi from "joi";

export const signUpObject = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    confirmPassword: joi.string().required()
  })

export const signInObject = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  })

export const urlObject = joi.object({
    url: joi.string().required()
  })