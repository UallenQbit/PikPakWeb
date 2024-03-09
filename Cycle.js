document.addEventListener("DOMContentLoaded", function () {
    var Host = document.location.toString();
    if (Host.substring(Host.indexOf("/?Type=") + 7, Host.length) == "List") {
        CycleTask_Initialization_Start();
        CycleTask_GetDownLoadListLink_Start();
    }
});

function CycleTask_Initialization_Start() {
    setTimeout(function () {
        Initialization_Multithreading().then(function () {
            CycleTask_Initialization_Start();
        });
    }, 60000);
}

function CycleTask_GetDownLoadListLink_Start() {
    setTimeout(function () {
        GetDownLoadListLink().then(function () {
            CycleTask_GetDownLoadListLink_Start();
        });
    }, 1000);
}
