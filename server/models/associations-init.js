"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const movie_1 = __importDefault(require("./movie"));
const series_1 = __importDefault(require("./series"));
const episode_1 = __importDefault(require("./episode"));
const genre_1 = __importDefault(require("./genre"));
const listing_1 = __importDefault(require("./listing"));
const collection_1 = __importDefault(require("./collection"));
const media_genres_association_1 = __importDefault(require("./media-genres-association"));
const media_listing_association_1 = __importDefault(require("./media-listing-association"));
const media_collection_association_1 = __importDefault(require("./media-collection-association"));
const personalization_1 = __importDefault(require("./personalization"));
const state_1 = __importDefault(require("./state"));
//#region one-to-many relation between Episodes - Series
series_1.default.hasMany(episode_1.default, {
    foreignKey: "series_id",
});
episode_1.default.belongsTo(series_1.default, {
    foreignKey: "series_id",
});
//#endregion
//#region many-to-many relation between Movies/Series - Genres
movie_1.default.belongsToMany(genre_1.default, {
    through: media_genres_association_1.default,
    foreignKey: "movie_id",
    otherKey: "genre_id",
    uniqueKey: "association_id",
});
genre_1.default.belongsToMany(movie_1.default, {
    through: media_genres_association_1.default,
    foreignKey: "genre_id",
    otherKey: "movie_id",
    uniqueKey: "association_id",
});
series_1.default.belongsToMany(genre_1.default, {
    through: media_genres_association_1.default,
    foreignKey: "series_id",
    otherKey: "genre_id",
    uniqueKey: "association_id",
});
genre_1.default.belongsToMany(series_1.default, {
    through: media_genres_association_1.default,
    foreignKey: "genre_id",
    otherKey: "series_id",
    uniqueKey: "association_id",
});
media_genres_association_1.default.belongsTo(movie_1.default, { foreignKey: "movie_id" });
media_genres_association_1.default.belongsTo(series_1.default, { foreignKey: "series_id" });
media_genres_association_1.default.belongsTo(genre_1.default, { foreignKey: "genre_id" });
//#endregion
//#region many-to-many relation between Movies/Series - Listing
movie_1.default.belongsToMany(listing_1.default, {
    through: media_listing_association_1.default,
    foreignKey: "movie_id",
    otherKey: "listing_id",
    uniqueKey: "association_id",
});
listing_1.default.belongsToMany(movie_1.default, {
    through: media_listing_association_1.default,
    foreignKey: "listing_id",
    otherKey: "movie_id",
    uniqueKey: "association_id",
});
series_1.default.belongsToMany(listing_1.default, {
    through: media_listing_association_1.default,
    foreignKey: "series_id",
    otherKey: "listing_id",
    uniqueKey: "association_id",
});
listing_1.default.belongsToMany(series_1.default, {
    through: media_listing_association_1.default,
    foreignKey: "listing_id",
    otherKey: "series_id",
    uniqueKey: "association_id",
});
media_listing_association_1.default.belongsTo(movie_1.default, { foreignKey: "movie_id" });
media_listing_association_1.default.belongsTo(series_1.default, { foreignKey: "series_id" });
media_listing_association_1.default.belongsTo(listing_1.default, { foreignKey: "listing_id" });
//#endregion
//#region many-to-many relation between Movies/Series - Collection
movie_1.default.belongsToMany(collection_1.default, {
    through: media_collection_association_1.default,
    foreignKey: "movie_id",
    otherKey: "collection_id",
    uniqueKey: "association_id",
});
collection_1.default.belongsToMany(movie_1.default, {
    through: media_collection_association_1.default,
    foreignKey: "collection_id",
    otherKey: "movie_id",
    uniqueKey: "association_id",
});
series_1.default.belongsToMany(collection_1.default, {
    through: media_collection_association_1.default,
    foreignKey: "series_id",
    otherKey: "collection_id",
    uniqueKey: "association_id",
});
collection_1.default.belongsToMany(series_1.default, {
    through: media_collection_association_1.default,
    foreignKey: "collection_id",
    otherKey: "series_id",
    uniqueKey: "association_id",
});
media_collection_association_1.default.belongsTo(movie_1.default, { foreignKey: "movie_id" });
media_collection_association_1.default.belongsTo(series_1.default, { foreignKey: "series_id" });
media_collection_association_1.default.belongsTo(collection_1.default, {
    foreignKey: "collection_id",
});
//#endregion
//#region personalization one-to-one relation
movie_1.default.hasOne(personalization_1.default, {
    sourceKey: "id", // Primary key in Movie
    foreignKey: "movie_id", // Foreign key in Personalization
});
personalization_1.default.belongsTo(movie_1.default, {
    targetKey: "id", // Primary key in Movie
    foreignKey: "movie_id", // Foreign key in Personalization
});
series_1.default.hasOne(personalization_1.default, {
    sourceKey: "id",
    foreignKey: "series_id",
});
personalization_1.default.belongsTo(series_1.default, {
    targetKey: "id",
    foreignKey: "series_id",
});
//#endregion
//#region state one-to-one relation
movie_1.default.hasOne(state_1.default, {
    sourceKey: "id",
    foreignKey: "movie_id",
});
state_1.default.belongsTo(movie_1.default, {
    targetKey: "id",
    foreignKey: "movie_id",
});
series_1.default.hasOne(state_1.default, {
    sourceKey: "id",
    foreignKey: "series_id",
});
state_1.default.belongsTo(series_1.default, {
    targetKey: "id",
    foreignKey: "series_id",
});
episode_1.default.hasOne(state_1.default, {
    sourceKey: "id",
    foreignKey: "episode_id",
});
state_1.default.belongsTo(episode_1.default, {
    targetKey: "id",
    foreignKey: "episode_id",
});
//#endregion
