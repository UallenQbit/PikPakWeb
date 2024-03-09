window.onload = function () {
    var Host = document.location.toString();
    if (Host.substring(Host.indexOf("/?Type=") + 7, Host.length) == "List") {
        document.oncontextmenu = function (Event) {
            if (window.location.href.indexOf("#mdui-dialog") == -1 && document.getElementsByClassName("swal2-container swal2-center swal2-backdrop-show").length == 0) {
                Event.preventDefault();
            }
        };

        document.getElementById("ColUser").onmousedown = function (Event) {
            if (Event.button == 2) {
                var Width = Event.clientX;
                var Height = Event.clientY;
                UserAction_ColUser(Width, Height);
            }
        };

        document.getElementById("ColList_Menu_For_Style").onmousedown = function (Event) {
            if (Event.button == 2) {
                var Width = Event.clientX;
                var Height = Event.clientY;
                UserAction_ColList_Menu_For_Style(Width, Height);
            }
        };
    }
};
