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
const media_listing_association_1 = __importDefault(require("../models/media-listing-association"));
const movie_1 = __importDefault(require("../models/movie"));
const series_1 = __importDefault(require("../models/series"));
const genre_1 = __importDefault(require("../models/genre"));
const listing_1 = __importDefault(require("../models/listing"));
const media_genres_association_1 = __importDefault(require("../models/media-genres-association"));
const personalization_1 = __importDefault(require("../models/personalization"));
//#region select-clauses
const movieAttributes = [
    "id",
    "title",
    "description",
    "duration",
    "release_date",
    "poster_src",
    "thumb_src",
];
const seriesAttributes = [
    "id",
    "title",
    "description",
    "seasons",
    "release_date",
    "poster_src",
    "thumb_src",
];
//#endregion
const getRandomSelection = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { type, limit } = req.body;
            let movieRecords = [];
            let seriesRecords = [];
            if (type === "movies" || type === "all") {
                movieRecords = yield movie_1.default.findAll({
                    order: sequelize_1.Sequelize.fn("RANDOM"),
                    include: [
                        {
                            model: listing_1.default,
                            where: {
                                id: {
                                    [sequelize_1.Op.notIn]: [
                                        "799779fd-8732-40f2-8949-dd2447f4ebe4",
                                        "0a6c6448-46eb-4c4e-9fee-c1a011ddb4db",
                                    ],
                                },
                            },
                        },
                        {
                            model: genre_1.default,
                            attributes: ["genre"],
                        },
                    ],
                    limit,
                });
            }
            if (type === "series" || type === "all") {
                seriesRecords = yield series_1.default.findAll({
                    order: sequelize_1.Sequelize.fn("RANDOM"),
                    include: [
                        {
                            model: listing_1.default,
                            where: {
                                id: {
                                    [sequelize_1.Op.notIn]: [
                                        "799779fd-8732-40f2-8949-dd2447f4ebe4",
                                        "0a6c6448-46eb-4c4e-9fee-c1a011ddb4db",
                                    ],
                                },
                            },
                        },
                        {
                            model: genre_1.default,
                            attributes: ["genre"],
                        },
                    ],
                    limit,
                });
            }
            const records = [...movieRecords, ...seriesRecords];
            for (let i = records.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [records[i], records[j]] = [records[j], records[i]];
            }
            return res.status(200).json({
                message: "Randomized selection retrieved succesfully.",
                records,
            });
        }
        catch (error) {
            console.log("Server error '/explore/recent': ", error);
            return res.status(500).json({
                message: `Couldn't retrieve random selection.`,
                apiFaultyRoute: "/explore/recent",
                errorDetails: error,
            });
        }
    });
};
const getRecentlyAdded = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const movieRecords = yield movie_1.default.findAll({
                attributes: [...movieAttributes, "createdAt"],
                order: [["createdAt", "DESC"]],
                include: [
                    { model: genre_1.default, attributes: ["genre"] },
                    { model: listing_1.default, attributes: ["id", "name"] },
                ],
                limit: 8,
            });
            const seriesRecords = yield series_1.default.findAll({
                attributes: [...seriesAttributes, "createdAt"],
                order: [["createdAt", "DESC"]],
                include: [
                    { model: genre_1.default, attributes: ["genre"] },
                    { model: listing_1.default, attributes: ["id", "name"] },
                ],
                limit: 8,
            });
            const records = [...movieRecords, ...seriesRecords].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            return res.status(200).json({
                message: "Recently added shelf was retrieved successfully.",
                records,
            });
        }
        catch (error) {
            console.log("Server error '/explore/recent': ", error);
            return res.status(500).json({
                message: `Couldn't retrieve the shelf.`,
                apiFaultyRoute: "/explore/recent",
                errorDetails: error,
            });
        }
    });
};
const fetchShelf = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { type, listingId, limit } = req.body;
            const records = yield media_listing_association_1.default.findAll({
                attributes: ["createdAt"],
                where: { listing_id: listingId },
                limit,
                include: type === "all"
                    ? [
                        {
                            model: movie_1.default,
                            attributes: movieAttributes,
                            include: [
                                { model: genre_1.default, attributes: ["genre"] },
                                { model: listing_1.default, attributes: ["id", "name"] },
                            ],
                        },
                        {
                            model: series_1.default,
                            attributes: seriesAttributes,
                            include: [
                                { model: genre_1.default, attributes: ["genre"] },
                                { model: listing_1.default, attributes: ["id", "name"] },
                            ],
                        },
                    ]
                    : type == "movies"
                        ? [
                            {
                                model: movie_1.default,
                                attributes: movieAttributes,
                                include: [
                                    { model: genre_1.default, attributes: ["genre"] },
                                    { model: listing_1.default, attributes: ["id", "name"] },
                                ],
                            },
                        ]
                        : [
                            {
                                model: series_1.default,
                                attributes: seriesAttributes,
                                include: [
                                    { model: genre_1.default, attributes: ["genre"] },
                                    { model: listing_1.default, attributes: ["id", "name"] },
                                ],
                            },
                        ],
                order: [["createdAt", "DESC"]],
            });
            return res
                .status(200)
                .json({ message: "Shelf retrieved successfully.", shelf: records });
        }
        catch (error) {
            console.log("Server error '/explore/shelf': ", error);
            return res.status(500).json({
                message: `Couldn't retrieve the shelf.`,
                apiFaultyRoute: "/explore/shelf",
                errorDetails: error,
            });
        }
    });
};
const exploreRecords = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { type, page, pageSize, keywords, filters } = req.body;
            const pageOffset = (page - 1) * pageSize;
            if (type === "all") {
                return res
                    .status(409)
                    .json({ message: "You can't request an exploration of type 'All'." });
            }
            let movieChunkedData = [];
            let seriesChunkedData = [];
            let totalResults = 0;
            //#region order-clause
            let orderByClause;
            switch (filters.orderBy) {
                case "Most Recently Added":
                    orderByClause = [["createdAt", "DESC"]];
                    break;
                case "Least Recently Added":
                    orderByClause = [["createdAt", "ASC"]];
                    break;
                case "Latest Releases":
                    orderByClause = [["release_date", "DESC"]];
                    break;
                case "Earliest Releases":
                    orderByClause = [["release_date", "ASC"]];
                    break;
                case "By Title A-to-Z":
                    orderByClause = [["title", "ASC"]];
                    break;
                case "By Title Z-to-A":
                    orderByClause = [["title", "DESC"]];
                    break;
                default:
                    orderByClause = [["createdAt", "DESC"]];
            }
            //#endregion
            let movieWhereClause = {};
            let seriesWhereClause = {};
            //#region keywords
            const keywordsSearch = keywords.split(" ");
            if (keywordsSearch.length > 0 && type === "movies") {
                movieWhereClause = {
                    [sequelize_1.Op.or]: keywordsSearch.map((word) => ({
                        title: { [sequelize_1.Op.like]: `%${word}%` },
                    })),
                };
            }
            if (keywordsSearch.length > 0 && type === "series") {
                seriesWhereClause = {
                    [sequelize_1.Op.or]: keywordsSearch.map((word) => ({
                        title: { [sequelize_1.Op.like]: `%${word}%` },
                    })),
                };
            }
            //#endregion
            //#region listing-filtering
            if (filters.listingId !== "default" && type === "movies") {
                const moviesAssociations = yield media_listing_association_1.default.findAll({
                    where: { listing_id: filters.listingId },
                });
                const moviesIds = moviesAssociations
                    .map((a) => a.movie_id)
                    .filter((id) => id !== undefined);
                movieWhereClause.id = { [sequelize_1.Op.in]: moviesIds };
            }
            if (filters.listingId !== "default" && type === "series") {
                const seriesAssosiations = yield media_listing_association_1.default.findAll({
                    where: { listing_id: filters.listingId },
                });
                const seriesId = seriesAssosiations
                    .map((s) => s.series_id)
                    .filter((id) => id !== undefined);
                seriesWhereClause.id = { [sequelize_1.Op.in]: seriesId };
            }
            //#endregion
            //#region genre-filtering
            if (filters.genreId !== "default" && type === "movies") {
                const moviesAssociations = yield media_genres_association_1.default.findAll({
                    where: { genre_id: filters.genreId },
                });
                const moviesIds = moviesAssociations
                    .map((a) => a.movie_id)
                    .filter((id) => id !== undefined);
                if (movieWhereClause.id) {
                    movieWhereClause.id = {
                        [sequelize_1.Op.in]: [
                            ...moviesIds.filter((id) => movieWhereClause.id[sequelize_1.Op.in].includes(id)),
                        ],
                    };
                }
                else {
                    movieWhereClause.id = { [sequelize_1.Op.in]: [...moviesIds] };
                }
            }
            if (filters.genreId !== "default" && type === "series") {
                const seriesAssosiations = yield media_genres_association_1.default.findAll({
                    where: { genre_id: filters.genreId },
                });
                const seriesIds = seriesAssosiations
                    .map((a) => a.series_id)
                    .filter((id) => id !== undefined);
                if (seriesWhereClause.id) {
                    seriesWhereClause.id = {
                        [sequelize_1.Op.in]: [
                            ...seriesIds.filter((id) => seriesWhereClause.id[sequelize_1.Op.in].includes(id)),
                        ],
                    };
                }
                else {
                    seriesWhereClause.id = { [sequelize_1.Op.in]: [...seriesIds] };
                }
            }
            //#endregion
            //#region year-filtering
            if (filters.year !== "All" && type === "movies") {
                movieWhereClause = Object.assign(Object.assign({}, movieWhereClause), { [sequelize_1.Op.and]: [
                        ...(movieWhereClause[sequelize_1.Op.and] || []),
                        sequelize_1.Sequelize.where(sequelize_1.Sequelize.fn("strftime", "%Y", sequelize_1.Sequelize.col("release_date")), filters.year),
                    ] });
            }
            if (filters.year !== "All" && type === "series") {
                seriesWhereClause = Object.assign(Object.assign({}, seriesWhereClause), { [sequelize_1.Op.and]: [
                        ...(seriesWhereClause[sequelize_1.Op.and] || []),
                        sequelize_1.Sequelize.where(sequelize_1.Sequelize.fn("strftime", "%Y", sequelize_1.Sequelize.col("release_date")), filters.year),
                    ] });
            }
            //#endregion
            //#region general-fetching
            if (type === "movies") {
                const { rows, count } = yield movie_1.default.findAndCountAll({
                    attributes: [...movieAttributes, "createdAt"],
                    include: [
                        {
                            model: genre_1.default,
                            attributes: ["genre"],
                        },
                        {
                            model: listing_1.default,
                            attributes: ["id", "name"],
                        },
                    ],
                    limit: pageSize,
                    offset: pageOffset,
                    order: orderByClause,
                    where: movieWhereClause,
                    distinct: true,
                });
                totalResults = count;
                movieChunkedData = rows;
            }
            else {
                const { rows, count } = yield series_1.default.findAndCountAll({
                    attributes: [...seriesAttributes, "createdAt"],
                    include: [
                        {
                            model: genre_1.default,
                            attributes: ["genre"],
                        },
                        {
                            model: listing_1.default,
                            attributes: ["id", "name"],
                        },
                    ],
                    limit: pageSize,
                    offset: pageOffset,
                    order: orderByClause,
                    where: seriesWhereClause,
                    distinct: true,
                });
                totalResults = count;
                seriesChunkedData = rows;
            }
            return res.status(200).json({
                message: `Chunked records data fetched successfully`,
                chunkedData: type === "movies" ? movieChunkedData : seriesChunkedData,
                pagination: {
                    currentPage: page,
                    recordsPerPage: pageSize,
                    totalPages: Math.ceil(totalResults / pageSize),
                    totalResults,
                },
            });
        }
        catch (error) {
            console.log("Server error '/explore': ", error);
            return res.status(500).json({
                message: `Couldn't retrieve the media.`,
                apiFaultyRoute: "/explore",
                errorDetails: error,
            });
        }
    });
};
const getFilterOptionsYear = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { type } = req.query;
            const movieYears = type === "all" || type === "movies"
                ? yield movie_1.default.findAll({
                    attributes: [
                        [
                            sequelize_1.Sequelize.fn("strftime", "%Y", sequelize_1.Sequelize.col("release_date")),
                            "year",
                        ],
                    ],
                    group: ["year"],
                    raw: true,
                })
                : [];
            const seriesYears = type === "all" || type === "series"
                ? yield series_1.default.findAll({
                    attributes: [
                        [
                            sequelize_1.Sequelize.fn("strftime", "%Y", sequelize_1.Sequelize.col("release_date")),
                            "year",
                        ],
                    ],
                    group: ["year"],
                    raw: true,
                })
                : [];
            const years = [
                ...new Set([...movieYears, ...seriesYears]
                    .map((obj) => obj.year)
                    .sort((a, b) => b - a)),
            ];
            return res.status(200).json({
                message: "Years options for the filter were retrieved successfully.",
                years,
            });
        }
        catch (error) {
            console.log("Server error '/explore/year-filter': ", error);
            return res.status(500).json({
                message: `Couldn't retrieve years options for the filter.`,
                apiFaultyRoute: "/explore",
                errorDetails: error,
            });
        }
    });
};
const getTopSelection = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { type, limit } = req.query;
            const media = yield media_listing_association_1.default.findAll({
                where: {
                    listing_id: "dc675045-7c1f-4693-8712-b9e53ff3cc6b",
                    [`${type}_id`]: { [sequelize_1.Op.not]: null },
                },
                include: [
                    {
                        model: type === "movie" ? movie_1.default : series_1.default,
                        include: [
                            {
                                model: genre_1.default,
                            },
                        ],
                    },
                ],
                order: [["createdAt", "ASC"]],
                limit,
            });
            const topSelection = media
                .map((record) => (type === "movie" ? record.Movie : record.Series))
                .filter((s) => s !== null);
            return res.status(200).json({
                message: "Top selection was retrieved successfully.",
                topSelection,
            });
        }
        catch (error) {
            console.log("Server error '/explore/top-selection': ", error);
            return res.status(500).json({
                message: `Couldn't retrieve top selection.`,
                apiFaultyRoute: "/explore/top-selection",
                errorDetails: error,
            });
        }
    });
};
const titlesYouHaveLoved = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const records = req.body.type === "movies"
                ? yield movie_1.default.findAll({
                    where: {
                        id: { [sequelize_1.Op.notIn]: req.body.exclusiveIds },
                    },
                    include: [
                        {
                            model: personalization_1.default,
                            where: {
                                rating: { [sequelize_1.Op.gt]: req.body.rating },
                            },
                        },
                        {
                            model: listing_1.default,
                        },
                        {
                            model: genre_1.default,
                        },
                    ],
                })
                : req.body.type === "series"
                    ? yield series_1.default.findAll({
                        where: {
                            id: { [sequelize_1.Op.notIn]: req.body.exclusiveIds },
                        },
                        include: [
                            {
                                model: personalization_1.default,
                                where: {
                                    rating: { [sequelize_1.Op.gt]: req.body.rating },
                                },
                            },
                            {
                                model: listing_1.default,
                            },
                            {
                                model: genre_1.default,
                            },
                        ],
                    })
                    : [];
            return res
                .status(200)
                .json({ message: "Records retrieved successfully.", records });
        }
        catch (error) {
            console.log("Server error '/explore/top-selection': ", error);
            return res.status(500).json({
                message: `Couldn't retrieve top selection.`,
                apiFaultyRoute: "/explore/top-selection",
                errorDetails: error,
            });
        }
    });
};
const getSimilar = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const targetMedia = req.query.type === "movie"
                ? yield movie_1.default.findByPk(req.query.id, {
                    include: [{ model: genre_1.default, attributes: ["id"] }],
                })
                : yield series_1.default.findByPk(req.query.id, {
                    include: [{ model: genre_1.default, attributes: ["id"] }],
                });
            if (!targetMedia) {
                return res.status(404).json({
                    message: `Media '${req.query.id}' was not found.`,
                    faultyId: req.query.id,
                });
            }
            const targetGenreIds = targetMedia.Genres.map((genre) => genre.id);
            const relatedMoviesId = yield movie_1.default.findAll({
                attributes: [
                    "id",
                    [sequelize_1.Sequelize.fn("COUNT", sequelize_1.Sequelize.col("Genres.id")), "genreCount"],
                ],
                where: {
                    id: { [sequelize_1.Op.not]: req.query.id },
                },
                include: [
                    {
                        model: genre_1.default,
                        where: {
                            id: { [sequelize_1.Op.in]: targetGenreIds },
                        },
                        attributes: [],
                        through: {
                            attributes: [],
                        },
                    },
                ],
                group: ["Movie.id"],
                order: [[sequelize_1.Sequelize.literal("genreCount"), "DESC"]],
            });
            const relatedSeriesId = yield series_1.default.findAll({
                attributes: [
                    "id",
                    [sequelize_1.Sequelize.fn("COUNT", sequelize_1.Sequelize.col("Genres.id")), "genreCount"],
                ],
                where: {
                    id: { [sequelize_1.Op.not]: req.query.id },
                },
                include: [
                    {
                        model: genre_1.default,
                        where: {
                            id: { [sequelize_1.Op.in]: targetGenreIds },
                        },
                        attributes: [],
                        through: {
                            attributes: [],
                        },
                    },
                ],
                group: ["Series.id"],
                order: [[sequelize_1.Sequelize.literal("genreCount"), "DESC"]],
            });
            const relatedMoviesDetails = yield movie_1.default.findAll({
                where: {
                    id: { [sequelize_1.Op.in]: relatedMoviesId.map((movie) => movie.id) },
                },
                include: [
                    {
                        model: genre_1.default,
                        attributes: ["id", "genre"],
                    },
                    {
                        model: listing_1.default,
                    },
                ],
            });
            const relatedSeriesDetails = yield series_1.default.findAll({
                where: {
                    id: { [sequelize_1.Op.in]: relatedSeriesId.map((series) => series.id) },
                },
                include: [
                    {
                        model: genre_1.default,
                        attributes: ["id", "genre"],
                    },
                    {
                        model: listing_1.default,
                    },
                ],
            });
            const relatedMoviesWithCount = relatedMoviesDetails.map((movie) => {
                var _a;
                return (Object.assign(Object.assign({}, movie.toJSON()), { genreCount: (_a = relatedMoviesId
                        .find((m) => m.id === movie.id)) === null || _a === void 0 ? void 0 : _a.getDataValue("genreCount") }));
            });
            const relatedSeriesWithCount = relatedSeriesDetails.map((series) => {
                var _a;
                return (Object.assign(Object.assign({}, series.toJSON()), { genreCount: (_a = relatedSeriesId
                        .find((s) => s.id === series.id)) === null || _a === void 0 ? void 0 : _a.getDataValue("genreCount") }));
            });
            const combinedResults = [
                ...relatedMoviesWithCount,
                ...relatedSeriesWithCount,
            ].sort((a, b) => b.genreCount - a.genreCount);
            return res.status(200).json({
                relatedResults: combinedResults.slice(0, 8),
            });
        }
        catch (error) {
            console.log("Server error '/explore/get-similar': ", error);
            return res.status(500).json({
                message: `Couldn't retrieve similar selection.`,
                apiFaultyRoute: "/explore/get-similar",
                errorDetails: error,
            });
        }
    });
};
const exploreController = {
    getRandomSelection,
    getRecentlyAdded,
    fetchShelf,
    exploreRecords,
    getFilterOptionsYear,
    getTopSelection,
    titlesYouHaveLoved,
    getSimilar,
};
exports.default = exploreController;
