<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

require("./TorrentDecode.php");
require("./TorrentEncode.php");

$FileTorrent = $_FILES["FileTorrent"];
$FileTorrent_TMP_Name = $FileTorrent["tmp_name"];

if (is_uploaded_file($FileTorrent_TMP_Name) == false) {
    echo json_encode(
        array(
            "Status" => 18
        )
    ); #参数不全
} else {
    $Data = fread(fopen($FileTorrent_TMP_Name, "r"), filesize($FileTorrent_TMP_Name));
    $TorrentData = TorrentDecode($Data);
    $TorrentInfo = $TorrentData["info"];
    $Hash = sha1(TorrentEncode($TorrentInfo));

    echo json_encode(
        array(
            "Status" => 0,
            "Hash" => $Hash
        )
    );

    unlink($FileTorrent_TMP_Name);
}
