CREATE PROCEDURE get_categories ()
BEGIN
	SELECT * FROM categories ORDER BY name;
END
