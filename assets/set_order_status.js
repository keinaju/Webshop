async function set_order_status(order_id, new_status) {
    // const new_status = document.querySelector('#select_' + order_id).value;
    if (new_status == 'none') return;
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            order_id: order_id,
            new_status: new_status,
        }),
    };
    const response = await fetch('/orders', requestOptions);
    const data = await response.json();
    alert(data.message);
    location.reload(true);
}

const selects = document.querySelectorAll('.status_select');
for (const select of selects) {
    const order_id = select.getAttribute('order_id');
    select.addEventListener('change', (event) => {
        const new_status = event.currentTarget.value;
        set_order_status(order_id, new_status);
        return false;
    });
}