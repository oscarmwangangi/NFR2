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
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `otp` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `google_id` varchar(255) DEFAULT NULL,
  `first_name` varchar(200) DEFAULT NULL,
  `second_name` varchar(200) DEFAULT NULL,
  `email_verified` tinyint(1) DEFAULT '0',
  `role` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `unique_email` (`email`),
  CONSTRAINT `role_values` CHECK ((`role` in (_utf8mb4'user',_utf8mb4'admin',_utf8mb4'topAdmin')))
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (14,'eddydennis883@gmail.com','$2a$10$x4EZrQBStWAbuWnxlq4Wpe/M/Tm3NakT7haqTC/PEDlvJJ.VuTQKi',NULL,'2025-02-11 22:35:01',NULL,'oscar','muu',0,NULL),(15,'desparteroscar@gmail.com','$2a$10$vpveeX0sNndAoQXZqBPTLeNRwUECKwsepea9vz5P6hQ8vFrqI693.',NULL,'2025-02-12 10:36:24',NULL,'Oscar','Desparter',1,NULL),(16,'mwangangioscar2016@gmail.com',NULL,NULL,'2025-02-12 11:12:07',NULL,'Oscar','Mwangangi',1,'admin'),(17,'testio@gmail.com','$2a$10$GEbAo6G.OdE1pkU262LWoebLWN45eP.iFECbhQ0yAiCb1fttI7esm',NULL,'2025-02-15 13:10:13',NULL,'Oscar','siga',0,NULL),(18,'muturaoscar6@gmail.com',NULL,NULL,'2025-06-02 20:47:10',NULL,'Oscar','Mutura',1,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-08  1:41:20
