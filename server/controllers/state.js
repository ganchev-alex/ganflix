"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const movie_1 = __importDefault(require("../models/movie"));
const state_1 = __importDefault(require("../models/state"));
const media_listing_association_1 = __importDefault(
  require("../models/media-listing-association")
);
const episode_1 = __importDefault(require("../models/episode"));
const series_1 = __importDefault(require("../models/series"));
const sequelize_1 = require("sequelize");
const manageState = function (req, res) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      const statePayload = req.body;
      if (statePayload.type === "movie") {
        const movieCheck = yield movie_1.default.findByPk(statePayload.id);
        if (!movieCheck) {
          return res.status(404).json({
            message: `Movie ${statePayload.id} was not found.`,
            faultyId: statePayload.id,
          });
        }
        const prevStateCheck = yield state_1.default.findOne({
          where: { movie_id: statePayload.id },
        });
        if (prevStateCheck) {
          if (statePayload.totalDuration - statePayload.resumeTime <= 15) {
            yield state_1.default.destroy({
              where: { movie_id: statePayload.id },
            });
            yield media_listing_association_1.default.create({
              movie_id: statePayload.id,
              series_id: null,
              listing_id: "3e89fe9b-7dbe-4171-a206-e3a0fa9eb289",
            });
            yield media_listing_association_1.default.destroy({
              where: {
                movie_id: statePayload.id,
                listing_id: "dc675045-7c1f-4693-8712-b9e53ff3cc6b",
              },
            });
            return res.status(201).json({
              message: `Movie '${statePayload.id}' was finished and thus its state was modified.`,
            });
          }
          yield prevStateCheck.update({
            resume_time: statePayload.resumeTime,
            total_duration: statePayload.totalDuration,
          });
          return res.status(201).json({
            message: `State of '${prevStateCheck.movie_id}' was modified successfully.`,
            state: prevStateCheck,
          });
        }
        const newState = yield state_1.default.create({
          movie_id: statePayload.id,
          resume_time: statePayload.resumeTime,
          total_duration: statePayload.totalDuration,
        });
        return res.status(201).json({
          message: `The state of ${newState.movie_id} was saved succesfully.`,
          newState,
        });
      } else if (statePayload.type === "episode") {
        const episodeCheck = yield episode_1.default.findByPk(statePayload.id);
        if (!episodeCheck) {
          return res.status(404).json({
            message: `Episode ${statePayload.id} was not found.`,
            faultyId: statePayload.id,
          });
        }
        yield state_1.default.destroy({
          where: {
            episode_id: { [sequelize_1.Op.not]: statePayload.id },
            series_id: episodeCheck.series_id,
          },
        });
        const prevStateCheck = yield state_1.default.findOne({
          where: { episode_id: statePayload.id },
        });
        if (prevStateCheck) {
          if (statePayload.totalDuration - statePayload.resumeTime <= 10) {
            yield state_1.default.destroy({
              where: { episode_id: statePayload.id },
            });
            yield media_listing_association_1.default.destroy({
              where: {
                series_id: prevStateCheck.series_id,
                listing_id: "dc675045-7c1f-4693-8712-b9e53ff3cc6b",
              },
            });
            const series = yield series_1.default.findByPk(
              episodeCheck.series_id
            );
            if (series && episodeCheck.season < series.seasons) {
              let nextEpisode = yield episode_1.default.findOne({
                where: {
                  series_id: series.id,
                  episode_num: episodeCheck.episode_num + 1,
                  season: episodeCheck.season,
                },
              });
              if (!nextEpisode) {
                nextEpisode = yield episode_1.default.findOne({
                  where: {
                    series_id: series.id,
                    episode_num: 1,
                    season: episodeCheck.season + 1,
                  },
                });
              }
              if (nextEpisode) {
                yield state_1.default.create({
                  episode_id: nextEpisode.id,
                  series_id: nextEpisode.series_id,
                  resume_time: 0,
                  total_duration: nextEpisode.duration,
                });
              }
            } else if (series && episodeCheck.season === series.seasons) {
              const nextEpisode = yield episode_1.default.findOne({
                where: {
                  series_id: series.id,
                  episode_num: episodeCheck.episode_num + 1,
                  season: episodeCheck.season,
                },
              });
              if (nextEpisode) {
                yield state_1.default.create({
                  episode_id: nextEpisode.id,
                  series_id: nextEpisode.series_id,
                  resume_time: 0,
                  total_duration: nextEpisode.duration,
                });
              }
            }
            return res.status(201).json({
              message: `Episode '${statePayload.id}' was finished and thus its state was modified and the next one was added to watch.`,
              action: "STOP_UPDATES",
            });
          }
          yield prevStateCheck.update({
            resume_time: statePayload.resumeTime,
            total_duration: statePayload.totalDuration,
          });
          return res.status(201).json({
            message: `State of '${prevStateCheck.series_id}' was modified successfully.`,
            state: prevStateCheck,
          });
        }
        const newState = yield state_1.default.create({
          episode_id: statePayload.id,
          series_id: episodeCheck.series_id,
          resume_time: statePayload.resumeTime,
          total_duration: statePayload.totalDuration,
        });
        return res.status(201).json({
          message: `The state of ${newState.episode_id} was saved succesfully.`,
          newState,
        });
      }
    } catch (error) {
      console.log("Server error '/state/manage': ", error);
      return res.status(500).json({
        message: `Couldn't manage the state properly.`,
        apiFaultyRoute: "/state/manage",
        errorDetails: error,
      });
    }
  });
};
const getWatching = function (req, res) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      const watchedMedia = yield state_1.default.findAll({
        attributes: ["state_id", "resume_time", "episode_id"],
        include: [
          {
            model: movie_1.default,
            attributes: ["id", "title", "poster_src", "thumb_src", "duration"],
          },
          {
            model: series_1.default,
            attributes: ["id", "title", "seasons", "poster_src", "thumb_src"],
          },
          {
            model: episode_1.default,
          },
        ],
      });
      return res.status(200).json({
        message: "Currantly watching media was retrieved successfully.",
        watching: watchedMedia,
      });
    } catch (error) {
      console.log("Server error '/state/watching': ", error);
      return res.status(500).json({
        message: `Couldn't retrieved currantly watching media.`,
        apiFaultyRoute: "/state/watching",
        errorDetails: error,
      });
    }
  });
};
const stateController = {
  manageState,
  getWatching,
};
exports.default = stateController;
