<?php
	abstract class EbrowserApplication extends EyeosApplicationExecutable
	{
		public static function getDbConnect()
		{
			$link = new mysqli("localhost", "root", "", "eyeos");
			if (mysqli_connect_errno())
			{
			}
			$link->query("set names 'utf8'");
			return $link;
		}
		
		public static function getUserId()
		{
			return ProcManager::getInstance()->getCurrentProcess()->getLoginContext()->getEyeosUser()->getId();
		}

		public static function getConfig($key)
		{
			$ownerid = self::getUserId();
			$dblink = self::getDbConnect();
			$result = $dblink->query("SELECT cvalue FROM ebrowser_configs WHERE ckey = '$key' AND ownerid = '$ownerid'");
			if ($configObject = $result->fetch_object())
			{
				return $configObject->cvalue;
			}
			else
			{
				return "";
			}
		}
		
		public static function setConfig($key, $value)
		{
			$ownerid = self::getUserId();
			$dblink = self::getDbConnect();
			$result = $dblink->query("select * from ebrowser_configs WHERE ckey = 'cookies' AND ownerid = '$ownerid'");
			if ($result->num_rows > 0)
			{	
				$dblink->query("UPDATE ebrowser_configs SET cvalue = '$value' WHERE ckey = '$key' AND ownerid = '$ownerid'");
			}
			else
			{
				$dblink->query("INSERT INTO ebrowser_configs (ownerid, ckey, cvalue) values ('$ownerid', '$key', '$value')");
			}	
		}
			
		public static function getCookies()
		{
			return self::getConfig("cookies");
		}
		
		public static function setCookies($cookies)
		{
			self::setConfig("cookies", "$cookies");
		}
		
		public static function getAllHistorys()
		{
			$ownerid = self::getUserId();
			$dblink = self::getDbConnect();
			$queryStr = "SELECT * FROM ebrowser_historys WHERE ownerid = '$ownerid'";
			$dblink->query($queryStr);
		}
		
		public static function getHistroysByDate($startDate, $endDate)
		{
			$ownerid = self::getUserId();
			$dblink = self::getDbConnect();
			$queryStr = "SELECT * FROM ebrowser_historys WHERE ownerid = '$ownerid' AND hdate > $startDate AND hdate < $endDate";
			$dblink->query($queryStr);
		}

		public static function delHistoryById($id)
		{
			$ownerid = self::getUserId();
			$dblink = self::getDbConnect();
			$queryStr = "DELETE FROM ebrowser_historys WHERE ownerid = '$ownerid' AND hid = $id";
			$dblink->query($queryStr);
		}
		
		public static function delHistorysByDate($startDate, $endDate)
		{
			$ownerid = self::getUserId();
			$dblink = self::getDbConnect();
			$queryStr = "DELETE FROM ebrowser_historys WHERE ownerid = '$ownerid' AND hdate > $startDate AND hdate < $endDate";
			$dblink->query($queryStr);
		}
		
		public static function delAllHistorys()
		{
			$ownerid = self::getUserId();
			$dblink = self::getDbConnect();
			$queryStr = "DELETE FROM ebrowser_historys WHERE ownerid = '$ownerid'";
			$dblink->query($queryStr);
		}

		public static function addHistory($history)
		{
			$ownerid = self::getUserId();
			$dblink = self::getDbConnect();
		}
		
		public static function getAllBookmarks()
		{
			$ownerid = self::getUserId();
			$dblink = self::getDbConnect();
			$queryStr = "SELECT * FROM ebrowser_bookmarks WHERE ownerid = '$ownerid'";
			$dblink->query($queryStr);
		}

		public static function delBookmarkById($id)
		{
			$ownerid = self::getUserId();
			$dblink = self::getDbConnect();
			$queryStr = "DELETE FROM ebrowser_bookmarks WHERE ownerid = '$ownerid'";
			$dblink->query($queryStr);
		}

		public static function updateBookmark($bookmark)
		{
			$ownerid = self::getUserId();
			$dblink = self::getDbConnect();
			//$queryStr = "DELETE FROM ebrowser_historys WHERE ownerid = '$ownerid'";
			$dblink->query($queryStr);
		}

		public static function createBookmark($bookmark)
		{
			$ownerid = self::getUserId();
			$dblink = self::getDbConnect();
			//$queryStr = "DELETE FROM ebrowser_historys WHERE ownerid = '$ownerid'";
			$dblink->query($queryStr);
		}
		
		public static function getBookmarksByGroup($group)
		{
			$ownerid = self::getUserId();
			$dblink = self::getDbConnect();
			$queryStr = "SELECT * FROM ebrowser_bookmarks WHERE ownerid = '$ownerid' AND bgroup = '$group'";
			$dblink->query($queryStr);
		}
	}
?>
