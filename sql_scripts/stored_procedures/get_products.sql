CREATE PROCEDURE get_products(IN p_limit INT, IN p_offset INT, IN any_category BOOL, IN chosen_categories TEXT, IN regular_expression TEXT)
BEGIN

SELECT DISTINCT 
	code, 
    price, 
    name, 
    description, 
    image_file, 
    get_categories_per_product(code) AS categories
FROM products p LEFT JOIN category_links c ON c.product = p.code
WHERE
	(any_category = TRUE OR FIND_IN_SET(c.category, chosen_categories) > 0)
    AND
    (name REGEXP regular_expression OR description REGEXP regular_expression)
ORDER BY name
LIMIT p_limit OFFSET p_offset;

END