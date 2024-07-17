const buttons = document.querySelectorAll('.add-to-cart-button');
for (const button of buttons) {
    const product_id = button.getAttribute('product_id');
    button.addEventListener('click', () => {
        post_json('/shoppingcart/add', {
            product_id: product_id,
            quantity: 1
        }).then((data) => {
            alert(data.message);
        });
        return false;
    });
}