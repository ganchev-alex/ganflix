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
const sequelize_1 = require("sequelize");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const formating_1 = require("../util/functions/formating");
const episodes_1 = __importDefault(require("./episodes"));
const series_1 = __importDefault(require("../models/series"));
const episode_1 = __importDefault(require("../models/episode"));
const genre_1 = __importDefault(require("../models/genre"));
const media_genres_association_1 = __importDefault(require("../models/media-genres-association"));
const personalization_1 = __importDefault(require("../models/personalization"));
const listing_1 = __importDefault(require("../models/listing"));
const collection_1 = __importDefault(require("../models/collection"));
const addSeries = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { seriesData, episodesPayload } = req.body;
            //#region dir-creation
            const rootFolderName = (0, formating_1.convertTitle)(req.body.seriesData.title);
            const rootDir = path_1.default.resolve(__dirname, "../../..", "database", "content", "series", rootFolderName);
            if (!fs_1.default.existsSync(rootDir)) {
                fs_1.default.mkdirSync(rootDir, { recursive: true });
            }
            for (let i = 1; i <= seriesData.seasons; i++) {
                const seasonDir = path_1.default.join(rootDir, `season_${i}`);
                if (!fs_1.default.existsSync(seasonDir)) {
                    fs_1.default.mkdirSync(seasonDir, { recursive: true });
                }
                const assetsDir = path_1.default.join(seasonDir, "assets");
                if (!fs_1.default.existsSync(assetsDir)) {
                    fs_1.default.mkdirSync(assetsDir, { recursive: true });
                }
            }
            //#endregion
            //#region  data-appliance
            const basePath = `/source/series/${rootFolderName}`;
            const seriesPayload = {
                title: seriesData.title,
                description: seriesData.description,
                seasons: seriesData.seasons,
                poster_src: `${basePath}/season_${seriesData.seasons}/assets/poster.jpg`,
                thumb_src: `${basePath}/season_${seriesData.seasons}/assets/thumb.jpg`,
                release_date: seriesData.release_date,
            };
            //#endregion
            const newSeries = yield series_1.default.create(Object.assign({}, seriesPayload));
            if (episodesPayload.length > 0) {
                yield Promise.all(episodesPayload.map((episode) => episodes_1.default.addEpisode(episode, newSeries.id, basePath)));
            }
            //#region genres-association-creation
            const validGenres = (yield Promise.all(seriesData.genres.map((genreId) => {
                return genre_1.default.findByPk(genreId);
            }))).filter((g) => g != null);
            yield Promise.all(validGenres.map((genre) => {
                media_genres_association_1.default.create({
                    series_id: newSeries.id,
                    genre_id: genre.id,
                });
            }));
            yield personalization_1.default.create({
                series_id: newSeries.id,
            });
            const newSeriesPayload = Object.assign(Object.assign({ id: newSeries.id }, seriesPayload), { genres: validGenres.map((g) => {
                    return { id: g.id, genre: g.genre };
                }) });
            //#endregion
            return res.status(201).json({
                message: `Series ${newSeries.id} have been added successfully.`,
                newSeries: newSeriesPayload,
            });
        }
        catch (error) {
            console.log("Server error '/series/add-series': ", error);
            return res.status(500).json({
                message: `Couldn't add new series.`,
                apiFaultyRoute: "/series/add-series",
                errorDetails: error,
            });
        }
    });
};
const updateSeries = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const seriesData = req.body;
            const recordCheck = yield series_1.default.findByPk(seriesData.id);
            if (!recordCheck) {
                return res.status(404).json({
                    message: `Movies with '${seriesData.id} was not found.'`,
                    faultyId: seriesData.id,
                });
            }
            //#region dir-update-process
            const databaseDir = path_1.default.resolve(__dirname, "../../..", "database", "content", "series");
            const currantRootDir = path_1.default.resolve(databaseDir, (0, formating_1.convertTitle)(recordCheck.title));
            const providedRootDir = path_1.default.resolve(databaseDir, (0, formating_1.convertTitle)(seriesData.title));
            if (currantRootDir != providedRootDir) {
                if (fs_1.default.existsSync(currantRootDir)) {
                    fs_1.default.renameSync(currantRootDir, providedRootDir);
                }
            }
            const basePath = `/source/series/${(0, formating_1.convertTitle)(seriesData.title)}`;
            const modifiedData = {
                title: seriesData.title,
                description: seriesData.description,
                release_date: seriesData.release_date,
                poster_src: `${basePath}/season_${recordCheck.seasons}/assets/poster.jpg`,
                thumb_src: `${basePath}/season_${recordCheck.seasons}/assets/thumb.jpg`,
            };
            //#endregion
            const [affectedRows] = yield series_1.default.update(Object.assign({}, modifiedData), { where: { id: seriesData.id }, returning: false });
            const updatedSeries = yield series_1.default.findByPk(seriesData.id);
            if (affectedRows === 0) {
                return res.status(204);
            }
            else {
                if (updatedSeries) {
                    //#region modify-existing-episodes
                    const episodes = yield episode_1.default.findAll({
                        where: { series_id: updatedSeries.id },
                    });
                    yield Promise.all(episodes.map((episode) => episode_1.default.update({
                        episode: episode.title,
                        season: episode.season,
                        eposide_num: episode.episode_num,
                        duration: episode.duration,
                        stream_src: `${basePath}/season_${recordCheck.seasons}/s${episode.season}_ep${episode.episode_num}_stream.mp4`,
                        en_subtitles: episode.en_subtitles
                            ? `${basePath}/en_sub.vtt`
                            : null,
                        bg_subtitles: episode.bg_subtitles
                            ? `${basePath}/bg_sub.vtt`
                            : null,
                    }, { where: { id: episode.id }, returning: false })));
                    //#endregion
                    //#region modify-association-data (delete previous genres related to the movie and add the new ones)
                    const validGenres = (yield Promise.all(seriesData.genres.map((genreId) => {
                        return genre_1.default.findByPk(genreId);
                    }))).filter((g) => g != null);
                    media_genres_association_1.default.destroy({
                        where: { series_id: updatedSeries.id },
                    });
                    yield Promise.all(validGenres.map((genre) => {
                        media_genres_association_1.default.create({
                            series_id: updatedSeries.id,
                            genre_id: genre.id,
                        });
                    }));
                    const updatedPayload = Object.assign(Object.assign({}, modifiedData), { genres: validGenres.map((g) => {
                            return { id: g.id, genre: g.genre };
                        }) });
                    //#endregion
                    return res.status(201).json({
                        message: "Series data was updated successfully.",
                        updatedSeries: updatedPayload,
                    });
                }
            }
        }
        catch (error) {
            return res.status(500).json({
                message: "Couldn't update the given series.",
                apiFaultyRoute: "/series/updateSeries",
                errorDetails: error,
            });
        }
    });
};
const deleteSeries = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const seriesId = req.query.id;
            const series = yield series_1.default.findByPk(seriesId);
            if (!series) {
                return res.status(404).json({
                    message: `Series with '${seriesId}' was not found.`,
                    faultyId: seriesId,
                });
            }
            const seriesDir = path_1.default.resolve(__dirname, "../../..", "database", "content", "series", (0, formating_1.convertTitle)(series.title));
            if (fs_1.default.existsSync(seriesDir)) {
                fs_1.default.rmSync(seriesDir, { recursive: true, force: true });
            }
            yield episode_1.default.destroy({ where: { series_id: seriesId } });
            yield media_genres_association_1.default.destroy({ where: { series_id: seriesId } });
            yield series.destroy();
            return res.status(200).json({
                message: `Series ${series.id} and its corresponding episodes and files were succesfully deleted from the database.`,
            });
        }
        catch (error) {
            console.log("Server error '/series/delete-series': ", error);
            return res.status(500).json({
                message: "Couldn't delete the given series.",
                faultyApiRoute: "/movies/delete-series",
                errorDetails: error,
            });
        }
    });
};
const addSeason = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const seasonPayload = req.body;
            const currantSeries = yield series_1.default.findByPk(seasonPayload.series_id);
            if (!currantSeries) {
                return res.status(404).json({
                    message: `Series '${seasonPayload.series_id}' was not found.`,
                    faultyId: seasonPayload.series_id,
                });
            }
            if (currantSeries.seasons + 1 < seasonPayload.season_num) {
                return res.status(409).json({
                    message: `You are trying to add a season that is much greater than the total season of the series ${seasonPayload.series_id}. Trying to add season ${seasonPayload.season_num} to a total of seasons ${currantSeries.seasons + 1}.`,
                });
            }
            if (currantSeries.seasons >= seasonPayload.season_num) {
                const seasonChecker = yield episode_1.default.findOne({
                    where: {
                        series_id: currantSeries.id,
                        season: seasonPayload.season_num,
                    },
                });
                if (seasonChecker) {
                    return res.status(409).json({
                        message: `This season already exists for series ${currantSeries.id}. If there are any new episodes that you wish to add to it, please use the suitable API for that like 'episodes/add-episodes'.`,
                    });
                }
            }
            const rootFolderName = (0, formating_1.convertTitle)(currantSeries.title);
            const rootDir = path_1.default.resolve(__dirname, "../../..", "database", "content", "series", rootFolderName);
            if (!fs_1.default.existsSync(rootDir)) {
                fs_1.default.mkdirSync(rootDir, { recursive: true });
            }
            const seasonDir = path_1.default.resolve(rootDir, `season_${seasonPayload.season_num}`);
            if (!fs_1.default.existsSync(seasonDir)) {
                fs_1.default.mkdirSync(seasonDir, { recursive: true });
            }
            const basePath = `/source/series/${rootFolderName}`;
            const isLatestSeason = currantSeries.seasons < seasonPayload.season_num
                ? currantSeries.seasons + 1
                : currantSeries.seasons;
            const modifiedData = {
                seasons: isLatestSeason,
                poster_src: `${basePath}/season_${isLatestSeason}/assets/poster.jpg`,
                thumb_src: `${basePath}/season_${isLatestSeason}/assets/poster.jpg`,
            };
            const [affectedRows] = yield series_1.default.update(Object.assign({}, modifiedData), { where: { id: currantSeries.id }, returning: false });
            if (affectedRows > 0) {
                const seasonDir = path_1.default.join(rootDir, `season_${modifiedData.seasons}`);
                if (!fs_1.default.existsSync(seasonDir)) {
                    fs_1.default.mkdirSync(seasonDir, { recursive: true });
                }
                const assetsDir = path_1.default.join(seasonDir, "assets");
                if (!fs_1.default.existsSync(assetsDir)) {
                    fs_1.default.mkdirSync(assetsDir, { recursive: true });
                }
                yield Promise.all(seasonPayload.episodes.map((episode) => episodes_1.default.addEpisode(episode, seasonPayload.series_id, basePath)));
            }
            const updatedSeries = yield series_1.default.findByPk(seasonPayload.series_id);
            return res.status(201).json({
                message: `New season has been added succesfully to the series '${updatedSeries === null || updatedSeries === void 0 ? void 0 : updatedSeries.id}'`,
                updatedSeries,
            });
        }
        catch (error) {
            return res.status(500).json({
                message: "Couldn't add the new season.",
                faultyApiRoute: "/series/add-season",
                errorDetails: error,
            });
        }
    });
};
const deleteSeason = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id: seriesId, season } = req.query;
            const series = yield series_1.default.findByPk(seriesId);
            if (!series) {
                return res.status(404).json({
                    message: `Series with '${seriesId}' was not found.`,
                    faultyId: seriesId,
                });
            }
            if (series.seasons >= Number(season)) {
                const seasonDir = path_1.default.resolve(__dirname, "../../..", "database", "content", "series", (0, formating_1.convertTitle)(series.title), `season_${season}`);
                if (fs_1.default.existsSync(seasonDir)) {
                    fs_1.default.rmSync(seasonDir, { recursive: true, force: true });
                }
            }
            else {
                return res.status(404).json({
                    message: `Season was not found.`,
                    faltySeason: season,
                    seriesId,
                });
            }
            yield episode_1.default.destroy({ where: { series_id: seriesId, season } });
            return res.status(200).json({
                message: `Season ${season} from '${series.id}' and its corresponding files were succesfully deleted from the database.`,
            });
        }
        catch (error) {
            console.log("Server error '/series/delete-season': ", error);
            return res.status(500).json({
                message: "Couldn't delete the given season.",
                faultyApiRoute: "/series/delete-season",
                errorDetails: error,
            });
        }
    });
};
const getSeason = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id: seriesId, season } = req.query;
            const series = yield series_1.default.findByPk(seriesId);
            if (!series) {
                return res
                    .status(404)
                    .json({ message: `Series ${seriesId} not found.`, faultyId: seriesId });
            }
            if (series.seasons < Number(season)) {
                return res.status(404).json({
                    message: `Season ${season} was not found.`,
                    fautlySeason: season,
                });
            }
            const episodePayload = yield episode_1.default.findAll({
                where: { series_id: seriesId, season },
            });
            return res.status(200).json({
                message: `Season ${season} from series ${series.id} was retrieved successfully`,
                totalEpisodes: episodePayload.length,
                episodePayload,
            });
        }
        catch (error) {
            console.log("Server error '/series/season': ", error);
            return res.status(500).json({
                message: "Couldn't retrieve season.",
                faultyApiRoute: "/series/season",
                errorDetails: error,
            });
        }
    });
};
const getSeriesByTitle = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const keywords = req.query.keywords.split(" ");
            const series = yield series_1.default.findAll({
                where: {
                    [sequelize_1.Op.or]: keywords.map((word) => ({
                        title: { [sequelize_1.Op.like]: `%${word}%` },
                    })),
                },
            });
            const ranked = series
                .map((series) => {
                const matchCount = keywords.filter((word) => series.title.toLowerCase().includes(word.toLowerCase())).length;
                return { series, matchCount };
            })
                .sort((a, b) => b.matchCount - a.matchCount);
            if (ranked.length > 0) {
                const genres = yield media_genres_association_1.default.findAll({
                    attributes: [],
                    include: [{ model: genre_1.default, attributes: ["id", "genre"] }],
                    where: { series_id: ranked[0].series.id },
                });
                return res.status(200).json({
                    message: `The best match movie based on the search was found.`,
                    series: Object.assign(Object.assign({}, ranked[0].series.dataValues), { genres }),
                });
            }
            else {
                return res.status(404).json({
                    message: "No match was found.",
                });
            }
        }
        catch (error) {
            console.log("Server error '/series/get-by-title': ", error);
            return res.status(500).json({
                message: "Couldn't retrive the given movie.",
                apiFaultyRoute: "/series/get-by-title",
                errorDetails: error,
            });
        }
    });
};
const loadSeries = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const seriesId = req.query.id;
            const series = yield series_1.default.findByPk(seriesId, {
                include: [
                    {
                        model: episode_1.default,
                    },
                    { model: genre_1.default, attributes: ["id", "genre"] },
                    { model: listing_1.default },
                    { model: collection_1.default },
                    { model: personalization_1.default },
                ],
                order: [
                    [episode_1.default, "season", "ASC"],
                    [episode_1.default, "episode_num", "ASC"],
                ],
            });
            if (series) {
                return res.status(200).json({
                    message: `Series '${series.id}' retrieved succesfully.`,
                    mediaData: series,
                });
            }
            else {
                return res.status(404).json({
                    message: `Series ${seriesId} were not found.`,
                    faultyId: seriesId,
                });
            }
        }
        catch (error) {
            console.log("Server error '/series/series': ", error);
            return res.status(500).json({
                message: "Couldn't retrieve series.",
                faultyApiRoute: "/series/series",
                errorDetails: error,
            });
        }
    });
};
const seriesController = {
    addSeries,
    updateSeries,
    deleteSeries,
    addSeason,
    deleteSeason,
    loadSeries,
    getSeason,
    getSeriesByTitle,
};
exports.default = seriesController;
