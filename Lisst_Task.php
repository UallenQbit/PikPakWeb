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
    $Url = 'https://api-drive.mypikpak.com/drive/v1/tasks?type=offline&limit=100';

    $Header = array(
        'User-Agent: PikPakWeb (github.com/UallenQbit/PikPakWeb)',
        'Accept-Language: zh-CN',
        'Authorization: Bearer ' . $AccessToken
    );

    $Result = CurlGet($Url, $Header);

    $Result = str_replace("'", "|", $Result);
    echo $Result;
}
