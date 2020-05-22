"use strict";
const { collectionName } = require("./const.js");
const { documentCollectionToResponse, addTimestampsToDocument } = require("./transmutation.js");
const db = require('@arangodb').db;

const collection = db._collection(collectionName);

function createEntity(document) {
    addTimestampsToDocument(document, false);
    const meta = collection.save(document);
    const returnDocument = Object.assign(document, meta);
    return documentCollectionToResponse(returnDocument);
}

function getEntity(entityId) {
    const returnDocument = collection.document(entityId);
    return documentCollectionToResponse(returnDocument);
}

function updateEntity(entityId, updateDocument) {
    addTimestampsToDocument(updateDocument, true);
    collection.update(entityId, updateDocument);
}

function deleteEntity(entityId) {
    collection.remove(entityId);
}

module.exports = { collection, collectionName, db, createEntity, getEntity, updateEntity, deleteEntity };
