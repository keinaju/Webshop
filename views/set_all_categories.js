function set_all_categories(true_or_false) {
    const checkbox_nodes = document.querySelectorAll('[name="categories"]');
    for (const node of checkbox_nodes) {
        node.checked = true_or_false;
    }
}