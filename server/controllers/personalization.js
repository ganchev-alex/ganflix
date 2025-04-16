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
const personalization_1 = __importDefault(require("../models/personalization"));
const updatePersonalization = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const personalizationPayload = req.body;
            const personalizationState = yield personalization_1.default.findOne({
                where: {
                    [`${personalizationPayload.type}_id`]: personalizationPayload.id,
                },
            });
            if (!personalizationState) {
                return res.status(404).json({
                    message: `Media content '${personalizationPayload.id}' was not found.`,
                    faultyId: personalizationPayload.id,
                });
            }
            yield personalization_1.default.update({
                movie_id: personalizationState.movies_id,
                series_id: personalizationState.series_id,
                notes: personalizationPayload.notes,
                rating: personalizationPayload.rating,
            }, {
                where: {
                    personalization_id: personalizationState.personalization_id,
                },
            });
            return res.status(201).json({
                message: `Media '${personalizationPayload.id}'s personalization was updated succesfully.'`,
            });
        }
        catch (error) {
            console.log("Server error '/personalization': ", error);
            return res.status(500).json({
                message: `Couldn't update personalization.`,
                apiFaultyRoute: "/personalization",
                errorDetails: error,
            });
        }
    });
};
exports.default = updatePersonalization;
