<?php
class TorrentEncode
{
	function makeSorted($array)
	{
		if (empty($array))
			return $array;
		$i = 0;
		foreach ($array as $key => $dummy)
			$keys[$i++] = stripslashes($key);
		sort($keys);
		for ($i = 0; isset($keys[$i]); $i++)
			$return[addslashes($keys[$i])] = $array[addslashes($keys[$i])];
		return $return;
	}

	function encodeEntry($entry, &$fd, $unstrip = false)
	{
		if (is_bool($entry)) {
			$fd .= "de";
			return;
		}
		if (is_int($entry) || is_float($entry)) {
			$fd .= "i" . $entry . "e";
			return;
		}
		if ($unstrip)
			$myentry = stripslashes($entry);
		else
			$myentry = $entry;
		$length = strlen($myentry);
		$fd .= $length . ":" . $myentry;
	}

	function encodeList($array, &$fd)
	{
		$fd .= "l";
		if (empty($array)) {
			$fd .= "e";
			return;
		}
		for ($i = 0; isset($array[$i]); $i++)
			$this->decideEncode($array[$i], $fd);
		$fd .= "e";
	}

	function decideEncode($unknown, &$fd)
	{
		if (is_array($unknown)) {
			if (isset($unknown[0]) || empty($unknown))
				return $this->encodeList($unknown, $fd);
			else
				return $this->encodeDict($unknown, $fd);
		}
		$this->encodeEntry($unknown, $fd);
	}

	function encodeDict($array, &$fd)
	{
		$fd .= "d";
		if (is_bool($array)) {
			$fd .= "e";
			return;
		}
		$newarray = $this->makeSorted($array);
		foreach ($newarray as $left => $right) {
			$this->encodeEntry($left, $fd, true);
			$this->decideEncode($right, $fd);
		}
		$fd .= "e";
	}
}

function TorrentEncode($array)
{
	$string = "";
	$encoder = new TorrentEncode;
	$encoder->decideEncode($array, $string);
	return $string;
}
