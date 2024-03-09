<?php
require("./Expand.php");

$AccessToken = $_POST['AccessToken'];

if ($AccessToken == '') {
    echo json_encode(
        array(
            'Status' => 18
        )
    ); #参数不全
} else {
    $Url = 'https://api-drive.mypikpak.com/vip/v1/activity/inviteCode';
    $Header = array(
        'User-Agent: PikPakWeb (github.com/UallenQbit/PikPakWeb)',
        'Authorization: Bearer ' . $AccessToken
    );

    $Result = CurlGet($Url, $Header);

    $JsonData = json_decode($Result, true);
    $Code = $JsonData['code'];
    if ($Code == '') {
        if ($JsonData['error'] == 'unauthenticated') {
            echo json_encode(
                array(
                    'Status' => 48
                )
            ); #AccessToken不可用
        } else {
            echo json_encode(
                array(
                    'Status' => 165
                )
            ); #邀请码生成失败
        }
    } else {
        echo json_encode(
            array(
                'Status' => 0,
                'Code' => $Code
            )
        );
    }
}
