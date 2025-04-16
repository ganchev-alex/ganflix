"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const explore_1 = __importDefault(require("../controllers/explore"));
const router = express_1.default.Router();
router.post("/", (req, res) => {
    explore_1.default.exploreRecords(req, res);
});
router.post("/random", (req, res) => {
    explore_1.default.getRandomSelection(req, res);
});
router.get("/recent", (req, res) => {
    explore_1.default.getRecentlyAdded(req, res);
});
router.post("/shelf", (req, res) => {
    explore_1.default.fetchShelf(req, res);
});
router.get("/year-filter", (req, res) => {
    explore_1.default.getFilterOptionsYear(req, res);
});
router.get("/top-selection", (req, res) => {
    explore_1.default.getTopSelection(req, res);
});
router.post("/titles-loved", (req, res) => {
    explore_1.default.titlesYouHaveLoved(req, res);
});
router.get("/get-similar", (req, res) => {
    explore_1.default.getSimilar(req, res);
});
exports.default = router;
