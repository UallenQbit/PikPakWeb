<?php
require("./Expand.php");

$AccessToken = $_POST['AccessToken'];
$Rand = $_POST['Rand'];

if ($AccessToken == '') {
    echo json_encode(
        array(
            'Status' => 18
        )
    ); #参数不全
} else {
    $Url = 'https://api-drive.mypikpak.com/drive/v1/about?Hash=' . hash('sha512', time());
    $Header = array('User-Agent: PikPakWeb (github.com/UallenQbit/PikPakWeb)', 'Authorization: Bearer ' . $AccessToken);

    $Result = CurlPost($Url, $Data, $Header);

    $JsonData = json_decode($Result, true);
    $Limit = $JsonData['quota']['limit'];
    $Usage = $JsonData['quota']['usage'];
    if ($Limit == '' || $Usage == '') {
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
                    'Status' => 155,
                    'Rand' => $Rand
                )
            ); #存储信息获取失败
        }
    } else {
        echo json_encode(
            array(
                'Status' => 0,
                'Limit' => $Limit,
                'Usage' => $Usage,
                'Result' => $Result,
                'Rand' => $Rand
            )
        );
    }
}
