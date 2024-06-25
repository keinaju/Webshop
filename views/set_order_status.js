async function set_order_status(order_id) {
    const new_status = document.querySelector('#select_' + order_id).value;
    if (new_status == 'none') return;
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            order_id: order_id,
            new_status: new_status,
        }),
    };
    const response = await fetch('orders/update', requestOptions);
    const data = await response.json();
    alert(data.message);
    location.reload(true);
}