<?php
require("./Expand.php");

$Mail = $_POST['Mail'];
$PassWord = $_POST['PassWord'];

if ($Mail == '' || $PassWord == '') {
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
        $Header = array(
            'User-Agent: PikPakWeb (github.com/UallenQbit/PikPakWeb)',
            'X-Captcha-Token: ' . $CaptchaToken,
        );

        $Url = 'https://user.mypikpak.com/v1/auth/signin';
        $Data = json_encode(
            array(
                'client_id' => 'YNxT9w7GMdWvEOKa',
                'username' => $Mail,
                'password' => $PassWord
            )
        );
    
        $Result = CurlPost($Url, $Data, $Header);
    
        $JsonData = json_decode($Result, true);
        $AccessToken = $JsonData['access_token'];
        if ($AccessToken == '') {
            $error_description = $JsonData['error_description'];
            if ($error_description == 'verification failed') {
                echo json_encode(
                    array(
                        'Status' => 156
                    )
                ); #邮箱不存在
            } else if ($error_description == 'invalid account or password') {
                echo json_encode(
                    array(
                        'Status' => 33
                    )
                ); #密码错误
            } else {
                echo json_encode(
                    array(
                        'Status' => 7
                    )
                ); #登陆失败
            }
        } else {
            $RefreshToken = $JsonData['refresh_token'];
            $ExpiresIn = $JsonData['expires_in'];
            $UserID = $JsonData['sub'];
            $TokenData = $Result;
    
            $Url = 'https://user.mypikpak.com/v1/user/me';
    
            $Header = array(
                'User-Agent: PikPakWeb (github.com/UallenQbit/PikPakWeb)',
                'Authorization: Bearer ' . $AccessToken
            );
    
            $Result = CurlGet($Url, $Header);
    
            $JsonData = json_decode($Result, true);
            $Name = $JsonData['name'];
            $Picture = $JsonData['picture'];
            $UserData = $Result;
    
            if ($Picture == '') {
                $Picture = 'PictureNo';
            }
    
            $StorageData = json_encode(
                array(
                    'Name' => $Name,
                    'UserID' => $UserID,
                    'Picture' => $Picture,
                    'Mail' => $Mail,
                    'PassWord' => $PassWord
                )
            );
    
            $Time = time();
            $ExpiresTime = $Time + $ExpiresIn;
            $StorageTokenData = json_encode(
                array(
                    'AccessToken' => $AccessToken,
                    'RefreshToken' => $RefreshToken,
                    'ExpiresIn' => $ExpiresIn,
                    'Time' => $Time,
                    'ExpiresTime' => $ExpiresTime
                )
            );
    
            echo json_encode(
                array(
                    'Status' => 0,
                    'Name' => $Name,
                    'UserID' => $UserID,
                    'Picture' => $Picture,
                    'AccessToken' => $AccessToken,
                    'RefreshToken' => $RefreshToken,
                    'ExpiresIn' => $ExpiresIn,
                    'TokenData' => $TokenData,
                    'UserData' => $UserData,
                    'StorageData' => $StorageData,
                    'StorageTokenData' => $StorageTokenData
                )
            );
        }
    }
}
