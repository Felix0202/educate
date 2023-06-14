-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Erstellungszeit: 14. Jun 2023 um 16:46
-- Server-Version: 10.4.27-MariaDB
-- PHP-Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `educate`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `card`
--

CREATE TABLE `card` (
  `cardId` int(11) NOT NULL,
  `cardEntryId` int(11) NOT NULL,
  `question` varchar(300) NOT NULL,
  `answer` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `cardEntry`
--

CREATE TABLE `cardEntry` (
  `cardEntryId` int(11) NOT NULL,
  `entryId` int(11) NOT NULL,
  `title` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `cardEntry`
--

INSERT INTO `cardEntry` (`cardEntryId`, `entryId`, `title`) VALUES
(1, 2, 'test'),
(4, 47, 'New Cards'),
(5, 51, 'Cards');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `course`
--

CREATE TABLE `course` (
  `courseId` int(11) NOT NULL,
  `title` varchar(60) NOT NULL,
  `note` varchar(120) NOT NULL,
  `creationDate` datetime NOT NULL,
  `isPublic` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `course`
--

INSERT INTO `course` (`courseId`, `title`, `note`, `creationDate`, `isPublic`) VALUES
(1, 'ExampleCourse', 'this is a test', '2023-04-03 19:47:12', 1),
(2, 'testing Course 2', 'this is a course for testing purposes', '2023-04-04 18:06:50', 0),
(74, 'New Test Course', ' nothing', '2023-05-18 21:02:59', 1),
(77, 'New Course', ' nothing', '2023-06-11 22:34:17', 1),
(78, 'Math ', 'trying to understand math', '2023-06-12 12:10:59', 0),
(79, 'German', ' Deutsch Kurs', '2023-06-12 12:16:00', 1),
(80, 'Programming', ' Java, PHP, JS', '2023-06-12 12:17:04', 1),
(83, 'New Course', ' nothing', '2023-06-13 21:49:57', 1),
(84, 'New Course', ' nothing', '2023-06-14 11:44:05', 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `courseEntry`
--

CREATE TABLE `courseEntry` (
  `entryId` int(11) NOT NULL,
  `creationDate` datetime NOT NULL,
  `courseId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `courseEntry`
--

INSERT INTO `courseEntry` (`entryId`, `creationDate`, `courseId`) VALUES
(1, '2023-04-06 11:27:05', 1),
(2, '2023-04-06 11:28:00', 1),
(14, '2023-05-20 18:50:52', 74),
(15, '2023-05-25 12:10:45', 74),
(47, '2023-06-10 16:36:50', 2),
(48, '2023-06-10 16:36:52', 2),
(49, '2023-06-10 16:36:53', 2),
(50, '2023-06-11 22:34:19', 77),
(51, '2023-06-11 22:38:56', 77),
(52, '2023-06-12 12:11:37', 78),
(53, '2023-06-12 12:11:53', 78),
(54, '2023-06-12 12:16:24', 79),
(55, '2023-06-12 12:16:34', 79),
(56, '2023-06-13 21:47:52', 78),
(57, '2023-06-13 21:49:19', 78),
(58, '2023-06-14 11:44:07', 84),
(59, '2023-06-14 16:42:00', 74);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `session`
--

CREATE TABLE `session` (
  `sessionId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `authtoken` varchar(30) NOT NULL,
  `lastLogin` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `session`
--

INSERT INTO `session` (`sessionId`, `userId`, `authtoken`, `lastLogin`) VALUES
(23, 72, 'iEtENdVtPBQ1UI7Gs1fuqXMKKiI8Fq', '2023-04-02 16:18:00'),
(490, 70, 'yzAGJmdvAj2FErXZ3OX36Qo18rLOua', '2023-04-18 18:11:52'),
(624, 75, '9QG0kvBlVGFMxNOAa5i8aOXwt6vqzY', '2023-06-10 18:13:10'),
(637, 1, 'ps5CpdCqgfNIJdFCfF4holyTd5W9Pp', '2023-06-11 22:35:58'),
(656, 76, 'F4ZyxB2QbCxSvye0lCBxYCF3BlinHa', '2023-06-13 21:49:14'),
(657, 77, 'VclouUYXbaEFx7PvCLpuRn1jZjxm6h', '2023-06-14 11:43:59'),
(660, 73, 'IuDOisNu1R4okdm4kYbZhZFir896hz', '2023-06-14 16:42:34');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `textEntry`
--

CREATE TABLE `textEntry` (
  `textEntryId` int(11) NOT NULL,
  `entryId` int(11) NOT NULL,
  `text` varchar(1000) NOT NULL,
  `isHeadline` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `textEntry`
--

INSERT INTO `textEntry` (`textEntryId`, `entryId`, `text`, `isHeadline`) VALUES
(1, 1, 'test Headline', 1),
(2, 1, 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.', 0),
(3, 3, 'New Headline', 1),
(4, 4, 'New Text Text', 0),
(5, 6, 'New Text test 2', 0),
(6, 7, 'New Text test 2 delete', 1),
(7, 8, 'New Text i checks ned 22', 0),
(8, 9, 'this gets deleted', 1),
(9, 10, 'New Text aaaaa', 0),
(10, 12, 'New Text', 0),
(11, 13, 'New Headline 234', 1),
(12, 14, 'This is an MEDTWT Project', 1),
(13, 15, 'and this is a test Text ', 0),
(14, 16, 'delete this shit', 0),
(15, 17, 'New Text', 0),
(16, 18, 'New Text', 0),
(17, 19, 'New Headline', 1),
(18, 20, 'New Headline', 1),
(19, 21, 'New Headline', 1),
(20, 22, 'New Headline', 1),
(22, 24, 'New Headline', 1),
(45, 48, 'New Text', 0),
(46, 49, 'New Headline', 1),
(47, 50, 'New Headlineasdf', 1),
(48, 52, 'Addition', 1),
(49, 53, 'Adding numbers means to add numbers!!!', 0),
(50, 54, 'Die Deutsche Sprache', 1),
(51, 55, 'ist sehr schwer.', 0),
(52, 56, 'This is a. new Text', 0),
(53, 57, 'New Text 2', 0),
(54, 58, 'New Headline', 1),
(55, 59, 'New Headline', 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user`
--

CREATE TABLE `user` (
  `userId` int(11) NOT NULL,
  `name` varchar(70) NOT NULL,
  `password` varchar(32) NOT NULL,
  `email` varchar(320) NOT NULL,
  `username` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `user`
--

INSERT INTO `user` (`userId`, `name`, `password`, `email`, `username`) VALUES
(1, 'test User', '2854134669058d5f6c27197245f2e133', 'test@user.com.at', 'testUser'),
(2, 'testUser2', 'f58c4f6eeea8d10ca3678329ab8aa078', 'test@user.com', 'testUser2'),
(3, 'test User3', '209314ed8a802af58a0dffebf455fe66', 'test@user.com', 'testUser3'),
(29, 'test User4', '209314ed8a802af58a0dffebf455fe66', 'test@user.com', 'testUser4'),
(63, 'test User5', '209314ed8a802af58a0dffebf455fe66', 'test@user.com', 'testUser5'),
(64, 'test User6', '209314ed8a802af58a0dffebf455fe66', 'test@user.com', 'testUser6'),
(66, '', '209314ed8a802af58a0dffebf455fe66', 'test@user.com', 'testUser7'),
(67, 'test User8', '209314ed8a802af58a0dffebf455fe66', 'test', 'testUser8'),
(68, 'test User 9', '209314ed8a802af58a0dffebf455fe66', 'test@user.com', 'testUser9'),
(70, 'test User 10', '209314ed8a802af58a0dffebf455fe66', 'test@user.com', 'testUser10'),
(71, 'test User11', '209314ed8a802af58a0dffebf455fe66', 'test@user.com', 'testUser11'),
(72, 'admin', '209314ed8a802af58a0dffebf455fe66', 'admin@test@com', 'admin'),
(73, 'admin', 'f996d74d500fb2f49077bb430ae92fc1', 'admin@test.com', 'a'),
(76, 'maxi', '209314ed8a802af58a0dffebf455fe66', 'maxmustermann@muster.com', 'maxmustermann');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `usercourse`
--

CREATE TABLE `usercourse` (
  `userId` int(11) NOT NULL,
  `courseId` int(11) NOT NULL,
  `isOwner` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `usercourse`
--

INSERT INTO `usercourse` (`userId`, `courseId`, `isOwner`) VALUES
(1, 1, 0),
(1, 77, 1),
(73, 1, 0),
(73, 2, 1),
(73, 71, 1),
(73, 72, 1),
(73, 74, 1),
(73, 79, 0),
(73, 80, 0),
(76, 1, 0),
(76, 78, 1),
(76, 79, 1),
(76, 80, 1),
(76, 83, 1),
(77, 80, 0),
(77, 84, 1);

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `card`
--
ALTER TABLE `card`
  ADD PRIMARY KEY (`cardId`);

--
-- Indizes für die Tabelle `cardEntry`
--
ALTER TABLE `cardEntry`
  ADD PRIMARY KEY (`cardEntryId`);

--
-- Indizes für die Tabelle `course`
--
ALTER TABLE `course`
  ADD PRIMARY KEY (`courseId`);

--
-- Indizes für die Tabelle `courseEntry`
--
ALTER TABLE `courseEntry`
  ADD PRIMARY KEY (`entryId`);

--
-- Indizes für die Tabelle `session`
--
ALTER TABLE `session`
  ADD PRIMARY KEY (`sessionId`);

--
-- Indizes für die Tabelle `textEntry`
--
ALTER TABLE `textEntry`
  ADD PRIMARY KEY (`textEntryId`);

--
-- Indizes für die Tabelle `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userId`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indizes für die Tabelle `usercourse`
--
ALTER TABLE `usercourse`
  ADD PRIMARY KEY (`userId`,`courseId`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `card`
--
ALTER TABLE `card`
  MODIFY `cardId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `cardEntry`
--
ALTER TABLE `cardEntry`
  MODIFY `cardEntryId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT für Tabelle `course`
--
ALTER TABLE `course`
  MODIFY `courseId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=85;

--
-- AUTO_INCREMENT für Tabelle `courseEntry`
--
ALTER TABLE `courseEntry`
  MODIFY `entryId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT für Tabelle `session`
--
ALTER TABLE `session`
  MODIFY `sessionId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=661;

--
-- AUTO_INCREMENT für Tabelle `textEntry`
--
ALTER TABLE `textEntry`
  MODIFY `textEntryId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT für Tabelle `user`
--
ALTER TABLE `user`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
