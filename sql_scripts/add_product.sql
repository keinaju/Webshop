CREATE PROCEDURE `add_product` (IN code VARCHAR(100), IN price DECIMAL(10,2), IN name VARCHAR(100), IN description TEXT, IN image_file VARCHAR(100))
BEGIN
	INSERT INTO products
    VALUES (code, price, name, description, image_file);
END