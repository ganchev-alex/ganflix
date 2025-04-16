"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Genre = void 0;
const sequelize_1 = require("sequelize");
const uuid_1 = require("uuid");
const config_1 = __importDefault(require("../config"));
const movie_1 = __importDefault(require("./movie"));
const media_genres_association_1 = __importDefault(require("./media-genres-association"));
class Genre extends sequelize_1.Model {
}
exports.Genre = Genre;
const { UUID, STRING } = sequelize_1.DataTypes;
Genre.init({
    id: {
        type: UUID,
        primaryKey: true,
        defaultValue: uuid_1.v4,
    },
    genre: {
        type: STRING,
        allowNull: false,
    },
}, {
    sequelize: config_1.default,
    modelName: "Genre",
    tableName: "genres",
});
Genre.belongsToMany(movie_1.default, {
    through: media_genres_association_1.default,
    foreignKey: "genre_id",
    otherKey: "movie_id",
    uniqueKey: "association_id",
});
exports.default = Genre;
