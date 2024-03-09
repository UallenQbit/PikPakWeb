<?php
require("./Expand.php");

$AccessToken = $_POST['AccessToken'];
$Rand = $_POST['Rand'];

if ($AccessToken == '' || $Rand == '') {
    echo json_encode(
        array(
            'Status' => 18
        )
    ); #参数不全
} else {
    $Url = 'https://api-drive.mypikpak.com/drive/v1/privilege/vip';
    $Header = array(
        'User-Agent: PikPakWeb (github.com/UallenQbit/PikPakWeb)',
        'Authorization: Bearer ' . $AccessToken
    );

    $Result = CurlPost($Url, $Data, $Header);

    $JsonData = json_decode($Result, true);
    if ($JsonData['result'] == 'ACCEPTED') {
        echo json_encode(
            array(
                'Status' => 0,
                'VIP_Status' => $JsonData['data']['status'],
                'ExpiredTime' => $JsonData['data']['expire'],
                'Rand' => $Rand
            )
        );
    } else {
        if ($JsonData['error_code'] == 16) {
            echo json_encode(
                array(
                    'Status' => 48,
                    'Rand' => $Rand
                )
            ); #AccessToken不可用
        } else {
            echo json_encode(
                array(
                    'Status' => 175,
                    'Rand' => $Rand
                )
            ); #读取失败
        }
    }
}
