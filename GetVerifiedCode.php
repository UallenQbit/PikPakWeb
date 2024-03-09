<?php
require("./Expand.php");

$Mail = $_POST['Mail'];

if ($Mail == '') {
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
            'action' => 'POST:/v1/shield/captcha/init',
            'meta' => array(
                'email' => $Mail
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
                'email' => $Mail
            )
        );

        $Result = CurlPost($Url, $Data, $Header);

        $JsonData = json_decode($Result, true);
        $VerificationID = $JsonData['verification_id'];

        if ($VerificationID == '') {
            if ($JsonData['error_code'] == 8) {
                $RetryIn = $JsonData['details'][0]['retry_in'];
                echo json_encode(
                    array(
                        'Status' => 151,
                        'RetryIn' => $RetryIn
                    )
                ); #验证码发送上限
            } else {
                echo json_encode(
                    array(
                        'Status' => 51
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
