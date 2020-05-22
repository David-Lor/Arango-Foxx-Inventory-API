"use strict";
const { collection, collectionName, db } = require("./database.js");

if (!collection) {
    db._createDocumentCollection(collectionName);
}
