function GetVerifiedCode(OJS) {
    var Account = document.getElementById("Account").value;
    var Mail = document.getElementById("Mail").value;
    var PassWord = document.getElementById("PassWord").value;
    var Repeat_PassWord = document.getElementById("Repeat_PassWord").value;

    if (Account == "") {
        mdui.snackbar({
            position: "top",
            message: "请输入用户名",
        });
    } else if (Mail == "") {
        mdui.snackbar({
            position: "top",
            message: "请输入邮箱",
        });
    } else if (PassWord == "") {
        mdui.snackbar({
            position: "top",
            message: "请输入密码",
        });
    } else if (Repeat_PassWord != PassWord) {
        mdui.snackbar({
            position: "top",
            message: "重复密码错误",
        });
    } else {
        LoadIng(true, "正在发送验证码", 220);

        var url = "./GetVerifiedCode.php";
        var data = "Mail=" + encodeURIComponent(Mail);

        $.ajax({
            type: "post",
            dataType: "json",
            url: url,
            data: data,
            error: function () {
                LoadIng(false);

                mdui.snackbar({
                    position: "top",
                    message: "网络异常",
                });
            },
            success: function (Result) {
                LoadIng(false);

                var Status = Result.Status;
                if (Status == 0) {
                    VerificationID = Result.VerificationID;
                    localStorage.setItem("VerificationID", VerificationID);

                    mdui.snackbar({
                        position: "top",
                        message: "发送验证码成功",
                    });

                    CountdownSendVerifyCode(120, "Button_GetVerifiedCode");
                } else if (Status == 151) {
                    var Seconds = Result.RetryIn;

                    mdui.snackbar({
                        position: "top",
                        message: "您的电子邮件每分钟最多可接收1条邮箱验证码，" + Seconds + "秒后可以再次发送",
                    });

                    CountdownSendVerifyCode(120, "Button_GetVerifiedCode");
                } else {
                    mdui.snackbar({
                        position: "top",
                        message: "发送失败",
                    });
                }
            },
        });
    }
}

function Register() {
    var Account = document.getElementById("Account").value;
    var Mail = document.getElementById("Mail").value;
    var VerificationCode = document.getElementById("VerificationCode").value;
    var PassWord = document.getElementById("PassWord").value;
    var Repeat_PassWord = document.getElementById("Repeat_PassWord").value;

    if (Account == "") {
        mdui.snackbar({
            position: "top",
            message: "请输入用户名",
        });
    } else if (Mail == "") {
        mdui.snackbar({
            position: "top",
            message: "请输入邮箱",
        });
    } else if (PassWord == "") {
        mdui.snackbar({
            position: "top",
            message: "请输入密码",
        });
    } else if (Repeat_PassWord != PassWord) {
        mdui.snackbar({
            position: "top",
            message: "重复密码错误",
        });
    } else if (VerificationCode == "") {
        mdui.snackbar({
            position: "top",
            message: "请输入验证码",
        });
    } else if (VerificationCode.length != 6) {
        mdui.snackbar({
            position: "top",
            message: "验证码格式错误",
        });
    } else {
        LoadIng(true, "正在注册", 220);

        var VerificationID = localStorage.getItem("VerificationID");
        var url = "./Register.php";
        var data = "Account=" + encodeURIComponent(Account) + "&Mail=" + encodeURIComponent(Mail) + "&VerificationCode=" + VerificationCode + "&VerificationID=" + encodeURIComponent(VerificationID) + "&PassWord=" + encodeURIComponent(PassWord);

        $.ajax({
            type: "post",
            dataType: "json",
            url: url,
            data: data,
            error: function () {
                LoadIng(false);

                mdui.snackbar({
                    position: "top",
                    message: "网络异常",
                });
            },
            success: function (Result) {
                LoadIng(false);

                var Status = Result.Status;
                if (Status == 0) {
                    Swal.fire({
                        icon: "success",
                        title: "注册成功",
                        text: "用户名:" + Account + " 邮箱:" + Mail + " 密码:" + PassWord,
                        confirmButtonText: "登陆",
                        denyButtonText: "刷新",
                        showDenyButton: true,
                    }).then(function (Result) {
                        if (Result.isConfirmed) {
                            window.location.replace("./?Type=Login");
                        } else {
                            document.getElementById("Register_Container").innerHTML = "";
                            window.location.reload();
                        }
                    });
                } else if (Status == 152) {
                    mdui.snackbar({
                        position: "top",
                        message: "验证码错误",
                    });
                } else {
                    mdui.snackbar({
                        position: "top",
                        message: "注册失败",
                    });
                }
            },
        });
    }
}

function Login() {
    var Mail = document.getElementById("Mail").value;
    var PassWord = document.getElementById("PassWord").value;

    if (Mail == "") {
        mdui.snackbar({
            position: "top",
            message: "请输入邮箱",
        });
    } else if (PassWord == "") {
        mdui.snackbar({
            position: "top",
            message: "请输入密码",
        });
    } else {
        LoadIng(true, "正在登陆", 220);

        var url = "./Login.php";
        var data = "Mail=" + encodeURIComponent(Mail) + "&PassWord=" + encodeURIComponent(PassWord);

        $.ajax({
            type: "post",
            dataType: "json",
            url: url,
            data: data,
            error: function () {
                LoadIng(false);

                mdui.snackbar({
                    position: "top",
                    message: "网络异常",
                });
            },
            success: function (Result) {
                LoadIng(false);

                var Status = Result.Status;
                if (Status == 0) {
                    var UserID = Result.UserID;

                    var Rand = sha1(UserID);

                    var localStorageKey = "User_" + Rand;
                    var StorageData = Result.StorageData;
                    localStorage.setItem(localStorageKey, StorageData);

                    localStorageKey = "UserToken_" + Rand;
                    var StorageTokenData = Result.StorageTokenData;
                    localStorage.setItem(localStorageKey, StorageTokenData);

                    document.getElementById("Login_Container").innerHTML = "";

                    Swal.fire({
                        icon: "success",
                        title: "登陆成功",
                        confirmButtonText: "查看文件列表",
                        denyButtonText: "继续登陆",
                        showDenyButton: true,
                    }).then(function (Result) {
                        if (Result.isConfirmed) {
                            window.location.replace("./?Type=List");
                        } else {
                            window.location.reload();
                        }
                    });
                } else if (Status == 156) {
                    mdui.snackbar({
                        position: "top",
                        message: "邮箱不存在",
                    });
                } else if (Status == 33) {
                    mdui.snackbar({
                        position: "top",
                        message: "密码错误",
                    });
                } else {
                    mdui.snackbar({
                        position: "top",
                        message: "登陆失败",
                    });
                }
            },
        });
    }
}

function GetVerifiedCode_Photo(OJS) {
    var Phone = document.getElementById("Phone").value;

    if (Phone == "") {
        mdui.snackbar({
            position: "top",
            message: "请输入手机号(例如:+8613800138000)",
        });
    } else if (Phone.indexOf("+") == -1) {
        mdui.snackbar({
            position: "top",
            message: "请输入正确手机号加区号(例如:+8613800138000)",
        });
    } else {
        LoadIng(true, "正在发送验证码", 220);

        Phone = Phone.replace("+", "");
        var url = "./GetVerifiedCode_Photo.php";
        var data = "Phone=" + Phone;

        $.ajax({
            type: "post",
            dataType: "json",
            url: url,
            data: data,
            error: function () {
                LoadIng(false);

                mdui.snackbar({
                    position: "top",
                    message: "网络异常",
                });
            },
            success: function (Result) {
                LoadIng(false);

                var Status = Result.Status;
                if (Status == 0) {
                    VerificationID = Result.VerificationID;
                    localStorage.setItem("VerificationID", VerificationID);

                    mdui.snackbar({
                        position: "top",
                        message: "发送验证码成功",
                    });
                } else if (Status == 151) {
                    mdui.snackbar({
                        position: "top",
                        message: "您的手机号每分钟最多可接收1条手机短信验证码，120秒后可以再次发送",
                    });
                } else {
                    mdui.snackbar({
                        position: "top",
                        message: "发送失败",
                    });
                }

                if (Status == 0 || Status == 151) {
                    CountdownSendVerifyCode(120, "Button_GetVerifiedCode");
                }
            },
        });
    }
}

function CountdownSendVerifyCode(Seconds, ElementByID) {
    if (Seconds > 1) {
        Seconds--;

        document.getElementById(ElementByID).innerText = Seconds + "秒后可再次获取验证码";
        document.getElementById(ElementByID).setAttribute("disabled", "disabled");

        setTimeout(function () {
            CountdownSendVerifyCode(Seconds, ElementByID);
        }, 1000);
    } else {
        document.getElementById(ElementByID).innerText = "获取验证码";
        document.getElementById(ElementByID).removeAttribute("disabled");
    }
}

function Register_Photo() {
    var Phone = document.getElementById("Phone").value;
    var VerificationCode_Photo = document.getElementById("VerificationCode_Photo").value;

    if (Phone == "") {
        mdui.snackbar({
            position: "top",
            message: "请输入手机号(例如:+8613800138000)",
        });
    } else if (Phone.indexOf("+") == -1) {
        mdui.snackbar({
            position: "top",
            message: "请输入正确手机号加区号(例如:+8613800138000)",
        });
    } else if (VerificationCode_Photo == "") {
        mdui.snackbar({
            position: "top",
            message: "请输入验证码",
        });
    } else if (VerificationCode_Photo.length != 6) {
        mdui.snackbar({
            position: "top",
            message: "验证码格式错误",
        });
    } else {
        LoadIng(true, "正在登陆", 220);

        Phone = Phone.replace("+", "");
        var VerificationID = localStorage.getItem("VerificationID");
        var url = "./Login_Phone.php";
        var data = "Phone=" + Phone + "&VerificationCode_Photo=" + VerificationCode_Photo + "&VerificationID=" + encodeURIComponent(VerificationID);

        $.ajax({
            type: "post",
            dataType: "json",
            url: url,
            data: data,
            error: function () {
                LoadIng(false);

                mdui.snackbar({
                    position: "top",
                    message: "网络异常",
                });
            },
            success: function (Result) {
                LoadIng(false);

                var Status = Result.Status;
                if (Status == 0) {
                    var UserID = Result.UserID;

                    var Rand = sha1(UserID);

                    var localStorageKey = "User_" + Rand;
                    var StorageData = Result.StorageData;
                    localStorage.setItem(localStorageKey, StorageData);

                    localStorageKey = "UserToken_" + Rand;
                    var StorageTokenData = Result.StorageTokenData;
                    localStorage.setItem(localStorageKey, StorageTokenData);

                    document.getElementById("Login_Container").innerHTML = "";

                    Swal.fire({
                        icon: "success",
                        title: "登陆成功",
                        confirmButtonText: "查看文件列表",
                        denyButtonText: "继续登陆",
                        showDenyButton: true,
                    }).then(function (Result) {
                        if (Result.isConfirmed) {
                            window.location.replace("./?Type=List");
                        } else {
                            window.location.reload();
                        }
                    });
                } else if (Status == 152) {
                    mdui.snackbar({
                        position: "top",
                        message: "验证码错误",
                    });
                } else if (Status == 167) {
                    mdui.snackbar({
                        position: "top",
                        message: "无法凭手机号找到对应账号",
                    });
                } else {
                    mdui.snackbar({
                        position: "top",
                        message: "登陆失败",
                    });
                }
            },
        });
    }
}
