async function menu_handler() {
    switch (document.querySelector('#menu').value) {
        case 'none':
            break;
        case 'add_category':
            window.location.href = '/categories/add';
            break;
        case 'add_product':
            window.location.href = '/products/add';
            break;
        case 'add_user':
            window.location.href = '/users/add';
            break;
        case 'checkout':
            window.location.href = '/order';
            break;
        case 'orders':
            window.location.href = '/orders';
            break;
        case 'shop':
            window.location.href = '/';
            break;
        case 'signout':
            await fetch('/logout', { method: "POST" });
            window.location.href = '/';
            break;
    }
}