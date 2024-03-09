<?php
require("./Expand.php");

$AccessToken = $_POST['AccessToken'];
$ID = $_POST['ID'];
$Token = $_POST['Token'];

if ($AccessToken == '') {
    echo json_encode(
        array(
            'Status' => 18
        )
    ); #参数不全
} else {
    $Url = 'https://api-drive.mypikpak.com/drive/v1/files?filters={"phase":{"eq":"PHASE_TYPE_COMPLETE"},"trashed":{"eq":false}}&parent_id=' . $ID . '&page_token=' . $Token;

    $Header = array(
        'User-Agent: PikPakWeb (github.com/UallenQbit/PikPakWeb)',
        'Authorization: Bearer ' . $AccessToken
    );

    $Result = CurlGet($Url, $Header);

    $Result = str_replace('static.mypikpak.com', 'backstage-img-ssl.a.88cdn.com', $Result);
    $Result = str_replace("'", '|', $Result);
    echo $Result;
}
