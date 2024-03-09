<?php
require("./Expand.php");

$Phone = '+' . $_POST['Phone'];

if ($Phone == '') {
    echo json_encode(
        array(
            'Status' => 18
        )
    ); #参数不全
} else {
    $Header = array('User-Agent: PikPakWeb (github.com/UallenQbit/PikPakWeb)');

    $Url = 'https://user.mypikpak.com/v1/shield/captcha/init';

    $Data = json_encode(
        array(
            'device_id' => '0',
            'client_id' => 'YNxT9w7GMdWvEOKa',
            'action' => 'POST:/v1/auth/verification',
            'meta' => array(
                'phone_number' => $Phone
            )
        )
    );

    $Result = CurlPost($Url, $Data, $Header);

    $JsonData = json_decode($Result, true);
    $CaptchaToken = $JsonData['captcha_token'];
    if ($CaptchaToken == '') {
        echo json_encode(
            array(
                'Status' => 44
            )
        ); #CaptchaToken获取失败
    } else {
        $Url = 'https://user.mypikpak.com/v1/auth/verification';
        $Data = json_encode(
            array(
                'client_id' => 'YNxT9w7GMdWvEOKa',
                'captcha_token' => $CaptchaToken,
                'phone_number' => $Phone
            ),
            true
        );

        $Result = CurlPost($Url, $Data, $Header);

        $JsonData = json_decode($Result, true);
        $VerificationID = $JsonData['verification_id'];

        if ($VerificationID == '') {
            if ($JsonData['error_code'] == 8) {
                echo json_encode(
                    array(
                        'Status' => 151,
                        'Message' => $JsonData['error_description']
                    )
                ); #验证码发送上限
            } else {
                echo json_encode(
                    array(
                        'Status' => 51,
                        'Phone' => $Phone,
                        'Result' => $Result
                    )
                ); #验证码发送失败
            }
        } else {
            echo json_encode(
                array(
                    'Status' => 0,
                    'VerificationID' => $VerificationID
                )
            );
        }
    }
}
