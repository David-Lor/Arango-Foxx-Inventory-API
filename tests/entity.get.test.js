"use strict";
const faker = require("faker");
const { expect } = require("chai");
const request = require("@arangodb/request");
const { getEntityExisting, stringify } = require("./utils.js");
const { baseUrl } = module.context;

describe('entity get', () => {
    it('should get the entity', () => {
        const entity = getEntityExisting();
        const url = `${baseUrl}/entities/${entity.name}`;

        const response = request.get(url);
        expect(response.statusCode).to.be.equal(200, stringify({ response, url, existingEntity: entity }));

        expect(response.json).to.be.deep.equal(entity, stringify({ result: response.json, expected: entity }));
    });

    it('should fail to get a non existing entity', () => {
        const response = request.get(baseUrl + "/entities/" + faker.random.uuid());
        expect(response.statusCode).to.be.equal(404, stringify({ response }));
    });
});
