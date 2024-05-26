function get_chosen_categories() {
    const checkbox_nodes = document.querySelectorAll('[name="categories"]');
    let chosen_categories = [];
    for (const node of checkbox_nodes) {
        if (node.checked) chosen_categories.push(node.value);
    }
    return chosen_categories.join(',');
}

function get_query_string(category_ids, page) {
    return `?categories=${category_ids}&page=${page}`;
}

function apply_filter() {    
    location.href = 'http://localhost:3000/products' + get_query_string(get_chosen_categories(), 0);
}