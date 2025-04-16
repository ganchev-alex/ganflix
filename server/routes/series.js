"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const series_1 = __importDefault(require("../controllers/series"));
const router = express_1.default.Router();
router.get("/load-series", (req, res) => {
    series_1.default.loadSeries(req, res);
});
router.get("/season", (req, res) => {
    series_1.default.getSeason(req, res);
});
router.post("/add-series", (req, res) => {
    series_1.default.addSeries(req, res);
});
router.post("/update-series", (req, res) => {
    series_1.default.updateSeries(req, res);
});
router.delete("/delete-series", (req, res) => {
    series_1.default.deleteSeries(req, res);
});
router.post("/add-season", (req, res) => {
    series_1.default.addSeason(req, res);
});
router.delete("/delete-season", (req, res) => {
    series_1.default.deleteSeason(req, res);
});
router.get("/get-by-title", (req, res) => {
    series_1.default.getSeriesByTitle(req, res);
});
exports.default = router;
