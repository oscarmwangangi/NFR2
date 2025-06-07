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
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sender_id` int NOT NULL,
  `receiver_id` int DEFAULT NULL,
  `message` text NOT NULL,
  `status` enum('sent','delivered','read') DEFAULT 'sent',
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,14,16,'hey','sent','2025-03-16 12:50:47'),(2,14,16,'hey','sent','2025-03-16 12:50:47'),(3,14,16,'how are you..','sent','2025-03-16 12:50:59'),(4,14,16,'how are you..','sent','2025-03-16 12:50:59'),(5,15,16,'hi','sent','2025-03-16 12:51:43'),(6,15,16,'hi','sent','2025-03-16 12:51:44'),(7,15,16,'hey what is NFR?','sent','2025-03-16 12:52:04'),(8,15,16,'hey what is NFR?','sent','2025-03-16 12:52:04'),(9,16,15,'NFR is an ecommerce platform that offers a variety of items at afforadale price','sent','2025-03-16 12:53:02'),(10,16,15,'hi','sent','2025-03-16 13:01:22'),(11,15,16,'how are you?','sent','2025-03-16 13:01:59'),(12,15,16,'how are you?','sent','2025-03-16 13:01:59'),(13,15,16,'hi','sent','2025-03-16 13:03:57'),(14,15,16,'hi','sent','2025-03-16 13:03:57'),(15,16,15,'how are you?','sent','2025-03-16 13:04:06'),(16,15,16,'am good you?','sent','2025-03-16 13:04:15'),(17,15,16,'am good you?','sent','2025-03-16 13:04:15'),(18,16,15,'am also good','sent','2025-03-16 13:04:41'),(19,15,16,'what is NFR?','sent','2025-03-16 13:04:56'),(20,15,16,'what is NFR?','sent','2025-03-16 13:04:56'),(21,15,16,'hi ','sent','2025-03-16 13:08:37'),(22,15,16,'hi ','sent','2025-03-16 13:08:37'),(23,16,15,'how are you?','sent','2025-03-16 13:08:54'),(24,15,16,'am good?','sent','2025-03-16 13:09:04'),(25,15,16,'am good?','sent','2025-03-16 13:09:04'),(26,16,15,'thats nice','sent','2025-03-16 13:09:15'),(27,15,16,'thank you','sent','2025-03-16 13:17:18'),(28,15,16,'thank you','sent','2025-03-16 13:17:18'),(29,14,16,'hi','sent','2025-03-16 14:01:43'),(30,14,16,'hi','sent','2025-03-16 14:01:43'),(31,16,14,'how are you?','sent','2025-03-16 14:02:12'),(32,14,16,'hi ','sent','2025-03-16 14:04:03'),(33,14,16,'hi ','sent','2025-03-16 14:04:03'),(34,16,14,'how are you?','sent','2025-03-16 14:04:20'),(35,14,16,'am good you?','sent','2025-03-16 14:04:32'),(36,14,16,'am good you?','sent','2025-03-16 14:04:33'),(37,16,14,'am also good','sent','2025-03-16 14:04:44'),(38,14,16,'what is NFR','sent','2025-03-16 14:04:56'),(39,14,16,'what is NFR','sent','2025-03-16 14:04:56'),(40,16,14,'NFR is an ecommerce website that offer quality product and at affordable price','sent','2025-03-16 14:06:10'),(41,14,16,'thank you when is it launching?','sent','2025-03-16 14:07:02'),(42,14,16,'thank you when is it launching?','sent','2025-03-16 14:07:02'),(43,16,14,'by on April 2025','sent','2025-03-16 14:07:39'),(44,14,16,'ok thank you..','sent','2025-03-16 14:08:41'),(45,14,16,'ok thank you..','sent','2025-03-16 14:08:41'),(46,14,16,'hey','sent','2025-03-16 14:09:10'),(47,14,16,'hey','sent','2025-03-16 14:09:10'),(48,16,14,'how are you?','sent','2025-03-16 14:10:55'),(49,14,16,'am good','sent','2025-03-16 14:11:06'),(50,14,16,'am good','sent','2025-03-16 14:11:06'),(51,16,14,'ok','sent','2025-03-16 14:11:11'),(52,14,16,'good night','sent','2025-03-16 14:11:21'),(53,14,16,'good night','sent','2025-03-16 14:11:21'),(54,16,14,'good night','sent','2025-03-16 14:11:32'),(55,14,16,'hi','sent','2025-03-16 14:13:30'),(56,14,16,'hi','sent','2025-03-16 14:13:30'),(57,16,14,'how can i help you?','sent','2025-03-16 14:13:53'),(58,14,16,'i would like to inquire what is NFR','sent','2025-03-16 14:14:19'),(59,14,16,'i would like to inquire what is NFR','sent','2025-03-16 14:14:19'),(60,16,14,'NFR is an ecommerce website that offer quality product and at affordable price','sent','2025-03-16 14:14:25'),(61,14,16,'when is it launching?','sent','2025-03-16 14:15:27'),(62,14,16,'when is it launching?','sent','2025-03-16 14:15:27'),(63,16,14,'on april 2025 hopefully','sent','2025-03-16 14:16:57'),(64,15,16,'hi','sent','2025-03-16 15:32:52'),(65,15,16,'hi','sent','2025-03-16 15:32:52'),(66,15,16,'hello','sent','2025-03-16 15:33:02'),(67,15,16,'hello','sent','2025-03-16 15:33:03'),(68,16,15,'how are you','sent','2025-03-16 15:33:20'),(69,15,16,'am good and you?','sent','2025-03-16 15:33:31'),(70,15,16,'am good and you?','sent','2025-03-16 15:33:31'),(71,16,15,'good, what is NFR?','sent','2025-03-16 15:33:48'),(72,15,16,'NFR is an ecommerce website that offer quality product and at affordable price','sent','2025-03-16 15:34:00'),(73,15,16,'NFR is an ecommerce website that offer quality product and at affordable price','sent','2025-03-16 15:34:00'),(74,16,15,'when is it launching?','sent','2025-03-16 15:34:38'),(75,15,16,'on April 2025 hopefully','sent','2025-03-16 15:35:14'),(76,15,16,'on April 2025 hopefully','sent','2025-03-16 15:35:14'),(77,16,15,'ok thank you','sent','2025-03-16 15:35:26');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-08  1:41:21
