<?php
require("./Expand.php");

$Account = $_POST['Account'];
$Mail = $_POST['Mail'];
$VerificationCode = $_POST['VerificationCode'];
$VerificationID = $_POST['VerificationID'];
$PassWord = $_POST['PassWord'];

if ($Account == '' || $Mail == '' || $VerificationCode == '' || $VerificationID == '' || $PassWord == '') {
    echo json_encode(
        array(
            'Status' => 18
        )
    ); #参数不全
} else {
    $Header = array('User-Agent: PikPakWeb (github.com/UallenQbit/PikPakWeb)');

    $Url = 'https://user.mypikpak.com/v1/auth/verification/verify';
    $Data = json_encode(
        array(
            'client_id' => 'YNxT9w7GMdWvEOKa',
            'verification_id' => $VerificationID,
            'verification_code' => $VerificationCode
        )
    );

    $Result = CurlPost($Url, $Data, $Header);

    $JsonData = json_decode($Result, true);
    $VerificationToken = $JsonData['verification_token'];
    if ($VerificationToken == '') {
        if ($JsonData['error_code'] == 4014) {
            echo json_encode(
                array(
                    'Status' => 152
                )
            ); #验证码错误
        } else {
            echo json_encode(
                array(
                    'Status' => 153
                )
            ); #验证码验证失败
        }
    } else {
        $Url = 'https://user.mypikpak.com/v1/shield/captcha/init';
        $Data = json_encode(
            array(
                'device_id' => '0',
                'client_id' => 'YNxT9w7GMdWvEOKa',
                'action' => 'POST:/v1/auth/signup',
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
            $Url = 'https://user.mypikpak.com/v1/auth/signup';
            $Data = json_encode(
                array(
                    'client_id' => 'YNxT9w7GMdWvEOKa',
                    'client_secret' => 'dbw2OtmVEeuUvIptb1Coyg',
                    'captcha_token' => $CaptchaToken,
                    'email' => $Mail,
                    'name' => $Account,
                    'password' => $PassWord,
                    'verification_token' => $VerificationToken
                )
            );

            $Result = CurlPost($Url, $Data, $Header);

            $JsonData = json_decode($Result, true);
            $AccessToken = $JsonData['access_token'];
            if ($AccessToken == '') {
                echo json_encode(
                    array(
                        'Status' => 166,
                        'Result' => $Result
                    )
                ); #注册失败
            } else {
                $RefreshToken = $JsonData['refresh_token'];
                $ExpiresIn = $JsonData['expires_in'];
                $UserID = $JsonData['sub'];
                echo json_encode(
                    array(
                        'Status' => 0,
                        'AccessToken' => $AccessToken,
                        'RefreshToken' => $RefreshToken,
                        'ExpiresIn' => $ExpiresIn,
                        'UserID' => $UserID,
                        'Data' => $Result
                    )
                );
            }
        }
    }
}
