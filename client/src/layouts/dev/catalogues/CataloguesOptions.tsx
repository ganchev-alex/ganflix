import AddCollection from "./AddCollection";
import DeleteCollection from "./DeleteCollection";
import UpdateCollection from "./UpdateCollection";

const CataloguesOptions: React.FC = function () {
  return (
    <>
      <AddCollection />
      <UpdateCollection />
      <DeleteCollection />
    </>
  );
};

export default CataloguesOptions;
