function get_chosen_categories() {
    const checkbox_nodes = document.querySelectorAll('[name="categories"]');
    let chosen_categories = [];
    for (const node of checkbox_nodes) {
        if (node.checked) chosen_categories.push(node.value);
    }
    return chosen_categories.join(',');
}

function get_search_value() {
    return document.querySelector('#search_node').value;
}

function get_query_string(search_string, category_ids, page) {
    return `?search=${search_string}&categories=${category_ids}&page=${page}`;
}

function apply_filter(page_number) {    
    location.href = 'http://localhost:3000/products' + get_query_string(get_search_value(), get_chosen_categories(), page_number || 0);
}