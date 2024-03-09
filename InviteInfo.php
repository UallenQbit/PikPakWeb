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
    $Url = 'https://api-drive.mypikpak.com/vip/v1/activity/inviteInfo';
    $Header = array(
        'User-Agent: PikPakWeb (github.com/UallenQbit/PikPakWeb)',
        'Authorization: Bearer ' . $AccessToken
    );

    $Result = CurlGet($Url, $Header);

    $JsonData = json_decode($Result, true);
    if (isset($JsonData['add_days']) == false) {
        if ($JsonData['error'] == 'unauthenticated') {
            echo json_encode(
                array(
                    'Status' => 48
                )
            ); #AccessToken不可用
        } else {
            echo json_encode(
                array(
                    'Status' => 183
                )
            ); #数据获取失败
        }
    } else {
        echo json_encode(
            array(
                'Status' => 0,
                'Data' => $Result
            )
        );
    }
}
