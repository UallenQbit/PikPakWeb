<?php
require("./Expand.php");

$AccessToken = $_POST['AccessToken'];
$Code = $_POST['Code'];

if ($AccessToken == '' || $Code == '') {
    echo json_encode(
        array(
            'Status' => 18
        )
    ); #参数不全
} else {
    $Url = 'https://api-drive.mypikpak.com/vip/v1/order/activation-code';

    $Data = json_encode(
        array(
            'activation_code' => $Code
        )
    );

    $Header = array(
        'Content-Type: application/json;charset=UTF-8',
        'User-Agent: PikPakWeb (github.com/UallenQbit/PikPakWeb)',
        'Authorization: Bearer ' . $AccessToken
    );

    $Result = CurlPost($Url, $Data, $Header);

    $JsonData = json_decode($Result, true);
    if ($JsonData['result'] == 'ACCEPTED') {
        echo json_encode(
            array(
                'Status' => 0
            )
        );
    } else {
        if ($JsonData['error'] == 'unauthenticated') {
            echo json_encode(
                array(
                    'Status' => 48
                )
            ); #AccessToken不可用
        } else if ($JsonData['error'] == 'invalid_activation_code') {
            echo json_encode(
                array(
                    'Status' => 162
                )
            ); #会员码无效
        } else if ($JsonData['error'] == 'activation_code_reused') {
            echo json_encode(
                array(
                    'Status' => 163
                )
            ); #兑换码无法重复使用
        } else {
            echo json_encode(
                array(
                    'Status' => 161,
                    'Message' => $JsonData['error_description'],
                    'Result' => $Result
                )
            ); #无法兑换会员
        }
    }
}
