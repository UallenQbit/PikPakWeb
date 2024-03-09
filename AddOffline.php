<?php
require("./Expand.php");

$AccessToken = $_POST["AccessToken"];
$Base64_OfflineLink = $_POST["Base64_OfflineLink"];
$ID = $_POST["ID"];

if ($AccessToken == "" || $Base64_OfflineLink == "") {
    echo json_encode(
        array(
            "Status" => 18
        )
    ); #参数不全
} else {
    $Url = "https://api-drive.mypikpak.com/drive/v1/files";

    $Data = json_encode(
        array(
            "kind" => "drive#file",
            "parent_id" => $ID,
            "upload_type" => "UPLOAD_TYPE_URL",
            "url" => array(
                "url" => urldecode(base64_decode($Base64_OfflineLink))
            )
        )
    );

    $Header = array(
        "User-Agent: PikPakWeb (github.com/UallenQbit/PikPakWeb)",
        "Authorization: Bearer " . $AccessToken
    );

    $Result = CurlPost($Url, $Data, $Header);

    $JsonData = json_decode($Result, true);
    $TaskID = $JsonData["task"]["id"];
    $Name = $JsonData["task"]["name"];
    $Size = $JsonData["task"]["file_size"];

    if ($TaskID == "") {
        if ($JsonData["error_code"] == 16) {
            echo json_encode(
                array(
                    "Status" => 48
                )
            ); #AccessToken不可用
        } else {
            echo json_encode(
                array(
                    "Status" => 58,
                    "Message" => $JsonData["error_description"],
                    "Result" => $Result
                )
            ); #无法添加离线任务
        }
    } else {
        echo json_encode(
            array(
                "Status" => 0,
                "ID" => $TaskID,
                "Name" => $Name,
                "Size" => $Size,
                "Result" => $Result
            )
        );
    }
}
