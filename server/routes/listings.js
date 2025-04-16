"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const listings_1 = __importDefault(require("../controllers/listings"));
const router = express_1.default.Router();
router.post("/add-listing", (req, res) => {
    listings_1.default.addListing(req, res);
});
router.post("/update-listing", (req, res) => {
    listings_1.default.updateListing(req, res);
});
router.delete("/delete-listing", (req, res) => {
    listings_1.default.deleteListing(req, res);
});
router.post("/add-to", (req, res) => {
    listings_1.default.addToListing(req, res);
});
router.delete("/remove-from", (req, res) => {
    listings_1.default.removeFromListing(req, res);
});
router.get("/get-listings", (req, res) => {
    listings_1.default.getListings(req, res);
});
router.post("/get-media", (req, res) => {
    listings_1.default.getRecordsFromListing(req, res);
});
exports.default = router;
