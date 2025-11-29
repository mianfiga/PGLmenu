// item.js

export default function Item({ title, price, editMode, setItem, removeItem }) {
  const item = { title, price };
  return (
    <div className="item">
      <span className="item-title">
        {editMode ? (
          <input
            placeholder="Item title"
            type="text"
            value={title}
            onChange={(ev) => setItem({ ...item, title: ev.target.value })}
          />
        ) : (
          title
        )}
      </span>
      <span className="item-price">
        {editMode ? (
          <>
            <input
              placeholder="Item price"
              type="number"
              value={price}
              onChange={(ev) => setItem({ ...item, price: ev.target.value })}
            />
            <button onClick={removeItem}>Borrar</button>
          </>
        ) : (
          price
        )}
      </span>
    </div>
  );
}
