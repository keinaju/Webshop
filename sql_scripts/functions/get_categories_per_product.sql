CREATE FUNCTION get_categories_per_product(product_code VARCHAR(100)) 
RETURNS TEXT
READS SQL DATA
BEGIN
	
    DECLARE output TEXT;
    
    SELECT GROUP_CONCAT(name ORDER BY name SEPARATOR ', ') INTO output
    FROM category_links JOIN categories ON category_links.category = categories.id
    WHERE product = product_code
    GROUP BY product;

	RETURN output;
    
END