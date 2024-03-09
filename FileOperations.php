<?php
require("./Expand.php");

$AccessToken = $_POST['AccessToken'];
$JsonData = $_POST['JsonData'];
$Type = $_POST['Type'];

if ($AccessToken == '' || $JsonData == '' || $Type == '') {
    echo json_encode(
        array(
            'Status' => 18
        )
    ); #参数不全
} else {
    if ($Type == 0) { //Delete
        $LinkData = 'files:batchTrash';
    } else if ($Type == 1) { //Copy
        $LinkData = 'files:batchCopy';
    } else if ($Type == 2) { //Move
        $LinkData = 'files:batchMove';
    } else if ($Type == 3) { //Untrash
        $LinkData = 'files:batchUntrash';
    } else if ($Type == 4) { //RecycleBinDelete
        $LinkData = 'files:batchDelete';
    } else if ($Type == 5) { //EmptyRecycleBin
        $LinkData = 'files/trash:empty';
    }

    $Url = 'https://api-drive.mypikpak.com/drive/v1/' . $LinkData;
    $Data = $JsonData;
    $Header = array(
        'User-Agent: PikPakWeb (github.com/UallenQbit/PikPakWeb)',
        'Authorization: Bearer ' . $AccessToken
    );

    $Result = CurlPost($Url, $Data, $Header);

    $JsonData = json_decode($Result, true);
    $ID = $JsonData['task_id'];
    if ($ID == '') {
        if ($JsonData['error_code'] == 16) {
            echo json_encode(
                array(
                    'Status' => 48
                )
            ); #AccessToken不可用
        } else {
            echo json_encode(
                array(
                    'Status' => 265,
                    'Result' => $Result
                )
            ); #失败
        }
    } else {
        echo json_encode(
            array(
                'Status' => 0,
                'ID' => $ID
            )
        );
    }
}
