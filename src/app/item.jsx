import Image from "next/image";

export default function Item({title, price}){
    return (
        <div className="category">
            <span className="item-price">{price}</span>
            <span className="item-title">{title}</span>
            
            
        </div>
    );
}
