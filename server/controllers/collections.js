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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sequelize_1 = __importDefault(require("sequelize"));
const sequelize_2 = require("sequelize");
const movie_1 = __importDefault(require("../models/movie"));
const series_1 = __importDefault(require("../models/series"));
const collection_1 = __importDefault(require("../models/collection"));
const media_collection_association_1 = __importDefault(require("../models/media-collection-association"));
const media_genres_association_1 = __importDefault(require("../models/media-genres-association"));
const formating_1 = require("../util/functions/formating");
const personalization_1 = __importDefault(require("../models/personalization"));
const genre_1 = __importDefault(require("../models/genre"));
const addCollection = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const collectionCheck = yield collection_1.default.findOne({
                where: { name: req.body.name },
            });
            if (collectionCheck) {
                return res
                    .status(409)
                    .json({ message: "Collection with this name already exists." });
            }
            const newCollection = yield collection_1.default.create({
                name: req.body.name,
                icon_src: `/assets/collections/${(0, formating_1.convertTitle)(req.body.name)}.svg`,
            });
            return res.status(201).json({
                message: `New collection '${newCollection.id}' created successfully.`,
                newCollection,
            });
        }
        catch (error) {
            console.log("Server error '/collection/add-collection': ", error);
            return res.status(500).json({
                message: `Couldn't add the new collection.`,
                apiFaultyRoute: "/collection/add-collection",
                errorDetails: error,
            });
        }
    });
};
const updateCollection = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const currantCollection = yield collection_1.default.findOne({
                where: { name: req.body.oldName },
            });
            if (!currantCollection) {
                return res.status(404).json({
                    message: `Collection '${req.body.oldName}' was not found.`,
                    faultyId: req.body.oldName,
                });
            }
            const modifedData = {
                name: req.body.newName,
                icon_src: `/assets/collections/${(0, formating_1.convertTitle)(req.body.newName)}.svg`,
            };
            yield fs_1.default.rename(path_1.default.resolve(__dirname, "../../..", "database", "client-assets", "collections", `${(0, formating_1.convertTitle)(currantCollection.name)}.svg`), path_1.default.resolve(__dirname, "../../..", "database", "client-assets", "collections", `${(0, formating_1.convertTitle)(modifedData.name)}.svg`), (err) => {
                if (err) {
                    console.error("Error renaming file:", err);
                }
            });
            yield collection_1.default.update(Object.assign({}, modifedData), { where: { name: currantCollection.name }, returning: false });
            return res.status(201).json({
                message: `Collection '${currantCollection.id}' was updated succesfully.`,
                updatedCollection: Object.assign({ id: currantCollection.id }, modifedData),
            });
        }
        catch (error) {
            console.log("Server error '/collections/update-collection': ", error);
            return res.status(500).json({
                message: `Couldn't add the new collection.`,
                apiFaultyRoute: "/collections/update-collection",
                errorDetails: error,
            });
        }
    });
};
const deletedCollection = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const deletedCollection = yield collection_1.default.findOne({
                where: { name: req.query.name },
            });
            if (!deletedCollection) {
                return res.status(404).json({
                    message: `Collection '${req.query.name}' was not found.`,
                    faultyName: req.query.name,
                });
            }
            yield media_collection_association_1.default.destroy({
                where: { collection_id: deletedCollection.id },
            });
            yield fs_1.default.unlink(path_1.default.resolve(__dirname, "../../..", "database", "client-assets", "collections", `${(0, formating_1.convertTitle)(deletedCollection.name)}.svg`), (err) => {
                if (err) {
                    console.error("Error renaming file:", err);
                }
            });
            yield deletedCollection.destroy();
            return res.status(201).json({
                message: `Collection '${deletedCollection.id}' was deleted succesfully.`,
            });
        }
        catch (error) {
            console.log("Server error '/collections/delete-collection': ", error);
            return res.status(500).json({
                message: `Couldn't delete the collection.`,
                apiFaultyRoute: "/collections/delete-collection",
                errorDetails: error,
            });
        }
    });
};
const addToCollection = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const collectionPayload = req.body;
            const media = collectionPayload.type === "movie"
                ? yield movie_1.default.findByPk(collectionPayload.mediaId)
                : yield series_1.default.findByPk(collectionPayload.mediaId);
            if (!media) {
                return res.status(404).json({
                    message: `Media content '${collectionPayload.mediaId}'  was not found.`,
                    faultyId: collectionPayload.mediaId,
                });
            }
            const collectionValidation = yield collection_1.default.findByPk(collectionPayload.collectionId);
            if (!collectionValidation) {
                return res.status(404).json({
                    message: `Invalid collection '${collectionPayload.collectionId}'.`,
                    faultyId: collectionPayload.collectionId,
                });
            }
            const isAlreadyExistsing = collectionPayload.type === "movie"
                ? yield media_collection_association_1.default.findOne({
                    where: {
                        movie_id: media.id,
                        collection_id: collectionPayload.collectionId,
                    },
                })
                : yield media_collection_association_1.default.findOne({
                    where: {
                        series_id: media.id,
                        collection_id: collectionPayload.collectionId,
                    },
                });
            if (isAlreadyExistsing) {
                return res.status(201).json({
                    message: `Media content '${media.id}' is already added to collection '${isAlreadyExistsing.collection_id}'.`,
                    associationId: isAlreadyExistsing.association_id,
                });
            }
            else {
                yield media_collection_association_1.default.create(collectionPayload.type === "movie"
                    ? {
                        movie_id: collectionPayload.mediaId,
                        collection_id: collectionPayload.collectionId,
                    }
                    : {
                        series_id: collectionPayload.mediaId,
                        collection_id: collectionPayload.collectionId,
                    });
                return res.status(201).json({
                    message: `Media content '${media.id}' was added successfully to collection '${collectionPayload.collectionId}'`,
                });
            }
        }
        catch (error) {
            console.log("Server error '/collections/add-to': ", error);
            return res.status(500).json({
                message: `Couldn't add the provided media to the collection.`,
                apiFaultyRoute: "/collections/add-to",
                errorDetails: error,
            });
        }
    });
};
const removeFromCollection = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const collectionPayload = req.body;
            const media = collectionPayload.type === "movie"
                ? yield movie_1.default.findByPk(collectionPayload.mediaId)
                : yield series_1.default.findByPk(collectionPayload.mediaId);
            if (!media) {
                return res.status(404).json({
                    message: `Media content '${collectionPayload.mediaId}'  was not found.`,
                    faultyId: collectionPayload.mediaId,
                });
            }
            const collectionValidation = yield collection_1.default.findByPk(collectionPayload.collectionId);
            if (!collectionValidation) {
                return res.status(404).json({
                    message: `Invalid collection '${collectionPayload.collectionId}'.`,
                    faultyId: collectionPayload.collectionId,
                });
            }
            collectionPayload.type === "movie"
                ? yield media_collection_association_1.default.destroy({
                    where: {
                        movie_id: media.id,
                        collection_id: collectionPayload.collectionId,
                    },
                })
                : yield media_collection_association_1.default.destroy({
                    where: {
                        series_id: media.id,
                        collection_id: collectionPayload.collectionId,
                    },
                });
            return res.status(201).json({
                message: `Media content '${media.id}' was removed successfully from collection '${collectionPayload.collectionId}'`,
            });
        }
        catch (error) {
            console.log("Server error '/collections/remove-from': ", error);
            return res.status(500).json({
                message: `Couldn't remove the provided media from the collection.`,
                apiFaultyRoute: "/collcctions/remove-from",
                errorDetails: error,
            });
        }
    });
};
const getCollections = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const collections = yield collection_1.default.findAll();
            if (collections) {
                return res
                    .status(200)
                    .json({ message: "Collections retrieved successfully.", collections });
            }
            else {
                return res.status(404).json({ message: "Collections were not found." });
            }
        }
        catch (error) {
            console.log("Server error '/collections/get-collections': ", error);
            return res.status(500).json({
                message: `Couldn't retrieve the collection.`,
                apiFaultyRoute: "/collections/get-collections",
                errorDetails: error,
            });
        }
    });
};
const getRecordsFromCollection = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { type, catalogueId, page, pageSize, filters, keywords } = req.body;
            const pageOffset = (page - 1) * pageSize;
            let orderByClause;
            switch (filters.orderBy) {
                case "Most Recently Added":
                    orderByClause = [["createdAt", "DESC"]];
                    break;
                case "Least Recently Added":
                    orderByClause = [["createdAt", "ASC"]];
                    break;
                default:
                    orderByClause = [["createdAt", "DESC"]];
            }
            let movieWhereClause = {};
            let seriesWhereClause = {};
            const keywordsSearch = keywords.split(" ");
            if (keywordsSearch.length > 0 && (type === "all" || type === "movies")) {
                movieWhereClause = {
                    [sequelize_2.Op.or]: keywordsSearch.map((word) => ({
                        title: { [sequelize_2.Op.like]: `%${word}%` },
                    })),
                };
            }
            if (keywordsSearch.length > 0 && (type === "all" || type === "series")) {
                seriesWhereClause = {
                    [sequelize_2.Op.or]: keywordsSearch.map((word) => ({
                        title: { [sequelize_2.Op.like]: `%${word}%` },
                    })),
                };
            }
            if (filters.genreId !== "default" &&
                (type === "all" || type === "movies")) {
                const moviesAssociations = yield media_genres_association_1.default.findAll({
                    where: { genre_id: filters.genreId },
                });
                const moviesIds = moviesAssociations
                    .map((a) => a.movie_id)
                    .filter((id) => id !== undefined);
                if (movieWhereClause.id) {
                    movieWhereClause.id = {
                        [sequelize_2.Op.in]: [
                            ...moviesIds.filter((id) => movieWhereClause.id[sequelize_2.Op.in].includes(id)),
                        ],
                    };
                }
                else {
                    movieWhereClause.id = { [sequelize_2.Op.in]: [...moviesIds] };
                }
            }
            if (filters.genreId !== "default" &&
                (type === "all" || type === "series")) {
                const seriesAssosiations = yield media_genres_association_1.default.findAll({
                    where: { genre_id: filters.genreId },
                });
                const seriesIds = seriesAssosiations
                    .map((a) => a.series_id)
                    .filter((id) => id !== undefined);
                if (seriesWhereClause.id) {
                    seriesWhereClause.id = {
                        [sequelize_2.Op.in]: [
                            ...seriesIds.filter((id) => seriesWhereClause.id[sequelize_2.Op.in].includes(id)),
                        ],
                    };
                }
                else {
                    seriesWhereClause.id = { [sequelize_2.Op.in]: [...seriesIds] };
                }
            }
            if (filters.year !== "All" && (type === "all" || type === "movies")) {
                movieWhereClause = Object.assign(Object.assign({}, movieWhereClause), { [sequelize_2.Op.and]: [
                        ...(movieWhereClause[sequelize_2.Op.and] || []),
                        sequelize_1.default.where(sequelize_1.default.fn("strftime", "%Y", sequelize_1.default.col("release_date")), filters.year),
                    ] });
            }
            if (filters.year !== "All" && (type === "all" || type === "series")) {
                seriesWhereClause = Object.assign(Object.assign({}, seriesWhereClause), { [sequelize_2.Op.and]: [
                        ...(seriesWhereClause[sequelize_2.Op.and] || []),
                        sequelize_1.default.where(sequelize_1.default.fn("strftime", "%Y", sequelize_1.default.col("release_date")), filters.year),
                    ] });
            }
            let moviesResults = [];
            let seriesResults = [];
            let totalCount = 0;
            if (type === "movies" || type === "all") {
                totalCount += yield movie_1.default.count({
                    where: movieWhereClause,
                    include: [
                        {
                            model: collection_1.default,
                            where: { id: catalogueId },
                        },
                    ],
                });
                moviesResults = yield media_collection_association_1.default.findAll({
                    where: { collection_id: catalogueId },
                    include: [
                        {
                            model: movie_1.default,
                            where: movieWhereClause,
                            include: [{ model: personalization_1.default }, { model: genre_1.default }],
                        },
                    ],
                    limit: pageSize,
                    offset: pageOffset,
                    order: orderByClause,
                });
            }
            if (type === "series" || type === "all") {
                totalCount += yield series_1.default.count({
                    where: seriesWhereClause,
                    include: [
                        {
                            model: collection_1.default,
                            where: { id: catalogueId },
                        },
                    ],
                });
                seriesResults = yield media_collection_association_1.default.findAll({
                    where: { collection_id: catalogueId },
                    include: [
                        {
                            model: series_1.default,
                            where: seriesWhereClause,
                            include: [{ model: personalization_1.default }, { model: genre_1.default }],
                        },
                    ],
                    limit: pageSize,
                    offset: pageOffset,
                    order: orderByClause,
                });
            }
            const combinedResults = [...moviesResults, ...seriesResults];
            return res.status(200).json({
                message: `Records from collection '${catalogueId}' fetched successfully`,
                records: combinedResults,
                pagination: {
                    page,
                    pageSize,
                    totalResults: totalCount,
                    totalPages: Math.ceil(totalCount / pageSize),
                },
            });
        }
        catch (_a) { }
    });
};
const collectionController = {
    addCollection,
    updateCollection,
    deletedCollection,
    addToCollection,
    removeFromCollection,
    getCollections,
    getRecordsFromCollection,
};
exports.default = collectionController;
