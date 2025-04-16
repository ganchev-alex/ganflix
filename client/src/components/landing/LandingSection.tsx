import { useEffect, useState } from "react";

import Shelf from "../shared/Shelf";
import Heading from "./Heading";

import { IGeneralRecord } from "../../utility/interfaces/explore-responses";

const LandingSection: React.FC = function () {
  const [recent, setRecent] = useState<IGeneralRecord[]>([]);
  const [recentLoadingState, setRecentLoadingState] = useState(false);

  const getRecent = async function () {
    try {
      setRecentLoadingState(true);
      const response = await fetch("http://localhost:8080/explore/recent");

      const responseData: { message: string; records: IGeneralRecord[] } =
        await response.json();

      if (response.ok) {
        setRecent(responseData.records);
      }
    } catch (error) {
      console.log(
        "Client Error.\nCouldn't get most recent records.\nError Details: \n",
        error
      );
    } finally {
      setRecentLoadingState(false);
    }
  };

  useEffect(() => {
    if (recent.length === 0) {
      getRecent();
    }
  }, []);

  return (
    <>
      <Heading />
      <Shelf
        sectionTitle="Recently Added"
        preFetchedData={recent}
        externalLoadingState={recentLoadingState}
      />
      <Shelf
        sectionTitle="To Be Added"
        reqProperties={{
          type: "all",
          limit: 16,
          listingId: "799779fd-8732-40f2-8949-dd2447f4ebe4",
        }}
      />
      <Shelf
        sectionTitle="Upcoming"
        reqProperties={{
          type: "all",
          limit: 10,
          listingId: "0a6c6448-46eb-4c4e-9fee-c1a011ddb4db",
        }}
      />
    </>
  );
};

export default LandingSection;
