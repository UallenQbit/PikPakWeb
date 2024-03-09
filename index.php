<?php
require("./Expand.php");
$Type = $_GET['Type'];
?>
<!DOCTYPE html>
<html id='Paste_UPLoad_Torrent'>

<head>
    <meta charset='utf-8'>
    <title id='WebTitle'>PikPak</title>
    <meta name='viewport' content='width=device-width'>
    <meta name='referrer' content='no-referrer'>
    <link rel='icon' href='https://ae05.alicdn.com/kf/Uef8fba0f55af4f1ca052e7b8ed109761V.png'>
    <link rel='stylesheet' href='https://cdn.staticfile.org/mdui/1.0.2/css/mdui.min.css'>
    <link rel='stylesheet' href='https://img.kaiheila.cn/attachments/2022-09/30/63363220e7064.css'>
    <link rel='stylesheet' href='https://cdn.staticfile.org/limonte-sweetalert2/11.4.14/sweetalert2.min.css'>
    <link rel='stylesheet' href='https://cdn.staticfile.org/aplayer/1.9.1/APlayer.min.css'>
    <link rel='stylesheet' href='https://cdn.staticfile.org/dplayer/1.25.0/DPlayer.min.css'>
    <link rel='stylesheet' href='./Style.css'>
    <script src='https://img.kaiheila.cn/attachments/2022-09/30/633632a102191.js'></script>
    <script src='https://img.kaiheila.cn/attachments/2022-09/30/633632a308c72.js'></script>
    <script src='https://cdn.staticfile.org/limonte-sweetalert2/11.4.14/sweetalert2.min.js'></script>
    <script src='https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js'></script>
    <script src='https://cdn.staticfile.org/mdui/1.0.2/js/mdui.min.js'></script>
    <script src='https://cdn.staticfile.org/aplayer/1.9.1/APlayer.min.js'></script>
    <script src='https://cdn.staticfile.org/dplayer/1.26.0/DPlayer.min.js'></script>
    <script src='https://cdn.staticfile.org/js-sha1/0.6.0/sha1.min.js'></script>
    <script src='https://img.kaiheila.cn/attachments/2022-09/30/6336329967643.js'></script>
    <script src='./Cycle.js'></script>
    <script src='./JavaScript.js'></script>
    <script src='./MenuTriggerEvent.js'></script>
    <script src='./Login_For_Register.js'></script>
    <script src='./Paste_UPLoad_Torrent.js'></script>

    <style id='HTMLStyle'></style>
</head>

<body class='mdui-theme-primary-indigo mdui-theme-accent-indigo'>
    <ul class='mdui-menu' id='UserMenu'>
        <li class='mdui-menu-item' id='Use'><a><i class='mdui-menu-item-icon mdui-icon material-icons'>launch</i>使用</a></li>
        <li class='mdui-menu-item'><a href='./?Type=Login'><i class='mdui-menu-item-icon mdui-icon material-icons'>account_circle</i>登陆</a></li>
        <li class='mdui-menu-item' id='RecycleBin'><a href='javascript:List_RecycleBin()'><i class='mdui-menu-item-icon mdui-icon material-icons'>delete_sweep</i>回收站</a></li>
        <!--<li class='mdui-menu-item' id='UserEditor'><a href='javascript:UserEditor()'><i class='mdui-menu-item-icon mdui-icon material-icons'>edit</i>编辑账号</a></li>-->
        <li class='mdui-menu-item' id='Offline'><a href='./?Type=List_Offline'><i class='mdui-menu-item-icon mdui-icon material-icons'>cloud_download</i>离线任务</a></li>
        <li class='mdui-menu-item' id='GetinviteCode'><a href='./?Type=Invite'><i class='mdui-menu-item-icon mdui-icon material-icons'>record_voice_over</i>邀请详细</a></li>
        <!--<li class='mdui-menu-item' id='PayVIP'><a href='./?Type=PayVIP'><i class='mdui-menu-item-icon mdui-icon material-icons'>attach_money</i>会员充值</a></li>-->
        <li class='mdui-menu-item' id='PayVIP'><a href='https://weidian.com/item.html?itemID=4442807507'><i class='mdui-menu-item-icon mdui-icon material-icons'>attach_money</i>会员充值</a></li>
        <li class='mdui-menu-item' id='EnterMembershipCode'><a href='javascript:MemberCode()'><i class='mdui-menu-item-icon mdui-icon material-icons'>vpn_key</i>输入会员码</a></li>
        <li class='mdui-divider' id='UserMenu_Open_Divider_0'></li>
        <li class='mdui-menu-item'><a href='javascript:ClearCache()'><i class='mdui-menu-item-icon mdui-icon material-icons'>delete</i>清理缓存</a></li>
        <li class='mdui-menu-item' id='SetBodyPicture'><a href='javascript:SetBodyPicture()'><i class='mdui-menu-item-icon mdui-icon material-icons'>insert_photo</i>使用图景</a></li>
        <li class='mdui-divider' id='UserMenu_Open_Divider_1'></li>
        <li class='mdui-menu-item' id='Exit'><a href='javascript:Exit()'><i class='mdui-menu-item-icon mdui-icon material-icons'>exit_to_app</i>退出</a></li>
    </ul>

    <ul class='mdui-menu' id='ListMenu'>
        <li class='mdui-menu-item'><a href='javascript:ListRefresh()'><i class='mdui-menu-item-icon mdui-icon material-icons'>refresh</i>刷新</a></li>
        <li class='mdui-divider'></li>
        <li class='mdui-menu-item' id='Menu_Open'><a href='javascript:MeunOpen()'><i class='mdui-menu-item-icon mdui-icon material-icons'>launch</i>打开</a></li>
        <li class='mdui-divider' id='ListMenu_Open_Divider_0'></li>
        <li class='mdui-menu-item' id='Menu_Picture'><a href='javascript:DownLoad(3)'><i class='mdui-menu-item-icon mdui-icon material-icons'>photo</i>预览</a></li>
        <li class='mdui-menu-item' id='Menu_Video_Music'><a href='javascript:PlayFile()'><i class='mdui-menu-item-icon mdui-icon material-icons' id='Menu_Video_Music_ICon'>ondemand_video</i>播放</a></li>
        <li class='mdui-menu-item' id='Menu_DownLoad'><a href='javascript:DownLoad(0)'><i class='mdui-menu-item-icon mdui-icon material-icons'>file_download</i>下载</a></li>
        <li class='mdui-divider' id='ListMenu_Open_Divider_1'></li>
        <li class='mdui-menu-item' id='Menu_Signature'><a href='javascript:GetSignature()'><i class='mdui-menu-item-icon mdui-icon material-icons'>all_inclusive</i>生成特征码</a></li>
        <li class='mdui-divider' id='ListMenu_Open_Divider_2'></li>
        <li class='mdui-menu-item'><a href='javascript:CreateFolder()'><i class='mdui-menu-item-icon mdui-icon material-icons'>create_new_folder</i>创建文件夹</a></li>
        <li class='mdui-menu-item'><a href='javascript:AddOffline()'><i class='mdui-menu-item-icon mdui-icon material-icons'>add</i>添加离线任务</a></li>
        <li class='mdui-menu-item'><a href='javascript:AddFileSignature()'><i class='mdui-menu-item-icon mdui-icon material-icons'>note_add</i>特征码导入文件</a></li>
        <li class='mdui-divider' id='ListMenu_Open_Divider_3'></li>
        <li class='mdui-menu-item' id='Menu_Rename'><a href='javascript:Rename()'><i class='mdui-menu-item-icon mdui-icon material-icons'>border_color</i>重命名</a></li>
        <li class='mdui-menu-item' id='Menu_Copy'><a href='javascript:FileOperations(1)'><i class='mdui-menu-item-icon mdui-icon material-icons'>content_copy</i>复制</a></li>
        <li class='mdui-menu-item' id='Menu_Move'><a href='javascript:FileOperations(2)'><i class='mdui-menu-item-icon mdui-icon material-icons'>swap_horiz</i>移动</a></li>
        <li class='mdui-menu-item' id='Menu_Paste'><a href='javascript:FileOperations(23)'><i class='mdui-menu-item-icon mdui-icon material-icons'>content_paste</i>粘贴</a></li>
        <li class='mdui-menu-item' id='Menu_Delete'><a href='javascript:FileOperations(0)'><i class='mdui-menu-item-icon mdui-icon material-icons'>delete</i>删除</a></li>
    </ul>

    <?php
    if ($Type == 'Login') {
    ?>
        <div class='mdui-container mdui-p-t-3' id='Login_Container'>
            <div class='mdui-card'>
                <div class='mdui-card-primary'>
                    <div class='mdui-card-primary-title'>登录</div>
                    <div class='mdui-card-primary-subtitle'>登录PikPak</div>
                </div>

                <div class='mdui-card-content'>
                    <ul class='mdui-list'>
                        <li class='mdui-list-item'>
                            <i class='mdui-list-item-icon mdui-icon material-icons'>email</i>
                            <div class='mdui-list-item mdui-textfield mdui-textfield-not-empty'>
                                <input id='Mail' class='mdui-textfield-input' type='text' placeholder='邮箱'>
                            </div>
                        </li>

                        <li class='mdui-list-item'>
                            <i class='mdui-list-item-icon mdui-icon material-icons'>lock</i>
                            <div class='mdui-list-item mdui-textfield mdui-textfield-not-empty'>
                                <input id='PassWord' class='mdui-textfield-input' type='password' placeholder='密码'>
                            </div>
                        </li>

                        <li class='mdui-list-item' onclick='Login()'>
                            <i class='mdui-list-item-icon mdui-icon material-icons'>check</i>
                            <div class='mdui-list-item'>登录</div>
                        </li>

                        <a class='mdui-list-item' href='./?Type=Register'><i class='mdui-list-item-icon mdui-icon material-icons'>arrow_forward</i>
                            <div class='mdui-list-item'>注册</div>
                        </a>
                        <!--<a class='mdui-list-item' href='./?Type=Login_Phone'><i class='mdui-list-item-icon mdui-icon material-icons'>phone</i>
                            <div class='mdui-list-item'>手机号登录</div>
                        </a>-->
                        <a class='mdui-list-item' target='_blank' href='https://i.mypikpak.com/v1/file/center/account/v1/password/?type=forget_password&locale=zh-cn'><i class='mdui-list-item-icon mdui-icon material-icons'>autorenew</i>
                            <div class='mdui-list-item'>忘记密码</div>
                        </a>
                    </ul>
                </div>
            </div>
        </div>

        <script>
            document.addEventListener('DOMContentLoaded', function() {
                document.getElementById('WebTitle').innerText = 'PikPak | 登录'
            })
        </script>
    <?php
    } else if ($Type == 'Register') {
    ?>
        <div class='mdui-container mdui-p-t-3' id='Register_Container'>
            <div class='mdui-card'>
                <div class='mdui-card-primary'>
                    <div class='mdui-card-primary-title' id='Register_Title'>注册</div>
                    <div class='mdui-card-primary-subtitle' id='Register_Subtitle'>注册PikPak</div>
                </div>

                <div class='mdui-card-content'>
                    <ul class='mdui-list'>
                        <div id='Register'>
                            <li class='mdui-list-item'>
                                <i class='mdui-list-item-icon mdui-icon material-icons'>account_circle</i>
                                <div class='mdui-list-item'>
                                    <div class='mdui-textfield mdui-textfield-not-empty'>
                                        <input id='Account' class='mdui-textfield-input' type='text' placeholder='用户名'>
                                    </div>
                                </div>
                            </li>

                            <li class='mdui-list-item'>
                                <i class='mdui-list-item-icon mdui-icon material-icons'>email</i>
                                <div class='mdui-list-item'>
                                    <div class='mdui-textfield mdui-textfield-not-empty'>
                                        <input id='Mail' class='mdui-textfield-input' type='text' placeholder='邮箱'>
                                    </div>
                                </div>
                            </li>

                            <li class='mdui-list-item'>
                                <i class='mdui-list-item-icon mdui-icon material-icons'>verified_user</i>
                                <div class='mdui-list-item mdui-textfield mdui-textfield-not-empty'>
                                    <input id='VerificationCode' class='mdui-textfield-input' type='text' placeholder='验证码'>
                                </div>

                                <button id='Button_GetVerifiedCode' class='mdui-btn mdui-btn-raised mdui-ripple' onclick='GetVerifiedCode(this)'>发送验证码<i class='mdui-icon mdui-icon-right material-icons'>send</i></button>
                            </li>

                            <li class='mdui-list-item'>
                                <i class='mdui-list-item-icon mdui-icon material-icons'>lock</i>
                                <div class='mdui-list-item mdui-textfield mdui-textfield-not-empty' style='padding-right:10px'>
                                    <input id='PassWord' class='mdui-textfield-input' type='password' placeholder='密码'>
                                </div>

                                <div class='mdui-list-item mdui-textfield'>
                                    <input id='Repeat_PassWord' class='mdui-textfield-input' type='password' placeholder='重复密码'>
                                </div>
                            </li>

                            <li class='mdui-list-item' onclick='Register()'>
                                <i class='mdui-list-item-icon mdui-icon material-icons'>done_all</i>
                                <div class='mdui-list-item'>注册</div>
                            </li>
                        </div>

                        <li class='mdui-list-item' onclick='window.location.replace("./?Type=Login")'>
                            <i class='mdui-list-item-icon mdui-icon material-icons'>arrow_forward</i>
                            <div class='mdui-list-item'>登陆</div>
                        </li>

                        <!--<a class='mdui-list-item' href='./?Type=Login_Phone'><i class='mdui-list-item-icon mdui-icon material-icons'>phone</i>
                            <div class='mdui-list-item'>手机号登录</div>
                        </a>-->
                    </ul>
                </div>
            </div>
        </div>

        <script>
            document.addEventListener('DOMContentLoaded', function() {
                document.getElementById('WebTitle').innerText = 'PikPak | 注册'
            })
        </script>
    <?php
    } else if ($Type == 'Login_Phone') {
    ?>
        <div class='mdui-container mdui-p-t-3' id='Login_Phone_Container'>
            <div class='mdui-card'>
                <div class='mdui-card-primary'>
                    <div class='mdui-card-primary-title' id='Register_Title'>登陆/注册</div>
                    <div class='mdui-card-primary-subtitle' id='Register_Subtitle'>登陆/注册PikPak</div>
                </div>

                <div class='mdui-card-content'>
                    <ul class='mdui-list'>
                        <li class='mdui-list-item'>
                            <i class='mdui-list-item-icon mdui-icon material-icons'>account_circle</i>
                            <div class='mdui-list-item'>
                                <div class='mdui-textfield mdui-textfield-not-empty'>
                                    <input id='Phone' class='mdui-textfield-input' style='width:260px' type='text' placeholder='区号和手机号例如:+8613800138000'>
                                </div>
                            </div>
                        </li>

                        <li class='mdui-list-item'>
                            <i class='mdui-list-item-icon mdui-icon material-icons'>verified_user</i>
                            <div class='mdui-list-item mdui-textfield mdui-textfield-not-empty'>
                                <input id='VerificationCode_Photo' class='mdui-textfield-input' style='width:260px' type='text' placeholder='验证码'>
                            </div>

                            <button id='Button_GetVerifiedCode_Photo' class='mdui-btn mdui-btn-raised mdui-ripple' onclick='GetVerifiedCode_Photo(this)'>发送验证码<i class='mdui-icon mdui-icon-right material-icons'>send</i></button>
                        </li>

                        <li class='mdui-list-item' onclick='Register_Photo()'>
                            <i class='mdui-list-item-icon mdui-icon material-icons'>done_all</i>
                            <div class='mdui-list-item'>登陆</div>
                        </li>

                        <a class='mdui-list-item' href='./?Type=Register'><i class='mdui-list-item-icon mdui-icon material-icons'>arrow_forward</i>
                            <div class='mdui-list-item'>注册</div>
                        </a>
                    </ul>
                </div>
            </div>
        </div>

        <script>
            document.addEventListener('DOMContentLoaded', function() {
                document.getElementById('WebTitle').innerText = 'PikPak | 手机号登录'
            })
        </script>
    <?php
    } else if ($Type == 'List') {
    ?>
        <div class='mdui-p-t-1'>
            <div class='mdui-col ProhibitChoose' id='ColPathStyle'>
                <div class='mdui-card' style='height:64px;margin-left:258px'>
                    <div class='mdui-card-content'>
                        <div id='Path' style='margin-top:-2px'></div>
                    </div>
                </div>
            </div>

            <div class='mdui-col' id='ColList_Menu_For_Style'>
                <div class='mdui-card' id='ColListStyle'>
                    <div class='mdui-table-fluid'>
                        <table class='mdui-table mdui-table-hoverable'>
                            <thead>
                                <tr id='ListThead'></tr>
                            </thead>

                            <tbody id='List'></tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div id='DoubleClickToLoadMoreFiles_Text_Length' style='display:none'></div>

            <div style='height:8px'></div>
            <div class='mdui-col' id='ColFileInfoListStyle'>
                <div class='mdui-card' style='height:48px;margin-left:258px'>
                    <div style='margin-top:4px;margin-left:8px'>
                        <div class='ProhibitChoose'>
                            <img src='https://ae05.alicdn.com/kf/Ufd018aaeef3743708e224a04cb4f02bdr.png'></img>
                        </div>

                        <div style='margin-top:-40px;margin-left:46px'>
                            <a id='FileInfo' style='font-size:20px;font-weight:600;color:#448AFF'>正在加载数据</a>
                        </div>
                    </div>

                    <div style='margin-top:-31.205px'>
                        <button class='mdui-btn mdui-color-indigo mdui-float-right mdui-ripple' style='margin-right:8px' onclick='List_DownLoad(false)'><i class='mdui-list-item-icon mdui-icon material-icons'>file_download</i> 下载管理</button>

                        <button class='mdui-btn mdui-color-indigo-accent mdui-float-right mdui-ripple' style='margin-right:8px' onclick='window.open("https://t.me/Uallen_Qbit")'><i class='mdui-list-item-icon mdui-icon material-icons'>chat</i> 联系开发者</button>

                        <button class='mdui-btn mdui-color-red mdui-float-right mdui-ripple' style='margin-right:8px' onclick='window.open("https://afd.kinh.cc/")'><i class='mdui-list-item-icon mdui-icon material-icons'>attach_money</i> 支持开发者</button>

                        <button class='mdui-btn mdui-color-green-600 mdui-float-right mdui-ripple' style='margin-right:8px' onclick='window.open("https://cilishenqi.cc/#search")'><i class='mdui-list-item-icon mdui-icon material-icons'>search</i> 资源搜索</button>
                    </div>
                </div>
            </div>

            <div class='mdui-col' style='width:250px' id='ColUser'>
                <div class='mdui-card' id='ColUserStyle'>
                    <div id='User'></div>
                </div>
            </div>
        </div>

        <script>
            document.addEventListener('DOMContentLoaded', function() {
                document.getElementById('WebTitle').innerText = 'PikPak | 我的文件'

                AdjustWindow()
                Initialization()
            })
        </script>
    <?php
    } else if ($Type == 'List_Offline') {
    ?>
        <div id='List' class='mdui-container'></div>

        <div class='mdui-fab-wrapper' id='List_Offline_MDUI_FAB'>
            <button class='mdui-fab mdui-color-theme-accent mdui-ripple' onclick='LoadIng(true,"正在返回",220);window.location.replace("./?Type=List")'>
                <i class='mdui-icon material-icons'>arrow_back</i>
                <i class='mdui-icon mdui-fab-opened material-icons'>keyboard_backspace</i>
            </button>

            <div class='mdui-fab-dial'>
                <button class='mdui-fab mdui-fab-mini mdui-ripple mdui-color-indigo' onclick='AddOffline()'><i class='mdui-icon material-icons'>add</i></button>
                <button class='mdui-fab mdui-fab-mini mdui-ripple mdui-color-indigo' onclick='GetListOffline_Start()'><i class='mdui-icon material-icons'>refresh</i></button>
            </div>
        </div>

        <script>
            document.addEventListener('DOMContentLoaded', function() {
                document.getElementById('WebTitle').innerText = 'PikPak | 离线任务'

                new mdui.Fab('#List_Offline_MDUI_FAB')
                GetListOffline_Start()
            })
        </script>
    <?php
    } else if ($Type == 'Invite') {
    ?>
        <div class='mdui-container mdui-p-t-1'>
            <div class='mdui-col'>
                <div class='mdui-card'>
                    <div class='mdui-card-primary'>
                        <div class='mdui-card-primary-title'>邀请详细</div>
                        <div class='mdui-card-primary-subtitle'>推广计划</div>
                    </div>

                    <div class='mdui-card-content mdui-typo'>
                        <div class='mdui-card-primary-title'>统计</div>

                        <div class='mdui-row mdui-row-md-2'>
                            <div class='mdui-col mdui-list-item mdui-ripple'>
                                <i class='mdui-list-item-icon mdui-icon material-icons'>group_add</i>
                                <div class='mdui-list-item-content'>邀请奖励(天/人)<a style='font-weight:600;color:#475bca' id='Invite_Data1'>0/0</a></div>
                            </div>
                            <div class='mdui-col mdui-list-item mdui-ripple'>
                                <i class='mdui-list-item-icon mdui-icon material-icons'>group</i>
                                <div class='mdui-list-item-content'>会员分成(天/次)<a style='font-weight:600;color:#475bca' id='Invite_Data2'>0/0</a></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class='mdui-container mdui-p-t-1'>
            <div class='mdui-col'>
                <div class='mdui-card'>
                    <div class='mdui-card-content mdui-typo'>
                        <div class='mdui-card-primary-title'>邀请链接</div>
                        <pre id='Invite_Link' onclick='DocumentCopyText(this.innerText);mdui.snackbar({position:"top",message:"已复制"})'>正在加载数据</pre>
                    </div>
                </div>
            </div>
        </div>

        <div class='mdui-container mdui-p-t-1'>
            <div class='mdui-col'>
                <div class='mdui-card'>
                    <div class='mdui-card-primary'>
                        <div class='mdui-card-primary-title'>邀请列表</div>
                        <div class='mdui-card-primary-subtitle'>最近邀请用户</div>
                    </div>

                    <div class='mdui-card-content mdui-typo'>
                        <div class='mdui-table-fluid'>
                            <table class='mdui-table mdui-table-hoverable'>
                                <thead>
                                    <tr>
                                        <th style='height:60px'>邀请用户</th>
                                        <th>奖励天数</th>
                                        <th>邀请时间</th>
                                    </tr>
                                </thead>

                                <tbody id='Invite_List'></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class='mdui-fab-wrapper' id='List_Invite_MDUI_FAB'>
            <button class='mdui-fab mdui-color-theme-accent mdui-ripple' onclick='window.location.replace("./?Type=List")'>
                <i class='mdui-icon material-icons'>arrow_back</i>
                <i class='mdui-icon mdui-fab-opened material-icons'>keyboard_backspace</i>
            </button>
            <div class='mdui-fab-dial'>
                <button class='mdui-fab mdui-fab-mini mdui-ripple mdui-color-indigo' onclick='GetInviteData()'><i class='mdui-icon material-icons'>refresh</i></button>
            </div>
        </div>

        <script>
            document.addEventListener('DOMContentLoaded', function() {
                document.getElementById('WebTitle').innerText = 'PikPak | 推广计划'

                new mdui.Fab('#List_Invite_MDUI_FAB')
                GetInviteData()
            })
        </script>
    <?php
    } else if ($Type == 'PayVIP') {
    ?>
        <div id='PayVIPList'></div>

        <script>
            document.addEventListener('DOMContentLoaded', function() {
                document.getElementById('WebTitle').innerText = 'PikPak | 会员充值'

                GetPayVIPList()
            })
        </script>
    <?php
    } else {
    ?>
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                if (IfUser() == true) {
                    window.location.replace('./?Type=List')
                } else {
                    window.location.replace('./?Type=Login')
                }
            })
        </script>
    <?php
    }
    ?>

    <div id='DivVar_DownLoadChooseWidth' style='display:none'></div>
    <div id='DivVar_DownLoadLink' style='display:none'></div>
    <div id='DivVar_DownLoadName' style='display:none'></div>
    <div id='DivVar_AddDownLoadCount' style='display:none'></div>

    <form enctype='multipart/form-data' style='display:none'>
        <input id='UPLoadTorrent_Input' type='file' accept='.torrent'><input>
    </form>

    <form enctype='multipart/form-data' style='display:none'>
        <input id='UPLoadTorrent_Picture' type='file'><input>
    </form>

    <div class='mdui-dialog' id='Music'>
        <div class='mdui-dialog-content'>
            <div id='APlayerDivID'></div>
        </div>

        <div class='mdui-dialog-actions'>
            <button mdui-dialog-confirm class='mdui-btn mdui-color-green-600 mdui-ripple' onclick='GlobalVariable_PlayMusic_APlaye.pause();DownLoad(0)'><i class='mdui-icon mdui-icon-left material-icons'>file_download</i>下载</button>
            <button mdui-dialog-confirm class='mdui-btn mdui-color-red-400 mdui-ripple' onclick='GlobalVariable_PlayMusic_APlaye.pause()'><i class='mdui-icon mdui-icon-left material-icons'>close</i>关闭</button>
        </div>
    </div>

    <div class='mdui-dialog' id='Video'>
        <div class='mdui-dialog-content'>
            <div id='DPlayerDivID'></div>
        </div>

        <div class='mdui-dialog-actions'>
            <button mdui-dialog-confirm class='mdui-btn mdui-color-green-600 mdui-ripple' onclick='GlobalVariable_Video_DPlayer.pause();DownLoad(0)'><i class='mdui-icon mdui-icon-left material-icons'>file_download</i>下载</button>
            <button mdui-dialog-confirm class='mdui-btn mdui-color-red-400 mdui-ripple' onclick='GlobalVariable_Video_DPlayer.pause()'><i class='mdui-icon mdui-icon-left material-icons'>close</i>关闭</button>
        </div>
    </div>

    <div class='mdui-dialog' id='SetUserConfigChoose' style='width:320px'>
        <div class='mdui-dialog-title'>编辑个人信息</div>

        <div class='mdui-dialog-actions'>
            <button class='mdui-btn' mdui-dialog-confirm onclick='SetUserConfigName()'>用户名</button>
            <!--<button class='mdui-btn' mdui-dialog-close onclick='SetUserConfigPicture()'>头像</button>-->
        </div>
    </div>

    <div class='mdui-dialog' id='DownLoadChoose'>
        <div class='mdui-tab mdui-tab-centered' id='DownLoadChooseTap' mdui-tab>
            <a href='#DownLoad-Tab-DownLoad' class='mdui-ripple' onclick='SetDownLoadChooseWidth(370);document.getElementById("SelectTOP").setAttribute("style","position:relative;top:307px")'>直接下载(不推荐)</a>
            <a href='#DownLoad-Tab-IDM' class='mdui-ripple' onclick='SetDownLoadChooseWidth(370);document.getElementById("SelectTOP").setAttribute("style","position:relative;top:307px")'>IDM下载(需协议EF2)</a>
            <a href='#DownLoad-Tab-Aria2' class='mdui-ripple' onclick='SetDownLoadChooseWidth(434);document.getElementById("SelectTOP").setAttribute("style","position:relative;top:373px")'>Arai2下载(不推荐)</a>
            <a href='#DownLoad-Tab-XunLei' class='mdui-ripple' onclick='SetDownLoadChooseWidth(370);document.getElementById("SelectTOP").setAttribute("style","position:relative;top:307px")'>迅雷下载(推荐)</a>
        </div>

        <div class='mdui-divider'></div>

        <div id='ChangeOfDownloadAddressServerID' style='display:none'></div>
        <div style='margin-top:-36px;margin-left:16px'>
            <div id='SelectTOP' style='position:relative;top:307px'>
                <lua style='font-size:16px'>下载服务器:</lua>
                <select class='mdui-select' id='DownLoadChoose_SelectList' onclick='ChangeOfDownloadAddress(this.value)'>
                    <option value='Official'>官方直连</option>
                    <option value='OfficialIP'>官方IP直连</option>
                    <option value='CDN'>CDN代理加速</option>
                </select>
            </div>
        </div>

        <div class='mdui-p-a-2 mdui-typo' id='DownLoadChoose_MDUI_Typo'>
            <div id='DownLoad-Tab-DownLoad'>
                <div style='text-align:center'>
                    <img id='DownLoadChoose_DownLoad_Image' style='width:120px;height:120px'></img>

                    <br>

                    <a style='font-weight:800;color:#000000;-webkit-line-clamp:1;-webkit-box-orient:vertical;display:-webkit-box' id='DownLoadChoose_DownLoad_Name' onclick='DocumentCopyText(document.getElementById("DivVar_DownLoadName").innerText);mdui.snackbar({position:"top",message:"已复制"})'></a>
                </div>

                <label class='mdui-textfield-label'>下载地址</label>
                <input class='mdui-textfield-input' type='text' id='DownLoadChoose_DownLoad_DLink'></input>

                <div class='mdui-dialog-actions'>
                    <button class='mdui-btn mdui-color-green-600 mdui-ripple' onclick='window.open(document.getElementById("DownLoadChoose_DownLoad_DLink").value);mdui.snackbar({position:"top",message:"已引导浏览器下载"})'><i class='mdui-icon mdui-icon-left material-icons'>file_download</i>下载</button>
                    <button mdui-dialog-confirm class='mdui-btn mdui-color-red-400 mdui-ripple'><i class='mdui-icon mdui-icon-left material-icons'>close</i>关闭</button>
                </div>
            </div>

            <div id='DownLoad-Tab-IDM'>
                <div style='text-align:center'>
                    <img id='DownLoadChoose_IDM_Image' style='width:120px;height:120px'></img>

                    <br>

                    <a style='font-weight:800;color:#000000;-webkit-line-clamp:1;-webkit-box-orient:vertical;display:-webkit-box' id='DownLoadChoose_IDM_Name' onclick='DocumentCopyText(document.getElementById("DivVar_DownLoadName").innerText);mdui.snackbar({position:"top",message:"已复制"})'></a>
                </div>

                <label class='mdui-textfield-label'>IDMEF2下载地址</label>
                <input class='mdui-textfield-input' type='text' id='DownLoadChoose_IDM_DLink'></input>

                <div class='mdui-dialog-actions'>
                    <button class='mdui-btn mdui-color-green-600 mdui-ripple' onclick='window.open(document.getElementById("DownLoadChoose_IDM_DLink").value);mdui.snackbar({position:"top",message:"已引导浏览器下载"})'><i class='mdui-icon mdui-icon-left material-icons'>file_download</i>调用IDM下载</button>
                    <button mdui-dialog-confirm class='mdui-btn mdui-color-red-400 mdui-ripple'><i class='mdui-icon mdui-icon-left material-icons'>close</i>关闭</button>
                </div>
            </div>

            <div id='DownLoad-Tab-Aria2'>
                <div style='text-align:center'>
                    <img id='DownLoadChoose_Aria2_Image' style='width:120px;height:120px'></img>

                    <br>

                    <a style='font-weight:800;color:#000000;-webkit-line-clamp:1;-webkit-box-orient:vertical;display:-webkit-box' id='DownLoadChoose_Aria2_Name' onclick='DocumentCopyText(document.getElementById("DivVar_DownLoadName").innerText);mdui.snackbar({position:"top",message:"已复制"})'></a>
                </div>

                <label class='mdui-textfield-label'>Aria2 WebSocket地址</label>
                <input class='mdui-textfield-input' type='text' id='Aria2Link'>

                <label class='mdui-textfield-label'>Aria2 Token</label>
                <input class='mdui-textfield-input' type='text' id='Aria2Token'>

                <div class='mdui-dialog-actions'>
                    <button mdui-dialog-confirm class='mdui-btn mdui-color-green-600 mdui-ripple' onclick='PassAria2DownloadData(document.getElementById("DivVar_DownLoadName").innerText,document.getElementById("DownLoadChoose_DownLoad_DLink").value,document.getElementById("Aria2Link").value,document.getElementById("Aria2Token").value)'><i class='mdui-icon mdui-icon-left material-icons'>near_me</i>传递下载数据到Aria2</button>
                    <button mdui-dialog-confirm class='mdui-btn mdui-color-red-400 mdui-ripple'><i class='mdui-icon mdui-icon-left material-icons'>close</i>关闭</button>
                </div>
            </div>

            <div id='DownLoad-Tab-XunLei'>
                <div style='text-align:center'>
                    <img id='DownLoadChoose_XunLei_Image' style='width:120px;height:120px'></img>

                    <br>

                    <a style='font-weight:800;color:#000000;-webkit-line-clamp:1;-webkit-box-orient:vertical;display:-webkit-box' id='DownLoadChoose_XunLei_Name' onclick='DocumentCopyText(document.getElementById("DivVar_DownLoadName").innerText);mdui.snackbar({position:"top",message:"已复制"})'></a>
                </div>

                <label class='mdui-textfield-label'>迅雷下载地址</label>
                <input class='mdui-textfield-input' type='text' id='DownLoadChoose_XunLei_DLink'></input>

                <div class='mdui-dialog-actions'>
                    <button class='mdui-btn mdui-color-green-600 mdui-ripple' onclick='window.open(document.getElementById("DownLoadChoose_XunLei_DLink").value);mdui.snackbar({position:"top",message:"已引导浏览器下载"})'><i class='mdui-icon mdui-icon-left material-icons'>file_download</i>调用迅雷下载</button>
                    <button mdui-dialog-confirm class='mdui-btn mdui-color-red-400 mdui-ripple'><i class='mdui-icon mdui-icon-left material-icons'>close</i>关闭</button>
                </div>
            </div>
        </div>
    </div>

    <script>
        if (window.location.href.indexOf('#') != -1) {
            window.location.replace('./')
        }

        <?php
        if ($Type == 'List' || $Type == 'List_Offline' || $Type == 'List') {
        ?>
            LoadIng(true, '正在加载数据', 220)
        <?php
        }
        ?>

        document.addEventListener('DOMContentLoaded', function() {
            var UserUA = window.navigator.userAgent.toLowerCase()
            if (UserUA.indexOf('micromessenger') == -1) {
                var SetBodyPictureData = localStorage.getItem('SetBodyPictureData')
                if (SetBodyPictureData == 1) {
                    document.getElementById('SetBodyPicture').innerHTML = "<a href='javascript:SetBodyPicture()'><i class='mdui-menu-item-icon mdui-icon material-icons'>insert_photo</i>禁用图景</a>"
                    document.getElementById('HTMLStyle').innerText = "body {background-image:url('https://www.dmoe.cc/random.php');background-size:100% 100%}.mdui-card {background-color:rgba(255, 255, 255, 0.8)}.mdui-table {background-color:#fff0}"
                }
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: '请点击右上角的三点，打开菜单，在默认浏览器中打开'
                }).then(
                    function() {
                        window.location.reload()
                    }
                )
            }
        })
    </script>
</body>

</html>