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
const movie_1 = __importDefault(require("../models/movie"));
const series_1 = __importDefault(require("../models/series"));
const listing_1 = __importDefault(require("../models/listing"));
const media_listing_association_1 = __importDefault(require("../models/media-listing-association"));
const formating_1 = require("../util/functions/formating");
const personalization_1 = __importDefault(require("../models/personalization"));
const genre_1 = __importDefault(require("../models/genre"));
const media_genres_association_1 = __importDefault(require("../models/media-genres-association"));
const sequelize_2 = require("sequelize");
const addListing = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const listingCheck = yield listing_1.default.findOne({
                where: { name: req.body.name },
            });
            if (listingCheck) {
                return res.status(409).json({
                    message: `Listing with the name '${req.body.name}' already exisits.`,
                    faultyName: req.body.name,
                });
            }
            const newListing = yield listing_1.default.create({
                name: req.body.name,
                icon_src: `/assets/listings/${(0, formating_1.convertTitle)(req.body.name)}.svg`,
            });
            return res.status(201).json({
                message: `New listing '${newListing.id}' created successfully.`,
                newListing,
            });
        }
        catch (error) {
            console.log("Server error '/listings/add-listing': ", error);
            return res.status(500).json({
                message: `Couldn't add the new listing.`,
                apiFaultyRoute: "/listings/add-listing",
                errorDetails: error,
            });
        }
    });
};
const updateListing = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const currantListing = yield listing_1.default.findOne({
                where: { name: req.body.oldName },
            });
            if (!currantListing) {
                return res.status(404).json({
                    message: `Listing '${req.body.oldName}' was not found.`,
                    faultyName: req.body.oldName,
                });
            }
            const modifedData = {
                name: req.body.newName,
                icon_src: `/assets/listings/${(0, formating_1.convertTitle)(req.body.newName)}.svg`,
            };
            yield fs_1.default.rename(path_1.default.resolve(__dirname, "../../..", "database", "client-assets", "listings", `${(0, formating_1.convertTitle)(currantListing.name)}.svg`), path_1.default.resolve(__dirname, "../../..", "database", "client-assets", "listings", `${(0, formating_1.convertTitle)(modifedData.name)}.svg`), (err) => {
                if (err) {
                    console.error("Error renaming file:", err);
                    throw err;
                }
            });
            yield listing_1.default.update(Object.assign({}, modifedData), { where: { name: currantListing.name }, returning: false });
            return res.status(201).json({
                message: `Listing '${currantListing.id}' was updated succesfully.`,
                updatedListing: Object.assign({ id: currantListing.id }, modifedData),
            });
        }
        catch (error) {
            console.log("Server error '/listings/update-listing': ", error);
            return res.status(500).json({
                message: `Couldn't update the new listing.`,
                apiFaultyRoute: "/listings/update-listing",
                errorDetails: error,
            });
        }
    });
};
const deleteListing = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const deletedListing = yield listing_1.default.findByPk(req.query.id);
            if (!deletedListing) {
                return res.status(404).json({
                    message: `Listing '${req.query.id}' was not found.`,
                    faultyId: req.query.id,
                });
            }
            switch (deletedListing.id) {
                case "dc675045-7c1f-4693-8712-b9e53ff3cc6b":
                case "5473d2da-b919-4a68-83ef-006809c38735":
                case "e50b9871-6a3f-4c59-895d-8f8064d23e52":
                case "3e89fe9b-7dbe-4171-a206-e3a0fa9eb289":
                case "0a6c6448-46eb-4c4e-9fee-c1a011ddb4db":
                case "799779fd-8732-40f2-8949-dd2447f4ebe4":
                    return res.status(403).json({
                        message: "You can't delete a core listing.",
                        coreListing: deletedListing,
                    });
            }
            yield media_listing_association_1.default.destroy({
                where: { listing_id: deletedListing.id },
            });
            yield fs_1.default.unlink(path_1.default.resolve(__dirname, "../../..", "database", "client-assets", "listings", `${(0, formating_1.convertTitle)(deletedListing.name)}.svg`), (err) => {
                if (err) {
                    console.error("Error renaming file:", err);
                    throw err;
                }
            });
            yield deletedListing.destroy();
            return res.status(201).json({
                message: `Listing '${deletedListing.id}' was deleted succesfully.`,
            });
        }
        catch (error) {
            console.log("Server error '/listings/delete-listing': ", error);
            return res.status(500).json({
                message: `Couldn't delete the listing.`,
                apiFaultyRoute: "/listings/delete-listing",
                errorDetails: error,
            });
        }
    });
};
const addToListing = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const listingPayload = req.body;
            const media = listingPayload.type === "movie"
                ? yield movie_1.default.findByPk(listingPayload.mediaId)
                : yield series_1.default.findByPk(listingPayload.mediaId);
            if (!media) {
                return res.status(404).json({
                    message: `Media content '${listingPayload.mediaId}'  was not found.`,
                    faultyId: listingPayload.mediaId,
                });
            }
            const listingValidation = yield listing_1.default.findByPk(listingPayload.listingId);
            if (!listingValidation) {
                return res.status(404).json({
                    message: `Invalid listings '${listingPayload.listingId}'.`,
                    faultyId: listingPayload.listingId,
                });
            }
            const isAlreadyExistsing = listingPayload.type === "movie"
                ? yield media_listing_association_1.default.findOne({
                    where: { movie_id: media.id, listing_id: listingPayload.listingId },
                })
                : yield media_listing_association_1.default.findOne({
                    where: {
                        series_id: media.id,
                        listing_id: listingPayload.listingId,
                    },
                });
            if (isAlreadyExistsing) {
                return res.status(201).json({
                    message: `Media content '${media.id}' is already added to '${isAlreadyExistsing.listing_id}'.`,
                    associationId: isAlreadyExistsing.association_id,
                });
            }
            else {
                yield media_listing_association_1.default.create(listingPayload.type === "movie"
                    ? {
                        movie_id: listingPayload.mediaId,
                        listing_id: listingPayload.listingId,
                    }
                    : {
                        series_id: listingPayload.mediaId,
                        listing_id: listingPayload.listingId,
                    });
                return res.status(201).json({
                    message: `Media content '${media.id}' was added successfully to listing '${listingPayload.listingId}'`,
                });
            }
        }
        catch (error) {
            console.log("Server error '/listings/add-to': ", error);
            return res.status(500).json({
                message: `Couldn't add the provided media to the listing.`,
                apiFaultyRoute: "/listings/add-to",
                errorDetails: error,
            });
        }
    });
};
const removeFromListing = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const listingPayload = req.body;
            const media = listingPayload.type === "movie"
                ? yield movie_1.default.findByPk(listingPayload.mediaId)
                : yield series_1.default.findByPk(listingPayload.mediaId);
            if (!media) {
                return res.status(404).json({
                    message: `Media content '${listingPayload.mediaId}'  was not found.`,
                    faultyId: listingPayload.mediaId,
                });
            }
            const listingValidation = yield listing_1.default.findByPk(listingPayload.listingId);
            if (!listingValidation) {
                return res.status(404).json({
                    message: `Invalid listings '${listingPayload.listingId}'.`,
                    faultyId: listingPayload.listingId,
                });
            }
            listingPayload.type === "movie"
                ? yield media_listing_association_1.default.destroy({
                    where: { movie_id: media.id, listing_id: listingPayload.listingId },
                })
                : yield media_listing_association_1.default.destroy({
                    where: {
                        series_id: media.id,
                        listing_id: listingPayload.listingId,
                    },
                });
            return res.status(201).json({
                message: `Media content '${media.id}' was removed successfully from listing '${listingPayload.listingId}'`,
            });
        }
        catch (error) {
            console.log("Server error '/listings/remove-from': ", error);
            return res.status(500).json({
                message: `Couldn't remove the provided media from the listing.`,
                apiFaultyRoute: "/listings/remove-from",
                errorDetails: error,
            });
        }
    });
};
const getListings = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const listings = yield listing_1.default.findAll();
            if (listings) {
                return res
                    .status(200)
                    .json({ message: "Listings retrieved successfully.", listings });
            }
            else {
                return res.status(404).json({ message: "Listings were not found." });
            }
        }
        catch (error) {
            console.log("Server error '/listings/get-listings': ", error);
            return res.status(500).json({
                message: `Couldn't retrieve the listings.`,
                apiFaultyRoute: "/listings/get-listings",
                errorDetails: error,
            });
        }
    });
};
const getMediaListings = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { type, mediaId } = req.body;
            const media = type === "movie"
                ? yield movie_1.default.findByPk(mediaId)
                : yield series_1.default.findByPk(mediaId);
            if (media) {
                return res.status(404).json({
                    message: `Media '${mediaId}' can't be found.`,
                    faultyId: mediaId,
                });
            }
            const listingsId = yield media_listing_association_1.default.findAll({
                where: { media_id: mediaId },
                attributes: ["media_id", "listing_id"],
            });
            return res.status(200).json({
                message: `Listings for '${mediaId}' were retrieved successfully.`,
                listingsId,
            });
        }
        catch (error) {
            console.log("Server error '/listings/media-listings': ", error);
            return res.status(500).json({
                message: `Couldn't retrieve the listings.`,
                apiFaultyRoute: "/listings/media-listings",
                errorDetails: error,
            });
        }
    });
};
const getRecordsFromListing = function (req, res) {
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
                            model: listing_1.default,
                            where: { id: catalogueId },
                        },
                    ],
                });
                moviesResults = yield media_listing_association_1.default.findAll({
                    where: { listing_id: catalogueId },
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
                            model: listing_1.default,
                            where: { id: catalogueId },
                        },
                    ],
                });
                seriesResults = yield media_listing_association_1.default.findAll({
                    where: { listing_id: catalogueId },
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
                message: `Records from listing '${catalogueId}' fetched successfully`,
                records: combinedResults,
                pagination: {
                    page,
                    pageSize,
                    totalResults: totalCount,
                    totalPages: Math.ceil(totalCount / pageSize),
                },
            });
        }
        catch (error) {
            console.log("Server error '/listings/get-media': ", error);
            return res.status(500).json({
                message: `Couldn't retrieve the media from the listing.`,
                apiFaultyRoute: "/listings/get-media",
                errorDetails: error,
            });
        }
    });
};
const listingsController = {
    addListing,
    deleteListing,
    updateListing,
    addToListing,
    removeFromListing,
    getListings,
    getMediaListings,
    getRecordsFromListing,
};
exports.default = listingsController;
