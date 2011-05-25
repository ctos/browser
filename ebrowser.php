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
//			$owenid  = ProcManager::getInstance()->getCurrentProcess()->getLoginContext()->getEyeosUser()->getId();
			$ownerid = self::getUserId();
			$dblink = self::getDbConnect();
//			return "SELECT cvalue FROM ebrowser_configs WHERE ckey = '".$key."' AND ownerid = '".($owenid->getId())."'";
			$result = $dblink->query("SELECT cvalue FROM ebrowser_configs WHERE ckey = '$key' AND ownerid = '$ownerid'");
			if ($configObject = $result->fetch_object())
			{
				return $configObject->cvalue;
			}
			else
			{
				return "fuck";
			}
		}
		
		public static function setConfig($key, $value)
		{
			$ownerid = self::getUserId();
			$dblink = self::getDbConnect();
			
			$dblink->query("UPDATE ebrowser_configs SET cvalue = '$value' WHERE ckey = '$key' AND ownerid = '$ownerid'");
			if ($dblink->affected_rows <= 0)
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
	}
?>
