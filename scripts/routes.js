"use strict";
const { db, errors } = require("@arangodb");
const joi = require("joi");
const { collectionName } = require("./const.js");
const { documentCreateSchema, documentReadSchema, documentUpdateSchema } = require("./models.js");
const { documentCollectionToResponse, addTimestampsToDocument } = require("./transmutation.js");

const collection = db._collection(collectionName);
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
        const document = req.body;
        addTimestampsToDocument(document, false);
        const meta = collection.save(document);
        res.send(documentCollectionToResponse(Object.assign(document, meta)));
    })
    .body(documentCreateSchema, "Entity to store")
    .response(documentReadSchema, "Stored entity")
    .summary("Store an entity")
    .description("Store an entity");
    
    router.get("/entities/:id", handleNotFoundErrors(function(req, res) {
        const data = collection.document(req.pathParams.id);
        res.send(documentCollectionToResponse(data));
    }))
    .pathParam("id", joi.string().required(), "Unique ID of the entity")
    .response(documentReadSchema, "Stored entity")
    .summary("Get an entity by its Unique ID")
    .description("Get an entity by its Unique ID");

    router.patch("/entities/:id", handleNotFoundErrors(function(req, res) {
        const document = req.body;
        addTimestampsToDocument(document, true);
        collection.update(req.pathParams.id, document);
        res.sendStatus(204);
    }))
    .pathParam("id", joi.string().required(), "Unique ID of the entity")
    .body(documentUpdateSchema, "Data to update on stored entity")
    .summary("Update an existing entity")
    .description("Update an existing entity");

    router.delete("/entities/:id", handleNotFoundErrors(function(req, res) {
        collection.remove(req.pathParams.id);
        res.sendStatus(204);
    }))
    .pathParam("id", joi.string().required(), "Unique ID of the entity")
    .summary("Delete an existing entity")
    .description("Delete an existing entity");
}

module.exports = { setRoutes };
