<?php
function CurlPatchPost($Url, $Data, $Header)
{
    $Curl = curl_init($Url);
    curl_setopt($Curl, CURLOPT_POSTFIELDS, $Data);
    curl_setopt($Curl, CURLOPT_HTTPHEADER, $Header);
    curl_setopt($Curl, CURLOPT_TIMEOUT, 30);
    curl_setopt($Curl, CURLOPT_POST, true);
    curl_setopt($Curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($Curl, CURLOPT_FOLLOWLOCATION, false);
    curl_setopt($Curl, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($Curl, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($Curl, CURLOPT_CUSTOMREQUEST, 'PATCH');
    $Result = curl_exec($Curl);
    curl_close($Curl);

    return $Result;
}

require("./Expand.php");

$AccessToken = $_POST['AccessToken'];
$Name = $_POST['Name'];
$ID = $_POST['ID'];

if ($AccessToken == '' || $Name == '') {
    echo json_encode(
        array(
            'Status' => 18
        )
    ); #参数不全
} else {
    $Url = 'https://api-drive.mypikpak.com/drive/v1/files/' . $ID;

    $Data = json_encode(
        array(
            'name' => $Name
        )
    );

    $Header = array(
        'User-Agent: PikPakWeb (github.com/UallenQbit/PikPakWeb)',
        'Authorization: Bearer ' . $AccessToken
    );

    $Result = CurlPatchPost($Url, $Data, $Header);
    $JsonData = json_decode($Result, true);
    if ($JsonData['name'] == $Name) {
        echo json_encode(
            array(
                'Status' => 0
            )
        );
    } else {
        if ($JsonData['error_code'] == 16) {
            echo json_encode(
                array(
                    'Status' => 48
                )
            ); #AccessToken不可用
        } else {
            echo json_encode(
                array(
                    'Status' => 158
                )
            ); #重命名失败
        }
    }
}
