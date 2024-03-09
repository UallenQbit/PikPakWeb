<?php
function SetCurl($Curl, $Header)
{
    curl_setopt($Curl, CURLOPT_HTTPHEADER, $Header);
    curl_setopt($Curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($Curl, CURLOPT_FOLLOWLOCATION, false);
    curl_setopt($Curl, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($Curl, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($Curl, CURLOPT_TIMEOUT, 30);
}

function CurlGet($Url, $Header)
{
    $Curl = curl_init($Url);
    SetCurl($Curl, $Header);
    $Result = curl_exec($Curl);
    curl_close($Curl);
    return $Result;
}

function CurlPost($Url, $Data, $Header)
{
    $Curl = curl_init($Url);
    SetCurl($Curl, $Header);
    curl_setopt($Curl, CURLOPT_POST, true);
    curl_setopt($Curl, CURLOPT_POSTFIELDS, $Data);
    $Result = curl_exec($Curl);
    curl_close($Curl);
    return $Result;
}

function CurlHeadGet($Url, $Header)
{
    $Curl = curl_init($Url);
    SetCurl($Curl, $Header);
    curl_setopt($Curl, CURLOPT_HEADER, true);
    $Response = curl_exec($Curl);
    $HeaderSize = curl_getinfo($Curl, CURLINFO_HEADER_SIZE);
    $Result = substr($Response, 0, $HeaderSize);
    curl_close($Curl);
    return $Result;
}

function CurlHeadPost($Url, $Data, $Header)
{
    $Curl = curl_init($Url);
    SetCurl($Curl, $Header);
    curl_setopt($Curl, CURLOPT_HEADER, true);
    curl_setopt($Curl, CURLOPT_POST, true);
    curl_setopt($Curl, CURLOPT_POSTFIELDS, $Data);
    $Response = curl_exec($Curl);
    $HeaderSize = curl_getinfo($Curl, CURLINFO_HEADER_SIZE);
    $Result = substr($Response, 0, $HeaderSize);
    curl_close($Curl);
    return $Result;
}

function GetSubStr($String, $StringLeft, $StringRight)
{
    $LengthLeft = strlen($StringLeft);
    $RightLength = strlen($String);

    if ($RightLength == 0 || $LengthLeft == 0) {
        return "";
    }

    $Left = strpos($String, $StringLeft);
    if ($Left == "") {
        return "";
    }

    $LeftForRight = substr($String, $Left, $RightLength);
    $Right = strpos($LeftForRight, $StringRight);

    $String = substr($String, $Left, $Right);
    $Data = substr($String, $LengthLeft, strlen($String));

    return $Data;
}


function FormatSize($Bytes)
{
    if ($Bytes == "" || $Bytes == null || $Bytes == 0) {
        return "0B";
    } else {
        $Power = ($Bytes > 0) ? floor(log($Bytes, 1024)) : 0;
        return str_ireplace(" ", "", sprintf("%01.2f %s", $Bytes / pow(1024, $Power), array("Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB")[$Power]));
    }
}

function GetSubStrLeft($String, $Left)
{
    if (strlen($String) == 0) {
        return "";
    } else {
        return substr($String, 0, strpos($String, $Left));
    }
}

function GetSubStrRight($String, $StringRight)
{
    if (strlen($String) == 0) {
        return "";
    } else {
        $StringRight = strpos($String, $StringRight) + strlen($StringRight);
        $Data = substr($String, $StringRight, strlen($String));
        return $Data;
    }
}
