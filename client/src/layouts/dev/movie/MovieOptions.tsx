import AddNewMovie from "./AddNewMovie";
import DeleteMovie from "./DeleteMovie";
import UpdateMovie from "./UpdateMovie";

const MovieOptions: React.FC = function () {
  return (
    <>
      <AddNewMovie />
      <UpdateMovie />
      <DeleteMovie />
    </>
  );
};

export default MovieOptions;
