// ==UserScript==
// @name         熊猫tv订阅列表
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  订阅列表直接当前页显示, 不跳转
// @author       Dingjz
// @include      http://www.panda.tv/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    // 订阅http://www.panda.tv/myfollow
    var orderContainer = $("<div></div>");
    $("body").append(orderContainer);
    orderContainer.css({
        position: "fixed",
        top: 0,
        left: $(".sidebar-container").width(),
        "z-index": 99999,
    });
    orderContainer.hide();
    // 打开状态
    var show = false;
    // 点击订阅按钮显示半透明列表
    $("a[href='/myfollow']").click(function (ev) {
        ev.preventDefault();
        orderContainer.html("");
        if (!show) {
            $.ajax({
                url: "http://www.panda.tv/myfollow",
                method: "get",
                success: function (data) {
                    var mainReg = /<!-- 正在直播 start -->(.|\n)+<!-- 正在直播 end -->/g;
                    var resultArr = data.match(mainReg);
                    var dataDom = $.parseHTML(resultArr[0]);
                    console.log(dataDom);
                    orderContainer.append(dataDom);
                    orderContainer.show();
                    orderContainer.find("#follow-list-container").css({
                        background: "rgba(227, 231, 231, 0.85)",
                        fontSize: 14,
                        overflow: "scroll",
                        height: $(document).height()
                    });
                    orderContainer.find("img").each(function() {
                        $(this).attr("src", $(this).attr("data-original"));
                        $(this).css({
                            width: 150
                        });
                    });
                },
                error: function (err) {
                    console.log(err);
                    orderContainer.html(err.toString());
                    orderContainer.show();
                },
                complete: function () {
                    show = true;
                }
            });
        }else{
            orderContainer.hide();
            show = false;
        }
    });
})();