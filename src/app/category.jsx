// category.js
import Item from "./item";

export default function Category({
  title,
  img,
  items,
  editMode,
  setCategory,
  removeCategory,
}) {
  const category = { title, img, items };
  const setItem = (id) => (item) => {
    const newItems = [...items];
    newItems[id] = item;

    setCategory({
      ...category,
      items: newItems,
    });
  };
  const removeItem = (id) => () => {
    if (!window.confirm("¿Está seguro de eliminar el item?")) {
      return;
    }
    const newItems = [...items];
    newItems.splice(id, 1);

    setCategory({
      ...category,
      items: newItems,
    });
  };

  return (
    <div className="category">
      <div className="category-header">
        <h2>
          {editMode ? (
            <>
              <input
                placeholder="Category title"
                value={title}
                onChange={(ev) =>
                  setCategory({ ...category, title: ev.target.value })
                }
              />
              <button onClick={removeCategory}>Borrar categoría</button>
            </>
          ) : (
            title
          )}
        </h2>
        {img && img != "" ? <img src={img} alt="" /> : null}
        {editMode ? (
          <input
            placeholder="Category image url"
            value={img}
            onChange={(ev) =>
              setCategory({ ...category, img: ev.target.value })
            }
          />
        ) : null}
      </div>
      {(editMode ? [...items, { title: "", price: 0 }] : items).map((i, id) => (
        <Item
          key={id}
          {...i}
          editMode={editMode}
          setItem={setItem(id)}
          removeItem={removeItem(id)}
        />
      ))}
    </div>
  );
}
