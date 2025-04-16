"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const genre_1 = __importDefault(require("../models/genre"));
const addGenre = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const exists = yield genre_1.default.findOne({ where: { genre: req.body.genre } });
            if (exists) {
                return res.status(409).json({ message: "This genre already exists." });
            }
            const newGenre = yield genre_1.default.create({ genre: req.body.genre });
            return res.status(201).json({
                message: `New genre '${newGenre.id}' added successfully.`,
                genre: newGenre,
            });
        }
        catch (error) {
            console.log("Server error '/genres/add-genre': ", error);
            return res.status(500).json({
                message: `Couldn't add new genre.`,
                apiFaultyRoute: "/genres/add-genre",
                errorDetails: error,
            });
        }
    });
};
const updateGenre = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const genreChecker = yield genre_1.default.findByPk(req.body.id);
            if (!genreChecker) {
                return res.status(404).json({
                    message: `Genre ${req.body.id} was not found.`,
                    faultyId: req.body.id,
                });
            }
            yield genre_1.default.update({ genre: req.body.genre }, { where: { id: req.body.id } });
            const updatedGenre = yield genre_1.default.findByPk(req.body.id);
            return res.status(201).json({
                message: `Genre ${genreChecker.id} updated succesfully.`,
                updatedGenre,
            });
        }
        catch (error) {
            console.log("Server error '/genres/update-genre': ", error);
            return res.status(500).json({
                message: `Couldn't update genre.`,
                apiFaultyRoute: "/genres/update-genre",
                errorDetails: error,
            });
        }
    });
};
const deleteGenre = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield genre_1.default.destroy({ where: { genre: req.query.genre } });
            return res
                .status(201)
                .json({ message: `Succesfully deleted genre '${req.query.genre}'` });
        }
        catch (error) {
            console.log("Server error '/genres/update-genre': ", error);
            return res.status(500).json({
                message: `Couldn't update genre.`,
                apiFaultyRoute: "/genres/update-genre",
                errorDetails: error,
            });
        }
    });
};
const getGenres = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const genres = yield genre_1.default.findAll({ order: [["genre", "ASC"]] });
            return res
                .status(200)
                .json({ message: "Genres were retrived successfully.", genres });
        }
        catch (error) {
            console.log("Server error '/genres/get-genres': ", error);
            return res.status(500).json({
                message: `Couldn't retrieve genres.`,
                apiFaultyRoute: "/genres/get-genres",
                errorDetails: error,
            });
        }
    });
};
const genresController = {
    addGenre,
    updateGenre,
    deleteGenre,
    getGenres,
};
exports.default = genresController;
