"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const episodes_1 = __importDefault(require("../controllers/episodes"));
const router = express_1.default.Router();
router.get("/episode", (req, res) => {
    episodes_1.default.getEpisode(req, res);
});
router.post("/add-episodes", (req, res) => {
    episodes_1.default.addEpisodes(req, res);
});
router.delete("/delete-episode", (req, res) => {
    episodes_1.default.deleteEpisodes(req, res);
});
exports.default = router;
