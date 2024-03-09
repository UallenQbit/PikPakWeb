<?php
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
    $Url = 'https://api-drive.mypikpak.com/drive/v1/files';

    $Data = json_encode(
        array(
            'kind' => 'drive#folder',
            'parent_id' => $ID,
            'name' => $Name
        )
    );

    $Header = array(
        'User-Agent: PikPakWeb (github.com/UallenQbit/PikPakWeb)',
        'Authorization: Bearer ' . $AccessToken
    );

    $Result = CurlPost($Url, $Data, $Header);

    $JsonData = json_decode($Result, true);
    if ($JsonData['file']['name'] == $Name) {
        $ID = $JsonData['file']['id'];
        echo json_encode(
            array(
                'Status' => 0,
                'ID' => $ID
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
                    'Status' => 157
                )
            ); #创建文件夹失败
        }
    }
}
