CREATE PROCEDURE get_products (IN limit_to INT, IN offset_to INT)
BEGIN
	SELECT * FROM products
    LIMIT limit_to OFFSET offset_to;
END
