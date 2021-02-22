import {} from 'https://cdn.bootcdn.net/ajax/libs/jquery/1.12.4/jquery.js';

//在详情页面获取商品的sid - 列表传入一个sid到详情页。
let $sid = location.search.substring(1).split('=')[1];

if (!$sid) {
    $sid = 1;
}

const $spic = $('.spic'); //小图
const $smallpic = $('.spic img'); //小图里面的图片
const $bpic = $('.bf img'); //大图里面的图片
const $sf = $('.sf'); //小放大镜
const $bf = $('.bf'); //大放
const $title = $('.title'); //标题
const $price = $('.price'); //价格
const $list = $('.detail-item ul'); //存小图列表的
const $detailpic = $('.detail-pic');
let $liwidth = 0; //li的宽度
let $lilenth = 0; //所有li的个数
const $prenum = $('.pre-num');
const $nextnum = $('.next-num');
const $countvalue = $('.count-value');
let $pronum = 1;


//2.将当前的sid传给后端，后端返回sid对应的数据给前端。
$.ajax({
    url: 'http://192.168.64.2/www/workspace/changhong.com/php/getsid.php',
    data: {
        datasid: $sid
    },
    dataType: 'json'
}).done(function(data) {
    console.log(data);
    $smallpic.attr('src', data.picurl);
    $bpic.attr('src', data.picurl);
    $title.html(data.title);
    $price.html(data.price)
        //渲染小图列表
    let $picarr = data.piclisturl.split(','); //数组
    let $strHtml = '';
    $.each($picarr, function(index, value) {
        $strHtml += ` 
                <li>
                    <img src="${value}" alt="">
                </li>
            `;
        $list.html($strHtml);
    });

    //这里可以任意的获取渲染的数据。
    $lilenth = $('.detail-item ul li').length; //存储li的个数
    if ($lilenth < 6) {
        $('.item-next').css('color', '#fff');
    }

    $liwidth = $('.detail-item ul li').eq(0).outerWidth(true); //存储一个li的宽度
})

//3.放大镜效果
//3.1.鼠标移入小图，显示小放和大放
$spic.hover(function() {
    $sf.css('display', 'block');
    $bf.css('display', 'block');

    //3.2.计算小放的尺寸和比例
    $sf.width($spic.outerWidth() * $bf.outerWidth() / $bpic.outerWidth());
    $sf.height($spic.outerHeight() * $bf.outerHeight() / $bpic.outerHeight());
    let $bili = $bpic.outerWidth() / $spic.outerWidth(); //比例

    //3.3.鼠标在小图里面移动，小放跟随鼠标
    $spic.on('mousemove', function(ev) {
        let $leftvalue = ev.pageX - $detailpic.offset().left - $sf.outerWidth() / 2;
        let $topvalue = ev.pageY - $detailpic.offset().top - $sf.outerHeight() / 2;
        if ($leftvalue < 0) {
            $leftvalue = 0;
        } else if ($leftvalue >= $spic.outerWidth() - $sf.outerWidth()) {
            $leftvalue = $spic.outerWidth() - $sf.outerWidth();
        }
        if ($topvalue < 0) {
            $topvalue = 0
        } else if ($topvalue >= $spic.outerHeight() - $sf.outerHeight()) {
            $topvalue = $spic.outerHeight() - $sf.outerHeight();
        };
        $sf.css({
            left: $leftvalue,
            top: $topvalue
        });
        $bpic.css({
            left: -$bili * $leftvalue,
            top: -$bili * $topvalue
        })
    });
}, function() {
    $sf.css('display', 'none');
    $bf.css('display', 'none');
});

//3.4.点击小图，切换大图。
const $listul = $('.detail-item ul');
$listul.on('mouseover', 'li', function() {
    let $url = $(this).find('img').attr('src');
    $smallpic.attr('src', $url);
    $bpic.attr('src', $url)
});

//3.5.通过小图两侧的按钮，切换小图。
let $num = 5;
$('.item-next').on('click', function() {
    if ($lilenth > $num) {
        $num++;
        $('.item-pre').css('color', '#333');
        if ($num === $lilenth) {
            $('.item-next').css('color', '#fff')
        }
    }
    $listul.animate({
        left: -$liwidth * ($num - 5)
    });

});
$('.item-pre').on('click', function() {
    if ($num > 5) {
        $num--;
        $('.item-next').css('color', '#333');
        if ($num === 5) {
            $('.item-pre').css('color', '#fff');
        }
    }
    $listul.animate({
        left: -$liwidth * ($num - 5)
    });
});
//数量的添加和减少
$nextnum.on('click', function() {
    $pronum++;
    $countvalue.val($pronum);
});
$prenum.on('click', function() {
    $pronum--;
    $countvalue.val($pronum);
    if ($pronum <= 1) {
        $pronum = 1;
        $countvalue.val($pronum);
    }
});
$countvalue.on('input', function() {
    let $reg = /^\d+$/; //行首行尾匹配一个或者多个数字
    if (!$reg.test($(this).val())) { //如果不满足条件，值为1
        $(this).val(1);
    }
})


//4.购物车

let $arrsid = [];
let $arrnum = [];

function getLocalStorage() {
    if (localStorage.getItem('localsid') && localStorage.getItem('localnum')) {
        $arrsid = localStorage.getItem('localsid').split(',');
        $arrnum = localStorage.getItem('localnum').split(',');
    } else {
        $arrsid = [];
        $arrnum = [];
    }
};

//开始存储商品的编号和数量

const $addbtn = $('.add-shoppingcar');
$addbtn.on('click', function() {
    getLocalStorage();
    if ($arrsid.includes($sid)) {
        let $index = $arrsid.indexOf($sid);
        $arrnum[$index] = parseInt($arrnum[$index]) + parseInt($countvalue.val());
        localStorage.setItem('localnum', $arrnum);
    } else {
        $arrsid.push($sid);
        localStorage.setItem('localsid', $arrsid);
        $arrnum.push($countvalue.val());
        localStorage.setItem('localnum', $arrnum);
    }
    alert('成功加入' + $countvalue.val() + '件商品');
})

const $unlogin = $('.unlogin');
const $logined = $('.logined');
const $quit = $('.quit');
const $infologined = $('.info-logined')

if (window.localStorage.getItem('loginphone')) {
    $logined.show();
    $unlogin.hide();
    $('.login_name').html(window.localStorage.getItem('loginphone'));
    $infologined.html(window.localStorage.getItem('loginphone'));
}

$quit.on('click', function() {
    $logined.hide();
    $unlogin.show();
    window.localStorage.removeItem('loginphone'); //删除本地存储
});

//登录注册
const $unlogin = $('.unlogin');
const $logined = $('.logined');
const $quit = $('.quit');
const $infologined = $('.info-logined')

if (window.localStorage.getItem('loginphone')) {
    $logined.show();
    $unlogin.hide();
    $('.login_name').html(window.localStorage.getItem('loginphone'));
    $infologined.html(window.localStorage.getItem('loginphone'));
}

$quit.on('click', function() {
    $logined.hide();
    $unlogin.show();
    window.localStorage.removeItem('loginphone'); //删除本地存储
});