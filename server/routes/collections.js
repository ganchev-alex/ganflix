"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const collections_1 = __importDefault(require("../controllers/collections"));
const router = express_1.default.Router();
router.post("/add-collection", (req, res) => {
    collections_1.default.addCollection(req, res);
});
router.post("/update-collection", (req, res) => {
    collections_1.default.updateCollection(req, res);
});
router.delete("/delete-collection", (req, res) => {
    collections_1.default.deletedCollection(req, res);
});
router.post("/add-to", (req, res) => {
    collections_1.default.addToCollection(req, res);
});
router.delete("/remove-from", (req, res) => {
    collections_1.default.removeFromCollection(req, res);
});
router.get("/get-collections", (req, res) => {
    collections_1.default.getCollections(req, res);
});
router.post("/get-media", (req, res) => {
    collections_1.default.getRecordsFromCollection(req, res);
});
exports.default = router;
