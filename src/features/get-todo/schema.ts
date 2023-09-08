import Joi from 'joi'

export default Joi.object({
    id: Joi.string(),
    name: Joi.string(),
    when_done: Joi.string().allow(null),
    page: Joi.number(),
    limit: Joi.number(),
})
