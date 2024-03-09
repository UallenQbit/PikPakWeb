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
    $Url = 'https://api-drive.mypikpak.com/vip/v1/stripe/products';

    $Header = array(
        'User-Agent: PikPakWeb (github.com/UallenQbit/PikPakWeb)',
        'Authorization: Bearer ' . $AccessToken
    );

    $Result = CurlPost($Url, '{}', $Header);

    if ($Result == '{"error":"unauthenticated"}') {
        echo json_encode(
            array(
                'Status' => 48
            )
        ); #AccessToken不可用
    } else {
        echo $Result;
    }
}
