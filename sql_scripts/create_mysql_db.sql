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
CREATE SCHEMA IF NOT EXISTS `webshop` ;
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
AUTO_INCREMENT = 20
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
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `webshop`.`orders`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `webshop`.`orders` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `date` DATETIME NOT NULL,
  `product` VARCHAR(100) NOT NULL,
  `quantity` INT NOT NULL,
  `price` DECIMAL(10,2) UNSIGNED NOT NULL,
  `status` VARCHAR(100) NOT NULL,
  `instructions` TEXT NULL,
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
AUTO_INCREMENT = 2
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
-- procedure add_product
-- -----------------------------------------------------

DELIMITER $$
USE `webshop`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `add_product`(IN code VARCHAR(100), IN price DECIMAL(10,2), IN name VARCHAR(100), IN description TEXT, IN image_file VARCHAR(100))
BEGIN
	INSERT INTO products
    VALUES (code, price, name, description, image_file);
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

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
