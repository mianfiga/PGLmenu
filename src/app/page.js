import Image from "next/image";
import styles from "./page.module.css";

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

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className={styles.intro}>
          <h1>To get started, edit the page.js file.</h1>
          <p>
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className={styles.logo}
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className={styles.secondary}
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
