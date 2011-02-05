<?php
	abstract class EbrowserApplication extends EyeosApplicationExecutable
	{
		public static function getTimeFromServer()
		{
			return date('Y-m-d h:i:s');
		}
	}
?>

