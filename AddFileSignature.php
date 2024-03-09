<?php
require("./Expand.php");

$AccessToken = $_POST["AccessToken"];
$ID = $_POST["ID"];
$Name = $_POST["Name"];
$Size = $_POST["Size"];
$Hash = $_POST["Hash"];

if ($AccessToken == "" || $Name == "" || $Size == "" || $Hash == "") {
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
            "name" => $Name,
            "size" => $Size,
            "hash" => $Hash,
            "upload_type" => "UPLOAD_TYPE_RESUMABLE",
            "objProvider" => array(
                "provider" => "UPLOAD_TYPE_UNKNOWN"
            )
        )
    );

    $Header = array(
        "User-Agent: PikPakWeb (github.com/UallenQbit/PikPakWeb)",
        "Authorization: Bearer " . $AccessToken
    );

    $Result = CurlPost($Url, $Data, $Header);

    $JsonData = json_decode($Result, true);
    if ($JsonData["file"]["name"] == $Name && $JsonData["upload_type"] == "UPLOAD_TYPE_UNKNOWN") {
        echo json_encode(
            array(
                "Status" => 0
            )
        );
    } else {
        if ($JsonData["error_code"] == 16) {
            echo json_encode(
                array(
                    "Status" => 48
                )
            ); #AccessToken不可用
        } else {
            if ($JsonData["upload_type"] == "UPLOAD_TYPE_RESUMABLE") {
                $message = "服务器没有找到文件";
            } else {
                $message = $JsonData["error_description"];
            }

            echo json_encode(
                array(
                    "Status" => 58,
                    "Message" => $message,
                    "Result" => $Result
                )
            ); #无法添加离线任务
        }
    }
}
