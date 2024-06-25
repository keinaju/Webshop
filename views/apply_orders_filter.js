function apply_orders_filter() {
    const status = document.querySelector('#status_filter').value;
    location.href = '/orders?status=' + status;
}