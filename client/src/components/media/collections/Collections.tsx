import { useEffect, useState } from "react";

import Collection from "./Collection";

import { ICollection } from "../../../utility/interfaces/listings-responses";

import styles from "./Collections.module.scss";

const Collections: React.FC = function () {
  const [collections, setCollections] = useState<ICollection[]>([]);

  const getCollections = async function () {
    try {
      const response = await fetch(
        "http://localhost:8080/collections/get-collections"
      );

      const responseData: { message: string; collections: ICollection[] } =
        await response.json();

      if (response.ok) {
        setCollections(
          responseData.collections.sort((a, b) => a.name.localeCompare(b.name))
        );
      }
    } catch (error) {
      console.log(
        "Client error. Couldn't retrieve collections. Error Details: ",
        error
      );
    }
  };

  useEffect(() => {
    getCollections();
  }, []);

  return (
    <section className={styles.collections}>
      {collections.map((collection) => (
        <Collection
          key={collection.id}
          id={collection.id}
          label={collection.name}
          iconSrc={collection.icon_src}
        />
      ))}
    </section>
  );
};

export default Collections;
