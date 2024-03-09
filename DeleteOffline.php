<?php
function CurlDelteGet($Url, $Header)
{
    $Curl = curl_init($Url);
    curl_setopt($Curl, CURLOPT_HTTPHEADER, $Header);
    curl_setopt($Curl, CURLOPT_TIMEOUT, 30);
    curl_setopt($Curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($Curl, CURLOPT_FOLLOWLOCATION, false);
    curl_setopt($Curl, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($Curl, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($Curl, CURLOPT_CUSTOMREQUEST, 'DELETE');
    $Result = curl_exec($Curl);
    curl_close($Curl);

    return $Result;
}

require("./Expand.php");

$AccessToken = $_POST['AccessToken'];
$ID = $_POST['ID'];

if ($AccessToken == '' || $ID == '') {
    echo json_encode(
        array(
            'Status' => 18
        )
    ); #参数不全
} else {
    $Url = 'https://api-drive.mypikpak.com/drive/v1/tasks?task_ids=' . $ID;
    $Header = array(
        'User-Agent: PikPakWeb (github.com/UallenQbit/PikPakWeb)',
        'Authorization: Bearer ' . $AccessToken
    );

    $Result = CurlDelteGet($Url, $Header);
    if ($Result == '{}') {
        echo json_encode(
            array(
                'Status' => 0
            )
        );
    } else {
        $JsonData = json_decode($Result, true);
        if ($JsonData['error_code'] == 16) {
            echo json_encode(
                array(
                    'Status' => 48
                )
            ); #AccessToken不可用
        } else {
            echo json_encode(
                array(
                    'Status' => 164
                )
            ); #删除离线任务失败
        }
    }
}
