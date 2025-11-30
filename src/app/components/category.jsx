// category.js
//import Item from "./item";

import ItemList from "./itemList";
import { useResource } from "../contexts/resource";

export const NEW_CATEGORY = {
  id: null,
  nombre: "",
  orden: 99,
};

export default function Category({ id, nombre, orden, editMode }) {
  const [categoryResource, categoryApi] = useResource("categories");
  const [itemsResource, _] = useResource("items", id);

  const removeCategory = () => {
    if (!window.confirm(`¿Está seguro de eliminar la categoría "${nombre}"?`)) {
      return;
    }
    if (itemsResource.data.data.some(item => item.id)) {
      window.alert(
        "Esta categoria contiene items, no es posible su eliminación"
      );
      return;
    }

    categoryApi
      .remove(
        { id },
        {
          body: JSON.stringify({
            usuario_id: 1,
          }),
        }
      )
      .then(setTimeout(() => categoryApi.get(), 300));
  };
  const updateCategory = () =>
    categoryApi[id ? "put" : "post"](
      { id },
      {
        body: JSON.stringify({
          usuario_id: 1,
          nombre,
          orden,
        }),
      }
    ).then(setTimeout(() => categoryApi.get(), 300));

  const onChangeCategory = (ev) => {
    let idx = categoryResource.data.data.findIndex((c) => c.id == id);
    let newState = { ...categoryResource.data };

    if (idx === -1) {
      const current = { ...NEW_CATEGORY };
      current[ev.target.name] = ev.target.value;
      newState.data = [...newState.data, current];
    } else {
      newState.data = [...categoryResource.data.data];
      newState.data[idx][ev.target.name] = ev.target.value;
    }
    categoryApi.set(newState);
  };

  return (
    <div className="category">
      <div className="category-header">
        <h2>
          {editMode ? (
            <>
              <input
                placeholder="Order"
                type="number"
                value={orden}
                size={2}
                name="orden"
                onChange={onChangeCategory}
              />
              <input
                placeholder="Category title"
                type="text"
                value={nombre}
                name="nombre"
                onChange={onChangeCategory}
              />
              <button onClick={updateCategory}>
                {id ? "Editar" : "Crear"}
              </button>
              <button
                onClick={removeCategory}
                style={id ? {} : { visibility: "hidden" }}
              >
                eliminar
              </button>
            </>
          ) : (
            nombre
          )}
        </h2>
      </div>
      {id && <ItemList categoryId={id} editMode={editMode} />}
    </div>
  );
}
