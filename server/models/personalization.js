"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Personalization = void 0;
const sequelize_1 = require("sequelize");
const uuid_1 = require("uuid");
const config_1 = __importDefault(require("../config"));
class Personalization extends sequelize_1.Model {
}
exports.Personalization = Personalization;
const { UUID, STRING, DOUBLE, TEXT } = sequelize_1.DataTypes;
Personalization.init({
    personalization_id: {
        type: UUID,
        primaryKey: true,
        defaultValue: uuid_1.v4,
    },
    movie_id: {
        type: STRING,
        allowNull: true,
        defaultValue: null,
    },
    series_id: {
        type: STRING,
        allowNull: true,
        defaultValue: null,
    },
    notes: {
        type: TEXT,
        allowNull: false,
        defaultValue: "",
    },
    rating: {
        type: DOUBLE,
        allowNull: false,
        defaultValue: 0.0,
    },
}, {
    sequelize: config_1.default,
    modelName: "Personalization",
    tableName: "personalization",
    timestamps: false,
});
exports.default = Personalization;
