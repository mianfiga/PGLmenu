// page.js
import Category from "./category";

const menu = {
  title:"Camper Cafe",
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

export default function Home() {
  return (
    <div className="root">
      <div className="menu">
        <div className="menu-header">
          <h1>{menu.title}</h1>
          <p className="subtitle">{menu.subtitle}</p>
        </div>
        {menu.categories.map((c, idx) => <Category key={idx} {...c} />)}
        <div className="separator"/>
        <div className="footer">
          <a href="#">Visit our website</a><br/>
          123 Free Code Camp Drive
        </div>
      </div>
    </div>
  );
}
