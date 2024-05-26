CREATE PROCEDURE get_products_by_categories(IN p_limit INT, IN p_offset INT, IN any_category BOOL, IN chosen_categories TEXT)
BEGIN

SELECT DISTINCT 
	code, 
    price, 
    name, 
    description, 
    image_file, 
    get_categories_per_product(code) AS categories
FROM products p LEFT JOIN category_links c ON c.product = p.code
WHERE any_category = TRUE OR FIND_IN_SET(c.category, chosen_categories) > 0
ORDER BY name
LIMIT p_limit OFFSET p_offset;

END