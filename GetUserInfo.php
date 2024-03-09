<?php
require("./Expand.php");

$AccessToken = $_POST['AccessToken'];
$Rand = $_POST['Rand'];

if ($AccessToken == '' || $Rand == '') {
    echo json_encode(
        array(
            'Status' => 18
        )
    ); #参数不全
} else {
    $Url = 'https://api-drive.mypikpak.com/drive/v1/files?filters={"phase":{"eq":"PHASE_TYPE_COMPLETE"},"trashed":{"eq":false}}';
    $Header = array(
        'User-Agent: PikPakWeb (github.com/UallenQbit/PikPakWeb)',
        'Authorization: Bearer ' . $AccessToken
    );

    $Result = CurlGet($Url, $Header);

    $JsonData = json_decode($Result, true);
    if ($JsonData['kind'] == 'drive#fileList') {
        for ($i = 0; $i < count($JsonData['files']); $i++) {
            $Name = $JsonData['files'][$i]['name'];
            if ($Name == '0123456789abcdefgABCDEFG-kinh.cc-pikpak.kinh.cc') {
                $ID = $JsonData['files'][$i]['id'];
                setcookie('UserConfigFolderID_' . $Rand, $ID);

                $Url = 'https://api-drive.mypikpak.com/drive/v1/files?filters={"phase":{"eq":"PHASE_TYPE_COMPLETE"},"trashed":{"eq":false}}&parent_id=' . $ID;
                $Header = array(
                    'User-Agent: PikPakWeb (github.com/UallenQbit/PikPakWeb)',
                    'Authorization: Bearer ' . $AccessToken
                );

                $Result = CurlGet($Url, $Header);

                $JsonData = json_decode($Result, true);
                if ($JsonData['kind'] == 'drive#fileList') {
                    for ($i = 0; $i < count($JsonData['files']); $i++) {
                        $Name = $JsonData['files'][$i]['name'];
                        $Name = urldecode($Name);
                        if (strpos($Name, '{Kinh-Time-PikPak}') == true) {
                            $UserName = GetSubStr($Name, '{Kinh-Time-PikPak}', '{Kinh-PikPak}');
                            $Picture = substr($Name, strpos($Name, '{Kinh-PikPak}') + 13, strlen($Name));
                            echo json_encode(
                                array(
                                    'Status' => 0,
                                    'ID' => $ID,
                                    'Data' => $Name,
                                    'Name' => $UserName,
                                    'Picture' => $Picture,
                                    'Rand' => $Rand
                                )
                            );
                        } else {
                            echo json_encode(
                                array(
                                    'Status' => 72,
                                    'Code' => 0,
                                    'ID' => $ID,
                                    'Data' => $Name,
                                    'Rand' => $Rand
                                )
                            ); #数据异常
                        }

                        exit();
                    }
                } else {
                    if ($JsonData['error_code'] == 16) {
                        echo json_encode(
                            array(
                                'Status' => 48,
                                'Code' => 1,
                                'Rand' => $Rand
                            )
                        ); #AccessToken不可用
                    } else {
                        echo json_encode(
                            array(
                                'Status' => 183,
                                'Code' => 1,
                                'Rand' => $Rand
                            )
                        ); #列表数据获取失败
                    }
                }

                exit();
            }
        }

        $Url = 'https://api-drive.mypikpak.com/drive/v1/files';

        $Data = json_encode(
            array(
                'kind' => 'drive#folder',
                'parent_id' => '',
                'name' => '0123456789abcdefgABCDEFG-kinh.cc-pikpak.kinh.cc'
            )
        );

        $Header = array(
            'User-Agent: PikPakWeb (github.com/UallenQbit/PikPakWeb)',
            'Authorization: Bearer ' . $AccessToken
        );

        $Result = CurlPost($Url, $Data, $Header);

        $JsonData = json_decode($Result, true);
        if ($JsonData['file']['name'] == '0123456789abcdefgABCDEFG-kinh.cc-pikpak.kinh.cc') {
            $ID = $JsonData['files'][$i]['id'];
            setcookie('UserConfigFolderID_' . $Rand, $ID);

            echo json_encode(
                array(
                    'Status' => 24,
                    'ID' => $ID
                )
            ); #请重试
        } else {
            echo json_encode(
                array(
                    'Status' => 157
                )
            ); #创建文件夹失败
        }
    } else {
        if ($JsonData['error_code'] == 16) {
            echo json_encode(
                array(
                    'Status' => 48,
                    'Code' => 0,
                    'Rand' => $Rand
                )
            ); #AccessToken不可用
        } else {
            echo json_encode(
                array(
                    'Status' => 189,
                    'Code' => 0,
                    'Rand' => $Rand
                )
            ); #列表数据获取失败
        }
    }
}
