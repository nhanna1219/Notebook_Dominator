-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: notebook_management
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

DROP DATABASE `notebook_management`;

CREATE DATABASE `notebook_management`;

USE `notebook_management`;

--
-- Table structure for table `class_game_sessions`
--

DROP TABLE IF EXISTS `class_game_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `class_game_sessions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `class_id` int NOT NULL,
  `game_id` int NOT NULL,
  `session_id` int NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_class_id` (`class_id`),
  KEY `idx_game_id` (`game_id`),
  KEY `idx_session_id` (`session_id`),
  CONSTRAINT `class_game_sessions_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`),
  CONSTRAINT `class_game_sessions_ibfk_2` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`),
  CONSTRAINT `class_game_sessions_ibfk_3` FOREIGN KEY (`session_id`) REFERENCES `sessions` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `class_game_sessions`
--

/*!40000 ALTER TABLE `class_game_sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `class_game_sessions` ENABLE KEYS */;

--
-- Table structure for table `classes`
--

DROP TABLE IF EXISTS `classes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `classes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint NOT NULL DEFAULT '1',
  `grade_id` int NOT NULL,
  `homeroom_teacher_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `idx_grade_id` (`grade_id`),
  CONSTRAINT `classes_ibfk_1` FOREIGN KEY (`grade_id`) REFERENCES `grades` (`id`),
  CONSTRAINT `classes_ibfk_2` FOREIGN KEY (`homeroom_teacher_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classes`
--

/*!40000 ALTER TABLE `classes` DISABLE KEYS */;
INSERT INTO `classes` VALUES (1,'10A1','2024-05-02 15:18:06',1,1,14),(2,'11A1','2024-05-02 15:18:06',1,2,15),(3,'12A1','2024-05-02 15:18:06',1,3,16);
/*!40000 ALTER TABLE `classes` ENABLE KEYS */;

--
-- Table structure for table `email_notifications`
--

DROP TABLE IF EXISTS `email_notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `email_notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `recipient_email` varchar(255) NOT NULL,
  `subject` text,
  `message` text,
  `sent_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_notifications`
--

/*!40000 ALTER TABLE `email_notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `email_notifications` ENABLE KEYS */;

--
-- Table structure for table `game_participants`
--

DROP TABLE IF EXISTS `game_participants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_participants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `game_id` int NOT NULL,
  `student_id` int NOT NULL,
  `result` text,
  PRIMARY KEY (`id`),
  KEY `idx_game_id` (`game_id`),
  KEY `idx_student_id` (`student_id`),
  CONSTRAINT `game_participants_ibfk_1` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`),
  CONSTRAINT `game_participants_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_participants`
--

/*!40000 ALTER TABLE `game_participants` DISABLE KEYS */;
/*!40000 ALTER TABLE `game_participants` ENABLE KEYS */;

--
-- Table structure for table `games`
--

DROP TABLE IF EXISTS `games`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `games` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `settings` text,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `games`
--

/*!40000 ALTER TABLE `games` DISABLE KEYS */;
/*!40000 ALTER TABLE `games` ENABLE KEYS */;

--
-- Table structure for table `grades`
--

DROP TABLE IF EXISTS `grades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grades` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grades`
--

/*!40000 ALTER TABLE `grades` DISABLE KEYS */;
INSERT INTO `grades` VALUES (1,'Khối 10','2024-04-05 16:06:42',1),(2,'Khối 11','2024-04-05 16:06:42',1),(3,'Khối 12','2024-04-05 16:06:42',1);
/*!40000 ALTER TABLE `grades` ENABLE KEYS */;

--
-- Table structure for table `lessons`
--

DROP TABLE IF EXISTS `lessons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lessons` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `subject_id` int DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `idx_subject_id` (`subject_id`),
  CONSTRAINT `lessons_ibfk_1` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lessons`
--

/*!40000 ALTER TABLE `lessons` DISABLE KEYS */;
INSERT INTO `lessons` VALUES (1,'Bài 1: Đại số','Giới thiệu về Đại số',1,'2024-05-02 15:13:54',1),(2,'Bài 2: Hình học','Giới thiệu về Hình học',1,'2024-05-02 15:13:54',1),(3,'Bài 3: Giải tích','Nhập môn Giải tích',1,'2024-05-02 15:13:54',1),(4,'Bài 4: Lượng giác','Cơ bản về Lượng giác',1,'2024-05-02 15:13:54',1),(5,'Bài 5: Phương trình','Giải phương trình bậc hai',1,'2024-05-02 15:13:54',1),(6,'Bài 6: Đồ thị','Vẽ và phân tích đồ thị hàm số',1,'2024-05-02 15:13:54',1),(7,'Bài 7: Tổ hợp','Tìm hiểu về tổ hợp và xác suất',1,'2024-05-02 15:13:54',1),(8,'Bài 8: Thống kê','Nhập môn Thống kê',1,'2024-05-02 15:13:54',1),(9,'Bài 9: Số phức','Giới thiệu về số phức',1,'2024-05-02 15:13:54',1),(10,'Bài 10: Đại số tuyến tính','Cơ bản về Đại số tuyến tính',1,'2024-05-02 15:13:54',1),(11,'Bài 11: Lý thuyết số','Khái niệm về Lý thuyết số',1,'2024-05-02 15:13:54',1),(12,'Bài 12: Toán tài chính','Giới thiệu về Toán tài chính',1,'2024-05-02 15:13:54',1),(13,'Bài 13: Toán ứng dụng','Ứng dụng của Toán trong thực tế',1,'2024-05-02 15:13:54',1),(14,'Bài 1: Động lực học','Khái niệm cơ bản của Động lực học',2,'2024-05-02 15:13:54',1),(15,'Bài 2: Nhiệt động lực học','Giới thiệu Nhiệt động lực học',2,'2024-05-02 15:13:54',1),(16,'Bài 3: Điện và từ','Cơ bản về điện và từ',2,'2024-05-02 15:13:54',1),(17,'Bài 4: Sóng và âm','Khái niệm về sóng và âm',2,'2024-05-02 15:13:54',1),(18,'Bài 5: Quang học','Nhập môn Quang học',2,'2024-05-02 15:13:54',1),(19,'Bài 6: Vật lý hiện đại','Tìm hiểu về Vật lý hiện đại',2,'2024-05-02 15:13:54',1),(20,'Bài 7: Cơ học chất lỏng','Cơ bản về Cơ học chất lỏng',2,'2024-05-02 15:13:54',1),(21,'Bài 8: Cơ học lượng tử','Giới thiệu về Cơ học lượng tử',2,'2024-05-02 15:13:54',1),(22,'Bài 9: Cơ học ứng dụng','Ứng dụng của Cơ học trong công nghệ',2,'2024-05-02 15:13:54',1),(23,'Bài 10: Động lực học vật rắn','Phân tích Động lực học vật rắn',2,'2024-05-02 15:13:54',1),(24,'Bài 11: Năng lượng tái tạo','Khái niệm về Năng lượng tái tạo',2,'2024-05-02 15:13:54',1),(25,'Bài 12: Vật lý thống kê','Cơ bản về Vật lý thống kê',2,'2024-05-02 15:13:54',1),(26,'Bài 13: Vật lý môi trường','Vật lý ứng dụng trong môi trường',2,'2024-05-02 15:13:54',1),(27,'Bài 1: Thơ ca','Thế giới thơ ca Việt Nam',3,'2024-05-02 15:13:54',1),(28,'Bài 2: Truyện ngắn','Nhập môn truyện ngắn',3,'2024-05-02 15:13:54',1),(29,'Bài 3: Phê bình văn học','Giới thiệu về phê bình văn học',3,'2024-05-02 15:13:54',1),(30,'Bài 4: Văn học cổ điển','Tìm hiểu về Văn học cổ điển',3,'2024-05-02 15:13:54',1),(31,'Bài 5: Văn học hiện đại','Văn học hiện đại và xu hướng mới',3,'2024-05-02 15:13:54',1),(32,'Bài 6: Văn học so sánh','Nhập môn Văn học so sánh',3,'2024-05-02 15:13:54',1),(33,'Bài 7: Lý thuyết văn học','Các lý thuyết chính trong Văn học',3,'2024-05-02 15:13:54',1),(34,'Bài 8: Văn hóa dân gian','Giới thiệu về Văn hóa dân gian',3,'2024-05-02 15:13:54',1),(35,'Bài 9: Văn học đương đại','Khám phá Văn học đương đại',3,'2024-05-02 15:13:54',1),(36,'Bài 10: Văn học trẻ em','Nhập môn Văn học trẻ em',3,'2024-05-02 15:13:54',1),(37,'Bài 11: Văn học thế giới','Tổng quan về Văn học thế giới',3,'2024-05-02 15:13:54',1),(38,'Bài 12: Thể loại văn học','Phân loại các thể loại trong Văn học',3,'2024-05-02 15:13:54',1),(39,'Bài 13: Văn học và xã hội','Mối liên hệ giữa Văn học và xã hội',3,'2024-05-02 15:13:54',1),(40,'Bài 1: Hóa hữu cơ','Nhập môn hóa hữu cơ',4,'2024-05-02 15:13:54',1),(41,'Bài 2: Hóa vô cơ','Cơ bản về hóa vô cơ',4,'2024-05-02 15:13:54',1),(42,'Bài 3: Bảng tuần hoàn','Khám phá bảng tuần hoàn các nguyên tố',4,'2024-05-02 15:13:54',1),(43,'Bài 4: Phản ứng hóa học','Hiểu về các phản ứng hóa học',4,'2024-05-02 15:13:54',1),(44,'Bài 5: Hóa phân tích','Tìm hiểu về Hóa phân tích',4,'2024-05-02 15:13:54',1),(45,'Bài 6: Hóa lý','Giới thiệu về Hóa lý',4,'2024-05-02 15:13:54',1),(46,'Bài 7: Hóa sinh','Nhập môn Hóa sinh',4,'2024-05-02 15:13:54',1),(47,'Bài 8: Hóa môi trường','Hóa học ứng dụng trong môi trường',4,'2024-05-02 15:13:54',1),(48,'Bài 9: Hóa dược','Giới thiệu về Hóa dược',4,'2024-05-02 15:13:54',1),(49,'Bài 10: Hóa thực phẩm','Hóa học trong thực phẩm',4,'2024-05-02 15:13:54',1),(50,'Bài 11: Hóa phân tử lớn','Các khái niệm về Hóa phân tử lớn',4,'2024-05-02 15:13:54',1),(51,'Bài 12: Hóa công nghiệp','Tìm hiểu về Hóa công nghiệp',4,'2024-05-02 15:13:54',1),(52,'Bài 1: Ngữ pháp','Cơ bản về ngữ pháp Anh ngữ',5,'2024-05-02 15:13:54',1),(53,'Bài 2: Từ vựng','Mở rộng vốn từ vựng',5,'2024-05-02 15:13:54',1),(54,'Bài 3: Giao tiếp','Kỹ năng giao tiếp cơ bản',5,'2024-05-02 15:13:54',1),(55,'Bài 4: Nghe','Phát triển kỹ năng nghe',5,'2024-05-02 15:13:54',1),(56,'Bài 5: Nói','Phát triển kỹ năng nói',5,'2024-05-02 15:13:54',1),(57,'Bài 6: Đọc','Phát triển kỹ năng đọc',5,'2024-05-02 15:13:54',1),(58,'Bài 7: Viết','Phát triển kỹ năng viết',5,'2024-05-02 15:13:54',1),(59,'Bài 8: Anh ngữ thương mại','Anh ngữ trong môi trường kinh doanh',5,'2024-05-02 15:13:54',1),(60,'Bài 9: Anh ngữ lịch sử','Tìm hiểu về lịch sử Anh ngữ',5,'2024-05-02 15:13:54',1),(61,'Bài 10: Anh ngữ khoa học','Anh ngữ ứng dụng trong khoa học',5,'2024-05-02 15:13:54',1),(62,'Bài 11: Anh ngữ kỹ thuật','Anh ngữ trong kỹ thuật',5,'2024-05-02 15:13:54',1),(63,'Bài 12: Anh ngữ pháp lý','Anh ngữ trong lĩnh vực pháp lý',5,'2024-05-02 15:13:54',1);


--
-- Table structure for table `notebooks`
--

DROP TABLE IF EXISTS `notebooks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notebooks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `note` text,
  `point` tinyint NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` tinyint NOT NULL DEFAULT '1',
  `lesson_id` int,
  `schedule_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `schedule_id` (`schedule_id`),
  CONSTRAINT `notebooks_ibfk_1` FOREIGN KEY (`schedule_id`) REFERENCES `schedules` (`id`),
  CONSTRAINT `notebooks_ibfk_2` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notebooks`
--

/*!40000 ALTER TABLE `notebooks` DISABLE KEYS */;
/*!40000 ALTER TABLE `notebooks` ENABLE KEYS */;

--
-- Table structure for table `periods`
--

DROP TABLE IF EXISTS `periods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `periods` (
  `id` int NOT NULL AUTO_INCREMENT,
  `from_time` time NOT NULL,
  `to_time` time NOT NULL,
  `note` VARCHAR(200) NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint NOT NULL DEFAULT '1',
  `session_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `periods_ibfk_1` (`session_id`),
  CONSTRAINT `periods_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `sessions` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `periods`
--

/*!40000 ALTER TABLE `periods` DISABLE KEYS */;
INSERT INTO
  `periods`
VALUES
  (
    1,
    '07:30:00',
    '08:15:00',
    'Tiết 1 (7:30 - 8:15)',
    '2024-05-02 15:31:17',
    1,
    1
  ),
  (
    2,
    '08:15:00',
    '09:00:00',
    'Tiết 2 (8:15 - 9:00)',
    '2024-05-02 15:31:17',
    1,
    1
  ),
  (
    3,
    '09:00:00',
    '09:45:00',
    'Tiết 3 (9:00 - 9:45)',
    '2024-05-02 15:31:17',
    1,
    1
  ),
  (
    4,
    '09:45:00',
    '10:30:00',
    'Tiết 4 (9:45 - 10:30)',
    '2024-05-02 15:31:17',
    1,
    1
  ),
  (
    5,
    '10:30:00',
    '11:15:00',
    'Tiết 5 (10:30 - 11:15)',
    '2024-05-02 15:31:17',
    1,
    1
  ),
  (
    6,
    '13:00:00',
    '13:45:00',
    'Tiết 6 (13:00 - 13:45)',
    '2024-05-02 15:31:17',
    1,
    2
  ),
  (
    7,
    '13:45:00',
    '14:30:00',
    'Tiết 7 (13:45 - 14:30)',
    '2024-05-02 15:31:17',
    1,
    2
  ),
  (
    8,
    '14:30:00',
    '15:15:00',
    'Tiết 8 (14:30 - 15:15)',
    '2024-05-02 15:31:17',
    1,
    2
  ),
  (
    9,
    '15:15:00',
    '16:00:00',
    'Tiết 9 (15:15 - 16:00)',
    '2024-05-02 15:31:17',
    1,
    2
  );/*!40000 ALTER TABLE `periods` ENABLE KEYS */;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint NOT NULL DEFAULT '1',
  `short_name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `name_2` (`name`),
  UNIQUE KEY `name_3` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Giáo Viên Chủ Nhiệm','2024-04-15 11:46:02',1,'GVCN'),(2,'Giáo Viên Bộ Môn','2024-04-14 01:19:21',1,'GVBM'),(3,'Trưởng Bộ Môn','2024-04-14 01:19:53',1,'TBM'),(4,'Ban Giám Hiệu','2024-04-14 01:20:14',1,'BGH');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;

--
-- Table structure for table `schedules`
--

DROP TABLE IF EXISTS `schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `period_id` int NOT NULL,
  `week_of_semester` int NOT NULL,
  `day_of_week` int NOT NULL,
  `date` date NOT NULL,
  `semester` int DEFAULT '1',
  `class_id` int NOT NULL,
  `teacher_id` int NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `period_id` (`period_id`),
  KEY `class_id` (`class_id`),
  KEY `teacher_id` (`teacher_id`),
  CONSTRAINT `schedules_ibfk_1` FOREIGN KEY (`period_id`) REFERENCES `periods` (`id`),
  CONSTRAINT `schedules_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`),
  CONSTRAINT `schedules_ibfk_3` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedules`
--

/*!40000 ALTER TABLE `schedules` DISABLE KEYS */;
-- Define variables for ease of adjustment
SET @date_start = '2024-04-29';  -- Starting date (ensure this is a Monday for simplicity)
SET @num_weeks = 12;  -- Number of weeks to schedule
SET @days_per_week = 5;  -- Number of days per week to schedule (Monday to Friday)

-- Insert schedule using loop in stored procedure
DELIMITER $$

CREATE PROCEDURE insert_schedule()
BEGIN
  DECLARE week_counter INT DEFAULT 0;
  DECLARE day_counter INT;
  DECLARE curr_date DATE;

  WHILE week_counter < @num_weeks DO
    SET day_counter = 0;
    WHILE day_counter < @days_per_week DO
      SET curr_date = DATE_ADD(@date_start, INTERVAL (week_counter * 7 + day_counter) DAY);
      -- Insert for class 1 (14, 3, 4, 7, 8)
      INSERT INTO schedules (period_id, week_of_semester, day_of_week, date, semester, class_id, teacher_id)
      VALUES (1, week_counter + 1, day_counter + 1, curr_date, 1, 1, 14), -- GVCN: Toán
            (2, week_counter + 1, day_counter + 1, curr_date, 1, 1, 14),
            (3, week_counter + 1, day_counter + 1, curr_date, 1, 1, 3), -- TTBM: Lý
            (4, week_counter + 1, day_counter + 1, curr_date, 1, 1, 3),
            (5, week_counter + 1, day_counter + 1, curr_date, 1, 1, 4), -- TTBM: Văn
            (6, week_counter + 1, day_counter + 1, curr_date, 1, 1, 10), -- GVBM: Anh (Replace)
            (7, week_counter + 1, day_counter + 1, curr_date, 1, 1, 10),
            (8, week_counter + 1, day_counter + 1, curr_date, 1, 1, 7), -- GVBM: Hóa
            (9, week_counter + 1, day_counter + 1, curr_date, 1, 1, 7);


      -- Insert for class 2 (2, 15, 9, 5, 10)
      INSERT INTO schedules (period_id, week_of_semester, day_of_week, date, semester, class_id, teacher_id)
      VALUES (1, week_counter + 1, day_counter + 1, curr_date, 1, 2, 2), -- TTBM: Toán
            (2, week_counter + 1, day_counter + 1, curr_date, 1, 2, 2),
            (3, week_counter + 1, day_counter + 1, curr_date, 1, 2, 16), -- GVBM: Văn (Replace)
            (4, week_counter + 1, day_counter + 1, curr_date, 1, 2, 15), -- GVCN: Lý
            (5, week_counter + 1, day_counter + 1, curr_date, 1, 2, 15),
            (6, week_counter + 1, day_counter + 1, curr_date, 1, 2, 5), -- TTBM: Hóa
            (7, week_counter + 1, day_counter + 1, curr_date, 1, 2, 5),
            (8, week_counter + 1, day_counter + 1, curr_date, 1, 2, 10), -- GVBM: Anh
            (9, week_counter + 1, day_counter + 1, curr_date, 1, 2, 10);
      
      -- Insert for class 3 (12, 11, 16, 13, 6)
      INSERT INTO schedules (period_id, week_of_semester, day_of_week, date, semester, class_id, teacher_id)
      VALUES (1, week_counter + 1, day_counter + 1, curr_date, 1, 3, 12), -- GVBM: Toán
            (2, week_counter + 1, day_counter + 1, curr_date, 1, 3, 12),
            (3, week_counter + 1, day_counter + 1, curr_date, 1, 3, 11), -- GVBM: Lý
            (4, week_counter + 1, day_counter + 1, curr_date, 1, 3, 11),
            (5, week_counter + 1, day_counter + 1, curr_date, 1, 3, 16), -- GVCN: Văn
            (6, week_counter + 1, day_counter + 1, curr_date, 1, 3, 13), -- GVBM: Hóa
            (7, week_counter + 1, day_counter + 1, curr_date, 1, 3, 13),
            (8, week_counter + 1, day_counter + 1, curr_date, 1, 3, 6), -- TTBM: Anh
            (9, week_counter + 1, day_counter + 1, curr_date, 1, 3, 6);

      SET day_counter = day_counter + 1;
    END WHILE;
    SET week_counter = week_counter + 1;
  END WHILE;
END$$

DELIMITER ;

-- Call the procedure to insert the data
CALL insert_schedule();

-- Drop the procedure if not needed further
DROP PROCEDURE IF EXISTS insert_schedule;

/*!40000 ALTER TABLE `schedules` ENABLE KEYS */;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `from_time` time NOT NULL,
  `to_time` time NOT NULL,
  `note` varchar(200) NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `idx_is_active` (`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES (1,'07:30:00','11:15:00','Buổi sáng (7:30 - 11:15)','2024-05-02 15:31:17',1),(2,'13:00:00','16:00:00','Buổi chiều (13:00 - 16:00)','2024-05-02 15:31:17',1);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;

--
-- Table structure for table `student_attendance`
--

DROP TABLE IF EXISTS `student_attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
-- Active: 1712942545286@@127.0.0.1@3306@notebook_management
CREATE TABLE `student_attendance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `note` text,
  `is_present` tinyint NOT NULL DEFAULT '0',
  `student_id` int NOT NULL,
  `schedule_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_student_schedule` (`student_id`,`schedule_id`),
  KEY `idx_student_id` (`student_id`),
  KEY `idx_schedule_id` (`schedule_id`),
  CONSTRAINT `student_attendance_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  CONSTRAINT `student_attendance_ibfk_2` FOREIGN KEY (`schedule_id`) REFERENCES `schedules` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_attendance`
--

/*!40000 ALTER TABLE `student_attendance` DISABLE KEYS */;
/*!40000 ALTER TABLE `student_attendance` ENABLE KEYS */;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int unsigned NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint NOT NULL DEFAULT '1',
  `class_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_class_id` (`class_id`),
  CONSTRAINT `students_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (1,'An','Nguyễn','2024-05-02 17:42:16',1,1,1),(2,'Bảo','Trần','2024-05-02 17:42:16',1,1,2),(3,'Chi','Lê','2024-05-02 17:42:16',1,1,3),(4,'Dũng','Phạm','2024-05-02 17:42:16',1,1,4),(5,'Duy','Hoàng','2024-05-02 17:42:16',1,1,5),(6,'Hà','Phan','2024-05-02 17:42:16',1,1,6),(7,'Hải','Vũ','2024-05-02 17:42:16',1,1,7),(8,'Hạnh','Đỗ','2024-05-02 17:42:16',1,1,8),(9,'Hảo','Bùi','2024-05-02 17:42:16',1,1,9),(10,'Hoa','Đặng','2024-05-02 17:42:16',1,1,10),(11,'Hoàng','Đinh','2024-05-02 17:42:16',1,1,11),(12,'Hùng','Lương','2024-05-02 17:42:16',1,1,12),(13,'Hường','Châu','2024-05-02 17:42:16',1,1,13),(14,'Khánh','Lý','2024-05-02 17:42:16',1,1,14),(15,'Khoa','Mai','2024-05-02 17:42:16',1,1,15),(16,'Khôi','Liễu','2024-05-02 17:42:16',1,1,16),(17,'Lan','Ngô','2024-05-02 17:42:16',1,1,17),(18,'Linh','Dương','2024-05-02 17:42:16',1,1,18),(19,'Long','Lưu','2024-05-02 17:42:16',1,1,19),(20,'Ly','Hồ','2024-05-02 17:42:16',1,1,20),(21,'Mai','Quách','2024-05-02 17:42:16',1,1,21),(22,'Minh','Vương','2024-05-02 17:42:16',1,1,22),(23,'Nam','Khuất','2024-05-02 17:42:16',1,1,23),(24,'Nhung','Hà','2024-05-02 17:42:16',1,1,24),(25,'Phúc','Kiều','2024-05-02 17:42:16',1,1,25),(26,'Quân','Kim','2024-05-02 17:42:16',1,2,1),(27,'Quang','Thái','2024-05-02 17:42:16',1,2,2),(28,'Quý','Thạch','2024-05-02 17:42:16',1,2,3),(29,'Sơn','Trịnh','2024-05-02 17:42:16',1,2,4),(30,'Thành','Tạ','2024-05-02 17:42:16',1,2,5),(31,'Thảo','Phan','2024-05-02 17:42:16',1,2,6),(32,'Thi','Võ','2024-05-02 17:42:16',1,2,7),(33,'Thu','Nguyễn','2024-05-02 17:42:16',1,2,8),(34,'Thư','Trần','2024-05-02 17:42:16',1,2,9),(35,'Thúy','Lê','2024-05-02 17:42:16',1,2,10),(36,'Thủy','Phạm','2024-05-02 17:42:16',1,2,11),(37,'Tiến','Hoàng','2024-05-02 17:42:16',1,2,12),(38,'Trâm','Vũ','2024-05-02 17:42:16',1,2,13),(39,'Trang','Đỗ','2024-05-02 17:42:16',1,2,14),(40,'Triết','Bùi','2024-05-02 17:42:16',1,2,15),(41,'Trí','Đặng','2024-05-02 17:42:16',1,2,16),(42,'Trinh','Đinh','2024-05-02 17:42:16',1,2,17),(43,'Trung','Lương','2024-05-02 17:42:16',1,2,18),(44,'Tùng','Châu','2024-05-02 17:42:16',1,2,19),(45,'Tú','Lý','2024-05-02 17:42:16',1,2,20),(46,'Uyên','Mai','2024-05-02 17:42:16',1,2,21),(47,'Việt','Liễu','2024-05-02 17:42:16',1,2,22),(48,'Vinh','Ngô','2024-05-02 17:42:16',1,2,23),(49,'Vĩ','Dương','2024-05-02 17:42:16',1,2,24),(50,'Vũ','Lưu','2024-05-02 17:42:16',1,2,25),(51,'Anh','Hồ','2024-05-02 17:42:16',1,3,1),(52,'Bình','Quách','2024-05-02 17:42:16',1,3,2),(53,'Cường','Vương','2024-05-02 17:42:16',1,3,3),(54,'Đạt','Khuất','2024-05-02 17:42:16',1,3,4),(55,'Đức','Hà','2024-05-02 17:42:16',1,3,5),(56,'Giang','Kim','2024-05-02 17:42:16',1,3,6),(57,'Hiếu','Thái','2024-05-02 17:42:16',1,3,7),(58,'Hồng','Thạch','2024-05-02 17:42:16',1,3,8),(59,'Huy','Trịnh','2024-05-02 17:42:16',1,3,9),(60,'Khải','Tạ','2024-05-02 17:42:16',1,3,10),(61,'Khang','Phan','2024-05-02 17:42:16',1,3,11),(62,'Kiên','Võ','2024-05-02 17:42:16',1,3,12),(63,'Lâm','Nguyễn','2024-05-02 17:42:16',1,3,13),(64,'Luân','Trần','2024-05-02 17:42:16',1,3,14),(65,'Lượng','Lê','2024-05-02 17:42:16',1,3,15),(66,'Mạnh','Phạm','2024-05-02 17:42:16',1,3,16),(67,'Nghĩa','Hoàng','2024-05-02 17:42:16',1,3,17),(68,'Ngọc','Vũ','2024-05-02 17:42:16',1,3,18),(69,'Nhi','Đỗ','2024-05-02 17:42:16',1,3,19),(70,'Phát','Bùi','2024-05-02 17:42:16',1,3,20),(71,'Phong','Đặng','2024-05-02 17:42:16',1,3,21),(72,'Quốc','Đinh','2024-05-02 17:42:16',1,3,22),(73,'Tân','Lương','2024-05-02 17:42:16',1,3,23),(74,'Thanh','Châu','2024-05-02 17:42:16',1,3,24),(75,'Thuận','Lý','2024-05-02 17:42:16',1,3,25);
/*!40000 ALTER TABLE `students` ENABLE KEYS */;

--
-- Table structure for table `subjects`
--

DROP TABLE IF EXISTS `subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subjects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subjects`
--

/*!40000 ALTER TABLE `subjects` DISABLE KEYS */;
INSERT INTO `subjects` VALUES (1,'Toán Học','2024-05-01 08:29:04',1),(2,'Vật Lý','2024-05-01 08:29:04',1),(3,'Văn Học','2024-05-01 08:29:04',1),(4,'Hóa Học','2024-05-01 08:29:04',1),(5,'Anh Ngữ','2024-05-01 08:29:04',1);
/*!40000 ALTER TABLE `subjects` ENABLE KEYS */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint NOT NULL DEFAULT '1',
  `subject_id` int DEFAULT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`),
  KEY `idx_role_id` (`role_id`),
  KEY `idx_subject_id` (`subject_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `users_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO
    `users`
VALUES (
        1, 'Nhân', 'Nguyễn', '19521940@gm.uit.edu.vn', 'admin', '$2a$12$JcoE7F4RCeRl4rBe.133VOJ.2kivqtMxwNlBFxbRHmUvESDG12pJG', '2024-04-14 01:21:08', 1, NULL, 4
    ),
    (
        2, 'Thảo', 'Nguyễn', 'thao.nguyen@gmail.com', 'thao.nguyen', '$2a$12$H8jAEvfuZV.QaiL1vA1oq.msDSh4aJDAmg0/ykVme/O0B4kfzjQwW', '2024-04-26 20:44:52', 1, 1, 3
    ),
    (
        3, 'Nam', 'Trần', 'nam.tran@gmail.com', 'nam.tran', '$2a$12$H8jAEvfuZV.QaiL1vA1oq.msDSh4aJDAmg0/ykVme/O0B4kfzjQwW', '2024-04-26 20:44:52', 1, 2, 3
    ),
    (
        4, 'Hoa', 'Lê', 'hoa.le@gmail.com', 'hoa.le', '$2a$12$H8jAEvfuZV.QaiL1vA1oq.msDSh4aJDAmg0/ykVme/O0B4kfzjQwW', '2024-04-26 20:44:52', 1, 3, 3
    ),
    (
        5, 'Kiên', 'Phạm', 'kien.pham@gmail.com', 'kien.pham', '$2a$12$H8jAEvfuZV.QaiL1vA1oq.msDSh4aJDAmg0/ykVme/O0B4kfzjQwW', '2024-04-26 20:44:52', 1, 4, 3
    ),
    (
        6, 'Minh', 'Hoàng', 'minh.hoang@gmail.com', 'minh.hoang', '$2a$12$H8jAEvfuZV.QaiL1vA1oq.msDSh4aJDAmg0/ykVme/O0B4kfzjQwW', '2024-04-26 20:44:52', 1, 5, 3
    ),
    (
        7, 'Ngọc', 'Hồ', 'ngoc.ho@gmail.com', 'ngoc.ho', '$2a$12$H8jAEvfuZV.QaiL1vA1oq.msDSh4aJDAmg0/ykVme/O0B4kfzjQwW', '2024-04-26 20:44:52', 1, 4, 2
    ),
    (
        8, 'Trang', 'Ngô', 'trang.ngo@gmail.com', 'trang.ngo', '$2a$12$H8jAEvfuZV.QaiL1vA1oq.msDSh4aJDAmg0/ykVme/O0B4kfzjQwW', '2024-04-26 20:44:52', 1, 5, 2
    ),
    (
        9, 'Mai', 'Lương', 'mai.luong@gmail.com', 'mai.luong', '$2a$12$H8jAEvfuZV.QaiL1vA1oq.msDSh4aJDAmg0/ykVme/O0B4kfzjQwW', '2024-04-26 20:44:52', 1, 3, 2
    ),
    (
        10, 'Bảo', 'Trần', 'bao.tran@gmail.com', 'bao.tran', '$2a$12$H8jAEvfuZV.QaiL1vA1oq.msDSh4aJDAmg0/ykVme/O0B4kfzjQwW', '2024-04-26 20:44:52', 1, 5, 2
    ),
    (
        11, 'Phương', 'Phạm', 'phuong.pham@gmail.com', 'phuong.pham', '$2a$12$H8jAEvfuZV.QaiL1vA1oq.msDSh4aJDAmg0/ykVme/O0B4kfzjQwW', '2024-04-26 20:44:52', 1, 2, 2
    ),
    (
        12, 'Sơn', 'Hoàng', 'son.hoang@gmail.com', 'son.hoang', '$2a$12$H8jAEvfuZV.QaiL1vA1oq.msDSh4aJDAmg0/ykVme/O0B4kfzjQwW', '2024-04-26 20:44:52', 1, 1, 2
    ),
    (
        13, 'Quang', 'Vũ', 'quang.vu@gmail.com', 'quang.vu', '$2a$12$H8jAEvfuZV.QaiL1vA1oq.msDSh4aJDAmg0/ykVme/O0B4kfzjQwW', '2024-04-26 20:44:52', 1, 4, 2
    ),
    (
        14, 'Huy', 'Trần', 'huy.tran@gmail.com', 'huy.tran', '$2a$12$H8jAEvfuZV.QaiL1vA1oq.msDSh4aJDAmg0/ykVme/O0B4kfzjQwW', '2024-04-26 20:44:52', 1, 1, 1
    ),
    (
        15, 'Khang', 'Lê', 'khang.le@gmail.com', 'khang.le', '$2a$12$H8jAEvfuZV.QaiL1vA1oq.msDSh4aJDAmg0/ykVme/O0B4kfzjQwW', '2024-04-26 20:44:52', 1, 2, 1
    ),
    (
        16, 'Lan Anh', 'Đinh Thị', 'anhdinh0920@gmail.com', 'anh.dinh', '$2a$12$H8jAEvfuZV.QaiL1vA1oq.msDSh4aJDAmg0/ykVme/O0B4kfzjQwW', '2024-04-28 23:27:53', 1, 3, 1
    );
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

--
-- Dumping routines for database 'notebook_management'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
-- 7 12 17
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-02 22:31:36
