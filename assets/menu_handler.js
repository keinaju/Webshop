async function menu_handler() {
    switch (document.querySelector('#menu').value) {
        case 'none':
            break;
        case 'add_category':
            window.location.href = '/categories/add';
            break;
        case 'add_product':
            window.location.href = '/product/add';
            break;
        case 'add_user':
            window.location.href = '/register';
            break;
        case 'checkout':
            window.location.href = '/checkout';
            break;
        case 'orders':
            window.location.href = '/orders';
            break;
        case 'shop':
            window.location.href = '/';
            break;
        case 'shop_configuration':
            window.location.href = '/config';
            break;
        case 'signout':
            await fetch('/logout', { method: "POST" });
            window.location.href = '/';
            break;
    }
}

const menu = document.getElementById('menu');
if (menu) menu.addEventListener('change', menu_handler);