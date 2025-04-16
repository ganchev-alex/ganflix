"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Listing = void 0;
const sequelize_1 = require("sequelize");
const uuid_1 = require("uuid");
const config_1 = __importDefault(require("../config"));
class Listing extends sequelize_1.Model {
}
exports.Listing = Listing;
const { UUID, STRING } = sequelize_1.DataTypes;
Listing.init({
    id: {
        type: UUID,
        primaryKey: true,
        defaultValue: uuid_1.v4,
    },
    name: {
        type: STRING,
        allowNull: false,
    },
    icon_src: {
        type: STRING(512),
        allowNull: false,
    },
}, {
    sequelize: config_1.default,
    modelName: "Listing",
    tableName: "listings",
    timestamps: false,
});
exports.default = Listing;
