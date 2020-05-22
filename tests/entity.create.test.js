"use strict";
const faker = require("faker");
const lodash = require("lodash");
const { expect } = require("chai");
const request = require("@arangodb/request");
const { getEntityCreate, stringify } = require("./utils.js");
const { baseUrl } = module.context;

describe('entity create api test', () => {
  it('should create the entity', () => {
    const entityCreate = getEntityCreate();
    entityCreate[faker.random.word()] = faker.random.word();

    const response = request.post(baseUrl + "/entities", { body: entityCreate, json: true });
    expect(response.statusCode).to.be.equal(201, stringify({ response }));

    const responseAsCreate = lodash.omit(response.json, ["id", "created", "updated"]);
    expect(responseAsCreate).to.be.deep.equal(entityCreate, stringify({ result: responseAsCreate, expected: entityCreate }));
  });

  it('should fail to create an entity with no name', () => {
    const entityCreate = getEntityCreate();
    delete entityCreate.name;

    const response = request.post(baseUrl + "/entities", { body: entityCreate, json: true });
    expect(response.statusCode).to.be.equal(400, stringify({ response }));
  });

  it('should fail to create an empty entity', () => {
      const response = request.post(baseUrl + "/entities", { body: {}, json: true });
      expect(response.statusCode).to.be.equal(400, stringify({ response }));
  });
});
