"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const movies_1 = __importDefault(require("../controllers/movies"));
const router = express_1.default.Router();
router.post("/add-movie", (req, res) => {
    movies_1.default.addMovie(req, res);
});
router.post("/update-movie", (req, res) => {
    movies_1.default.updateMovie(req, res);
});
router.delete("/delete-movie", (req, res) => {
    movies_1.default.deleteMovie(req, res);
});
router.get("/load-movie", (req, res) => {
    movies_1.default.loadMovie(req, res);
});
router.get("/get-by-title", (req, res) => {
    movies_1.default.getMovieByTitle(req, res);
});
exports.default = router;
