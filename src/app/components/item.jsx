// item.js

import { useResource } from "../contexts/resource";

export default function Item({
  id,
  nombre,
  precio,
  orden,
  categoryId,
  editMode,
}) {
  const item = { nombre, precio };

  const [itemResource, itemApi] = useResource("items", categoryId);

  const removeItem = () => {
    if (!window.confirm(`¿Está seguro de eliminar el item "${nombre}"?`)) {
      return;
    }

    itemApi
      .remove(
        { id },
        {
          body: JSON.stringify({
            usuario_id: 1,
          }),
        }
      )
      .then(setTimeout(() => itemApi.get({ id: categoryId }), 300));
  };

  const update = () => {
    itemApi[id ? "put" : "post"](
      { id: id ? id : categoryId },
      {
        body: JSON.stringify({
          usuario_id: 1,
          nombre,
          precio,
          orden,
        }),
      }
    ).then(setTimeout(() => itemApi.get({ id: categoryId }), 300));
  };

  const onChange = (ev) => {
    let idx = itemResource.data.data.findIndex((c) => c.id == id);
    let newState = { ...itemResource.data };

    if (idx === -1) {
      const current = { ...NEW_CATEGORY };
      current[ev.target.name] = ev.target.value;
      newState.data = [...newState.data, current];
    } else {
      newState.data = [...itemResource.data.data];
      newState.data[idx][ev.target.name] = ev.target.value;
    }
    itemApi.set(newState);
  };

  return (
    <div className="item">
      <span className="item-title">
        {editMode ? (
          <>
            <input
              placeholder="Order"
              type="number"
              name="orden"
              value={orden}
              size={2}
              onChange={onChange}
            />
            <input
              placeholder="Item title"
              type="text"
              name="nombre"
              value={nombre}
              onChange={onChange}
            />
          </>
        ) : (
          nombre
        )}
      </span>
      <span className="item-price">
        {editMode ? (
          <>
            <input
              placeholder="Item price"
              type="number"
              name="precio"
              value={precio}
              onChange={onChange}
            />
            <button onClick={update}>{id ? "Editar" : "Crear"}</button>
            {id && <button onClick={removeItem}>Eliminar</button>}
          </>
        ) : (
          precio
        )}
      </span>
    </div>
  );
}
