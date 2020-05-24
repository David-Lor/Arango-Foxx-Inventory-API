"use strict";
const faker = require("faker");
const { expect } = require("chai");
const request = require("@arangodb/request");
const { getEntityExisting, stringify } = require("./utils.js");
const { getEntity } = require("../src/database.js");
const { baseUrl } = module.context;

describe('entity get', () => {
    it('should delete the entity', () => {
        const entity = getEntityExisting();
        const url = `${baseUrl}/entities/${entity.id}`;

        const response = request.delete(url);
        expect(response.statusCode).to.be.equal(204, stringify({ response, url, existingEntity: entity }));

        let error = null;
        try {
            getEntity(entity.id)
        } catch (err) {
            error = err;
        }

        expect(error).to.be.not.null;
    });

    it('should fail to get a non existing entity', () => {
        const url = `${baseUrl}/entities/${faker.random.uuid()}`;
        const response = request.delete(url);
        expect(response.statusCode).to.be.equal(404, stringify({ response, url }));
    });
});
