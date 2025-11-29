// page.js

"use client";
import { useState } from "react";
import Category from "./category";

const menuConst = {
  title: "Camper Cafe",
  subtitle: "Est. 2020",
  categories: [
    {
      title: "Coffee",
      img: "/coffee.jpg",
      items: [
        { title: "French Vanilla", price: "3.00" },
        { title: "Caramel Macchiato", price: "3.75" },
        { title: "Pumpkin Spice", price: "3.50" },
      ],
    },
    {
      title: "Desserts",
      img: "/pie.jpg",
      items: [
        { title: "Donut", price: "1.50" },
        { title: "Cherry Pie", price: "2.75" },
      ],
    },
  ],
};
const newCategory = {
  title: "",
  img: "",
  items: [],
};
//const menuLS = JSON.parse(localStorage.getItem('menu'));

export default function Home() {
  const [menu, setMenu] = useState(/*menuLS ||*/ menuConst);
  const [editMode, setEditMode] = useState(false);
  const resetMenu = () => {
    localStorage.setItem("menu", JSON.stringify(menuConst));
    setMenu(menuConst);
  };

  const setCategory = (id) => (category) => {
    const newCategories = [...menu.categories];
    newCategories[id] = category;

    setMenu({
      ...menu,
      categories: newCategories,
    });
  };

  const removeCategory = (id) => () => {
    if (
      !window.confirm(
        "¿Está seguro de eliminar la categoría y todos sus items?"
      )
    ) {
      return;
    }
    const newCategories = [...menu.categories];
    newCategories.splice(id, 1);
    setMenu({
      ...menu,
      categories: newCategories,
    });
  };

  return (
    <div className="root">
      <button onClick={() => setEditMode(!editMode)}>
        {editMode ? "view mode" : "edit mode"}
      </button>
      <button onClick={resetMenu}>reset menu</button>

      <div className="menu">
        <div className="menu-header">
          <h1>{menu.title}</h1>
          <p className="subtitle">{menu.subtitle}</p>
        </div>
        {(editMode ? [...menu.categories, newCategory] : menu.categories).map(
          (c, id) => (
            <Category
              key={id}
              {...c}
              editMode={editMode}
              setCategory={setCategory(id)}
              removeCategory={removeCategory(id)}
            />
          )
        )}
        <div className="separator" />
        <div className="footer">
          <a href="#">Visit our website</a>
          <br />
          123 Free Code Camp Drive
        </div>
      </div>
    </div>
  );
}
