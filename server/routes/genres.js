"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const genres_1 = __importDefault(require("../controllers/genres"));
const router = express_1.default.Router();
router.post("/add-genre", (req, res) => {
    genres_1.default.addGenre(req, res);
});
router.post("/update-genre", (req, res) => {
    genres_1.default.updateGenre(req, res);
});
router.delete("/delete-genre", (req, res) => {
    genres_1.default.deleteGenre(req, res);
});
router.get("/get-genres", (req, res) => {
    genres_1.default.getGenres(req, res);
});
exports.default = router;
