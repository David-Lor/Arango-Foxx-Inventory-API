"use strict";
const { createEntity } = require("../src/database.js");
const faker = require("faker");

function getEntityCreate(withExtraKeys=true) {
    const entityCreate = {
        name: faker.random.uuid(),
        type: faker.random.word()
    };
    if (withExtraKeys) {
        entityCreate[faker.random.word()] = faker.random.word();
    }
    return entityCreate;
}

function getEntityExisting(entityCreate = null) {
    return createEntity(entityCreate === null? getEntityCreate() : entityCreate);
}

function stringify(object) {
    return JSON.stringify(object, null, 2);
}

module.exports = { getEntityCreate, getEntityExisting, stringify };
