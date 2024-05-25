CREATE PROCEDURE get_products (IN p_limit INT, IN p_offset INT)
BEGIN
	SELECT * FROM products
    ORDER BY name
    LIMIT p_limit OFFSET p_offset;
END
