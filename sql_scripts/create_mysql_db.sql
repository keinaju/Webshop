-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema webshop
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema webshop
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `webshop` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `webshop` ;

-- -----------------------------------------------------
-- Table `webshop`.`categories`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `webshop`.`categories` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `image_file` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 26
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `webshop`.`products`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `webshop`.`products` (
  `code` VARCHAR(100) NOT NULL,
  `price` DECIMAL(10,2) UNSIGNED NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `image_file` VARCHAR(100) NULL DEFAULT NULL,
  `manufacturer` VARCHAR(100) NULL DEFAULT NULL,
  `country_of_origin` VARCHAR(100) NULL DEFAULT NULL,
  `released` DATE NULL DEFAULT NULL,
  `lead_time_workdays` INT NULL DEFAULT NULL,
  `notes` TEXT NULL DEFAULT NULL,
  PRIMARY KEY (`code`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `webshop`.`category_links`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `webshop`.`category_links` (
  `category` INT NOT NULL,
  `product` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`category`, `product`),
  INDEX `fk_assignment_category1_idx` (`category` ASC) VISIBLE,
  INDEX `fk_assignment_products1_idx` (`product` ASC) VISIBLE,
  CONSTRAINT `fk_assignment_category1`
    FOREIGN KEY (`category`)
    REFERENCES `webshop`.`categories` (`id`)
    ON UPDATE CASCADE,
  CONSTRAINT `fk_assignment_products1`
    FOREIGN KEY (`product`)
    REFERENCES `webshop`.`products` (`code`)
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `webshop`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `webshop`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(100) NOT NULL,
  `hashed_password` VARCHAR(100) NOT NULL,
  `role` VARCHAR(100) NOT NULL,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `shopping_cart` TEXT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 26
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `webshop`.`orders`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `webshop`.`orders` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `product` VARCHAR(100) NOT NULL,
  `quantity` INT NOT NULL,
  `price_per_pc` DECIMAL(10,2) UNSIGNED NOT NULL,
  `status` VARCHAR(100) NOT NULL,
  `instructions` TEXT NULL DEFAULT NULL,
  `customer` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_orders_products_idx` (`product` ASC) VISIBLE,
  INDEX `fk_orders_users1_idx` (`customer` ASC) VISIBLE,
  CONSTRAINT `fk_orders_products`
    FOREIGN KEY (`product`)
    REFERENCES `webshop`.`products` (`code`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_orders_users1`
    FOREIGN KEY (`customer`)
    REFERENCES `webshop`.`users` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 55
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

USE `webshop` ;

-- -----------------------------------------------------
-- procedure add_category
-- -----------------------------------------------------

DELIMITER $$
USE `webshop`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `add_category`(IN p_name VARCHAR(100), IN p_image_file VARCHAR(100))
BEGIN
	INSERT INTO categories(name, image_file)
    VALUES (p_name, p_image_file);
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure add_category_link
-- -----------------------------------------------------

DELIMITER $$
USE `webshop`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `add_category_link`(IN product_code VARCHAR(100), IN category_id INT)
BEGIN
	INSERT INTO category_links
    VALUES (category_id, product_code);
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure add_order
-- -----------------------------------------------------

DELIMITER $$
USE `webshop`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `add_order`(IN p_product VARCHAR(100), IN p_quantity INT, IN p_price_per_pc DECIMAL(10,2), IN p_status VARCHAR(100), IN p_instructions TEXT, IN p_customer INT)
BEGIN

	INSERT INTO orders (product, quantity, price_per_pc, status, instructions, customer)
    VALUES (p_product, p_quantity, p_price_per_pc, p_status, p_instructions, p_customer);

END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure add_product
-- -----------------------------------------------------

DELIMITER $$
USE `webshop`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `add_product`(
	IN code VARCHAR(100),
    IN price DECIMAL(10,2),
    IN name VARCHAR(100),
    IN description TEXT,
    IN image_file VARCHAR(100),
    IN manufacturer VARCHAR(100),
    IN country_of_origin VARCHAR(100),
    IN released DATE,
    IN lead_time_workdays INT,
    IN notes TEXT
    )
BEGIN
	INSERT INTO products
    VALUES (code, price, name, description, image_file, manufacturer, country_of_origin, released, lead_time_workdays, notes);
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure add_user
-- -----------------------------------------------------

DELIMITER $$
USE `webshop`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `add_user`(IN p_email VARCHAR(100), IN p_hashed_password VARCHAR(100), IN p_role VARCHAR(100), IN p_first_name VARCHAR(100), IN p_last_name VARCHAR(100))
BEGIN
	INSERT INTO users(email, hashed_password, role, first_name, last_name)
    VALUES (p_email, p_hashed_password, p_role, p_first_name, p_last_name);
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure delete_category_links
-- -----------------------------------------------------

DELIMITER $$
USE `webshop`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `delete_category_links`(IN p_code VARCHAR(100))
BEGIN

	DELETE FROM category_links WHERE product = p_code ;

END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure get_categories
-- -----------------------------------------------------

DELIMITER $$
USE `webshop`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_categories`()
BEGIN
	SELECT * FROM categories ORDER BY name;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure get_categories_by_id
-- -----------------------------------------------------

DELIMITER $$
USE `webshop`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_categories_by_id`(IN p_product_code VARCHAR(100))
BEGIN

	SELECT * FROM category_links WHERE product = p_product_code;

END$$

DELIMITER ;

-- -----------------------------------------------------
-- function get_categories_per_product
-- -----------------------------------------------------

DELIMITER $$
USE `webshop`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `get_categories_per_product`(product_code VARCHAR(100)) RETURNS text CHARSET utf8mb4
    READS SQL DATA
BEGIN
	
    DECLARE output TEXT;
    
    SELECT GROUP_CONCAT(name ORDER BY name SEPARATOR ', ') INTO output
    FROM category_links JOIN categories ON category_links.category = categories.id
    WHERE product = product_code
    GROUP BY product;

	RETURN output;
    
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure get_order_by_id
-- -----------------------------------------------------

DELIMITER $$
USE `webshop`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_order_by_id`(IN p_order_id INT)
BEGIN

	SELECT * FROM orders WHERE id = p_order_id;

END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure get_orders_by_status
-- -----------------------------------------------------

DELIMITER $$
USE `webshop`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_orders_by_status`(IN p_status VARCHAR(100), IN p_limit INT, IN p_offset INT)
BEGIN

	SELECT
		orders.id AS order_id,
        orders.date AS order_date,
        orders.product AS product_code,
        orders.quantity AS order_quantity,
        orders.price_per_pc AS unit_price,
        orders.status AS order_status,
        orders.instructions AS order_instructions,
        orders.customer AS customer_id,
        products.name AS product_name,
        products.image_file AS product_image_file,
        users.email AS customer_email,
        users.first_name AS customer_first_name,
        users.last_name AS customer_last_name
	FROM orders 
		JOIN products ON orders.product = products.code 
        JOIN users ON orders.customer = users.id
	WHERE 
		status = p_status
	ORDER BY order_id
	LIMIT p_limit OFFSET p_offset;

END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure get_orders_count_by_status
-- -----------------------------------------------------

DELIMITER $$
USE `webshop`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_orders_count_by_status`(IN p_status VARCHAR(100))
BEGIN

	SELECT COUNT(*) AS orders_count FROM orders WHERE status = p_status;

END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure get_product_by_id
-- -----------------------------------------------------

DELIMITER $$
USE `webshop`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_product_by_id`(IN p_product_code VARCHAR(100))
BEGIN

	SELECT * FROM products WHERE code = p_product_code;

END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure get_products
-- -----------------------------------------------------

DELIMITER $$
USE `webshop`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_products`(IN p_limit INT, IN p_offset INT, IN any_category BOOL, IN chosen_categories TEXT, IN regular_expression TEXT)
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

END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure get_products_count
-- -----------------------------------------------------

DELIMITER $$
USE `webshop`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_products_count`(IN any_category BOOL, IN chosen_categories TEXT, IN regular_expression TEXT)
BEGIN

SELECT COUNT(DISTINCT(code)) AS product_count
FROM products p LEFT JOIN category_links c ON c.product = p.code
WHERE
	(any_category = TRUE OR FIND_IN_SET(c.category, chosen_categories) > 0)
    AND
    (name REGEXP regular_expression OR description REGEXP regular_expression);
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure get_user_by_email
-- -----------------------------------------------------

DELIMITER $$
USE `webshop`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_user_by_email`(IN p_email VARCHAR(100))
BEGIN
	SELECT * FROM users WHERE email = p_email;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure reset_shopping_cart_by_user
-- -----------------------------------------------------

DELIMITER $$
USE `webshop`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `reset_shopping_cart_by_user`(IN p_userid INT)
BEGIN

	UPDATE users
    SET shopping_cart = NULL
    WHERE id = p_userid;

END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure set_order_status
-- -----------------------------------------------------

DELIMITER $$
USE `webshop`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `set_order_status`(IN p_order_id INT, IN p_new_status VARCHAR(100))
BEGIN

	UPDATE orders
    SET status = p_new_status
    WHERE id = p_order_id;
    
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure set_shopping_cart_by_email
-- -----------------------------------------------------

DELIMITER $$
USE `webshop`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `set_shopping_cart_by_email`(IN p_email VARCHAR(100), IN p_content TEXT)
BEGIN

	UPDATE users
    SET shopping_cart = p_content
    WHERE email = p_email;

END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure update_product
-- -----------------------------------------------------

DELIMITER $$
USE `webshop`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `update_product`(
	IN p_code VARCHAR(100),
    IN p_price DECIMAL(10,2),
    IN p_name VARCHAR(100),
    IN p_description TEXT,
    IN p_manufacturer VARCHAR(100),
    IN p_country_of_origin VARCHAR(100),
    IN p_released DATE,
    IN p_lead_time_workdays INT,
    IN p_notes TEXT
)
BEGIN

	UPDATE products
    SET
		code = p_code,
        price = p_price,
        name = p_name,
        description = p_description,
        manufacturer = p_manufacturer,
        country_of_origin = p_country_of_origin,
        released = p_released,
        lead_time_workdays = p_lead_time_workdays,
        notes = p_notes
	WHERE code = p_code;

END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure update_product_image
-- -----------------------------------------------------

DELIMITER $$
USE `webshop`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `update_product_image`(IN p_code VARCHAR(100), IN p_image_file VARCHAR(100))
BEGIN

	UPDATE products SET image_file = p_image_file WHERE code = p_code;

END$$

DELIMITER ;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
