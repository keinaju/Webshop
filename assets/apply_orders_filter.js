function apply_orders_filter() {
    const status = document.querySelector('#status_filter').value;
    location.href = `/orders?status=${status}&page=0`;
}

document.getElementById('status_filter').addEventListener('change', () => {
    apply_orders_filter();
    return false;
});