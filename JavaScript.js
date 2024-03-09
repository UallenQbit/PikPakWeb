function SetUseUserRand(Rand) {
    var Record_Use_User_Rand = localStorage.getItem("Record_Use_User_Rand");

    if (document.getElementById("ICons_" + Record_Use_User_Rand) != null) {
        document.getElementById("ICons_" + Record_Use_User_Rand).innerText = "";
    }

    localStorage.setItem("Record_Use_User_Rand", Rand);

    if (document.getElementById("ICons_" + Rand) != null) {
        document.getElementById("ICons_" + Rand).innerText = "check";
    }
}

function Initialization() {
    GetUserList().then(function () {
        AnExaminationAccessToken().then(function () {
            MarkDefaultAccount().then(function () {
                Initialization_Multithreading();
                List();
            });
        });
    });
}

function Initialization_Multithreading() {
    return new Promise(function (TerminateReturn) {
            GetUserQuota().then(function () {
                GetUserVIPStatus().then(function () {
                    TerminateReturn();
                });
            });
    });
}

function GetUserList() {
    return new Promise(function (TerminateReturn) {
        LoadIng(true, "正在获取用户", 220);

        var User = "";
        var UserCount = 0;

        for (var i = 0; i < localStorage.length; i++) {
            var Key = localStorage.key(i);
            if (Key != "" && Key != null && Key.indexOf("User_") != -1) {
                var Data = localStorage.getItem(Key);
                if (Data.length > 64) {
                    UserCount++;

                    var Rand = Key.substring(5, Key.length);
                    var Json = JSON.parse(Data);
                    var Name = Json.Name;
                    var Picture = Json.Picture;

                    if (Picture == "PictureNo") {
                        Picture = "https://ae05.alicdn.com/kf/Uef8fba0f55af4f1ca052e7b8ed109761V.png";
                    }

                    User = User + "<div id='User_" + Rand + "'><div class='mdui-p-t-1'onmouseover='localStorage.setItem(" + '"Record_User_Rand","' + Rand + '"' + ")'onmouseout='localStorage.removeItem(" + '"Record_User_Rand"' + ")'ondblclick='SetUseUserRand(" + '"' + Rand + '"' + ");List()'><div class='mdui-col'><div class='mdui-card'><div class='mdui-card-content mdui-ripple'style='height:72px'><div class='mdui-card-menu'><i class='mdui-icon material-icons'id='ICons_" + Rand + "'></i></div><div class='mdui-chip'style='height:40px'><span class='mdui-chip-icon mdui-icon'style='height:40px;width:40px;margin-right:0px'><img id='UserPicture_" + Rand + "' src='" + Picture + "'height='40'width='40'></img></span><span class='mdui-chip-title text'style='padding-left:6px' id='UserName_" + Rand + "'>" + Name + "</span></div><div style='height:6px'></div><div class='mdui-progress'><div class='mdui-progress-indeterminate'style='width:15%'id='Progress_" + Rand + "'></div></div><div style='height:6px'></div><a class='text mdui-float-right' id='QuotaInfo_" + Rand + "'>∞ / ∞</a></div></div></div></div></div><div id='UserCount_" + UserCount + "'></div>";
                }
            }
        }

        if (UserCount == 0) {
            window.location.replace("./?Type=Login");
        } else {
            document.getElementById("User").innerHTML = User;
            document.getElementById("UserCount_" + UserCount).setAttribute("style", "height:8px");
        }

        LoadIng(false);

        TerminateReturn();
    });
}

function AnExaminationAccessToken() {
    return new Promise(async function (TerminateReturn) {
        LoadIng(true, "正在验证AccessToken", 220);

        for (var i = 0; i < localStorage.length; i++) {
            var Key = localStorage.key(i);
            if (Key != "" && Key != null && Key.indexOf("User_") != -1 && Key.length == 45) {
                var Rand = Key.substring(5, 45);
                var localStorageKey = "UserToken_" + Rand;
                var TokenData = localStorage.getItem(localStorageKey);
                if (TokenData == "" || TokenData == null) {
                    LoadIng(true, "正在获取AccessToken", 220);

                    await GetUserToken(Rand);

                    LoadIng(true, "正在验证AccessToken", 220);
                } else {
                    var Json = JSON.parse(TokenData);
                    var ExpiresTime = Json.ExpiresTime;

                    if (Date.now() / 1000 > ExpiresTime) {
                        LoadIng(true, "正在更新AccessToken", 220);

                        await GetUserToken(Rand);

                        LoadIng(true, "正在验证AccessToken", 220);
                    }
                }
            }
        }

        LoadIng(false);

        TerminateReturn();
    });
}

function GetUserToken(Rand) {
    return new Promise(async function (TerminateReturn) {
        var localStorageKey = "User_" + Rand;
        var UserData = localStorage.getItem(localStorageKey);
        var Json = JSON.parse(UserData);
        var Mail = Json.Mail;
        var PassWord = Json.PassWord;

        if (Mail != "" && Mail != null && PassWord != "" && PassWord != null) {
            var url = "./Login.php";
            var data = "Mail=" + encodeURIComponent(Mail) + "&PassWord=" + encodeURIComponent(PassWord);

            $.ajax({
                type: "post",
                dataType: "json",
                url: url,
                data: data,
                error: function () {
                    TerminateReturn(false);
                },
                success: function (result) {
                    if (result.Status == 0) {
                        localStorageKey = "UserToken_" + Rand;
                        var StorageTokenData = result.StorageTokenData;
                        localStorage.setItem(localStorageKey, StorageTokenData);
                        TerminateReturn(true);
                    } else {
                        TerminateReturn(false);
                    }
                },
            });
        }
    });
}

function GetUserQuota() {
    return new Promise(function (TerminateReturn) {
        for (var i = 0; i < localStorage.length; i++) {
            var Key = localStorage.key(i);
            if (Key != "" && Key != null && Key.indexOf("User_") != -1 && Key.length == 45) {
                var Rand = Key.substring(5, 45);
                var localStorageKey = "UserToken_" + Rand;
                var TokenData = localStorage.getItem(localStorageKey);
                if (TokenData == "" || TokenData == null) {
                    if (document.getElementById("QuotaInfo_" + Rand).innerText == "信息过期") {
                        document.getElementById("QuotaInfo_" + Rand).innerText = "信息过期";
                    } else {
                        document.getElementById("QuotaInfo_" + Rand).innerText = "信息获取失败";
                    }

                    document.getElementById("Progress_" + Rand).setAttribute("class", "mdui-progress-determinate mdui-color-red");
                    document.getElementById("Progress_" + Rand).setAttribute("style", "width:100%");
                } else {
                    var Json = JSON.parse(TokenData);
                    var AccessToken = Json.AccessToken;

                    var url = "./GetUserQuota.php";
                    var data = "AccessToken=" + encodeURIComponent(AccessToken) + "&Rand=" + Rand;

                    $.ajax({
                        type: "post",
                        dataType: "json",
                        url: url,
                        data: data,
                        error: function () {
                            TerminateReturn();
                        },
                        success: function (Result) {
                            var Status = Result.Status;
                            var ResultRand = Result.Rand;

                            if (Status == 0) {
                                var Limit = Result.Limit;
                                var Usage = Result.Usage;

                                document.getElementById("QuotaInfo_" + ResultRand).innerText = SizeFormat(Usage) + "/" + SizeFormat(Limit);
                                document.getElementById("Progress_" + ResultRand).setAttribute("class", "mdui-progress-determinate");
                                document.getElementById("Progress_" + ResultRand).setAttribute("style", "width:" + (Usage / Limit) * 100 + "%");
                            } else if (Status == 48) {
                                localStorage.removeItem("UserToken_" + ResultRand);
                            }

                            TerminateReturn();
                        },
                    });
                }
            }
        }
    });
}

function GetUserVIPStatus() {
    return new Promise(function (TerminateReturn) {
        for (var i = 0; i < localStorage.length; i++) {
            var Key = localStorage.key(i);
            if (Key != "" && Key != null && Key.indexOf("User_") != -1 && Key.length == 45) {
                var Rand = Key.substring(5, 45);
                var localStorageKey = "UserToken_" + Rand;
                var TokenData = localStorage.getItem(localStorageKey);
                if (TokenData != "" && TokenData != null) {
                    var Json = JSON.parse(TokenData);
                    var AccessToken = Json.AccessToken;

                    var url = "./VIPExpiredTime.php";
                    var data = "AccessToken=" + encodeURIComponent(AccessToken) + "&Rand=" + Rand;

                    $.ajax({
                        type: "post",
                        dataType: "json",
                        url: url,
                        data: data,
                        error: function () {
                            TerminateReturn();
                        },
                        success: function (Result) {
                            var Status = Result.Status;
                            var VIP_Status = Result.VIP_Status;
                            var ResultRand = Result.Rand;

                            if (Status == 0 && VIP_Status == "ok") {
                                var ExpiredTime = Result.ExpiredTime;

                                ExpiredTime = ExpiredTime.replace("T", " ");
                                ExpiredTime = ExpiredTime.replace("+08:00", "");

                                //document.getElementById('UserVIPInfo_' + ResultRand).innerText = 'VIP过期时间:' + ExpiredTime
                            } else {
                                //document.getElementById('UserVIPInfo_' + ResultRand).innerText = '此账号不是VIP'
                            }

                            TerminateReturn();
                        },
                    });
                }
            }
        }
    });
}

function MarkDefaultAccount() {
    return new Promise(function (TerminateReturn) {
        var Record_Use_User_Rand = localStorage.getItem("Record_Use_User_Rand");
        if (document.getElementById("ICons_" + Record_Use_User_Rand) == null) {
            localStorage.removeItem("Record_Use_User_Rand");
        } else {
            document.getElementById("ICons_" + Record_Use_User_Rand).innerText = "check";
        }

        TerminateReturn();
    });
}

function Exit(Rand) {
    var UserName = document.getElementById("UserName_" + Rand).innerText;

    Swal.fire({
        icon: "warning",
        title: "确定退出账号",
        text: UserName,
        confirmButtonText: "确定",
        denyButtonText: "关闭",
        showDenyButton: true,
    }).then(function (Result) {
        if (Result.isConfirmed) {
            var localStorageKey = "UserToken_" + Rand;
            localStorage.removeItem(localStorageKey);

            localStorageKey = "User_" + Rand;
            localStorage.removeItem(localStorageKey);

            var ID = "User_" + Rand;
            document.getElementById(ID).innerHTML = "";

            var Record_Use_User_Rand = localStorage.getItem("Record_Use_User_Rand");
            if (Record_Use_User_Rand == Rand) {
                localStorage.removeItem("Record_Use_User_Rand");
                SelectAccount(true);
            }

            var UserCount = 0;

            for (var i = 0; i < localStorage.length; i++) {
                var Key = localStorage.key(i);
                if (Key != "" && Key != null && Key.indexOf("User_") != -1) {
                    var Data = localStorage.getItem(Key);
                    if (Data.length > 64) {
                        UserCount++;
                    }
                }
            }

            if (UserCount == 0) {
                window.location.replace("./?Type=Login");
            }

            if (document.getElementById("ColList_Menu_For_Style").getAttribute("style") == "display:none") {
                SelectAccount(true);
            }
        }
    });
}

function List(PageToken = "") {
    LoadIng(true, "正在验证用户状态", 220);
    document.getElementById("WebTitle").innerText = "PikPak | 我的文件";

    var Record_Use_User_Rand = localStorage.getItem("Record_Use_User_Rand");

    if (Record_Use_User_Rand == "" || Record_Use_User_Rand == null) {
        SelectAccount(true);
        LoadIng(false);
    } else {
        SelectAccount(false);

        document.getElementById("FileInfo").innerText = "正在获取文件";

        var AccessToken = GetUserStorageAccessToken(Record_Use_User_Rand);

        if (PageToken == "" || PageToken == null) {
            LoadIng(true, "正在获取文件", 220);
        } else {
            LoadIng(true, "正在更多获取文件", 220);
        }

        var ID = localStorage.getItem("FileFolderID_" + Record_Use_User_Rand);
        if (ID == null) {
            ID = "";
        }
        var url = "./List.php";
        var data = "AccessToken=" + encodeURIComponent(AccessToken) + "&ID=" + ID + "&Token=" + encodeURIComponent(PageToken);
        var List_Folder = 0;
        var List_File = 0;

        $.ajax({
            type: "post",
            dataType: "json",
            url: url,
            data: data,
            error: function () {
                LoadIng(false);

                Swal.fire({
                    icon: "error",
                    title: "网络异常",
                    text: "请求失败",
                    confirmButtonText: "重新获取文件",
                    denyButtonText: "关闭",
                    showDenyButton: true,
                }).then(function (Result) {
                    if (Result.isConfirmed) {
                        List(PageToken);
                    }
                });
            },
            success: function (Result) {
                document.getElementById("ListThead").innerHTML = "<th style='width:60px' onclick='AllSetListState()'><label class='mdui-checkbox'><input type='checkbox' id='Checkbox_Thead'><i class='mdui-checkbox-icon'></i></th><th>文件</th><th>文件大小</th><th id='ListTime'>创建时间</th>";

                var kind = Result.kind;
                if (kind == "drive#fileList") {
                    if (PageToken == "" || PageToken == null) {
                        var ListData = "";
                        var ListDataCount = 0;

                        document.getElementById("DoubleClickToLoadMoreFiles_Text_Length").innerText = 0;
                    } else {
                        var ListData = document.getElementById("List").innerHTML;
                        ListData = ListData.substring(0, ListData.length - document.getElementById("DoubleClickToLoadMoreFiles_Text_Length").innerText);

                        var ListDataCount = CountSubStrings(ListData, "List_ID_");
                    }

                    PageToken = Result.next_page_token;
                    FileCount = Result.files.length;

                    for (var i = 0; i < FileCount; i++) {
                        var Name = Result.files[i].name;
                        var Size = Result.files[i].size;
                        var Time = Result.files[i].created_time;
                        var ID = Result.files[i].id;
                        var Hash = Result.files[i].hash;
                        var Type = Result.files[i].kind;
                        var ICon_Link = Result.files[i].icon_link;
                        var FileMimeType = Result.files[i].mime_type;
                        var Signature = "PikPak://" + Name + "|" + Size + "|" + Hash;

                        Time = Time.replace("T", " ");
                        Time = Time.replace("+08:00", "");

                        if (Type == "drive#folder") {
                            List_Folder++;
                            var Info_Size = "---:---:---";
                            var ListOnDBLclick = "ondblclick='OpenFolder(" + '"' + ID + '","' + Name + '"' + ")'";
                        } else {
                            List_File++;
                            var Info_Size = SizeFormat(Size);
                            var ListOnDBLclickSetIDData = "localStorage.setItem(" + '"Record_List_Use_FileID","' + ID + '"' + ")";

                            if (FileMimeType.indexOf("image/") != -1) {
                                var ListOnDBLclick = "ondblclick='" + ListOnDBLclickSetIDData + ";DownLoad(3)'";
                            } else if (FileMimeType.indexOf("video/") != -1) {
                                var ListOnDBLclick = "ondblclick='" + ListOnDBLclickSetIDData + ";DownLoad(1)'";
                            } else if (FileMimeType.indexOf("audio/") != -1) {
                                var ListOnDBLclick = "ondblclick='" + ListOnDBLclickSetIDData + ";DownLoad(2)'";
                            } else {
                                var ListOnDBLclick = "";
                            }
                        }

                        var List_Count_i = i + ListDataCount;

                        ListData += "<tr id='List_" + List_Count_i + "'onmouseover='localStorage.setItem(" + '"Record_List_NumberID","' + List_Count_i + '"' + ");localStorage.setItem(" + '"Record_List_Name","' + Name + '"' + ");localStorage.setItem(" + '"Record_List_FileID","' + ID + '"' + ")'onmouseout='localStorage.removeItem(" + '"Record_List_NumberID"' + ");localStorage.removeItem(" + '"Record_List_Name"' + ");localStorage.removeItem(" + '"Record_List_FileID"' + ")'onclick='SetListState(" + List_Count_i + ",false)'" + ListOnDBLclick + "><th><label class='mdui-checkbox'onmouseover='ListState_Checkbox_NumberID(" + i + ")'onmouseout='ListState_Checkbox_NumberID()'><input type='checkbox'id='Checkbox_Tbody_" + List_Count_i + "'onclick='SetListState(" + List_Count_i + ",false)'><i class='mdui-checkbox-icon'></i></th><td><lua class='ProhibitChoose'><img id='List_Image_Hash_" + Hash + "' class='mdui-icon' src='" + ICon_Link + "' style='width:40px;height:40px'></img></lua><a class='mdui-list-item-content' style='margin-left:12px' id='List_Name_" + List_Count_i + "'>" + Name + "</a></td><td>" + Info_Size + "</td><td id='List_Time_" + List_Count_i + "'>" + Time + "</td></tr><div id='List_Type_" + List_Count_i + "'class='" + Type + "'></div><div id='List_Size_" + List_Count_i + "' class='" + Size + "'></div><div id='List_ID_" + List_Count_i + "' class='" + ID + "'></div><div id='List_Hash_" + List_Count_i + "' class='" + Hash + "'></div><div id='List_Signature_" + List_Count_i + "' class='" + Signature + "'></div><div id='List_FileMimeType_" + List_Count_i + "' class='" + FileMimeType + "'></div>";
                    }

                    if (PageToken != "" && PageToken != null) {
                        var DoubleClickToLoadMoreFiles_TR = "<tr style='height:64px' ondblclick='List(&quot;" + PageToken + "&quot;)'><th>双击获取更多文件</th><th>双击获取更多文件</th><th>双击获取更多文件</th><th>双击获取更多文件</th></tr>";
                        var DoubleClickToLoadMoreFiles_Text_Length = DoubleClickToLoadMoreFiles_TR.length;

                        ListData += DoubleClickToLoadMoreFiles_TR;
                    } else {
                        var DoubleClickToLoadMoreFiles_Text_Length = 0;
                    }

                    document.getElementById("DoubleClickToLoadMoreFiles_Text_Length").innerText = DoubleClickToLoadMoreFiles_Text_Length;

                    document.getElementById("Checkbox_Thead").checked = false;
                    document.getElementById("Checkbox_Thead").indeterminate = false;

                    document.getElementById("List").innerHTML = ListData;

                    if (List_Count_i > 49) {
                        List_Folder = CountSubStrings(ListData, "drive#folder");
                        List_File = CountSubStrings(ListData, "drive#file");
                    }

                    if (FileCount == 0) {
                        var NotFile = " (没有文件/个文件夹)";
                    } else {
                        var NotFile = "";
                    }

                    document.getElementById("FileInfo").innerText = List_Folder + List_File + "个文件类型 | " + List_Folder + "个文件夹 | " + List_File + "个文件" + NotFile;

                    LoadIng(false);
                } else {
                    LoadIng(false);

                    if (Result.error_code == 16) {
                        Swal.fire({
                            icon: "error",
                            title: "AccessToken验证失败",
                            text: "错误或过期(2小时有效)",
                            confirmButtonText: "重新获取AccessToken",
                            denyButtonText: "关闭",
                            showDenyButton: true,
                        }).then(function (Result) {
                            if (Result.isConfirmed) {
                                window.location.reload();
                            }
                        });
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "获取文件失败",
                            text: "无法获取文件",
                            confirmButtonText: "重新获取文件",
                            denyButtonText: "关闭",
                            showDenyButton: true,
                        }).then(function (Result) {
                            if (Result.isConfirmed) {
                                List(PageToken);
                            }
                        });
                    }
                }

                var AllOpenFolderHTMLCode = "<button class='mdui-btn mdui-color-blue-accent mdui-ripple' onclick='AllOpenFolder()'><i class='mdui-list-item-icon mdui-icon material-icons'>home</i> 全部文件</button>";

                var Record_Use_User_Rand = localStorage.getItem("Record_Use_User_Rand");
                var Dir = localStorage.getItem("FileFolderDir_" + Record_Use_User_Rand);
                if (Dir != "" && Dir != null) {
                    var ArrayDir = Dir.split("/");
                    var ArrayDir_Length = ArrayDir.length;
                    var ListPath = "";
                    for (var i = 1; i < ArrayDir_Length; i++) {
                        if (i == ArrayDir_Length - 1) {
                            var Color = "mdui-color-green-600";
                        } else {
                            var Color = "mdui-color-indigo-accent";
                        }

                        var DirData = ArrayDir[i];
                        var DataOf = DirData.indexOf("{Kinh|PikPak}");
                        var Name = DirData.substring(0, DataOf);
                        var ID = DirData.substring(DataOf + 13, DirData.length);
                        ListPath += "<i class='mdui-icon material-icons'>keyboard_arrow_right</i><button class='mdui-btn mdui-ripple " + Color + "' onclick='BackOpenFolder(" + '"' + ID + '"' + ")'>" + Name + "</button>";
                    }

                    var HTMLCode = AllOpenFolderHTMLCode + ListPath;
                    document.getElementById("Path").innerHTML = HTMLCode;
                } else {
                    document.getElementById("Path").innerHTML = AllOpenFolderHTMLCode;
                }
            },
        });
    }
}

function UserAction_ColUser(Width, Height) {
    var Rand = localStorage.getItem("Record_User_Rand");
    if (Rand == "" || Rand == null) {
        document.getElementById("Use").setAttribute("style", "display:none");
        document.getElementById("Use").innerHTML = "";

        document.getElementById("RecycleBin").setAttribute("style", "display:none");
        // document.getElementById("UserEditor").setAttribute("style", "display:none");
        document.getElementById("Offline").setAttribute("style", "display:none");
        document.getElementById("PayVIP").setAttribute("style", "display:none");
        document.getElementById("EnterMembershipCode").setAttribute("style", "display:none");
        document.getElementById("GetinviteCode").setAttribute("style", "display:none");
        document.getElementById("UserMenu_Open_Divider_0").setAttribute("style", "display:none");
        document.getElementById("UserMenu_Open_Divider_1").setAttribute("style", "display:none");
        document.getElementById("Exit").innerHTML = "";

        var MenuHeight = 124;
    } else {
        document.getElementById("Use").setAttribute("style", "");
        document.getElementById("Use").innerHTML = "<li class='mdui-menu-item' id='Use'><a href='javascript:SetUseUserRand(" + '"' + Rand + '"' + ");List()'><i class='mdui-menu-item-icon mdui-icon material-icons'>launch</i>使用</a></li>";

        document.getElementById("UserMenu_Open_Divider_0").setAttribute("style", "");
        document.getElementById("UserMenu_Open_Divider_1").setAttribute("style", "");
        document.getElementById("Exit").setAttribute("style", "");
        document.getElementById("Exit").innerHTML = "<li class='mdui-menu-item' id='Exit'><a href='javascript:Exit(" + '"' + Rand + '"' + ")'><i class='mdui-menu-item-icon mdui-icon material-icons'>exit_to_app</i>退出</a></li>";

        if (Rand == localStorage.getItem("Record_Use_User_Rand")) {
            document.getElementById("RecycleBin").setAttribute("style", "");
            // document.getElementById("UserEditor").setAttribute("style", "");
            document.getElementById("Offline").setAttribute("style", "");
            document.getElementById("PayVIP").setAttribute("style", "");
            document.getElementById("EnterMembershipCode").setAttribute("style", "");
            document.getElementById("GetinviteCode").setAttribute("style", "");

            var MenuHeight = 482;
        } else {
            document.getElementById("RecycleBin").setAttribute("style", "display:none");
            // document.getElementById("UserEditor").setAttribute("style", "display:none");
            document.getElementById("Offline").setAttribute("style", "display:none");
            document.getElementById("PayVIP").setAttribute("style", "display:none");
            document.getElementById("EnterMembershipCode").setAttribute("style", "display:none");
            document.getElementById("GetinviteCode").setAttribute("style", "display:none");

            var MenuHeight = 230;
        }
    }

    var WindowHeight = window.innerHeight;
    if (WindowHeight < 740) {
        WindowHeight = 740;
    }

    if (WindowHeight - MenuHeight < Height) {
        Height = WindowHeight - MenuHeight - 12;
    }

    document.getElementById("ListMenu").setAttribute("style", "top:-1024px;left:-1024px");
    document.getElementById("UserMenu").setAttribute("style", "top:" + Height + "px;left:" + Width + "px;width:155px");

    var MenuInst = new mdui.Menu("#UserMenu", "#UserMenu");
    MenuInst.open();
}

function UserAction_ColList_Menu_For_Style(Width, Height) {
    if (document.getElementById("ListTime").innerText == "创建时间") {
        var Record_List_Name = localStorage.getItem("Record_List_Name");
        if (Record_List_Name != "" && Record_List_Name != null) {
            localStorage.setItem("Record_List_Use_Name", Record_List_Name);
        }

        var Record_List_FileID = localStorage.getItem("Record_List_FileID");
        if (Record_List_FileID != "" && Record_List_FileID != null) {
            localStorage.setItem("Record_List_Use_FileID", Record_List_FileID);
        }

        var Record_List_NumberID = localStorage.getItem("Record_List_NumberID");
        if (Record_List_NumberID == "" || Record_List_NumberID == null) {
            document.getElementById("Menu_Open").setAttribute("style", "display:none");
            document.getElementById("ListMenu_Open_Divider_0").setAttribute("class", "");
            document.getElementById("ListMenu_Open_Divider_1").setAttribute("class", "");
            document.getElementById("ListMenu_Open_Divider_2").setAttribute("class", "");
            document.getElementById("ListMenu_Open_Divider_3").setAttribute("class", "");
            document.getElementById("Menu_Signature").setAttribute("style", "display:none");
            document.getElementById("Menu_Rename").setAttribute("style", "display:none");
            document.getElementById("Menu_Copy").setAttribute("style", "display:none");
            document.getElementById("Menu_Move").setAttribute("style", "display:none");
            document.getElementById("Menu_Delete").setAttribute("style", "display:none");
            document.getElementById("Menu_Picture").setAttribute("style", "display:none");
            document.getElementById("Menu_Video_Music").setAttribute("style", "display:none");
            document.getElementById("Menu_DownLoad").setAttribute("style", "display:none");
            var MenuHeight = 194;

            AllSetListState(false);
        } else {
            localStorage.setItem("Record_List_Use_NumberID", Record_List_NumberID);

            SetListState(Record_List_NumberID, true);

            document.getElementById("Menu_Copy").setAttribute("style", "");
            document.getElementById("Menu_Move").setAttribute("style", "");
            document.getElementById("Menu_Delete").setAttribute("style", "");
            document.getElementById("ListMenu_Open_Divider_3").setAttribute("class", "mdui-divider");

            var List_Type = document.getElementById("List_Type_" + Record_List_NumberID).getAttribute("class");
            var List_FileMimeType = document.getElementById("List_FileMimeType_" + Record_List_NumberID).getAttribute("class");
            var ListCount_Checkbox_Length = document.getElementsByClassName("mdui-table-row-selected").length;

            if (ListCount_Checkbox_Length > 1) {
                document.getElementById("Menu_Open").setAttribute("style", "display:none");
                document.getElementById("ListMenu_Open_Divider_0").setAttribute("class", "");
                document.getElementById("ListMenu_Open_Divider_1").setAttribute("class", "");
                document.getElementById("Menu_Rename").setAttribute("style", "display:none");
                document.getElementById("Menu_Picture").setAttribute("style", "display:none");
                document.getElementById("Menu_Video_Music").setAttribute("style", "display:none");
                var MenuHeight = 302;

                if (IfFile() == true) {
                    document.getElementById("Menu_Signature").setAttribute("style", "");
                    document.getElementById("ListMenu_Open_Divider_2").setAttribute("class", "mdui-divider");
                    MenuHeight += 36 + 12;
                } else {
                    document.getElementById("Menu_Signature").setAttribute("style", "display:none");
                    document.getElementById("ListMenu_Open_Divider_2").setAttribute("class", "");
                }
            } else if (List_Type == "drive#folder") {
                document.getElementById("Menu_Open").setAttribute("style", "");
                document.getElementById("ListMenu_Open_Divider_0").setAttribute("class", "mdui-divider");
                document.getElementById("ListMenu_Open_Divider_1").setAttribute("class", "");
                document.getElementById("ListMenu_Open_Divider_2").setAttribute("class", "");
                document.getElementById("Menu_Signature").setAttribute("style", "display:none");
                document.getElementById("Menu_Rename").setAttribute("style", "");
                document.getElementById("Menu_Picture").setAttribute("style", "display:none");
                document.getElementById("Menu_Video_Music").setAttribute("style", "display:none");
                var MenuHeight = 391;
            } else {
                document.getElementById("Menu_Open").setAttribute("style", "display:none");
                document.getElementById("ListMenu_Open_Divider_0").setAttribute("class", "");
                document.getElementById("ListMenu_Open_Divider_1").setAttribute("class", "mdui-divider");
                document.getElementById("ListMenu_Open_Divider_2").setAttribute("class", "mdui-divider");
                document.getElementById("Menu_Signature").setAttribute("style", "");
                document.getElementById("Menu_Rename").setAttribute("style", "");
                document.getElementById("Menu_DownLoad").setAttribute("style", "");
                var MenuHeight = 512;

                if (List_FileMimeType.indexOf("video/") == -1 && List_FileMimeType.indexOf("audio/") == -1 && List_FileMimeType.indexOf("image/") == -1) {
                    document.getElementById("Menu_Picture").setAttribute("style", "display:none");
                    document.getElementById("Menu_Video_Music").setAttribute("style", "display:none");
                } else if (List_FileMimeType.indexOf("image/") != -1) {
                    document.getElementById("Menu_Picture").setAttribute("style", "");
                    document.getElementById("Menu_Video_Music").setAttribute("style", "display:none");
                    MenuHeight += 36;
                } else {
                    if (List_FileMimeType.indexOf("video/") != -1) {
                        document.getElementById("Menu_Video_Music_ICon").innerText = "ondemand_video";
                    } else if (List_FileMimeType.indexOf("audio/") != -1) {
                        document.getElementById("Menu_Video_Music_ICon").innerText = "music_note";
                    }

                    document.getElementById("Menu_Picture").setAttribute("style", "display:none");
                    document.getElementById("Menu_Video_Music").setAttribute("style", "");

                    MenuHeight += 36;
                }
            }
        }

        var Record_Use_User_Rand = localStorage.getItem("Record_Use_User_Rand");
        var Type = localStorage.getItem("FileOperations_Copy_Move_Type_" + Record_Use_User_Rand);
        var JsonData = localStorage.getItem("FileOperations_Copy_Move_JsonData_" + Record_Use_User_Rand);
        var ListCount_Length = localStorage.getItem("FileOperations_Copy_Move_ListCount_Length_" + Record_Use_User_Rand);

        if (Type == "" || Type == null || JsonData == "" || JsonData == null || ListCount_Length == "" || ListCount_Length == null) {
            localStorage.removeItem("FileOperations_Copy_Move_Type_" + Record_Use_User_Rand);
            localStorage.removeItem("FileOperations_Copy_Move_JsonData_" + Record_Use_User_Rand);
            localStorage.removeItem("FileOperations_Copy_Move_ListCount_Length_" + Record_Use_User_Rand);
            document.getElementById("Menu_Paste").setAttribute("style", "display:none");
        } else {
            document.getElementById("Menu_Paste").setAttribute("style", "");
            MenuHeight += 36;
        }

        var WindowHeight = window.innerHeight;
        var WindowWidth = window.innerWidth;

        if (WindowHeight < 740) {
            WindowHeight = 740;
        }

        if (WindowWidth < 1280) {
            WindowWidth = 1280;
        }

        if (WindowHeight - MenuHeight < Height) {
            Height = WindowHeight - MenuHeight - 12;
        }

        if (WindowWidth - 185 < Width) {
            Width = WindowWidth - 185 - 12;
        }

        document.getElementById("UserMenu").setAttribute("style", "top:-1024px;left:-1024px");

        var MenuInst = new mdui.Menu("#ListMenu", "#ListMenu");
        MenuInst.open();

        document.getElementById("ListMenu").setAttribute("style", "top:" + Height + "px;left:" + Width + "px;width:185px");
    }
}

function SetListState(NumberID, Menu) {
    Record_ListState_Checkbox_NumberID = localStorage.getItem("Record_ListState_Checkbox_NumberID");
    if (Menu == false && (Record_ListState_Checkbox_NumberID == "" || Record_ListState_Checkbox_NumberID == null)) {
        AllSetListState(false);
    }

    var HTMLCodeClass = document.getElementById("List_" + NumberID).getAttribute("class");
    if (HTMLCodeClass == "" || HTMLCodeClass == null) {
        if (Menu == true) {
            AllSetListState(false);
        }

        document.getElementById("List_" + NumberID).setAttribute("class", "mdui-table-row-selected");
        document.getElementById("Checkbox_Tbody_" + NumberID).checked = true;
    } else {
        if (Menu == false) {
            document.getElementById("List_" + NumberID).setAttribute("class", "");
            document.getElementById("Checkbox_Tbody_" + NumberID).checked = false;
        }
    }

    var ListCount_Checked_Length = document.getElementsByClassName("mdui-table-row-selected").length;
    var ListCount_Length = document.getElementsByClassName("mdui-checkbox").length - 1;

    if (ListCount_Checked_Length == ListCount_Length) {
        document.getElementById("Checkbox_Thead").indeterminate = false;
        document.getElementById("Checkbox_Thead").checked = true;
    } else if (ListCount_Checked_Length > 0) {
        document.getElementById("Checkbox_Thead").checked = false;
        document.getElementById("Checkbox_Thead").indeterminate = true;
    } else if (ListCount_Checked_Length == 0) {
        document.getElementById("Checkbox_Thead").checked = false;
        document.getElementById("Checkbox_Thead").indeterminate = false;
    }
}

function AllSetListState(Type) {
    if (Type == null) {
        Type = document.getElementById("Checkbox_Thead").checked;
    }

    var ListCount_Length = document.getElementsByClassName("mdui-checkbox").length - 1;
    if (Type == true) {
        for (var i = 0; i < ListCount_Length; i++) {
            if (document.getElementById("List_" + i) != null) {
                document.getElementById("List_" + i).setAttribute("class", "mdui-table-row-selected");
                document.getElementById("Checkbox_Tbody_" + i).checked = true;
                document.getElementById("Checkbox_Thead").indeterminate = false;
                document.getElementById("Checkbox_Thead").checked = true;
            }
        }
    } else {
        for (var i = 0; i < ListCount_Length; i++) {
            if (document.getElementById("List_" + i) != null) {
                document.getElementById("List_" + i).setAttribute("class", "");
                document.getElementById("Checkbox_Tbody_" + i).checked = false;
                document.getElementById("Checkbox_Thead").indeterminate = false;
                document.getElementById("Checkbox_Thead").checked = false;
            }
        }
    }
}

function ListState_Checkbox_NumberID(NumberID) {
    if (NumberID == null) {
        NumberID = "";
    }
    localStorage.setItem("Record_ListState_Checkbox_NumberID", NumberID);
}

function IfUser() {
    for (var i = 0; i < localStorage.length; i++) {
        var Key = localStorage.key(i);
        if (Key != null && Key.indexOf("User_") != -1) {
            return true;
        }
    }

    return false;
}

function OpenFolder(ID, Dir) {
    var Record_Use_User_Rand = localStorage.getItem("Record_Use_User_Rand");
    localStorage.setItem("FileFolderID_" + Record_Use_User_Rand, ID);
    var FileFolderDir = localStorage.getItem("FileFolderDir_" + Record_Use_User_Rand);
    if (FileFolderDir == null) {
        FileFolderDir = "";
    }
    localStorage.setItem("FileFolderDir_" + Record_Use_User_Rand, FileFolderDir + "/" + Dir + "{Kinh|PikPak}" + ID);

    List();
}

function BackOpenFolder(ID) {
    var Record_Use_User_Rand = localStorage.getItem("Record_Use_User_Rand");
    localStorage.setItem("FileFolderID_" + Record_Use_User_Rand, ID);

    var FileFolderDir = localStorage.getItem("FileFolderDir_" + Record_Use_User_Rand);
    var OfData = "{Kinh|PikPak}" + ID;
    var FileFolderDir_Data = FileFolderDir.substring(0, FileFolderDir.indexOf(OfData)) + OfData;
    localStorage.setItem("FileFolderDir_" + Record_Use_User_Rand, FileFolderDir_Data);

    List();
}

function AllOpenFolder() {
    var Record_Use_User_Rand = localStorage.getItem("Record_Use_User_Rand");
    localStorage.removeItem("FileFolderID_" + Record_Use_User_Rand);
    localStorage.removeItem("FileFolderDir_" + Record_Use_User_Rand);
    List();
}

function CreateFolder() {
    mdui.prompt(
        "请输入文件夹名称",
        "创建文件夹",
        function () {},
        function (Value) {
            if (Value == "" || Value == null) {
                Swal.fire({
                    icon: "warning",
                    title: "请输入创建文件夹名",
                    confirmButtonText: "重新创建文件夹",
                    denyButtonText: "关闭",
                    showDenyButton: true,
                }).then(function (Result) {
                    if (Result.isConfirmed) {
                        CreateFolder();
                    }
                });
            } else {
                LoadIng(true, "正在创建文件夹", 220);
                var Record_Use_User_Rand = localStorage.getItem("Record_Use_User_Rand");
                var ID = localStorage.getItem("FileFolderID_" + Record_Use_User_Rand);
                if (ID == null) {
                    ID = "";
                }
                var AccessToken = GetUserStorageAccessToken(Record_Use_User_Rand);
                var url = "./CreateFolder.php";
                var data = "AccessToken=" + encodeURIComponent(AccessToken) + "&Name=" + encodeURIComponent(Value) + "&ID=" + ID;

                $.ajax({
                    type: "post",
                    dataType: "json",
                    url: url,
                    data: data,
                    error: function () {
                        LoadIng(false);

                        Swal.fire({
                            icon: "error",
                            title: "网络异常",
                            text: "请求错误",
                            confirmButtonText: "重新创建文件夹",
                            denyButtonText: "关闭",
                            showDenyButton: true,
                        }).then(function (Result) {
                            if (Result.isConfirmed) {
                                CreateFolder();
                            }
                        });
                    },
                    success: function (Result) {
                        LoadIng(false);

                        var Status = Result.Status;
                        if (Status == 0) {
                            Swal.fire({
                                icon: "success",
                                title: "创建文件夹成功",
                                confirmButtonText: "重新获取文件",
                            }).then(function () {
                                List();
                            });
                        } else if (Status == 48) {
                            Swal.fire({
                                icon: "error",
                                title: "AccessToken验证失败",
                                text: "错误或过期(2小时有效)",
                                confirmButtonText: "重新获取AccessToken",
                                denyButtonText: "关闭",
                                showDenyButton: true,
                            }).then(function (Result) {
                                if (Result.isConfirmed) {
                                    window.location.reload();
                                }
                            });
                        } else {
                            Swal.fire({
                                icon: "error",
                                title: "创建文件夹失败",
                                text: "可能存在非法符号",
                                confirmButtonText: "重新创建",
                                denyButtonText: "关闭",
                                showDenyButton: true,
                            }).then(function (Result) {
                                if (Result.isConfirmed) {
                                    CreateFolder();
                                }
                            });
                        }
                    },
                });
            }
        }
    );

    DoubleNamingHeavyNaming("提交", "关闭");
    SetMDUIDiaLogWidth(680);
}

function GetUserStorageAccessToken(Rand = "") {
    if (Rand == "" || Rand == null) {
        Rand = localStorage.getItem("Record_Use_User_Rand");
    }

    var localStorageKey = "UserToken_" + Rand;
    var TokenData = localStorage.getItem(localStorageKey);
    if (TokenData == "" || TokenData == null) {
        return "";
    } else {
        var Json = JSON.parse(TokenData);
        var AccessToken = Json.AccessToken;
        return AccessToken;
    }
}

function Rename() {
    var Record_List_Use_Name = localStorage.getItem("Record_List_Use_Name");

    Swal.fire({
        icon: "info",
        title: "请输入文件名",
        confirmButtonText: "提交",
        denyButtonText: "关闭",
        input: "text",
        inputValue: Record_List_Use_Name,
        showDenyButton: true,
    }).then(function (Result) {
        if (Result.isConfirmed) {
            if (Result.isConfirmed) {
                if (Result.value == "" || Result.value == null) {
                    Swal.fire({
                        icon: "warning",
                        title: "请输入文件名",
                        text: "原文件名:" + Record_List_Use_Name,
                        confirmButtonText: "重新重命名",
                        denyButtonText: "关闭",
                        showDenyButton: true,
                    }).then(function (Result) {
                        if (Result.isConfirmed) {
                            Rename();
                        }
                    });
                } else {
                    LoadIng(true, "正在重命名", 220);

                    var AccessToken = GetUserStorageAccessToken();
                    var Name = Result.value;
                    var ID = localStorage.getItem("Record_List_Use_FileID");
                    var url = "./Rename.php";
                    var data = "AccessToken=" + encodeURIComponent(AccessToken) + "&Name=" + encodeURIComponent(Name) + "&ID=" + ID;

                    $.ajax({
                        type: "post",
                        dataType: "json",
                        url: url,
                        data: data,
                        error: function () {
                            LoadIng(false);

                            Swal.fire({
                                icon: "error",
                                title: "网络异常",
                                text: "请求失败",
                                confirmButtonText: "重新重命名",
                                denyButtonText: "关闭",
                                showDenyButton: true,
                            }).then(function (Result) {
                                if (Result.isConfirmed) {
                                    Rename();
                                }
                            });
                        },
                        success: function (Result) {
                            LoadIng(false);

                            var Status = Result.Status;
                            if (Status == 0) {
                                Swal.fire({
                                    icon: "success",
                                    title: "重命名文件成功",
                                    confirmButtonText: "重新获取文件",
                                }).then(function () {
                                    List();
                                });
                            } else if (Status == 48) {
                                Swal.fire({
                                    icon: "error",
                                    title: "AccessToken验证失败",
                                    text: "错误或过期(2小时有效)",
                                    confirmButtonText: "重新获取AccessToken",
                                    denyButtonText: "关闭",
                                    showDenyButton: true,
                                }).then(function (Result) {
                                    if (Result.isConfirmed) {
                                        window.location.reload();
                                    }
                                });
                            } else {
                                Swal.fire({
                                    icon: "error",
                                    title: "重命名文件失败",
                                    text: "可能存在非法符号",
                                    confirmButtonText: "重新重命名文件",
                                    denyButtonText: "关闭",
                                    showDenyButton: true,
                                }).then(function (Result) {
                                    if (Result.isConfirmed) {
                                        Rename();
                                    }
                                });
                            }
                        },
                    });
                }
            }
        }
    });
}

async function FileOperations(Type) {
    if (Type == 0 || Type == 10 || Type == 4 || Type == 5) {
        if ((await FileOperations_Delete(Type)) == false) {
            return null;
        }
    }

    if (Type == 0 || Type == 10) {
        var TypeInfo = "删除";
    } else if (Type == 1) {
        var TypeInfo = "复制";
    } else if (Type == 2) {
        var TypeInfo = "移动";
    } else if (Type == 3) {
        var TypeInfo = "恢复";
    } else if (Type == 4) {
        var TypeInfo = "彻底删除";
    } else if (Type == 5) {
        var TypeInfo = "清空回收站";
    }

    if (Type == 0 || Type == 10 || Type == 1 || Type == 2) {
        var ListCount_Length = document.getElementsByClassName("mdui-table-row-selected").length;
    } else if (Type == 3 || Type == 4) {
        ListCount_Length = 1;
    }

    if (Type == 0 || Type == 10 || Type == 3 || Type == 4) {
        LoadIng(true, "正在" + TypeInfo + ListCount_Length + "个文件", 220);
    } else if (Type == 5) {
        LoadIng(true, "正在" + TypeInfo, 220);
    }

    if (Type == 0) {
        if (ListCount_Length > 50) {
            Type = 100;

            LoadIng(false);

            Swal.fire({
                icon: "info",
                title: "每次只可以删除50个文件",
                text: "当前选中文件" + ListCount_Length + "个",
                confirmButtonText: "继续删除",
                denyButtonText: "关闭",
                showDenyButton: true,
            }).then(function (Result) {
                if (Result.isConfirmed) {
                    FileOperations(10);
                }
            });
        } else {
            Type = 10;
        }
    }

    if (Type == 10 || Type == 1 || Type == 2) {
        var ArrayData = new Array(ListCount_Length);
        for (var i = 0; i < ListCount_Length; i++) {
            var HTMLCode = document.getElementsByClassName("mdui-table-row-selected")[i].id;
            var NumberID = HTMLCode.replace("List_", "");
            var ID = document.getElementById("List_ID_" + NumberID).getAttribute("class");
            ArrayData[i] = ID;
        }

        var JsonData = JSON.stringify(ArrayData);
        if (Type == 10) {
            Type = 0;

            JsonData = '{"ids":' + JsonData + "}";
        } else if (Type == 1 || Type == 2) {
            JsonData = '{"to":{"parent_id":"@ID#"},"ids":' + JsonData + "}";

            var Record_Use_User_Rand = localStorage.getItem("Record_Use_User_Rand");
            localStorage.setItem("FileOperations_Copy_Move_Type_" + Record_Use_User_Rand, Type);
            localStorage.setItem("FileOperations_Copy_Move_JsonData_" + Record_Use_User_Rand, JsonData);
            localStorage.setItem("FileOperations_Copy_Move_ListCount_Length_" + Record_Use_User_Rand, ListCount_Length);

            if (Type == 1) {
                mdui.snackbar({
                    position: "top",
                    message: "已复制到剪切板",
                });
            } else {
                mdui.snackbar({
                    position: "top",
                    message: "已复制到剪切板(粘贴后自动删除原文件)",
                });
            }

            return;
        }
    } else if (Type == 23) {
        var Record_Use_User_Rand = localStorage.getItem("Record_Use_User_Rand");
        Type = localStorage.getItem("FileOperations_Copy_Move_Type_" + Record_Use_User_Rand);
        var JsonData = localStorage.getItem("FileOperations_Copy_Move_JsonData_" + Record_Use_User_Rand);
        ListCount_Length = localStorage.getItem("FileOperations_Copy_Move_ListCount_Length_" + Record_Use_User_Rand);
        var ID = localStorage.getItem("FileFolderID_" + Record_Use_User_Rand);
        if (ID == null) {
            ID = "";
        }
        JsonData = JsonData.replace("@ID#", ID);

        if (Type == 1) {
            var TypeInfo = "复制";
        } else if (Type == 2) {
            var TypeInfo = "移动";
        }

        LoadIng(true, "正在" + TypeInfo + ListCount_Length + "个文件", 220);

        localStorage.removeItem("FileOperations_Copy_Move_Type_" + Record_Use_User_Rand);
        localStorage.removeItem("FileOperations_Copy_Move_JsonData_" + Record_Use_User_Rand);
        localStorage.removeItem("FileOperations_Copy_Move_ListCount_Length_" + Record_Use_User_Rand);
    } else if (Type == 3) {
        var ID = localStorage.getItem("FileOperations_RecycleBin_Recover");
        JsonData = '{"ids":["' + ID + '"]}';
        localStorage.removeItem("FileOperations_RecycleBin_Recover");
    } else if (Type == 4) {
        var ID = localStorage.getItem("FileOperations_RecycleBin_Delete");
        JsonData = '{"ids":["' + ID + '"]}';
        localStorage.removeItem("FileOperations_RecycleBin_Delete");
    } else if (Type == 5) {
        JsonData = "{}";
    }

    if (Type == 0 || Type == 1 || Type == 2 || Type == 3 || Type == 4 || Type == 5) {
        var AccessToken = GetUserStorageAccessToken();
        var url = "./FileOperations.php";
        var data = "AccessToken=" + encodeURIComponent(AccessToken) + "&Type=" + Type + "&JsonData=" + encodeURIComponent(JsonData);

        $.ajax({
            type: "post",
            dataType: "json",
            url: url,
            data: data,
            error: function () {
                LoadIng(false);

                Swal.fire({
                    icon: "error",
                    title: "网络异常",
                    text: "请求失败",
                    confirmButtonText: "关闭",
                });
            },
            success: function (Result) {
                LoadIng(false);

                var Status = Result.Status;
                if (Status == 0) {
                    if (Type == 3) {
                        Swal.fire({
                            icon: "success",
                            title: TypeInfo + "文件成功(因为PikPakAPI原因恢复等文件会保存的云盘根目录不会恢复的删除原目录)",
                            confirmButtonText: "重新获取文件",
                            denyButtonText: "打开恢复文件目录",
                            showDenyButton: true,
                        }).then(function (Result) {
                            if (Result.isConfirmed) {
                                List_RecycleBin();
                            } else {
                                AllOpenFolder();
                            }
                        });
                    } else {
                        Swal.fire({
                            icon: "success",
                            title: TypeInfo + "文件成功",
                            confirmButtonText: "重新获取文件",
                        }).then(function () {
                            if (Type == 0 || Type == 1 || Type == 2) {
                                List();
                            } else if (Type == 3 || Type == 4 || Type == 5) {
                                List_RecycleBin();
                            }

                            if (Type == 1 || Type == 4 || Type == 5) {
                                GetUserQuota();
                            }
                        });
                    }
                } else if (Status == 48) {
                    Swal.fire({
                        icon: "error",
                        title: "AccessToken验证失败",
                        text: "错误或过期(2小时有效)",
                        confirmButtonText: "重新获取AccessToken",
                        denyButtonText: "关闭",
                        showDenyButton: true,
                    }).then(function (Result) {
                        if (Result.isConfirmed) {
                            window.location.reload();
                        }
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: TypeInfo + "文件失败",
                        confirmButtonText: "关闭",
                    });
                }
            },
        });
    }
}

function FileOperations_Delete(Type) {
    return new Promise(function (TerminateReturn) {
        if (Type == 0 || Type == 10) {
            var Title = "是否确定删除文件";
            var Text = "文件可在回收站找到";
        } else if (Type == 4) {
            var Title = "是否确定彻底删除文件";
            var Text = "删除文件永不可恢复";
        } else if (Type == 5) {
            var Title = "是否确定清空回收站";
            var Text = "删除文件永不可恢复";
        }

        Swal.fire({
            icon: "warning",
            title: Title,
            text: Text,
            confirmButtonText: "删除",
            denyButtonText: "关闭",
            showDenyButton: true,
        }).then(function (Result) {
            if (Result.isConfirmed) {
                TerminateReturn(true);
            } else {
                TerminateReturn(false);
            }
        });
    });
}

function IfFile() {
    var ListCount_Length = document.getElementsByClassName("mdui-table-row-selected").length;
    for (var i = 0; i < ListCount_Length; i++) {
        var HTMLCode = document.getElementsByClassName("mdui-table-row-selected")[i].id;
        var NumberID = HTMLCode.replace("List_", "");
        var List_Type = document.getElementById("List_Type_" + NumberID).getAttribute("class");
        if (List_Type == "drive#folder") {
            return false;
        }
    }

    return true;
}

function GetSignature() {
    var ListCount_Length = document.getElementsByClassName("mdui-table-row-selected").length;
    LoadIng(true, "正在生成特征码" + ListCount_Length + "个文件", 260);

    var Signature = "";
    for (var i = 0; i < ListCount_Length; i++) {
        var HTMLCode = document.getElementsByClassName("mdui-table-row-selected")[i].id;
        var NumberID = HTMLCode.replace("List_", "");
        Signature += document.getElementById("List_Signature_" + NumberID).getAttribute("class") + "\r";
    }

    LoadIng(false);

    Swal.fire({
        icon: "success",
        title: "生成成功",
        text: Signature,
        confirmButtonText: "复制特征码",
        denyButtonText: "关闭",
        showDenyButton: true,
    }).then(function (Result) {
        if (Result.isConfirmed) {
            DocumentCopyText(Signature);
        }
    });
}

async function DownLoad(Type) {
    if (Type == 0) {
        LoadIng(true, "正在扫描文件", 220);

        document.getElementById("DivVar_AddDownLoadCount").innerText = 0;

        for (var i = 0; i < document.getElementsByClassName("mdui-table-row-selected").length; i++) {
            var HTMLCode = document.getElementsByClassName("mdui-table-row-selected")[i].id;
            var NumberID = HTMLCode.replace("List_", "");
            var Name = document.getElementById("List_Name_" + NumberID).innerText;
            var ID = document.getElementById("List_ID_" + NumberID).getAttribute("class");
            var Type = document.getElementById("List_Type_" + NumberID).getAttribute("class");

            if (Type == "drive#folder") {
                LoadIng(true, "正在扫描文件夹", 220);
                await ScanningFolder(ID);
                LoadIng(false);
            } else {
                var Size = document.getElementById("List_Size_" + NumberID).getAttribute("class");
                var Hash = document.getElementById("List_Hash_" + NumberID).getAttribute("class");

                var DownLoadData_Array = {};
                DownLoadData_Array["Rand"] = localStorage.getItem("Record_Use_User_Rand");
                DownLoadData_Array["ID"] = ID;
                DownLoadData_Array["Name"] = Name;
                DownLoadData_Array["Size"] = Size;
                DownLoadData_Array["Hash"] = Hash;
                DownLoadData_Array["Time"] = Date.now() / 1000;
                DownLoadData_Array["Picture"] = document.getElementById("List_Image_Hash_" + Hash).src;

                var DownLoadData = JSON.stringify(DownLoadData_Array);
                localStorage.setItem("DownLoadData_" + Hash, DownLoadData);

                document.getElementById("DivVar_AddDownLoadCount").innerText++;
            }
        }

        LoadIng(false);

        Swal.fire({
            icon: "info",
            title: "已加入到下载管理列表",
            text: document.getElementById("DivVar_AddDownLoadCount").innerText + "个文件",
            confirmButtonText: "前往下载管理列表",
            denyButtonText: "关闭",
            showDenyButton: true,
        }).then(function (Result) {
            if (Result.isConfirmed) {
                List_DownLoad(false);
            }
        });
    } else if (Type == 1 || Type == 2) {
        var LoadIngInfoText = "播放";
    } else if (Type == 3) {
        var LoadIngInfoText = "预览";
    }

    if (Type == 1 || Type == 2 || Type == 3) {
        LoadIng(true, "正在生成" + LoadIngInfoText + "地址", 220);

        var AccessToken = GetUserStorageAccessToken();
        var ID = localStorage.getItem("Record_List_Use_FileID");
        var url = "./DownLoad.php";
        var data = "AccessToken=" + encodeURIComponent(AccessToken) + "&ID=" + ID;

        $.ajax({
            type: "post",
            dataType: "json",
            url: url,
            data: data,
            error: function () {
                LoadIng(false);

                Swal.fire({
                    icon: "error",
                    title: "网络异常",
                    text: "请求失败",
                    confirmButtonText: "重新生成" + LoadIngInfoText + "地址",
                    denyButtonText: "关闭",
                    showDenyButton: true,
                }).then(function (Result) {
                    if (Result.isConfirmed) {
                        DownLoad(Type);
                    }
                });
            },
            success: async function (Result) {
                var Status = Result.Status;
                if (Status == 0) {
                    var Link = Result.Link;
                    var Name = Result.Name;
                    var Hash = Result.Hash;
                    var Size = Result.Size;

                    if (Type == 0) {
                        LoadIng(false);

                        var Picture = document.getElementById("List_Image_Hash_" + Hash).src;
                        TriggerDownLoad(Name, Size, Link, Picture);
                    } else if (Type == 1 || Type == 2) {
                        LoadIng(false);

                        Swal.fire({
                            title: "请选择播放引擎",
                            input: "select",
                            confirmButtonText: "开始播放",
                            inputOptions: {
                                "A-0": "PotPlayer",
                                "A-1": "VLC",
                                "A-2": "IINA",
                                "A-3": "nPlayer",
                                "A-4": "MXPlayer",
                                "A-5": "QQ影音",
                                "A-6": "在线播放",
                            },
                            inputValidator: (value) => {
                                if (value == "A-0") {
                                    window.open("potplayer://" + Link);
                                } else if (value == "A-1") {
                                    window.open("vlc://" + Link);
                                } else if (value == "A-2") {
                                    window.open("iina://weblink?url=" + Link);
                                } else if (value == "A-3") {
                                    window.open("nplayer-" + Link);
                                } else if (value == "A-4") {
                                    window.open("intent:" + Link);
                                } else if (value == "A-5") {
                                    window.open("QQPlayer://" + Link);
                                } else if (value == "A-6") {
                                    if (Type == 1) {
                                        Video(Link);
                                    } else if (Type == 2) {
                                        PlayMusic(Name, Link);
                                    }
                                }
                            },
                        });
                    } else if (Type == 3) {
                        if (Size >= 134217728) {
                            Swal.fire({
                                icon: "warning",
                                title: "超出预览限制",
                                text: "图片大于128M无法预览",
                                confirmButtonText: "下载图片",
                                denyButtonText: "关闭",
                                showDenyButton: true,
                            }).then(function (Result) {
                                if (Result.isConfirmed) {
                                    DownLoad(0);
                                }
                            });
                        } else {
                            LoadIng(true, "正在获取图片", 220);

                            await CacheImage(Link);

                            Swal.fire({
                                imageUrl: Link,
                                confirmButtonText: "关闭",
                            });
                        }

                        LoadIng(false);
                    }
                } else {
                    LoadIng(false);

                    if (Status == 48) {
                        Swal.fire({
                            icon: "error",
                            title: "AccessToken验证失败",
                            text: "错误或过期(2小时有效)",
                            confirmButtonText: "重新获取AccessToken",
                            denyButtonText: "关闭",
                            showDenyButton: true,
                        }).then(function (Result) {
                            if (Result.isConfirmed) {
                                window.location.reload();
                            }
                        });
                    } else if (Status == 16) {
                        Swal.fire({
                            icon: "error",
                            title: "无法生成下载地址",
                            text: "请检查文件是否正常",
                            confirmButtonText: "重新生成" + LoadIngInfoText + "地址",
                            denyButtonText: "关闭",
                            showDenyButton: true,
                        }).then(function (Result) {
                            if (Result.isConfirmed) {
                                DownLoad(Type);
                            }
                        });
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "未知错误",
                            text: "请检查文件是否正常",
                            confirmButtonText: "重新生成" + LoadIngInfoText + "地址",
                            denyButtonText: "关闭",
                            showDenyButton: true,
                        }).then(function (Result) {
                            if (Result.isConfirmed) {
                                DownLoad(Type);
                            }
                        });
                    }
                }
            },
        });
    }
}

function TriggerDownLoad(Name, Size, Link, Picture) {
    document.getElementById("DivVar_DownLoadName").innerText = Name;
    document.getElementById("DivVar_DownLoadLink").innerText = Link;

    DivVar_DownLoadChoose = new mdui.Dialog("#DownLoadChoose");
    DivVar_DownLoadChoose.open();

    new mdui.Tab("#DownLoadChooseTap").show("DownLoad-Tab-DownLoad");

    SetDownLoadChooseWidth();

    var Aria2Link = localStorage.getItem("Aria2Link");
    var Aria2Token = localStorage.getItem("Aria2Token");

    if (Aria2Link == null || Aria2Link == "") {
        Aria2Link = "ws://127.0.0.1:6800/jsonrpc";
    }

    if (Aria2Token == null) {
        Aria2Token = "";
    }

    document.getElementById("Aria2Link").value = Aria2Link;
    document.getElementById("Aria2Token").value = Aria2Token;

    document.getElementById("DownLoadChoose_DownLoad_Image").src = Picture;
    document.getElementById("DownLoadChoose_IDM_Image").src = Picture;
    document.getElementById("DownLoadChoose_Aria2_Image").src = Picture;
    document.getElementById("DownLoadChoose_XunLei_Image").src = Picture;

    document.getElementById("DownLoadChoose_DownLoad_DLink").value = Link;
    document.getElementById("DownLoadChoose_IDM_DLink").value = GetIDMEF2Link(Name, Link);
    document.getElementById("DownLoadChoose_XunLei_DLink").value = "thunder://" + new Base64().encode(encodeURIComponent("AA" + Link + "ZZ"));

    Name += "(" + SizeFormat(Size) + ")";
    document.getElementById("DownLoadChoose_DownLoad_Name").innerText = Name;
    document.getElementById("DownLoadChoose_IDM_Name").innerText = Name;
    document.getElementById("DownLoadChoose_Aria2_Name").innerText = Name;
    document.getElementById("DownLoadChoose_XunLei_Name").innerText = Name;
}

function ChangeOfDownloadAddress(ServerID) {
    if (document.getElementById("ChangeOfDownloadAddressServerID").innerText != ServerID) {
        var OfficialLink = document.getElementById("DivVar_DownLoadLink").innerText;
        if (ServerID == "Official") {
            var DownLoadLink = OfficialLink;
        } else if (ServerID == "CDN") {
            var Host = OfficialLink.substring(8, OfficialLink.indexOf("/download/?fid="));
            var DownLoadLink = OfficialLink.replace(Host, "pikpak-file-download.b-cdn.net");
        } else if (ServerID == "OfficialIP") {
            var Host = OfficialLink.substring(8, OfficialLink.indexOf("/download/?fid="));
            var url = "https://dns.alidns.com/resolve?name=" + Host;

            var Style = document.getElementById("DownLoadChoose").getAttribute("style");
            document.getElementById("DownLoadChoose").setAttribute("style", "display:none");

            LoadIng(true, "正在获取下载服务器IP地址", 260);

            $.ajax({
                type: "get",
                dataType: "json",
                url: url,
                error: function () {
                    LoadIng(false);

                    Swal.fire({
                        icon: "error",
                        title: "网络异常",
                        text: "请求失败",
                        confirmButtonText: "重新获取下载服务器IP地址",
                        denyButtonText: "关闭",
                        showDenyButton: true,
                    }).then(function (Result) {
                        if (Result.isConfirmed) {
                            ChangeOfDownloadAddress(ServerID);
                        }
                    });
                },
                success: function (Result) {
                    LoadIng(false);

                    var IP = Result.Answer[0].data;
                    if (IP == "") {
                        Swal.fire({
                            icon: "error",
                            title: "获取下载服务器IP地址失败",
                            confirmButtonText: "重新获取下载服务器IP地址",
                            denyButtonText: "关闭",
                            showDenyButton: true,
                        }).then(function (Result) {
                            if (Result.isConfirmed) {
                                ChangeOfDownloadAddress(ServerID);
                            } else {
                                document.getElementById("DownLoadChoose").setAttribute("style", Style);
                                SetDownLoadChooseWidth();
                            }
                        });
                    } else {
                        document.getElementById("DownLoadChoose").setAttribute("style", Style);
                        SetDownLoadChooseWidth();

                        var DownLoadLink = OfficialLink.replace(Host, IP);
                        document.getElementById("DownLoadChoose_DownLoad_DLink").value = DownLoadLink;
                        document.getElementById("DownLoadChoose_IDM_DLink").value = GetIDMEF2Link(document.getElementById("DownLoadChoose_DownLoad_Name").innerText, DownLoadLink);
                        document.getElementById("DownLoadChoose_XunLei_DLink").value = "thunder://" + new Base64().encode(encodeURIComponent("AA" + DownLoadLink + "ZZ"));
                        document.getElementById("ChangeOfDownloadAddressServerID").innerText = ServerID;
                    }
                },
            });
        }

        if (ServerID != "OfficialIP") {
            document.getElementById("DownLoadChoose_DownLoad_DLink").value = DownLoadLink;
            document.getElementById("DownLoadChoose_IDM_DLink").value = GetIDMEF2Link(document.getElementById("DownLoadChoose_DownLoad_Name").innerText, DownLoadLink);
            document.getElementById("DownLoadChoose_XunLei_DLink").value = "thunder://" + new Base64().encode(encodeURIComponent("AA" + DownLoadLink + "ZZ"));
            document.getElementById("ChangeOfDownloadAddressServerID").innerText = ServerID;
        }
    }
}

function SetDownLoadChooseWidth(Width) {
    if (Width == "" || Width == null) {
        Width = document.getElementById("DivVar_DownLoadChooseWidth").innerText;
        if (Width == "" || Width == null) {
            SetDownLoadChooseWidth(370);
        }
    } else {
        document.getElementById("DivVar_DownLoadChooseWidth").innerText = Width;
    }

    var Style = document.getElementById("DownLoadChoose").getAttribute("style");
    Style = "display:block;top:" + Style.substring(Style.indexOf("top:") + 4, Style.indexOf("px;")) + "px;height:" + Width + "px";
    document.getElementById("DownLoadChoose").setAttribute("style", Style);

    setTimeout(function () {
        if (window.location.href.indexOf("#mdui-dialog") != -1) {
            SetDownLoadChooseWidth();
        }
    }, 10);
}

function GetIDMEF2Link(Name, Link) {
    var EF2Data = '-u "' + Link + '" -s "' + Name + '"';
    var Base64Data = new Base64().encode(EF2Data);
    var EF2Link = "ef2://" + Base64Data;
    return EF2Link;
}

function AddOffline() {
    return new Promise(function (TerminateReturn) {
        AddOfflineMDUIProMpt = mdui.prompt(
            "请输入下载链接(支持HTTP(S)/FTP/BT/ED2K)",
            "添加离线下载任务",
            function () {},
            function () {},
            { type: "textarea" }
        );

        document.getElementsByClassName("mdui-dialog-actions")[document.getElementsByClassName("mdui-dialog-actions").length - 1].innerHTML = '<a href="javascript:UPLoadTorrent()" class="mdui-btn">上传种子文件(Torrent)</a><a href="javascript:AddOfflineLink()" class="mdui-btn">提交</a><a href="javascript:AddOfflineMDUIProMpt.close()" class="mdui-btn">关闭</a>';

        SetMDUIDiaLogWidth(680);

        TerminateReturn();
    });
}

function AddOfflineLink() {
    AddOfflineMDUIProMpt.close();
    var LinkData = document.getElementsByClassName("mdui-textfield-input")[document.getElementsByClassName("mdui-textfield-input").length - 1].value;
    if (LinkData == "" || LinkData == null) {
        Swal.fire({
            icon: "warning",
            title: "请输入下载链接",
            text: "支持HTTP(S)/FTP/BT/ED2K",
            confirmButtonText: "重新添加",
            denyButtonText: "关闭",
            showDenyButton: true,
        }).then(function (Result) {
            if (Result.isConfirmed) {
                AddOffline();
            }
        });
    } else {
        LoadIng(true, "正在添加离线下载任务", 220);

        var Record_Use_User_Rand = localStorage.getItem("Record_Use_User_Rand");
        var ID = localStorage.getItem("FileFolderID_" + Record_Use_User_Rand);
        if (ID == null) {
            ID = "";
        }
        var AccessToken = GetUserStorageAccessToken(Record_Use_User_Rand);

        var LinkArray = LinkData.split("\n");
        var Count = LinkArray.length;

        for (var i = 0; i < Count; i++) {
            Link = LinkArray[i];
            if (Link != "") {
                var Base64_OfflineLink = new Base64().encode(encodeURIComponent(Link));

                var url = "./AddOffline.php?Base64_OfflineLink=" + Base64_OfflineLink;
                var data = "AccessToken=" + encodeURIComponent(AccessToken) + "&Base64_OfflineLink=" + Base64_OfflineLink + "&ID=" + ID;

                $.ajax({
                    type: "post",
                    dataType: "json",
                    url: url,
                    data: data,
                    error: function () {
                        LoadIng(false);

                        Swal.fire({
                            icon: "error",
                            title: "网络异常",
                            text: "请求失败",
                            confirmButtonText: "重新添加",
                            denyButtonText: "关闭",
                            showDenyButton: true,
                        }).then(function (Result) {
                            if (Result.isConfirmed) {
                                AddOffline();
                            }
                        });
                    },
                    success: function (Result) {
                        LoadIng(false);

                        var Status = Result.Status;
                        var Message = Result.Message;

                        if (Status == 0) {
                            Swal.fire({
                                icon: "success",
                                title: "添加离线下载任务成功",
                                text: "可右键账号列表查看离线任务",
                                confirmButtonText: "继续添加离线下载任务",
                                denyButtonText: "关闭",
                                showDenyButton: true,
                            }).then(function (Result) {
                                if (Result.isConfirmed) {
                                    AddOffline();
                                }
                            });
                        } else {
                            if (Status == 48) {
                                Swal.fire({
                                    icon: "error",
                                    title: "AccessToken验证失败",
                                    text: "错误或过期(2小时有效)",
                                    confirmButtonText: "重新获取AccessToken",
                                    denyButtonText: "关闭",
                                    showDenyButton: true,
                                }).then(function (Result) {
                                    if (Result.isConfirmed) {
                                        window.location.reload();
                                    }
                                });
                            } else {
                                Swal.fire({
                                    icon: "error",
                                    title: "添加离线下载任务失败",
                                    text: Message,
                                    confirmButtonText: "重新添加",
                                    denyButtonText: "关闭",
                                    showDenyButton: true,
                                }).then(function (Result) {
                                    if (Result.isConfirmed) {
                                        AddOffline();
                                    }
                                });
                            }
                        }
                    },
                });
            }
        }
    }
}

function UPLoadTorrent() {
    var UPLoadTorrent_Input_Document = document.getElementById("UPLoadTorrent_Input");
    UPLoadTorrent_Input_Document.click();
    UPLoadTorrent_Input_Document.addEventListener("change", function () {
        if (document.getElementById("UPLoadTorrent_Input").files[0].name == "") {
            UPLoadTorrent_Input_Document.outerHTML = UPLoadTorrent_Input_Document.outerHTML;
        } else {
            if (typeof AddOfflineMDUIProMpt != "undefined") {
                AddOfflineMDUIProMpt.close();
            }

            LoadIng(true, "正在解析种子文件(Torrent)", 300);

            var Data = new FormData();
            Data.append("FileTorrent", document.getElementById("UPLoadTorrent_Input").files[0]);

            $.ajax({
                dataType: "json",
                type: "POST",
                url: "./Torrent/FetFileTorrentHash.php",
                data: Data,
                cache: false,
                processData: false,
                contentType: false,
                error: function () {
                    UPLoadTorrent_Input_Document.outerHTML = UPLoadTorrent_Input_Document.outerHTML;
                    LoadIng(false);

                    Swal.fire({
                        icon: "error",
                        title: "网络异常",
                        text: "请求失败",
                        confirmButtonText: "重新解析种子(Torrent)",
                        denyButtonText: "关闭",
                        showDenyButton: true,
                    }).then(function (Result) {
                        if (Result.isConfirmed) {
                            UPLoadTorrent();
                        }
                    });
                },
                success: async function (Result) {
                    UPLoadTorrent_Input_Document.outerHTML = UPLoadTorrent_Input_Document.outerHTML;
                    LoadIng(false);

                    if (Result.Status == 0) {
                        Hash = Result.Hash;

                        mdui.snackbar({
                            position: "top",
                            message: "解析种子(Torrent)链接(Hash)成功",
                        });

                        await AddOffline();

                        var MagNet = "magnet:?xt=urn:btih:" + Hash;
                        document.getElementsByClassName("mdui-textfield-input")[document.getElementsByClassName("mdui-textfield-input").length - 1].value = MagNet;
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "解析种子(Torrent)失败",
                            text: "请检查种子(Torrent)是否正常",
                            confirmButtonText: "重新解析",
                            denyButtonText: "关闭",
                            showDenyButton: true,
                        }).then(function (Result) {
                            if (Result.isConfirmed) {
                                UPLoadTorrent();
                            }
                        });
                    }
                },
            });
        }
    });
}

function List_RecycleBin(PageToken = "") {
    LoadIng(true, "正在获取回收站文件", 220);
    document.getElementById("WebTitle").innerText = "PikPak | 回收站";

    var AccessToken = GetUserStorageAccessToken();
    var url = "./List_RecycleBin.php";
    var data = "AccessToken=" + encodeURIComponent(AccessToken) + "&Token=" + encodeURIComponent(PageToken);
    var List_Folder = 0;
    var List_File = 0;

    $.ajax({
        type: "post",
        dataType: "json",
        url: url,
        data: data,
        error: function () {
            LoadIng(false);

            Swal.fire({
                icon: "error",
                title: "网络异常",
                confirmButtonText: "重新获取回收站文件",
                denyButtonText: "关闭",
                showDenyButton: true,
            }).then(function (Result) {
                if (Result.isConfirmed) {
                    List_RecycleBin(PageToken);
                }
            });
        },
        success: function (Result) {
            document.getElementById("ListThead").innerHTML = "<th style='height:60px'>文件</th><th>文件大小</th><th id='ListTime'>删除时间</th><th>操作</th>";

            var kind = Result.kind;
            if (kind == "drive#fileList") {
                if (PageToken == "" || PageToken == null) {
                    var ListData = "";
                    var ListDataCount = 0;

                    document.getElementById("DoubleClickToLoadMoreFiles_Text_Length").innerText = 0;
                } else {
                    var ListData = document.getElementById("List").innerHTML;
                    ListData = ListData.substring(0, ListData.length - document.getElementById("DoubleClickToLoadMoreFiles_Text_Length").innerText);

                    var ListDataCount = CountSubStrings(ListData, "List_RecycleBin_Type_");
                }

                PageToken = Result.next_page_token;
                FileCount = Result.files.length;

                for (var i = 0; i < FileCount; i++) {
                    var Name = Result.files[i].name;
                    var Size = Result.files[i].size;
                    var Time = Result.files[i].modified_time;
                    var ID = Result.files[i].id;
                    var Type = Result.files[i].kind;
                    var ICon_Link = Result.files[i].icon_link;

                    Time = Time.replace("T", " ");
                    Time = Time.replace("+08:00", "");

                    if (Type == "drive#folder") {
                        List_Folder++;
                        var Info_Size = "---:---:---";
                    } else {
                        List_File++;
                        var Info_Size = SizeFormat(Size);
                    }

                    var List_Count_i = i + ListDataCount;
                    var Button = '<button class="mdui-btn mdui-btn-icon" onclick="localStorage.setItem(' + "'FileOperations_RecycleBin_Recover','" + ID + "'" + ');FileOperations(3)"><i class="mdui-icon material-icons">settings_backup_restore</i></button><button class="mdui-btn mdui-btn-icon" onclick="localStorage.setItem(' + "'FileOperations_RecycleBin_Delete','" + ID + "'" + ');FileOperations(4)"><i class="mdui-icon material-icons">delete</i></button>';

                    ListData += "<tr id='List_RecycleBin_" + List_Count_i + "'><td><lua class='ProhibitChoose'><img class='mdui-icon' src='" + ICon_Link + "' style='width:40px;height:40px'></img></lua><a class='mdui-list-item-content' style='margin-left:12px'>" + Name + "</a></td><td>" + Info_Size + "</td><td>" + Time + "</td><td>" + Button + "</td></tr><div id='List_RecycleBin_Type_" + List_Count_i + "'class='" + Type + "'>";
                }

                if (PageToken != "" && PageToken != null) {
                    var DoubleClickToLoadMoreFiles_TR = "<tr style='height:64px' ondblclick='List_RecycleBin(&quot;" + PageToken + "&quot;)'><th>双击获取更多文件</th><th>双击获取更多文件</th><th>双击获取更多文件</th><th>双击获取更多文件</th></tr>";
                    var DoubleClickToLoadMoreFiles_Text_Length = DoubleClickToLoadMoreFiles_TR.length;

                    ListData += DoubleClickToLoadMoreFiles_TR;
                } else {
                    var DoubleClickToLoadMoreFiles_Text_Length = 0;
                }

                document.getElementById("DoubleClickToLoadMoreFiles_Text_Length").innerText = DoubleClickToLoadMoreFiles_Text_Length;

                document.getElementById("List").innerHTML = ListData;

                if (List_Count_i > 49) {
                    List_Folder = CountSubStrings(ListData, "drive#folder");
                    List_File = CountSubStrings(ListData, "drive#file");
                }

                document.getElementById("FileInfo").innerText = List_Folder + List_File + "个文件类型 | " + List_Folder + "个文件夹 | " + List_File + "个文件";

                LoadIng(false);
            } else {
                LoadIng(false);

                if (Result.error_code == 16) {
                    Swal.fire({
                        icon: "error",
                        title: "AccessToken验证失败",
                        text: "错误或过期(2小时有效)",
                        confirmButtonText: "重新获取AccessToken",
                        denyButtonText: "关闭",
                        showDenyButton: true,
                    }).then(function (Result) {
                        if (Result.isConfirmed) {
                            window.location.reload();
                        }
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "获取回收站文件失败",
                        confirmButtonText: "重新获取回收站文件",
                        denyButtonText: "关闭",
                        showDenyButton: true,
                    }).then(function (Result) {
                        if (Result.isConfirmed) {
                            List_RecycleBin(PageToken);
                        }
                    });
                }
            }

            var HTMLCode = "<button class='mdui-btn mdui-color-blue-accent mdui-ripple' onclick='List()'><i class='mdui-list-item-icon mdui-icon material-icons'>arrow_back</i> 返回文件列表</button><button class='mdui-btn mdui-color-red-400 mdui-float-right mdui-ripple' onclick='FileOperations(5)'><i class='mdui-list-item-icon mdui-icon material-icons'>delete</i> 清空回收站</button>";
            document.getElementById("Path").innerHTML = HTMLCode;
        },
    });
}

function ListRefresh() {
    if (document.getElementById("ListTime").innerText == "创建时间") {
        List();
    } else {
        List_RecycleBin();
    }
}

function SetRecycleBinNumberID(NumberID) {
    if (NumberID == null) {
        NumberID = "";
    }
    localStorage.setItem("Record_RecycleBin_NumberID", NumberID);
}

function AddFileSignature() {
    mdui.prompt(
        "请输入特征码(PikPak://文件名|文件大小|文件Hash)",
        "特征码导入文件",
        function () {},
        async function (SignatureData_Value) {
            if (SignatureData_Value == "" || SignatureData_Value == null) {
                Swal.fire({
                    icon: "warning",
                    title: "请输入特征码",
                    text: "PikPak://文件名|文件大小|文件Hash",
                    confirmButtonText: "重新输入",
                    denyButtonText: "关闭",
                    showDenyButton: true,
                }).then(function (Result) {
                    if (Result.isConfirmed) {
                        AddFileSignature();
                    }
                });
            } else {
                LoadIng(true, "正在使用特征码导入文件", 240);

                var SignatureDataArraay = SignatureData_Value.split("PikPak://").join("").split("|");
                var Name = SignatureDataArraay[0];
                var Size = SignatureDataArraay[1];
                var Hash = SignatureDataArraay[2];

                if (SignatureDataArraay.length == 3) {
                    Name = Name.replace(/[\r\n]/g, "");
                    Hash = Hash.replace(/[\r\n]/g, "");

                    if (Name != "" && Name != null && Size != "" && Size != null && Hash != "" && Hash != null && Hash.length == 40) {
                        var Record_Use_User_Rand = localStorage.getItem("Record_Use_User_Rand");
                        var ID = localStorage.getItem("FileFolderID_" + Record_Use_User_Rand);
                        if (ID == null) {
                            ID = "";
                        }
                        var AccessToken = GetUserStorageAccessToken(Record_Use_User_Rand);
                        var url = "./AddFileSignature.php";
                        var data = "AccessToken=" + encodeURIComponent(AccessToken) + "&Name=" + encodeURIComponent(Name) + "&Size=" + Size + "&Hash=" + Hash + "&ID=" + ID;

                        $.ajax({
                            type: "post",
                            dataType: "json",
                            url: url,
                            data: data,
                            error: function () {
                                LoadIng(false);

                                Swal.fire({
                                    icon: "error",
                                    title: "网络异常",
                                    text: "请求失败",
                                    confirmButtonText: "重新导入文件",
                                    denyButtonText: "关闭",
                                    showDenyButton: true,
                                }).then(function (Result) {
                                    if (Result.isConfirmed) {
                                        AddFileSignature();
                                    }
                                });
                            },
                            success: function (Result) {
                                LoadIng(false);

                                var Status = Result.Status;
                                var Message = Result.Message;

                                if (Status == 0) {
                                    Swal.fire({
                                        icon: "success",
                                        title: "特征码导入文件成功",
                                        confirmButtonText: "重新获取文件",
                                    }).then(function () {
                                        List();
                                    });
                                } else if (Status == 48) {
                                    Swal.fire({
                                        icon: "error",
                                        title: "AccessToken验证失败",
                                        text: "错误或过期(2小时有效)",
                                        confirmButtonText: "重新获取AccessToken",
                                        denyButtonText: "关闭",
                                        showDenyButton: true,
                                    }).then(function (Result) {
                                        if (Result.isConfirmed) {
                                            window.location.reload();
                                        }
                                    });
                                } else {
                                    Swal.fire({
                                        icon: "error",
                                        title: "特征码导入文件失败",
                                        text: Message,
                                        confirmButtonText: "重新导入文件",
                                        denyButtonText: "关闭",
                                        showDenyButton: true,
                                    }).then(function (Result) {
                                        if (Result.isConfirmed) {
                                            AddFileSignature();
                                        }
                                    });
                                }
                            },
                        });
                    }
                } else {
                    SignatureData_Array = SignatureData_Value.split("\n").join("").split("PikPak://");
                    var Count = SignatureData_Array.length - 1;
                    for (i = 1; i < Count + 1; i++) {
                        var SignatureData_Array_I = SignatureData_Array[i].split("|");
                        var Name = SignatureData_Array_I[0];
                        var Size = SignatureData_Array_I[1];
                        var Hash = SignatureData_Array_I[2];

                        if (Name != "" && Name != null && Size != "" && Size != null && Hash != "" && Hash != null && Hash.length == 40) {
                            var Record_Use_User_Rand = localStorage.getItem("Record_Use_User_Rand");
                            var ID = localStorage.getItem("FileFolderID_" + Record_Use_User_Rand);
                            if (ID == null) {
                                ID = "";
                            }
                            var AccessToken = GetUserStorageAccessToken(Record_Use_User_Rand);
                            var data = "AccessToken=" + encodeURIComponent(AccessToken) + "&Name=" + encodeURIComponent(Name) + "&Size=" + Size + "&Hash=" + Hash + "&ID=" + ID;

                            await AddFileSignature_Batch(data, i, Count);
                        }
                    }

                    LoadIng(false);
                    List();
                }
            }
        },
        {
            type: "textarea",
        }
    );

    DoubleNamingHeavyNaming("提交", "关闭");
    SetMDUIDiaLogWidth(680);
}

function AddFileSignature_Batch(data, i, Count) {
    return new Promise(function (TerminateReturn) {
        $.ajax({
            type: "post",
            dataType: "json",
            url: "./AddFileSignature.php",
            data: data,
            error: function () {
                mdui.snackbar({
                    position: "top",
                    message: "[" + i + "/" + Count + "]网络异常 -请求失败",
                });

                TerminateReturn();
            },
            success: function (Result) {
                var Status = Result.Status;
                var Message = Result.Message;

                if (Status == 0) {
                    mdui.snackbar({
                        position: "top",
                        message: "[" + i + "/" + Count + "]特征码导入文件成功",
                    });

                    TerminateReturn();
                } else if (Status == 48) {
                    LoadIng(false);

                    Swal.fire({
                        icon: "error",
                        title: "AccessToken验证失败",
                        text: "错误或过期(2小时有效)",
                        confirmButtonText: "重新获取AccessToken",
                        denyButtonText: "关闭",
                        showDenyButton: true,
                    }).then(function (Result) {
                        if (Result.isConfirmed) {
                            window.location.reload();
                        }
                    });
                } else {
                    mdui.snackbar({
                        position: "top",
                        message: "[" + i + "/" + Count + "]特征码导入文件失败 - " + Message,
                    });

                    TerminateReturn();
                }
            },
        });
    });
}

function MemberCode() {
    mdui.prompt(
        "会员码领取会员",
        "请输入会员码",
        function () {},
        function (MemberCode) {
            if (MemberCode == "" || MemberCode == null) {
                Swal.fire({
                    icon: "warning",
                    title: "请输入会员码",
                    text: "会员码领取会员",
                    confirmButtonText: "重新输入会员码",
                    denyButtonText: "关闭",
                    showDenyButton: true,
                }).then(function (Result) {
                    if (Result.isConfirmed) {
                        MemberCode();
                    }
                });
            } else {
                LoadIng(true, "正在使用会员码领取会员", 240);

                var AccessToken = GetUserStorageAccessToken();
                var url = "./MemberCode.php";
                var data = "AccessToken=" + encodeURIComponent(AccessToken) + "&Code=" + MemberCode;

                $.ajax({
                    type: "post",
                    dataType: "json",
                    url: url,
                    data: data,
                    error: function () {
                        LoadIng(false);

                        Swal.fire({
                            icon: "error",
                            title: "网络异常",
                            text: "请求失败",
                            confirmButtonText: "重新输入会员码",
                            denyButtonText: "关闭",
                            showDenyButton: true,
                        }).then(function (Result) {
                            if (Result.isConfirmed) {
                                MemberCode();
                            }
                        });
                    },
                    success: function (Result) {
                        LoadIng(false);

                        var Status = Result.Status;
                        var Message = Result.Message;
                        if (Status == 0) {
                            Swal.fire({
                                icon: "success",
                                title: "会员码领取会员成功",
                                text: "可能会延迟到账",
                                confirmButtonText: "重新获取账号信息",
                            }).then(function () {
                                window.location.reload();
                            });
                        } else if (Status == 48) {
                            Swal.fire({
                                icon: "error",
                                title: "AccessToken验证失败",
                                text: "错误或过期(2小时有效)",
                                confirmButtonText: "重新获取AccessToken",
                                denyButtonText: "关闭",
                                showDenyButton: true,
                            }).then(function (Result) {
                                if (Result.isConfirmed) {
                                    window.location.reload();
                                }
                            });
                        } else if (Status == 162) {
                            Swal.fire({
                                icon: "error",
                                title: "会员码无效",
                                text: "会员码无效或已过期",
                                confirmButtonText: "重新输入会员码",
                                denyButtonText: "关闭",
                                showDenyButton: true,
                            }).then(function (Result) {
                                if (Result.isConfirmed) {
                                    MemberCode();
                                }
                            });
                        } else if (Status == 163) {
                            Swal.fire({
                                icon: "error",
                                title: "无法重复使用",
                                text: "兑换码无法重复使用",
                                confirmButtonText: "重新输入会员码",
                                denyButtonText: "关闭",
                                showDenyButton: true,
                            }).then(function (Result) {
                                if (Result.isConfirmed) {
                                    MemberCode();
                                }
                            });
                        } else {
                            Swal.fire({
                                icon: "error",
                                title: "未知错误",
                                text: Message,
                                confirmButtonText: "重新输入会员码",
                                denyButtonText: "关闭",
                                showDenyButton: true,
                            }).then(function (Result) {
                                if (Result.isConfirmed) {
                                    MemberCode();
                                }
                            });
                        }
                    },
                });
            }
        }
    );

    DoubleNamingHeavyNaming("提交", "关闭");
    SetMDUIDiaLogWidth(380);
}

async function GetListOffline_Start() {
    LoadIng(true, "正在获取离线任务列表", 240);
    await GetListOffline();

    setTimeout(function () {
        StaticRefresh();
    }, 10000);
}

async function StaticRefresh() {
    await GetListOffline();
    setTimeout(function () {
        StaticRefresh();
    }, 10000);
}

function GetListOffline() {
    return new Promise(function (TerminateReturn) {
        var AccessToken = GetUserStorageAccessToken();
        var url = "./Lisst_Task.php";
        var data = "AccessToken=" + encodeURIComponent(AccessToken);

        $.ajax({
            type: "post",
            dataType: "json",
            url: url,
            data: data,
            error: function () {
                LoadIng(false);

                Swal.fire({
                    icon: "error",
                    title: "网络异常",
                    confirmButtonText: "重新获取离线任务",
                    denyButtonText: "关闭",
                    showDenyButton: true,
                }).then(function () {
                    GetListOffline_Start();
                    TerminateReturn();
                });
            },
            success: function (Result) {
                LoadIng(false);

                if (Result.error_code == 16) {
                    Swal.fire({
                        icon: "error",
                        title: "AccessToken验证失败",
                        text: "错误或过期(2小时有效)",
                        confirmButtonText: "重新获取AccessToken",
                        denyButtonText: "关闭",
                        showDenyButton: true,
                    }).then(function (Result) {
                        if (Result.isConfirmed) {
                            window.location.reload();
                        }
                    });
                } else {
                    var Count = Result.tasks.length;

                    if (Count != 0) {
                        var List = "";

                        for (var i = 0; i < Count; i++) {
                            var Name = Result.tasks[i].file_name;
                            var Size = Result.tasks[i].file_size;
                            var Progress = Result.tasks[i].progress;
                            var Message = Result.tasks[i].message;
                            var ID = Result.tasks[i].id;
                            var ICon_Link = Result.tasks[i].icon_link;

                            List += "<div class='mdui-p-t-1'><div class='mdui-col'><div class='mdui-card'><div class='mdui-card-content'><div class='mdui-card-menu'><button onclick='DeleteOffline(" + '"' + ID + '"' + ")' class='mdui-btn mdui-btn-icon'><i class='mdui-icon material-icons'>delete</i></button></div><lua class='ProhibitChoose'><img class='mdui-icon'src='" + ICon_Link + "'style='width:40px;height:40px'></img></lua><a class='text' style='margin-left:12px'>" + Name + "</a><div style='height:6px'></div><div class='mdui-progress'><div class='mdui-progress-determinate'style='width:" + Progress + "%'></div></div><div style='height:6px'></div><a class='text mdui-float-left'>进度:" + Progress + "% / " + SizeFormat(Size) + "</a><a class='text mdui-float-right'>状态:" + Message + "</a><div style='height:12px'></div></div></div></div></div>";
                        }

                        document.getElementById("List").innerHTML = List;
                    }
                }

                TerminateReturn();
            },
        });
    });
}

function DeleteOffline(ID) {
    LoadIng(true, "正在删除离线任务", 240);

    var AccessToken = GetUserStorageAccessToken();
    var url = "./DeleteOffline.php";
    var data = "AccessToken=" + encodeURIComponent(AccessToken) + "&ID=" + ID;

    $.ajax({
        type: "post",
        dataType: "json",
        url: url,
        data: data,
        error: function () {
            LoadIng(false);

            Swal.fire({
                icon: "error",
                title: "网络异常",
                text: "请求失败",
                confirmButtonText: "重新删除",
                denyButtonText: "关闭",
                showDenyButton: true,
            }).then(function (Result) {
                if (Result.isConfirmed) {
                    DeleteOffline(ID);
                }
            });
        },
        success: function (Result) {
            LoadIng(false);

            var Status = Result.Status;
            if (Status == 0) {
                Swal.fire({
                    icon: "success",
                    title: "删除离线任务成功",
                    confirmButtonText: "重新获取离线任务",
                }).then(function () {
                    GetListOffline();
                });
            } else if (Status == 48) {
                Swal.fire({
                    icon: "error",
                    title: "AccessToken验证失败",
                    text: "错误或过期(2小时有效)",
                    confirmButtonText: "重新获取AccessToken",
                    denyButtonText: "关闭",
                    showDenyButton: true,
                }).then(function (Result) {
                    if (Result.isConfirmed) {
                        window.location.reload();
                    }
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "删除离线任务失败",
                    text: "可能任务已经不存在",
                    confirmButtonText: "重新删除",
                    denyButtonText: "关闭",
                    showDenyButton: true,
                }).then(function (Result) {
                    if (Result.isConfirmed) {
                        DeleteOffline(ID);
                    }
                });
            }
        },
    });
}

function GetInviteData() {
    LoadIng(true, "正在获取邀请信息", 220);

    var AccessToken = GetUserStorageAccessToken();
    var url = "./inviteCode.php";
    var data = "AccessToken=" + encodeURIComponent(AccessToken);

    $.ajax({
        type: "post",
        dataType: "json",
        url: url,
        data: data,
        error: function () {
            LoadIng(false);

            Swal.fire({
                icon: "error",
                title: "网络异常",
                text: "请求失败",
                confirmButtonText: "重新获取",
            }).then(function () {
                window.location.reload();
            });
        },
        success: function (Result) {
            var Status = Result.Status;
            if (Status == 0) {
                var Code = Result.Code;
                var Link = "https://toapp.mypikpak.com/activity/invited?g=1&code=" + Code;
                var DLink = "https://api.kinh.cc/PikPak/Invite/APPDownLoad.php?Code=" + Code;

                document.getElementById("Invite_Link").innerText = Link;

                var url = "./InviteInfo.php";
                var data = "AccessToken=" + encodeURIComponent(AccessToken);

                $.ajax({
                    type: "post",
                    dataType: "json",
                    url: url,
                    data: data,
                    error: function () {
                        LoadIng(false);

                        Swal.fire({
                            icon: "error",
                            title: "获取邀请信息失败",
                            confirmButtonText: "重新获取",
                        }).then(function () {
                            window.location.reload();
                        });
                    },
                    success: function (Result) {
                        var Status = Result.Status;
                        if (Status == 0) {
                            var Data = Result.Data;
                            var JosnData = JSON.parse(Data);
                            var add_days = JosnData.add_days;
                            var invited_nums = JosnData.invited_nums;
                            var join_vip_days = JosnData.join_vip_days;
                            var join_vip_nums = JosnData.join_vip_nums;

                            var Data1 = add_days + "/" + invited_nums;
                            var Data2 = join_vip_days + "/" + join_vip_nums;

                            document.getElementById("Invite_Data1").innerText = Data1;
                            document.getElementById("Invite_Data2").innerText = Data2;

                            var url = "./InviteList.php";
                            var data = "AccessToken=" + encodeURIComponent(AccessToken);

                            $.ajax({
                                type: "post",
                                dataType: "json",
                                url: url,
                                data: data,
                                error: function () {
                                    LoadIng(false);

                                    Swal.fire({
                                        icon: "error",
                                        title: "获取邀请信息失败",
                                        confirmButtonText: "重新获取",
                                    }).then(function () {
                                        window.location.reload();
                                    });
                                    
                                    console.log(1)
                                },
                                success: function (Result) {
                                    LoadIng(false);

                                    var Status = Result.Status;
                                    if (Status == 0) {
                                        var JsonData = JSON.parse(Result.Data)
                                        var Count = JsonData.data.length;
                                        var Invite_List = "";

                                        for (var i = 0; i < Count; i++) {
                                            var Name = JsonData.data[i].invited_user;
                                            var Time = JsonData.data[i].time;
                                            var Days = JsonData.data[i].reward_days;

                                            Time = Time.replace("T", " ");
                                            Time = Time.replace("+08:00", "");

                                            Invite_List += "<tr><td>" + Name + "</td><td>" + Days + "</td><td>" + Time + "</td></tr>";
                                        }

                                        document.getElementById("Invite_List").innerHTML = Invite_List;
                                    } else if (Status == 48) {
                                        Swal.fire({
                                            icon: "error",
                                            title: "AccessToken验证失败",
                                            text: "错误或过期(2小时有效)",
                                            confirmButtonText: "重新获取AccessToken",
                                            denyButtonText: "关闭",
                                            showDenyButton: true,
                                        }).then(function (Result) {
                                            if (Result.isConfirmed) {
                                                window.location.reload();
                                            }
                                        });
                                    } else {
                                        Swal.fire({
                                            icon: "error",
                                            title: "获取邀请信息失败",
                                            confirmButtonText: "重新获取",
                                        }).then(function () {
                                            window.location.reload();
                                        });
                                        
                                        console.log(2)
                                    }
                                },
                            });
                        } else if (Status == 48) {
                            LoadIng(false);

                            Swal.fire({
                                icon: "error",
                                title: "AccessToken验证失败",
                                text: "错误或过期(2小时有效)",
                                confirmButtonText: "重新获取AccessToken",
                                denyButtonText: "关闭",
                                showDenyButton: true,
                            }).then(function (Result) {
                                if (Result.isConfirmed) {
                                    window.location.reload();
                                }
                            });
                        } else {
                            LoadIng(false);

                            Swal.fire({
                                icon: "error",
                                title: "获取邀请信息失败",
                                confirmButtonText: "重新获取",
                            }).then(function () {
                                window.location.reload();
                            });
                            
                            console.log(3)
                        }
                    },
                });
            } else if (Status == 48) {
                Swal.fire({
                    icon: "error",
                    title: "AccessToken验证失败",
                    text: "错误或过期(2小时有效)",
                    confirmButtonText: "重新获取AccessToken",
                    denyButtonText: "关闭",
                    showDenyButton: true,
                }).then(function (Result) {
                    if (Result.isConfirmed) {
                        window.location.reload();
                    }
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "获取邀请信息失败",
                    confirmButtonText: "重新获取",
                }).then(function () {
                    window.location.reload();
                });
                
                console.log(4)
            }
        },
    });
}

function ClearCache() {
    Swal.fire({
        icon: "warning",
        title: "你是否清除缓存",
        text: "进出款能可解决某些神奇的BUG，但你的所有数据将丢失",
        confirmButtonText: "清除",
        denyButtonText: "关闭",
        showDenyButton: true,
    }).then(function (Result) {
        if (Result.isConfirmed) {
            localStorage.clear();
            window.location.replace("./?Type=Login");
        }
    });
}

function SetMDUIDiaLogWidth(Width) {
    var Style = document.getElementsByClassName("mdui-dialog mdui-dialog-prompt mdui-dialog-open")[0].getAttribute("style");
    Style += ";width:" + Width + "px";
    document.getElementsByClassName("mdui-dialog mdui-dialog-open")[0].setAttribute("style", Style);
}

function MeunOpen() {
    var Record_List_Use_FileID = localStorage.getItem("Record_List_Use_FileID");
    var Record_List_Use_Name = localStorage.getItem("Record_List_Use_Name");
    OpenFolder(Record_List_Use_FileID, Record_List_Use_Name);
}

function AdjustWindow() {
    return new Promise(function (TerminateReturn) {
        var WindowHeight = window.innerHeight;
        var WindowWidth = window.innerWidth;

        if (WindowHeight < 740) {
            WindowHeight = 740;
        }

        if (WindowWidth < 1280) {
            WindowWidth = 1280;
        }

        var ColListStyle_Height = WindowHeight - 144;
        var MarginTop = ColListStyle_Height;
        MarginTop = ~MarginTop + 1 - 128;
        var ColUserStyle_Height = WindowHeight - 16;
        ColListStyle_Width = WindowWidth - 274;

        document.getElementById("ColListStyle").setAttribute("style", "margin-top:8px;margin-left:258px;overflow:auto;height:" + ColListStyle_Height + "px;width:" + ColListStyle_Width + "px");
        document.getElementById("ColUserStyle").setAttribute("style", "overflow:auto;width:250px;height:" + ColUserStyle_Height + "px;margin-top:" + MarginTop + "px");
        document.getElementById("ColPathStyle").setAttribute("style", "width:" + WindowWidth + "px");
        document.getElementById("ColFileInfoListStyle").setAttribute("style", "width:" + WindowWidth + "px");

        TerminateReturn();
    });
}

async function SelectAccount(Type) {
    if (Type == true) {
        document.getElementById("ColPathStyle").setAttribute("style", "display:none");
        document.getElementById("ColList_Menu_For_Style").setAttribute("style", "display:none");
        document.getElementById("ColFileInfoListStyle").setAttribute("style", "display:none");

        var Style = document.getElementById("ColUserStyle").getAttribute("style");
        Style = Style.substring(0, Style.indexOf(";margin-top:"));
        Style = Style + ";margin-top:-8px";
        document.getElementById("ColUserStyle").setAttribute("style", Style);

        var WindowHeight = window.innerHeight;
        var WindowWidth = window.innerWidth;

        if (WindowHeight < 740) {
            WindowHeight = 740;
        }

        if (WindowWidth < 1280) {
            WindowWidth = 1280;
        }

        if (document.getElementById("User_SelectAccount") == null) {
            var User = document.getElementById("User").innerHTML;
            User = "<div id='User_SelectAccount' onclick='AlertSelectAccount()'><div class='mdui-p-t-1'><div class='mdui-col'><div class='mdui-card'><div class='mdui-card-content mdui-ripple'style='height:24px;text-align:center;font-weight:600;color:#3f51b5;font-size:18px'>请在以下列表选择账号</div></div></div></div></div>" + User;
            document.getElementById("User").innerHTML = User;
        }
    } else {
        if (document.getElementById("User_SelectAccount") != null) {
            document.getElementById("User_SelectAccount").setAttribute("style", "display:none");
        }

        document.getElementById("ColList_Menu_For_Style").setAttribute("style", "");

        await AdjustWindow();
    }
}

function AlertSelectAccount() {
    Swal.fire({
        icon: "warning",
        title: "请选择账号",
        text: "请右键左侧账号列表选择账号",
        confirmButtonText: "关闭",
    });
}

window.onresize = async function () {
    var Host = document.location.toString();
    var Type = Host.substring(Host.indexOf("/?Type=") + 7, Host.length);
    if (Type != "Login" && Type != "Register" && Type != "Login_Phone") {
        var DownLoadChooseStyle = document.getElementById("DownLoadChoose").getAttribute("style");
        if (DownLoadChooseStyle != null && DownLoadChooseStyle.indexOf("block;") != -1) {
            SetDownLoadChooseWidth();
        }

        await AdjustWindow();

        var Record_Use_User_Rand = localStorage.getItem("Record_Use_User_Rand");
        if (Record_Use_User_Rand == "" || Record_Use_User_Rand == null) {
            SelectAccount(true);
        }
    }
};

function PlayMusic(Name, Link) {
    GlobalVariable_PlayMusic_APlaye = new APlayer({
        element: document.getElementById("APlayerDivID"),
        music: {
            title: Name,
            author: "Kinh",
            url: Link,
            pic: "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-ab498c51-8871-421b-8e23-a43eaa306dff/d32cf312-24e0-4c71-a062-142db6ebc420.svg",
        },
    });

    new mdui.Dialog("#Music").open();
}

function Video(Link) {
    var Hash = Link.substring(Link.indexOf("&g=") + 3, Link.indexOf("&i"));
    var Picture = "https://vod0051-aliyun18-vip-lixian.mypikpak.com/v0/screenshot-thumbnails/" + Hash + "/240/720";

    GlobalVariable_Video_DPlayer = new DPlayer({
        container: document.getElementById("DPlayerDivID"),
        video: {
            url: Link,
            pic: Picture,
        },
    });

    document.getElementsByClassName("dplayer-video dplayer-video-current")[0].setAttribute("style", "width:680px");
    document.getElementsByClassName("dplayer-video dplayer-video-current")[0].setAttribute("style", "height:400px");

    var VideoDialog = new mdui.Dialog("#Video");
    VideoDialog.open();

    mdui.snackbar({
        position: "top",
        message: "浏览器可能播放失败，请使用本地播放器",
        buttonText: "调用本地播放器",
        onButtonClick: function () {
            GlobalVariable_Video_DPlayer.pause();
            VideoDialog.close();
            DownLoad(1);
        },
    });
}

function PlayFile() {
    var Record_List_Use_NumberID = localStorage.getItem("Record_List_Use_NumberID");
    var List_FileMimeType = document.getElementById("List_FileMimeType_" + Record_List_Use_NumberID).getAttribute("class");

    if (List_FileMimeType.indexOf("video/") != -1) {
        DownLoad(1);
    } else if (List_FileMimeType.indexOf("audio/") != -1) {
        DownLoad(2);
    }
}

function SetBodyPicture() {
    var SetBodyPictureData = localStorage.getItem("SetBodyPictureData");
    if (SetBodyPictureData == "" || SetBodyPictureData == null || SetBodyPictureData == 0) {
        localStorage.setItem("SetBodyPictureData", "1");
    } else if (SetBodyPictureData == 1) {
        localStorage.setItem("SetBodyPictureData", "0");
    }
    window.location.reload();
}

function DoubleNamingHeavyNaming(Data1, Data2) {
    document.getElementsByClassName("mdui-btn mdui-ripple mdui-text-color-primary")[0].innerText = Data1;
    document.getElementsByClassName("mdui-btn mdui-ripple mdui-text-color-primary")[1].innerText = Data2;
}

async function UserCachePicture(Link, Rand) {
    await CacheImage(Link);
    document.getElementById("UserPicture_" + Rand).setAttribute("src", Link);
}

function UserEditor() {
    var Record_Use_User_Rand = localStorage.getItem("Record_Use_User_Rand");
    var ID = GetCookie("UserConfigFolderID_" + Record_Use_User_Rand);
    if (ID == "" || ID == null) {
        Swal.fire({
            icon: "error",
            title: "数据异常",
            text: "存储数据异常",
            confirmButtonText: "重新获取",
            denyButtonText: "关闭",
            showDenyButton: true,
        }).then(function (Result) {
            if (Result.isConfirmed) {
                window.location.reload();
            }
        });
    } else {
        new mdui.Dialog("#SetUserConfigChoose").open();
    }
}

function SetUserConfigPicture() {
    var UPLoadTorrent_Picture_Document = document.getElementById("UPLoadTorrent_Picture");
    UPLoadTorrent_Picture_Document.click();
    UPLoadTorrent_Picture_Document.addEventListener("change", function () {
        if (document.getElementById("UPLoadTorrent_Picture").files[0].name == "") {
            UPLoadTorrent_Picture_Document.outerHTML = UPLoadTorrent_Picture_Document.outerHTML;
        } else {
            if (document.getElementById("UPLoadTorrent_Picture").files[0].size > 10485760) {
                Swal.fire({
                    icon: "error",
                    title: "头像超过上传限制",
                    text: "头像大于10M无法上传",
                    confirmButtonText: "重新上传",
                    denyButtonText: "关闭",
                    showDenyButton: true,
                }).then(function (Result) {
                    if (Result.isConfirmed) {
                        SetUserConfigPicture();
                    }
                });
            } else {
                LoadIng(true, "正在上传头像", 220);

                var Data = new FormData();
                Data.append("FilePicture", document.getElementById("UPLoadTorrent_Picture").files[0]);

                var url = "https://api.kinh.cc/Picture/MeiTuan.php";

                $.ajax({
                    dataType: "json",
                    type: "POST",
                    url: url,
                    data: Data,
                    cache: false,
                    processData: false,
                    contentType: false,
                    error: function () {
                        UPLoadTorrent_Picture_Document.outerHTML = UPLoadTorrent_Picture_Document.outerHTML;
                        LoadIng(false);

                        Swal.fire({
                            icon: "error",
                            title: "网络异常",
                            text: "请求错误",
                            confirmButtonText: "重新上传",
                            denyButtonText: "关闭",
                            showDenyButton: true,
                        }).then(function (Result) {
                            if (Result.isConfirmed) {
                                SetUserConfigPicture();
                            }
                        });
                    },
                    success: async function (Result) {
                        var Status = Result.Status;
                        var PictureLink = Result.link;

                        LoadIng(true, "正在缓冲预览", 220);
                        await CacheImage(PictureLink);
                        LoadIng(false);

                        if (Status == 0) {
                            Swal.fire({
                                imageUrl: PictureLink,
                                title: "预览头像",
                                confirmButtonText: "提交",
                                denyButtonText: "关闭",
                                showDenyButton: true,
                            }).then(function (Result) {
                                if (Result.isConfirmed) {
                                    LoadIng(true, "正在提交", 220);

                                    var Record_Use_User_Rand = localStorage.getItem("Record_Use_User_Rand");

                                    var UserConfigName = document.getElementById("UserName_" + Record_Use_User_Rand).innerText;
                                    if (UserConfigName == null || UserConfigName == "") {
                                        UserConfigName = "";
                                    }

                                    var AccessToken = GetUserStorageAccessToken(Record_Use_User_Rand);
                                    var ID = GetCookie("UserConfigFolderID_" + Record_Use_User_Rand);

                                    var Name = Date.now() + "{Kinh-Time-PikPak}" + encodeURIComponent(UserConfigName + "{Kinh-PikPak}" + PictureLink);

                                    var url = "./CreateFolder.php";
                                    var data = "AccessToken=" + encodeURIComponent(AccessToken) + "&Name=" + encodeURIComponent(Name) + "&ID=" + ID;

                                    $.ajax({
                                        type: "post",
                                        dataType: "json",
                                        url: url,
                                        data: data,
                                        error: function () {
                                            LoadIng(true, "正在重新获取账号信息", 220);
                                            window.location.reload();
                                        },
                                        success: function () {
                                            LoadIng(true, "正在重新获取账号信息", 220);
                                            window.location.reload();
                                        },
                                    });
                                }
                            });
                        } else {
                            Swal.fire({
                                icon: "error",
                                title: "上传失败",
                                text: "头像上传失败",
                                confirmButtonText: "重新上传",
                                denyButtonText: "关闭",
                                showDenyButton: true,
                            }).then(function (Result) {
                                if (Result.isConfirmed) {
                                    SetUserConfigPicture();
                                }
                            });
                        }
                    },
                });
            }
        }
    });
}

function SetUserConfigName() {
    var Record_Use_User_Rand = localStorage.getItem("Record_Use_User_Rand");
    var UserName = document.getElementById("UserName_" + Record_Use_User_Rand).innerText;

    mdui.prompt(
        "请输入用户名",
        "请输入云盘用户名",
        function () {},
        function (Value) {
            if (Value == "" || Value == UserName) {
                Swal.fire({
                    icon: "warning",
                    title: "请输入用户名",
                    text: "请输入云盘用户名",
                    confirmButtonText: "重新输入云盘用户名",
                    denyButtonText: "关闭",
                    showDenyButton: true,
                }).then(function (Result) {
                    if (Result.isConfirmed) {
                        SetUserConfigName();
                    }
                });
            } else {
                LoadIng(true, "正在设置用户名", 220);

                var UserConfigPicture = document.getElementById("UserPicture_" + Record_Use_User_Rand).src;
                if (UserConfigPicture == null || UserConfigPicture == "") {
                    UserConfigPicture = "";
                }

                var AccessToken = GetUserStorageAccessToken(Record_Use_User_Rand);
                var ID = GetCookie("UserConfigFolderID_" + Record_Use_User_Rand);

                var Name = Date.now() + "{Kinh-Time-PikPak}" + encodeURIComponent(Value + "{Kinh-PikPak}" + UserConfigPicture);

                var url = "./CreateFolder.php";
                var data = "AccessToken=" + encodeURIComponent(AccessToken) + "&Name=" + encodeURIComponent(Name) + "&ID=" + ID;

                $.ajax({
                    type: "post",
                    dataType: "json",
                    url: url,
                    data: data,
                    error: function () {
                        LoadIng(true, "正在重新获取账号信息", 220);
                        window.location.reload();
                    },
                    success: function () {
                        LoadIng(true, "正在重新获取账号信息", 220);
                        window.location.reload();
                    },
                });
            }
        }
    );

    setTimeout(() => {
        document.getElementsByClassName("mdui-textfield-input")[5].value = UserName;
        DoubleNamingHeavyNaming("提交", "关闭");
        SetMDUIDiaLogWidth(680);
    }, 120);
}

function PassAria2DownloadData(Name, DownLoad_Link, Link, Token) {
    LoadIng(true, "正在发送的Aria2下载引擎", 240);

    localStorage.setItem("Aria2Link", Link);
    localStorage.setItem("Aria2Token", Token);

    var Aria2_Data = '{"jsonrpc":2,"id":"Kinh-PikPak","method":"system.multicall","params":[[{"methodName":"aria2.addUri","params":["token:' + Token + '",["' + DownLoad_Link + '"],{"out":"' + Name + '"}]}]]}';

    var Variable_WebSocket = new WebSocket(Link);
    Variable_WebSocket.onopen = function () {
        Variable_WebSocket.send(Aria2_Data);
    };

    Variable_WebSocket.onerror = function () {
        LoadIng(false);

        Swal.fire({
            icon: "error",
            title: "传递失败",
            text: "无法建立隧道",
            confirmButtonText: "重新传递下载",
            denyButtonText: "关闭",
            showDenyButton: true,
        }).then(function (Result) {
            if (Result.isConfirmed) {
                PassAria2DownloadData(Name, DownLoad_Link, Link, Token);
            }
        });
    };

    Variable_WebSocket.onmessage = function () {
        LoadIng(false);

        Swal.fire({
            icon: "success",
            title: "传递成功",
            text: "请检查是否正常下载",
            confirmButtonText: "重新传递",
            denyButtonText: "关闭",
            showDenyButton: true,
        }).then(function (Result) {
            if (Result.isConfirmed) {
                PassAria2DownloadData(Name, DownLoad_Link, Link, Token);
            }
        });

        Variable_WebSocket.close();
    };
}

function GetPayVIPList() {
    var AccessToken = GetUserStorageAccessToken();
    var url = "./List_VIP.php";
    var data = "AccessToken=" + encodeURIComponent(AccessToken);

    $.ajax({
        type: "post",
        dataType: "json",
        url: url,
        data: data,
        error: function () {
            LoadIng(false);

            Swal.fire({
                icon: "error",
                title: "网络异常",
                text: "请求错误",
                confirmButtonText: "重新获取",
            }).then(function () {
                GetPayVIPList();
            });
        },
        success: function (Result) {
            LoadIng(false);

            if (Result.sku_group == "") {
                Swal.fire({
                    icon: "error",
                    title: "无法获取订阅",
                    confirmButtonText: "重新获取",
                }).then(function () {
                    GetPayVIPList();
                });
            } else {
                var ListHTMLCode = "";

                var Count = Result.products.length;
                for (var i = 0; i < Count; i++) {
                    var ID = Result.products[i].price_id;
                    var Unit = Result.products[i].unit;
                    var Top = Result.products[i].style.top_title;
                    var Middle = Result.products[i].style.middle_title;
                    var Bottom = Result.products[i].style.bottom_title;
                    var Remarks = Result.products[i].style.remarks;

                    Bottom = Bottom.replace(Unit, "");
                    Middle = Middle.replace(Unit, "");

                    ListHTMLCode += "<div id='" + ID + "' class='mdui-container mdui-p-t-3'><div class='mdui-card'><div class='mdui-card-primary'><div class='mdui-card-primary-title'>" + Top + "</div><div class='mdui-card-primary-subtitle'>" + Remarks + "</div></div><div class='mdui-card-content'><ul class='mdui-list'><li class='mdui-list-item'><i class='mdui-list-item-icon mdui-icon material-icons'>timelapse</i><div class='mdui-list-item-content'><lua style='font-weight:600;color:#FF4081'>" + Middle + "</lua></div></li><li class='mdui-list-item'><i class='mdui-list-item-icon mdui-icon material-icons'>attach_money</i><div class='mdui-list-item-content'><lua style='font-weight:600;color:#00C853'>" + Bottom + " " + Unit + "</lua></div></li></ul></div><div class='mdui-card-actions mdui-float-right'><a class='btn mdui-btn mdui-btn-raised mdui-color-green-600 mdui-text-color-white'onclick='PayVIP(" + '"' + ID + '"' + ")'><i class='mdui-icon mdui-icon-left material-icons'>done_all</i>购买</a></div></div></div>";
                }

                document.getElementById("PayVIPList").innerHTML = ListHTMLCode;
            }
        },
    });
}

function List_DownLoad(Type) {
    if (Type == false) {
        LoadIng(true, "正在获取下载文件列表", 220);
        document.getElementById("WebTitle").innerText = "PikPak | 下载文件";
        document.getElementById("ListThead").innerHTML = "<th style='height:60px'>文件</th><th>文件大小</th><th>创建时间</th><th>完成时间</th><th>状态</th><th>操作</th>";
        document.getElementById("FileInfo").innerText = "正在获取文件";
        document.getElementById("Path").innerHTML = "<button class='mdui-btn mdui-color-blue-accent mdui-ripple' onclick='List()'><i class='mdui-list-item-icon mdui-icon material-icons'>arrow_back</i> 返回文件列表</button><div class='mdui-card-menu'><button class='mdui-btn mdui-color-indigo mdui-ripple' onclick='List_DownLoad(false)'><i class='mdui-list-item-icon mdui-icon material-icons'>refresh</i> 刷新下载管理列表</button><button class='mdui-btn mdui-color-indigo-accent mdui-ripple' onclick='List_DownLoad_All_Send_Aria2()'><i class='mdui-list-item-icon mdui-icon material-icons'>send</i> 全部发送到Aria2</button><button class='mdui-btn mdui-color-green-600 mdui-ripple' onclick='SetAria2()'><i class='mdui-list-item-icon mdui-icon material-icons'>cloud_done</i> 配置Aria2</button><button class='mdui-btn mdui-color-red-400 mdui-ripple' onclick='DeleteAllDownLoadData()'><i class='mdui-list-item-icon mdui-icon material-icons'>delete</i> 清空下载管理列表</button></div>";
    }

    var HTMLCode = "";
    var Count = 0;

    for (var i = 0; i < localStorage.length; i++) {
        var Key = localStorage.key(i);
        if (Key.substring(0, 12) == "DownLoadData") {
            Count++;

            var Value = localStorage.getItem(Key);
            var JsonData = JSON.parse(Value);
            var Name = JsonData["Name"];
            var Size = JsonData["Size"];
            var Hash = JsonData["Hash"];
            var Time = JsonData["Time"];
            var Picture = JsonData["Picture"];

            var DownLoadLink = localStorage.getItem("DownLoadLink_" + Hash);
            if (DownLoadLink == "" || DownLoadLink == null) {
                var CompleteTime = "---:---:---";
                var Status = "等待获取下载地址";
                var Button = "<button class='mdui-btn mdui-btn-icon' onclick='localStorage.removeItem(" + '"' + Key + '"' + ");List_DownLoad(false)'><i class='mdui-icon material-icons'>delete</i></button>";
            } else {
                var DownLoadLinkTime = DownLoadLink.substring(DownLoadLink.indexOf("&expire=") + 8, DownLoadLink.indexOf("&g"));
                var CompleteTime = TimeDate(DownLoadLinkTime);
                console.log(DownLoadLinkTime - (Date.now() / 1000))
                if ((Date.now() / 1000) - DownLoadLinkTime > 86400) {
                    var Status = "下载地址已过期";
                    var Button = "<button class='mdui-btn mdui-btn-icon' onclick='localStorage.removeItem(" + '"' + Key + '"' + ");localStorage.removeItem(" + '"DownLoadLink_' + Hash + '"' + ");List_DownLoad(false)'><i class='mdui-icon material-icons'>delete</i></button><button class='mdui-btn mdui-btn-icon' onclick='localStorage.removeItem(" + '"DownLoadLink_' + Hash + '"' + ");List_DownLoad(false)'><i class='mdui-icon material-icons'>refresh</i></button>";
                } else {
                    var Status = "获取下载地址完成";
                    var Button = "<button class='mdui-btn mdui-btn-icon' onclick='TriggerDownLoad(" + '"' + Name + '","' + Size + '","' + DownLoadLink + '","' + Picture + '"' + ")'><i class='mdui-icon material-icons'>file_download</i></button><button class='mdui-btn mdui-btn-icon' onclick='localStorage.removeItem(" + '"' + Key + '"' + ");localStorage.removeItem(" + '"DownLoadLink_' + Hash + '"' + ");List_DownLoad(false)'><i class='mdui-icon material-icons'>delete</i></button><button class='mdui-btn mdui-btn-icon' onclick='localStorage.removeItem(" + '"DownLoadLink_' + Hash + '"' + ");List_DownLoad(false)'><i class='mdui-icon material-icons'>refresh</i></button>";
                }
            }

            HTMLCode += "<tr id='" + Key + "'><td><lua class='ProhibitChoose'><img class='mdui-icon' src='" + Picture + "' style='width:40px;height:40px'></lua><a class='mdui-list-item-content' style='margin-left:12px'>" + Name + "</a></td><td>" + SizeFormat(Size) + "</td><td>" + TimeDate(Time) + "</td><td>" + CompleteTime + "</td><td id='List_DownLoad_Status_" + Hash + "'>" + Status + "</td><td>" + Button + "</td></tr>";
        }
    }

    document.getElementById("List").innerHTML = HTMLCode;
    document.getElementById("FileInfo").innerText = Count + "个文件";

    if (Type == false) {
        LoadIng(false);
    }
}

function GetDownLoadListLink() {
    return new Promise(async function (TerminateReturn) {
        for (var i = 0; i < localStorage.length; i++) {
            var Key = localStorage.key(i);
            if (Key.substring(0, 12) == "DownLoadData") {
                var Value = localStorage.getItem(Key);
                var JsonData = JSON.parse(Value);
                var Rand = JsonData["Rand"];
                var ID = JsonData["ID"];
                var Hash = JsonData["Hash"];

                var DownLoadLink = localStorage.getItem("DownLoadLink_" + Hash);
                if (DownLoadLink == "" || DownLoadLink == null) {
                    if (document.getElementById("WebTitle").innerText == "PikPak | 下载文件") {
                        try {
                            document.getElementById("List_DownLoad_Status_" + Hash).innerText = "正在获取下载地址";
                        } catch (Error) {
                            console.log("GetDownLoadListLink", "FatalRrror", Error);
                        }
                    }

                    var AccessToken = GetUserStorageAccessToken(Rand);
                    var Url = "./DownLoad.php";
                    var Data = "AccessToken=" + encodeURIComponent(AccessToken) + "&ID=" + ID;

                    var Type = await GetDownLoadListLink_AJAX_Response(Url, Data, Hash);

                    if (document.getElementById("WebTitle").innerText == "PikPak | 下载文件") {
                        try {
                            if (Type == true) {
                                document.getElementById("List_DownLoad_Status_" + Hash).innerText = "获取下载地址成功";
                                List_DownLoad(true);
                            } else {
                                document.getElementById("List_DownLoad_Status_" + Hash).innerText = "获取下载地址失败";
                            }
                        } catch (Error) {
                            console.log("GetDownLoadListLink", "FatalRrror", Error);
                        }
                    }
                }
            }
        }

        TerminateReturn();
    });
}

function GetDownLoadListLink_AJAX_Response(Url, Data, Hash) {
    return new Promise(function (TerminateReturn) {
        setTimeout(function () {
            $.ajax({
                type: "post",
                dataType: "json",
                url: Url,
                data: Data,
                error: function () {
                    TerminateReturn(false);
                },
                success: function (Result) {
                    if (Result.Status == 0) {
                        var Link = Result.Link;

                        localStorage.setItem("DownLoadLink_" + Hash, Link);

                        TerminateReturn(true);
                    } else {
                        TerminateReturn(false);
                    }
                },
            });
        }, 1000);
    });
}

function DeleteAllDownLoadData() {
    Swal.fire({
        icon: "warning",
        title: "是否确定清空下载管理列表",
        confirmButtonText: "删除",
        denyButtonText: "关闭",
        showDenyButton: true,
    }).then(function (Result) {
        if (Result.isConfirmed) {
            LoadIng(true, "正在清空下载管理列表", 220);

            for (var I = 0; I < localStorage.length * localStorage.length; I++) {
                for (var i = 0; i < localStorage.length; i++) {
                    var Key = localStorage.key(i);
                    var Data = Key.substring(0, 12);
                    if (Data == "DownLoadData" || Data == "DownLoadLink") {
                        localStorage.removeItem(Key);
                    }
                }
            }

            List_DownLoad(false);
        }
    });
}

function ScanningFolder(ID, Token) {
    return new Promise(function (TerminateReturn) {
        if (Token == null) {
            Token = "";
        }

        var Url = 'https://api-drive-pikpak.kinh.cc/drive/v1/files?filters={"phase":{"eq":"PHASE_TYPE_COMPLETE"},"trashed":{"eq":false}}&parent_id=' + ID + "&page_token=" + encodeURIComponent(Token);

        var Rand = localStorage.getItem("Record_Use_User_Rand");
        var AccessToken = "Bearer " + GetUserStorageAccessToken(Rand);

        $.ajax({
            type: "get",
            dataType: "json",
            url: Url,
            beforeSend: function (Request) {
                Request.setRequestHeader("Authorization", AccessToken);
            },
            error: function (Error) {
                console.log("ScanningFolder", ID, Token, Error);
                TerminateReturn();
            },
            success: async function (Result) {
                if (Result["kind"] == "drive#fileList") {
                    var ResultToken = Result["next_page_token"];
                    if (ResultToken != null && ResultToken != "") {
                        await ScanningFolder(ID, ResultToken);
                    }

                    for (var i = 0; i < Result["files"].length; i++) {
                        var ID = Result["files"][i]["id"];
                        var Name = Result["files"][i]["name"];
                        var Hash = Result["files"][i]["hash"];
                        var IConLink = Result["files"][i]["icon_link"];
                        IConLink = IConLink.replace("static.mypikpak.com", "backstage-img-ssl.a.88cdn.com");

                        if (Result["files"][i]["kind"] == "drive#file") {
                            localStorage.setItem(
                                "DownLoadData_" + Hash,
                                JSON.stringify({
                                    Rand: Rand,
                                    ID: ID,
                                    Name: Name,
                                    Size: Result["files"][i]["size"],
                                    Hash: Hash,
                                    Time: Date.now() / 1000,
                                    Picture: IConLink,
                                })
                            );

                            document.getElementById("DivVar_AddDownLoadCount").innerText++;
                        } else if (Result["files"][i]["kind"] == "drive#folder") {
                            await ScanningFolder(ID);
                        }
                    }
                }

                TerminateReturn();
            },
        });
    });
}

function SetAria2() {
    var Aria2Link = localStorage.getItem("Aria2Link");
    var Aria2Token = localStorage.getItem("Aria2Token");

    if (Aria2Link == null || Aria2Link == "") {
        Aria2Link = "ws://127.0.0.1:6800/jsonrpc";
    }

    if (Aria2Token == null) {
        Aria2Token = "";
    }

    Swal.fire({
        title: "配置Aria2",
        confirmButtonText: "确定",
        denyButtonText: "取消",
        showDenyButton: true,
        html: '<a>Aria2 WebSocket地址</a><br><a>AriaNgGUI地址:ws://127.0.0.1:6800/jsonrpc</a><br><a>Motrix地址:ws://127.0.0.1:16800/jsonrpc</a><br><a>Aria2 HTTP地址</a><br></br><input class="mdui-textfield-input" id="SwalAria2Link" type="text" value="' + Aria2Link + '"><br><a>Token(没有不要填)</a><input id="SwalAria2Token" class="mdui-textfield-input" type="text" value="' + Aria2Token + '">',
        preConfirm: function () {
            Aria2Link = document.getElementById("SwalAria2Link").value;
            Aria2Token = document.getElementById("SwalAria2Token").value;

            if (Aria2Link == null || Aria2Link == "") {
                Aria2Link = "ws://127.0.0.1:6800/jsonrpc";
            }

            localStorage.setItem("Aria2Link", Aria2Link);
            localStorage.setItem("Aria2Token", Aria2Token);
        },
    });
}

function List_DownLoad_All_Send_Aria2() {
    var Data = {};
    var Stop = false;

    for (var i = 0; i < localStorage.length; i++) {
        var Key = localStorage.key(i);
        if (Key.substring(0, 12) == "DownLoadData") {
            var Value = localStorage.getItem(Key);
            var JsonData = JSON.parse(Value);
            var Hash = JsonData["Hash"];
            var Name = JsonData["Name"];

            var DownLoadLink = localStorage.getItem("DownLoadLink_" + Hash);
            if (DownLoadLink == "" || DownLoadLink == null) {
                Swal.fire({
                    icon: "warning",
                    title: "请等等下载地址全部获取完成后再操作",
                    confirmButtonText: "关闭",
                });

                Stop = true;

                break;
            } else {
                Data[i] = JSON.stringify({
                    Hash: Hash,
                    Name: Name,
                    DownLoadLink: DownLoadLink,
                });
            }
        }
    }

    if (Stop == false) {
        Swal.fire({
            icon: "warning",
            title: "温馨提醒",
            text: "请设置并行下载数量为1否则会导致下载失败",
            confirmButtonText: "开始全部发送的Aria2下载引擎",
            denyButtonText: "关闭",
            showDenyButton: true,
        }).then(function (Result) {
            if (Result.isConfirmed) {
                LoadIng(true, "正在全部发送的Aria2下载引擎", 280);

                var Aria2Link = localStorage.getItem("Aria2Link");
                var Aria2Token = localStorage.getItem("Aria2Token");

                if (Aria2Link == null || Aria2Link == "") {
                    Aria2Link = "ws://127.0.0.1:6800/jsonrpc";
                }

                if (Aria2Token == null) {
                    Aria2Token = "";
                }

                var Variable_WebSocket = new WebSocket(Aria2Link);

                Variable_WebSocket.onopen = function () {
                    for (i = 0; i < localStorage.length; i++) {
                        if (Data[i] != "" && Data[i] != undefined) {
                            var JsonData = JSON.parse(Data[i]);
                            var Name = JsonData["Name"];
                            var DownLoadLink = JsonData["DownLoadLink"];
                            if (Name != "" && Name != undefined && DownLoadLink != "" && DownLoadLink != undefined) {
                                var Aria2_Data = '{"jsonrpc":2,"id":"Kinh-PikPak","method":"system.multicall","params":[[{"methodName":"aria2.addUri","params":["token:' + Aria2Token + '",["' + DownLoadLink + '"],{"out":"' + Name + '"}]}]]}';

                                Variable_WebSocket.send(Aria2_Data);
                            }
                        }
                    }
                };

                LoadIng(false);

                Swal.fire({
                    icon: "success",
                    title: "全部传递成功",
                    text: "请检查是否正常下载",
                    confirmButtonText: "关闭",
                });
            }
        });
    }
}

const CountSubStrings = (String, searchValue) => {
    let count = 0,
        i = 0;
    while (true) {
        const r = String.indexOf(searchValue, i);
        if (r !== -1) [count, i] = [count + 1, r + 1];
        else return count;
    }
};
