"use strict";
const lodash = require("lodash");
const { expect } = require("chai");
const request = require("@arangodb/request");
const { getEntityCreate, stringify } = require("./utils.js");
const { getEntity } = require("../src/database.js");
const { baseUrl } = module.context;

describe('entity create', () => {
  it('should create the entity', () => {
    const entityCreate = getEntityCreate();

    const response = request.post(baseUrl + "/entities", { body: entityCreate, json: true });
    expect(response.statusCode).to.be.equal(201, stringify({ response }));

    const responseAsCreate = lodash.omit(response.json, ["id", "created", "updated"]);
    expect(responseAsCreate).to.be.deep.equal(entityCreate, stringify({ result: responseAsCreate, expected: entityCreate }));

    const entityRead = getEntity(response.json.id);
    expect(response.json).to.be.deep.equal(entityRead, stringify({ result: response.json, expected: entityRead }));
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
