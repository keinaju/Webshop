module.exports = class ShoppingCart {
    #contents = [];

    constructor(contents = []) {
        this.#contents = contents;
    }

    #get_product_from_cart(product_id) {
        return this.#contents.find((element) => element.product_id == product_id);
    }

    add_products(product_id, quantity, price_per_pc) {
        //Check if product exists in cart
        const product_in_cart = this.#get_product_from_cart(product_id);
        //If yes, add quantity
        if (product_in_cart) {
            product_in_cart.quantity += quantity;
            product_in_cart.price_per_pc = price_per_pc; //Use latest price
        }
        //If no, add product to cart
        else {
            this.#contents.push({
                product_id: product_id,
                quantity: quantity,
                price_per_pc: price_per_pc
            });
        }
    }

    remove_products_by_id(product_id, quantity) {
        const product_in_cart = this.#get_product_from_cart(product_id);
        if (product_in_cart) {
            product_in_cart.quantity -= quantity;
            //Remove product information if quantity is 0 or less
            if (product_in_cart.quantity <= 0) {
                const index = this.#contents.findIndex((element) => element.product_id == product_id);
                this.#contents.splice(index, 1);
            }
        }
    }

    remove_all_products() {
        this.#contents = [];
    }

    get_contents_array() {
        return this.#contents;
    }

    get_contents_json() {
        return JSON.stringify(this.#contents);
    }

    get_total_price() {
        let total = 0;
        for (const product_in_cart of this.#contents) {
            total += product_in_cart.price_per_pc * product_in_cart.quantity;
        }
        return total.toFixed(2);
    }

    get_total_quantity() {
        let total = 0;
        for (const product_in_cart of this.#contents) {
            total += product_in_cart.quantity;
        }
        return total;
    }

    get_short_info() {
        return `${this.get_total_quantity()} items, ${this.get_total_price()} €`;
    }

};