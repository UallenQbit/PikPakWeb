<?php
require("./Expand.php");

function CurlPatchPost($Url, $Data, $Header) {
    $Curl = curl_init($Url);
    curl_setopt($Curl, CURLOPT_POSTFIELDS, $Data);
    curl_setopt($Curl, CURLOPT_HTTPHEADER, $Header);
    curl_setopt($Curl, CURLOPT_CUSTOMREQUEST, 'PATCH');
    curl_setopt($Curl, CURLOPT_TIMEOUT, 30);
    curl_setopt($Curl, CURLOPT_POST, true);
    curl_setopt($Curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($Curl, CURLOPT_FOLLOWLOCATION, false);
    curl_setopt($Curl, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($Curl, CURLOPT_SSL_VERIFYHOST, false);
    $Result = curl_exec($Curl);
    curl_close($Curl);

    return $Result;
}

$AccessToken = $_POST['AccessToken'];
$ID = $_POST['ID'];

if ($AccessToken == '' || $ID == '') {
    echo json_encode(
        array(
            'Status' => 18
        )
    ); #参数不全
} else {
    $Url = 'https://api-drive.mypikpak.com/drive/v1/files/' . $ID;
    $Header = array(
        'User-Agent: PikPakWeb (github.com/UallenQbit/PikPakWeb)',
        'Authorization: Bearer ' . $AccessToken
    );

    $Result = CurlGet($Url, $Header);

    $JsonData = json_decode($Result, true);

    echo json_encode(
        array(
            'Status' => 0,
            'Name' => $JsonData['name'],
            'Size' => $JsonData['size'],
            'Hash' => $JsonData['hash'],
            'Link' => $JsonData['web_content_link']
        )
    );
}
