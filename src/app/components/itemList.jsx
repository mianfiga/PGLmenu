"use client";

import { useEffect } from "react";
import { useResource } from "../contexts/resource";
import Item from "./item";

export const NEW_ITEM = {
  id: null,
  nombre: "",
  orden: 99,
};

export default function ItemList({ categoryId, editMode }) {
  const [itemResource, itemApi] = useResource("items", categoryId);
  useEffect(() => {
    if (!itemResource.loaded && !itemResource.loading && !itemResource.error) {
      itemApi.get({ id: categoryId });
      console.log("GET");
    }
  }, []);

  //Wait for data
  if (itemResource.loading) {
    return <strong>loading</strong>;
  }
  if (itemResource.error) {
    return <strong>Error</strong>;
  }
  if (!itemResource.loaded) {
    return null;
  }

  //order data
  let orderedItems = itemResource.data.data.sort((a, b) => a.orden - b.orden);

  //add empty register for new Items
  if (editMode && !orderedItems.some((c) => c.id === null)) {
    orderedItems.push({ ...NEW_ITEM });
  }

  return orderedItems.map((item) => (
    <Item key={item.id} {...item} categoryId={categoryId} editMode={editMode} />
  ));
}
