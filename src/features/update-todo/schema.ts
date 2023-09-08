import Joi from 'joi'

export default Joi.object({
    id: Joi.string().required(),
    name: Joi.string(),
    when_done: Joi.string().allow(null),
    deleted_at: Joi.string(),
})
