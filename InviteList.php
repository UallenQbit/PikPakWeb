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
    $Url = 'https://api-drive.mypikpak.com/vip/v1/activity/inviteList';
    $Header = array(
        'User-Agent: PikPakWeb (github.com/UallenQbit/PikPakWeb)',
        'Authorization: Bearer ' . $AccessToken
    );

    $Result = CurlGet($Url, $Header);

    if (json_decode($Result, true)['error'] == 'unauthenticated') {
        echo json_encode(
            array(
                'Status' => 48
            )
        ); #AccessToken不可用
    } else {
        echo json_encode(
            array(
                'Status' => 0,
                'Data' => $Result
            )
        );
    }
}
