import AddNewEpisodes from "./AddNewEpisodes";
import AddNewSeason from "./AddNewSeason";
import AddNewSeries from "./AddNewSeries";
import DeleteSeason from "./DeleteSeason";
import DeleteSeries from "./DeleteSeries";
import UpdateSeries from "./UpdateSeries";

const SeriesOptions: React.FC = function () {
  return (
    <>
      <AddNewSeries />
      <UpdateSeries />
      <AddNewSeason />
      <AddNewEpisodes />
      <DeleteSeason />
      <DeleteSeries />
    </>
  );
};

export default SeriesOptions;
