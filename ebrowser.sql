DROP TABLE IF EXISTS `ebrowser_bookmarks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ebrowser_bookmarks` (
  `bid` int(20) NOT NULL AUTO_INCREMENT,
  `bgroup` varchar(1024) NOT NULL,
  `btitle` varchar(1024) NOT NULL,
  `burl` varchar(1024) NOT NULL,
  `ownerid` varchar(128) NOT NULL,
  PRIMARY KEY (`bid`),
  KEY `ownerid` (`ownerid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `ebrowser_historys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ebrowser_historys` (
  `hid` int(20) NOT NULL AUTO_INCREMENT,
  `htitle` varchar(1024) NOT NULL,
  `hurl` varchar(1024) NOT NULL,
  `hdate` timestamp(14),
  `ownerid` varchar(128) NOT NULL,
  PRIMARY KEY (`hid`),
  KEY `ownerid` (`ownerid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `ebrowser_configs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ebrowser_configs` (
  `cid` int(20) NOT NULL AUTO_INCREMENT,
  `ckey` varchar(1024) NOT NULL,
  `cvalue` longtext NOT NULL,
  `ownerid` varchar(128) NOT NULL,
  PRIMARY KEY (`cid`),
  KEY `ownerid` (`ownerid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

