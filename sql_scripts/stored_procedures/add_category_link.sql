CREATE PROCEDURE add_category_link (IN product_code VARCHAR(100), IN category_id INT)
BEGIN
	INSERT INTO category_links
    VALUES (category_id, product_code);
END