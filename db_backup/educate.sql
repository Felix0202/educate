-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Erstellungszeit: 30. Mrz 2023 um 11:55
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
  `entryId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `courseEntry`
--

CREATE TABLE `courseEntry` (
  `entryId` int(11) NOT NULL,
  `creationDate` datetime NOT NULL,
  `courseId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `textEntry`
--

CREATE TABLE `textEntry` (
  `textEntryId` int(11) NOT NULL,
  `entryId` int(11) NOT NULL,
  `text` varchar(1000) NOT NULL,
  `isHeadline` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(1, 'test User', '209314ed8a802af58a0dffebf455fe66', 'test@user.com', 'testUser'),
(2, 'testUser2', 'f58c4f6eeea8d10ca3678329ab8aa078', 'test@user.com', 'testUser2'),
(3, 'test User3', '209314ed8a802af58a0dffebf455fe66', 'test@user.com', 'testUser3'),
(29, 'test User4', '209314ed8a802af58a0dffebf455fe66', 'test@user.com', 'testUser4'),
(63, 'test User5', '209314ed8a802af58a0dffebf455fe66', 'test@user.com', 'testUser5'),
(64, 'test User6', '209314ed8a802af58a0dffebf455fe66', 'test@user.com', 'testUser6'),
(66, '', '209314ed8a802af58a0dffebf455fe66', 'test@user.com', 'testUser7'),
(67, 'test User8', '209314ed8a802af58a0dffebf455fe66', 'test', 'testUser8'),
(68, 'test User 9', '209314ed8a802af58a0dffebf455fe66', 'test@user.com', 'testUser9'),
(70, 'test User 10', '209314ed8a802af58a0dffebf455fe66', 'test@user.com', 'testUser10'),
(71, 'test User11', '209314ed8a802af58a0dffebf455fe66', 'test@user.com', 'testUser11');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `usercourse`
--

CREATE TABLE `usercourse` (
  `userId` int(11) NOT NULL,
  `couseId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  ADD PRIMARY KEY (`userId`,`couseId`);

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
  MODIFY `cardEntryId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `course`
--
ALTER TABLE `course`
  MODIFY `courseId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `courseEntry`
--
ALTER TABLE `courseEntry`
  MODIFY `entryId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `textEntry`
--
ALTER TABLE `textEntry`
  MODIFY `textEntryId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `user`
--
ALTER TABLE `user`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
