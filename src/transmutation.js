"use strict";

function documentCollectionToResponse(document) {
    const response = { ...document };
    response["id"] = response._key;
    delete response._key;
    delete response._id;
    delete response._rev;
    return response;
}

function addTimestampsToDocument(document, isUpdate) {
    const now = Math.trunc(new Date().getTime() / 1000);
    document.updated = now;
    if (!isUpdate) document.created = now;
    return document
}

module.exports = { documentCollectionToResponse, addTimestampsToDocument };
