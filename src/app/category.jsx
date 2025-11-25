import Image from "next/image";
import Item from "./item";

export default function Category({title, img, items}){
    return (
        <div className="category">
            <div className="category-header">
                <h2>{title}</h2>
                <img src={img} alt=""/>
            </div>
            {items.map((i,idx) => <Item key={idx} {...i} />)} 
        </div>
    );
}
