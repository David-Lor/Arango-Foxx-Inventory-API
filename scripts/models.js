"use strict";
const joi = require("joi");

const timestamp = joi.number().integer().min(0);

const documentUpdateKeys = {
    name: joi.string(),
    type: joi.string()
};
const documentCreateKeys = {
    ...documentUpdateKeys,
    name: joi.string().required()
};
const documentReadKeys = {
    id: joi.string().required(),
    created: timestamp.required(),
    updated: timestamp.required(),
    ...documentCreateKeys
};

const documentCreateSchema = joi.object().required().keys(documentCreateKeys).unknown();
const documentReadSchema = joi.object().required().keys(documentReadKeys).unknown();
const documentUpdateSchema = joi.object().required().keys(documentUpdateKeys).min(1).unknown();

module.exports = { documentCreateSchema, documentReadSchema, documentUpdateSchema };
