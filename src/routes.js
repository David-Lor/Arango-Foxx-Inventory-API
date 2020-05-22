"use strict";
const { errors } = require("@arangodb");
const joi = require("joi");
const { createEntity, getEntity, updateEntity, deleteEntity } = require("./database.js");
const { documentCreateSchema, documentReadSchema, documentUpdateSchema } = require("./models.js");

const DOC_NOT_FOUND = errors.ERROR_ARANGO_DOCUMENT_NOT_FOUND.code;

function handleNotFoundErrors(requestHandler) {
    return function(req, res) {
        try {
            requestHandler(req, res);
        } catch (error) {
            if (!error.isArangoError || error.errorNum !== DOC_NOT_FOUND) {
                throw error;
            } else {
                res.throw(404, "Entity does not exist", error);
            }
        }
    };
}

function setRoutes(router) {
    router.get("/status", function(req, res) {
        res.send("OK");
    })
    .response(["text/plain"], "Service Status endpoint")
    .summary("Service Status endpoint")
    .description("Return 200 OK if service is reachable and running");
    
    router.post("/entities", function(req, res) {
        res.send(createEntity(req.body)).status(201);
    })
    .body(documentCreateSchema, "Entity to store")
    .response(documentReadSchema, "Stored entity")
    .summary("Store an entity")
    .description("Store an entity");
    
    router.get("/entities/:id", handleNotFoundErrors(function(req, res) {
        res.send(getEntity(req.pathParams.id));
    }))
    .pathParam("id", joi.string().required(), "Unique ID of the entity")
    .response(documentReadSchema, "Stored entity")
    .summary("Get an entity by its Unique ID")
    .description("Get an entity by its Unique ID");

    router.patch("/entities/:id", handleNotFoundErrors(function(req, res) {
        updateEntity(req.pathParams.id, req.body);
        res.sendStatus(204);
    }))
    .pathParam("id", joi.string().required(), "Unique ID of the entity")
    .body(documentUpdateSchema, "Data to update on stored entity")
    .summary("Update an existing entity")
    .description("Update an existing entity");

    router.delete("/entities/:id", handleNotFoundErrors(function(req, res) {
        deleteEntity(req.pathParams.id);
        res.sendStatus(204);
    }))
    .pathParam("id", joi.string().required(), "Unique ID of the entity")
    .summary("Delete an existing entity")
    .description("Delete an existing entity");
}

module.exports = { setRoutes };
