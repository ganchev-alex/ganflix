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
const series_1 = __importDefault(require("../models/series"));
const episode_1 = __importDefault(require("../models/episode"));
const formating_1 = require("../util/functions/formating");
const addEpisode = function (episodePayload, seriesId, basePath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const series = yield series_1.default.findByPk(seriesId);
            if (!series) {
                return;
            }
            const episodeData = {
                series_id: seriesId,
                title: episodePayload.title,
                season: episodePayload.season,
                episode_num: episodePayload.episode_num,
                duration: episodePayload.duration,
                stream_src: `${basePath}/season_${episodePayload.season}/s${episodePayload.season}_ep${episodePayload.episode_num}_stream.mp4`,
                en_subtitles: episodePayload.en_subtitles
                    ? `${basePath}/season_${episodePayload.season}/s${episodePayload.season}_ep${episodePayload.episode_num}_en-sub.vtt`
                    : null,
                bg_subtitles: episodePayload.bg_subtitles
                    ? `${basePath}/season_${episodePayload.season}/s${episodePayload.season}_ep${episodePayload.episode_num}_bg-sub.vtt`
                    : null,
            };
            yield episode_1.default.create(Object.assign({}, episodeData));
            return;
        }
        catch (error) {
            console.log("Server error '/series/add-series': ", error);
        }
    });
};
const addEpisodes = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const episodesPayload = req.body;
            const series = yield series_1.default.findByPk(episodesPayload.series_id);
            if (!series) {
                return res.status(404).json({
                    message: `Series with '${episodesPayload.series_id}' was not found.`,
                    faultyId: episodesPayload.series_id,
                });
            }
            yield Promise.all(episodesPayload.newEpisodes.map((episode) => {
                if (episode.season <= series.seasons) {
                    addEpisode(episode, series.id, `/source/series/${(0, formating_1.convertTitle)(series.title)}`);
                }
            }));
            return res.status(201).json({
                message: `New episodes to series ${series.id} have been added successfully.`,
            });
        }
        catch (error) {
            console.log("Server error '/episodes/add-episodes': ", error);
            return res.status(500).json({
                message: `Couldn't add new series.`,
                apiFaultyRoute: "/episodes/add-episode",
                errorDetails: error,
            });
        }
    });
};
const deleteEpisodes = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const episodeId = req.query.id;
            const deletingRecord = yield episode_1.default.findByPk(episodeId);
            if (!deletingRecord) {
                return res
                    .status(404)
                    .json({ message: `Episode not found ${episodeId}` });
            }
            yield deletingRecord.destroy();
            return res
                .status(201)
                .json({ message: `Episode '${episodeId} was deleted successfully.'` });
        }
        catch (error) {
            console.log("Server error '/episodes/delete-episodes': ", error);
            return res.status(500).json({
                message: `Couldn't delete episode.`,
                apiFaultyRoute: "/episodes/delete-episode",
                errorDetails: error,
            });
        }
    });
};
const getEpisode = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const episodeId = req.query.id;
            const episode = yield episode_1.default.findByPk(episodeId);
            if (episode) {
                return res.status(200).json({
                    message: `Episode ${episode.id} retrieved successfully`,
                    episode,
                });
            }
            else {
                return res.status(404).json({
                    message: `Episode ${episodeId} not found.`,
                    faultyId: episodeId,
                });
            }
        }
        catch (error) {
            console.log("Server error '/episodes/episode': ", error);
            return res.status(500).json({
                message: `Couldn't retrieve episode.`,
                apiFaultyRoute: "/episodes/episode",
                errorDetails: error,
            });
        }
    });
};
const episodeController = {
    addEpisode,
    addEpisodes,
    deleteEpisodes,
    getEpisode,
};
exports.default = episodeController;
