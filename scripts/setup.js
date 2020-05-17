"use strict";
const { collectionName } = require("./const.js");
const db = require('@arangodb').db;

if (!db._collection(collectionName)) {
    db._createDocumentCollection(collectionName);
}
