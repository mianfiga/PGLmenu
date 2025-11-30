// page.js

"use client";
import { useState } from "react";
import Category from "./category";
import { ResourceProvider } from "./contexts/resource";
import routes from "./routes";
import CategoryList from "./components/categoryList";

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
        <ResourceProvider routes={routes}>
          <CategoryList editMode={editMode} />
        </ResourceProvider>
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
