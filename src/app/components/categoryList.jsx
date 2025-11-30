"use client";

import { useEffect } from "react";
import { useResource } from "../contexts/resource";
import Category, { NEW_CATEGORY } from "./category";

export default function CategoryList({ editMode }) {
  const [categoryResource, categoryApi] = useResource("categories");
  useEffect(() => {
    if (
      !categoryResource.loaded &&
      !categoryResource.loading &&
      !categoryResource.error
    ) {
      categoryApi.get();
      console.log("GET");
    }
  }, []);

  //Wait for data
  if (categoryResource.loading) {
    return <strong>loading</strong>;
  }
  if (categoryResource.error) {
    return <strong>Error</strong>;
  }
  if (!categoryResource.loaded) {
    return null;
  }

  //order data
  let orderedCategories = categoryResource.data.data.sort(
    (a, b) => a.orden - b.orden
  );

  //add empty register for new Items
  if (editMode && !orderedCategories.some((c) => c.id === null)) {
    orderedCategories.push({ ...NEW_CATEGORY });
  }

  return orderedCategories.map((cat, key) => (
    <Category key={cat.id} {...cat} editMode={editMode} />
  ));
}
