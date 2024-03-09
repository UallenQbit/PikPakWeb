<?php
require("./Expand.php");

$AccessToken = $_POST['AccessToken'];
$Token = $_POST['Token'];

if ($AccessToken == '') {
    echo json_encode(
        array(
            'Status' => 18
        )
    ); #参数不全
} else {
    $Url = 'https://api-drive.mypikpak.com/drive/v1/files?filters={"phase":{"eq":"PHASE_TYPE_COMPLETE"},"trashed":{"eq":true}}&parent_id=*&page_token=' . $Token;

    $Header = array(
        'User-Agent: PikPakWeb (github.com/UallenQbit/PikPakWeb)',
        'Authorization: Bearer ' . $AccessToken
    );

    $Result = CurlGet($Url, $Header);

    $Result = str_replace("'", '|', $Result);
    echo $Result;
}
