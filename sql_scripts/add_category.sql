CREATE PROCEDURE add_category(IN p_name VARCHAR(100), IN p_image_file VARCHAR(100))
BEGIN
	INSERT INTO categories(name, image_file)
    VALUES (p_name, p_image_file);
END