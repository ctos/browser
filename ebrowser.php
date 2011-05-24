<?php
	abstract class EbrowserApplication extends EyeosApplicationExecutable
	{
		public static function getDbConnect()
		{
			$link = new mysqli("localhost", "root", "", "eyeos24");
			if (mysqli_connect_errno())
			{
			}
			$link->query("set names 'utf8'");
			return $link;
		}

		public static function getConfig($key)
		{
			$owenid = $owner = ProcManager::getInstance()->getCurrentProcess()->getLoginContext()->getEyeosUser();
			$dblink = self::getDbConnect();
	//		return "SELECT cvalue FROM ebrowser_configs WHERE ckey = '".$key."' AND owenid = ".($owenid->getId());
			$result = $dblink->query("SELECT cvalue FROM ebrowser_configs WHERE ckey = '".$key."' AND owenid = ".($owenid->getId()));
			if ($configObject = $result->fetch_object())
			{
				return $configObject->cvalue;
			}
			else
			{
			}
		}
		
		public static function getCookies()
		{
			return self::getConfig("cookies");
		}
	}
?>
