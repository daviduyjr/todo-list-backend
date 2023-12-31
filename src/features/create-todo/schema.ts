import Joi from 'joi'

export default Joi.object({
    name: Joi.string().required(),
    when_done: Joi.string().allow(null),
})
