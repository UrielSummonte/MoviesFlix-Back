import Joi from "joi"

export const validateProfile = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    type: Joi.string().valid("adult", "teen", "child").required(),
    avatar: Joi.string().allow("", null),
  })

  return schema.validate(data)
}
