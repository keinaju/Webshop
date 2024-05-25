CREATE PROCEDURE add_product (IN p_code VARCHAR(100), IN p_price DECIMAL(10,2), IN p_name VARCHAR(100), IN p_description TEXT, IN p_image_file VARCHAR(100))
BEGIN
	INSERT INTO products
    VALUES (p_code, p_price, p_name, p_description, p_image_file);
END