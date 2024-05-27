CREATE PROCEDURE get_products_count(IN any_category BOOL, IN chosen_categories TEXT, IN regular_expression TEXT)
BEGIN

SELECT COUNT(DISTINCT(code)) AS product_count
FROM products p LEFT JOIN category_links c ON c.product = p.code
WHERE
	(any_category = TRUE OR FIND_IN_SET(c.category, chosen_categories) > 0)
    AND
    (name REGEXP regular_expression OR description REGEXP regular_expression);
    
END