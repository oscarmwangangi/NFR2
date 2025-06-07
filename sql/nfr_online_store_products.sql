-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: nfr_online_store
-- ------------------------------------------------------
-- Server version	8.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `price` decimal(10,2) DEFAULT NULL,
  `discount_price` decimal(10,2) DEFAULT NULL,
  `in_stock` int DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `category` varchar(255) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `size` json DEFAULT NULL,
  `gender` varchar(50) DEFAULT NULL,
  `product_category_id` int DEFAULT NULL,
  `subcategory` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'breast pump','When we first encountered the Willow at CES in 2017, we thought it might just be the iPhone of breast pumps. Its design is revolutionary with no cords or tubes, and it works quietly inside your bra so that you can pump any time and anywhere you want. At $479.99, Willow isn’t cheap, but hopefully this type of technology becomes the norm at a lower price point in the future.',2000.00,3000.00,50,'uploads/1747572594556.webp','2025-05-18 12:49:54','2025-05-18 12:49:54','24','','[]','female',NULL,''),(2,'A-Line Dress','Dimensions and specifications\r\n86% Polyester 14% Metallic\r\nMade in Turkey\r\n\r\nDesigner Model Number: NA00202630289\r\nDesigner Colour: BLACK',3000.00,1000.00,60,'uploads/1747573705370.jpeg','2025-05-18 13:08:26','2025-05-18 13:08:26','10','','[]','female',NULL,''),(5,'Beauty product','Beauty product',500.00,200.00,90,'uploads/1747577122146.jpeg','2025-05-18 14:05:22','2025-05-18 14:05:22','28','','[]','female',NULL,''),(10,'Xiomi','Xiomi',400.00,5000.00,50,'uploads/1747579793445.jpeg','2025-05-18 14:49:53','2025-05-18 14:49:53','25','','[]','unisex',NULL,''),(11,'Clothing','Clothing',5000.00,4000.00,500,'uploads/1747580164505.jpg','2025-05-18 14:56:04','2025-05-18 14:56:04','28','','[]','unisex',NULL,''),(12,'Hand made leather ','Hand made leather ',300.00,500.00,4,'uploads/1747580388624.jpeg','2025-05-18 14:59:48','2025-05-18 14:59:48','28','','[]','unisex',NULL,''),(13,'Will leather goods','Will leather goods',400.00,500.00,4,'uploads/1747580468678.jpg','2025-05-18 15:01:08','2025-05-18 15:01:08','28','','[]','unisex',NULL,''),(14,'Elite Health Care','Elite Health Care',500.00,600.00,7,'uploads/1747580580838.jpeg','2025-05-18 15:03:00','2025-05-18 15:03:00','28','','[]','unisex',NULL,''),(15,'Shampoo','Shampoo',300.00,500.00,8,'uploads/1747580661416.webp','2025-05-18 15:04:21','2025-05-18 15:04:21','28','','[]','unisex',NULL,''),(16,'Lets Bond hair care','Lets Bond hair care',300.00,500.00,23,'uploads/1747580816542.webp','2025-05-18 15:06:56','2025-05-18 15:06:56','28','','[]','unisex',NULL,''),(17,'Mac','27 inch Mac',70300.00,77000.00,56,'uploads/1747581017931.jpeg','2025-05-18 15:10:18','2025-05-18 15:10:18','28','','[]','unisex',NULL,''),(18,'laptop','laptop',5000.00,6000.00,23,'uploads/1747581370739.webp','2025-05-18 15:16:10','2025-05-18 15:16:10','28','','[]','unisex',NULL,''),(19,'Asian Leather wallet','Asian Leather wallet',500.00,900.00,34,'uploads/1747581868219.jpeg','2025-05-18 15:24:28','2025-05-18 15:24:28','28','','[]','unisex',NULL,''),(20,'Asian Leather ','Asian Leather wallet',510.00,510.00,1,'uploads/1747586887268.jpeg','2025-05-18 15:26:04','2025-05-18 16:48:07','28','null','null','unisex',NULL,''),(22,'Xiomi','Xiomi',900.00,8989.00,89,'uploads/1747586460700.jpeg','2025-05-18 16:41:01','2025-05-18 16:41:01','29','','[]','unisex',NULL,''),(23,'ring','Xiomi',8989.00,7879.00,98,'uploads/1747586529188.jpeg','2025-05-18 16:42:09','2025-05-18 16:42:09','29','','[]','unisex',NULL,'');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-08  1:41:18
