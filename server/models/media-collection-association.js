"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaCollectionAssociation = void 0;
const sequelize_1 = require("sequelize");
const uuid_1 = require("uuid");
const config_1 = __importDefault(require("../config"));
class MediaCollectionAssociation extends sequelize_1.Model {
}
exports.MediaCollectionAssociation = MediaCollectionAssociation;
const { STRING, UUID } = sequelize_1.DataTypes;
MediaCollectionAssociation.init({
    association_id: {
        type: UUID,
        primaryKey: true,
        defaultValue: uuid_1.v4,
    },
    movie_id: {
        type: STRING,
        allowNull: true,
        references: {
            model: "Movie",
            key: "id",
        },
    },
    series_id: {
        type: STRING,
        allowNull: true,
        references: {
            model: "Series",
            key: "id",
        },
    },
    collection_id: {
        type: STRING,
        allowNull: false,
        references: {
            model: "Collection",
            key: "id",
        },
    },
}, {
    sequelize: config_1.default,
    tableName: "media_collection_association",
    modelName: "MediaCollectionAssociation",
});
exports.default = MediaCollectionAssociation;
