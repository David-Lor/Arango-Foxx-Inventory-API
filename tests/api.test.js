"use strict";
const { expect } = require("chai");
const request = require("@arangodb/request");
const { baseUrl } = module.context;

describe('microservice api test', () => {
    it('should return 200 when requesting the status endpoint', () => {
        const response = request.get(baseUrl + "/status");
        expect(response.status).to.equal(200);
        expect(response.body).to.equal("OK");
    });
});
