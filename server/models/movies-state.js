"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoviesState = void 0;
const sequelize_1 = require("sequelize");
const uuid_1 = require("uuid");
const config_1 = __importDefault(require("../config"));
class MoviesState extends sequelize_1.Model {
}
exports.MoviesState = MoviesState;
const { STRING, INTEGER, UUID } = sequelize_1.DataTypes;
MoviesState.init({
    state_id: {
        type: UUID,
        primaryKey: true,
        defaultValue: uuid_1.v4,
    },
    movie_id: {
        type: STRING,
        allowNull: false,
    },
    currant_time: {
        type: INTEGER,
        allowNull: false,
    },
    total_duration: {
        type: INTEGER,
        allowNull: false,
    },
}, {
    sequelize: config_1.default,
    modelName: "MoviesState",
    tableName: "movies_state",
    timestamps: false,
});
exports.default = MoviesState;
