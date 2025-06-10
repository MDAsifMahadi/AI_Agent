import {product} from "../schema/schema.js";
const getProducts = async () => {
    try {
        const products = await product.find();
        const productInfo = products.map(product => {
            return {
                title : product.title,
                description : product.productDetails
            }
        });
        return productInfo;
    } catch {
        
    }
}


export default getProducts;