import Joi from 'joi';

const schemaUsuario = Joi.object({
  NOME_USUARIO: Joi.string().min(3).required(),
  CPF: Joi.string().length(11).pattern(/^\d+$/).required(),
  EMAIL: Joi.string().email().required(),
  TIPO_USUARIO: Joi.string().required(),
  SENHA: Joi.string().min(6).required(),
  ID_SETOR: Joi.number().integer().required()
});

export default schemaUsuario;