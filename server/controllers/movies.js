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
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const movie_1 = __importDefault(require("../models/movie"));
const genre_1 = __importDefault(require("../models/genre"));
const personalization_1 = __importDefault(require("../models/personalization"));
const media_genres_association_1 = __importDefault(require("../models/media-genres-association"));
const formating_1 = require("../util/functions/formating");
const sequelize_1 = require("sequelize");
const listing_1 = __importDefault(require("../models/listing"));
const collection_1 = __importDefault(require("../models/collection"));
const addMovie = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const moviePayload = req.body;
            //#region dir-creation
            const rootFolderName = (0, formating_1.convertTitle)(moviePayload.title);
            const rootDir = path_1.default.resolve(__dirname, "../../..", "database", "content", "movies", rootFolderName);
            if (!fs_1.default.existsSync(rootDir)) {
                fs_1.default.mkdirSync(rootDir, { recursive: true });
            }
            const assetsDir = path_1.default.join(rootDir, "assets");
            if (!fs_1.default.existsSync(assetsDir)) {
                fs_1.default.mkdirSync(assetsDir, { recursive: true });
            }
            //#endregion
            //#region data-appliance
            const basePath = `/source/movies/${rootFolderName}`;
            const movieData = {
                title: moviePayload.title,
                description: moviePayload.description,
                duration: moviePayload.duration,
                release_date: moviePayload.release_date,
                poster_src: `${basePath}/assets/poster.jpg`,
                thumb_src: `${basePath}/assets/thumb.jpg`,
                stream_src: `${basePath}/stream.mp4`,
                en_subtitles: moviePayload.en_subtitles ? `${basePath}/en-sub.vtt` : null,
                bg_subtitles: moviePayload.bg_subtitles ? `${basePath}/bg-sub.vtt` : null,
            };
            //#endregion
            //#region associations-management
            const newMovie = yield movie_1.default.create(Object.assign({}, movieData));
            const validGenres = (yield Promise.all(moviePayload.genres.map((genreId) => {
                return genre_1.default.findByPk(genreId);
            }))).filter((g) => g != null);
            yield Promise.all(validGenres.map((genre) => {
                media_genres_association_1.default.create({
                    movie_id: newMovie.id,
                    genre_id: genre.id,
                });
            }));
            yield personalization_1.default.create({
                movie_id: newMovie.id,
                series_id: null,
            });
            //#endregion
            const movie = Object.assign(Object.assign({ id: newMovie.id }, movieData), { genres: validGenres.map((g) => {
                    return { id: g.id, genre: g.genre };
                }) });
            return res.status(201).json({
                message: `Movie '${newMovie.id}' has been added successfully.`,
                movie,
            });
        }
        catch (error) {
            console.log("Server error '/movies/add-movie': ", error);
            return res.status(500).json({
                message: `Couldn't add new movie.`,
                apiFaultyRoute: "/movies/add-movie",
                errorDetails: error,
            });
        }
    });
};
const updateMovie = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const movieData = req.body;
            const recordCheck = yield movie_1.default.findByPk(movieData.id);
            if (!recordCheck) {
                return res.status(404).json({
                    message: `Movie with '${movieData.id}' was not found.`,
                    faultyId: movieData.id,
                });
            }
            //#region dir-update-process
            const databaseDir = path_1.default.resolve(__dirname, "../../..", "database", "content", "movies");
            const currantRootDir = path_1.default.resolve(databaseDir, (0, formating_1.convertTitle)(recordCheck.title));
            const providedRootDir = path_1.default.resolve(databaseDir, (0, formating_1.convertTitle)(movieData.title));
            if (currantRootDir !== providedRootDir) {
                if (fs_1.default.existsSync(currantRootDir)) {
                    fs_1.default.renameSync(currantRootDir, providedRootDir);
                }
            }
            //#endregion
            //#region updating-data
            const basePath = `/source/movies/${(0, formating_1.convertTitle)(movieData.title)}`;
            const modifiedData = {
                title: movieData.title,
                description: movieData.description,
                duration: movieData.duration,
                release_date: movieData.release_date,
                poster_src: `${basePath}/assets/poster.jpg`,
                thumb_src: `${basePath}/assets/thumb.jpg`,
                stream_src: `${basePath}/stream.mp4`,
                en_subtitles: movieData.en_subtitles ? `${basePath}/en-sub.vtt` : null,
                bg_subtitles: req.body.bg_subtitles ? `${basePath}/bg-sub.vtt` : null,
            };
            const [affectedRows] = yield movie_1.default.update(Object.assign({}, modifiedData), { where: { id: movieData.id }, returning: true });
            //#endregion
            if (affectedRows === 0) {
                return res.status(204);
            }
            else {
                //#region modify-association-data (delete previous genres related to the movie and add the new ones)
                const validGenres = (yield Promise.all(movieData.genres.map((genreId) => {
                    return genre_1.default.findByPk(genreId);
                }))).filter((g) => g != null);
                const updatedMovie = yield movie_1.default.findByPk(movieData.id);
                if (updatedMovie) {
                    media_genres_association_1.default.destroy({
                        where: { movie_id: updatedMovie.id },
                    });
                    yield Promise.all(validGenres.map((genre) => {
                        media_genres_association_1.default.create({
                            movie_id: updatedMovie.id,
                            genre_id: genre.id,
                        });
                    }));
                }
                const updatedPayload = Object.assign(Object.assign({}, modifiedData), { genres: validGenres.map((g) => {
                        return { id: g.id, genre: g.genre };
                    }) });
                return res.status(201).json({
                    message: "Movie data was updated successfully.",
                    updatedMovie: updatedPayload,
                });
            }
        }
        catch (error) {
            console.log("Server error '/movies/update-movie': ", error);
            return res.status(500).json({
                message: "Couldn't update the given movie.",
                apiFaultyRoute: "/movies/update-movie",
                errorDetails: error,
            });
        }
    });
};
const deleteMovie = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const movieId = req.query.id;
            const movie = yield movie_1.default.findByPk(movieId);
            if (!movie) {
                return res.status(404).json({
                    message: `Movie with '${movieId}' was not found.`,
                    faultyId: movieId,
                });
            }
            const movieDir = path_1.default.resolve(__dirname, "../../..", "database", "content", "movies", (0, formating_1.convertTitle)(movie.title));
            if (fs_1.default.existsSync(movieDir)) {
                fs_1.default.rmSync(movieDir, { recursive: true, force: true });
            }
            yield media_genres_association_1.default.destroy({ where: { movie_id: movie.id } });
            yield personalization_1.default.destroy({ where: { movie_id: movie.id } });
            yield movie.destroy();
            return res.status(200).json({
                message: `Movie ${movie.id} and its corresponding files were succesfully deleted from the database.`,
            });
        }
        catch (error) {
            console.log("Server error '/movies/delete-movie': ", error);
            return res.status(500).json({
                message: "Couldn't delete the given movie.",
                apiFaultyRoute: "/movies/delete-movie",
                errorDetails: error,
            });
        }
    });
};
const loadMovie = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const movie = yield movie_1.default.findByPk(req.query.id, {
                include: [
                    { model: genre_1.default, attributes: ["id", "genre"] },
                    { model: listing_1.default },
                    { model: collection_1.default },
                    { model: personalization_1.default },
                ],
            });
            if (movie) {
                return res.status(200).json({
                    meessage: `Movie ${movie.id} retrieved successfully`,
                    mediaData: movie,
                });
            }
            else {
                return res.status(404).json({
                    message: `Movie with '${req.query.id}' was not found.`,
                    faultyId: req.query.id,
                });
            }
        }
        catch (error) {
            console.log("Server error '/movies/load-movie': ", error);
            return res.status(500).json({
                message: "Couldn't delete the given movie.",
                apiFaultyRoute: "/movies/load-movie",
                errorDetails: error,
            });
        }
    });
};
const getMovieByTitle = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const keywords = req.query.keywords.split(" ");
            const movies = yield movie_1.default.findAll({
                where: {
                    [sequelize_1.Op.or]: keywords.map((word) => ({
                        title: { [sequelize_1.Op.like]: `%${word}%` },
                    })),
                },
            });
            const ranked = movies
                .map((movie) => {
                const matchCount = keywords.filter((word) => movie.title.toLowerCase().includes(word.toLowerCase())).length;
                return { movie, matchCount };
            })
                .sort((a, b) => b.matchCount - a.matchCount);
            if (ranked.length > 0) {
                const genres = yield media_genres_association_1.default.findAll({
                    attributes: [],
                    include: [{ model: genre_1.default, attributes: ["id", "genre"] }],
                    where: { movie_id: ranked[0].movie.id },
                });
                return res.status(200).json({
                    message: `The best match movie based on the search was found.`,
                    movie: Object.assign(Object.assign({}, ranked[0].movie.dataValues), { genres }),
                });
            }
            else {
                return res.status(404).json({
                    message: "No match was found.",
                });
            }
        }
        catch (error) {
            console.log("Server error '/movies/get-by-title': ", error);
            return res.status(500).json({
                message: "Couldn't retrive the given movie.",
                apiFaultyRoute: "/movies/get-by-title",
                errorDetails: error,
            });
        }
    });
};
const moviesController = {
    addMovie,
    updateMovie,
    deleteMovie,
    loadMovie,
    getMovieByTitle,
};
exports.default = moviesController;
