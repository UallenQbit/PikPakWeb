var Paste_UPLoad_Torrent = document.getElementById("Paste_UPLoad_Torrent");

Paste_UPLoad_Torrent.addEventListener("dragenter", function (Result) {
    Result.preventDefault();
});

Paste_UPLoad_Torrent.addEventListener("dragover", function (Result) {
    Result.preventDefault();
});

Paste_UPLoad_Torrent.addEventListener("drop", function (Result) {
    Result.preventDefault();

    var WebUrl = window.location.href;
    if (WebUrl.indexOf("/?Type=List") != -1 || WebUrl.indexOf("/?Type=List_Offline") != -1) {
        var FileTorrent = Result.dataTransfer.files[0];
        var Name = FileTorrent.name;

        if (Name.split(".").pop() == "torrent") {
            LoadIng(true, "正在解析种子文件(Torrent)", 300);

            var Data = new FormData();
            Data.append("FileTorrent", FileTorrent);

            $.ajax({
                dataType: "json",
                type: "POST",
                url: "https://api.kinh.cc/Torrent/FetFileTorrentHash.php",
                data: Data,
                cache: false,
                processData: false,
                contentType: false,
                error: function () {
                    LoadIng(false);

                    Swal.fire({
                        icon: "error",
                        title: "解析失败",
                        confirmButtonText: "刷新",
                    }).then(function () {
                        window.location.reload();
                    });
                },
                success: async function (Result) {
                    LoadIng(false);

                    if (Result.Status == 0) {
                        Hash = Result.Hash;

                        mdui.snackbar({
                            position: "top",
                            message: "解析磁力链接成功",
                        });

                        await AddOffline();

                        var MagNet = "magnet:?xt=urn:btih:" + Hash;
                        document.getElementsByClassName("mdui-textfield-input")[document.getElementsByClassName("mdui-textfield-input").length - 1].value = MagNet;
                    } else {
                        mdui.snackbar({
                            position: "top",
                            message: "解析失败",
                        });
                    }
                },
            });
        } else {
            mdui.snackbar({
                position: "top",
                message: "拖拽文件不是种子文件(Torrent)",
            });
        }
    }
});
