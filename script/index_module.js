import {} from 'https://cdn.bootcdn.net/ajax/libs/jquery/1.12.4/jquery.js';

//引入懒加载模块
import {} from "./jquery.lazyload.js";
//懒加载
$('img.lazy').lazyload({
    effect: "fadeIn" //切换形式
});

//首页购物车的渲染
if (localStorage.getItem('localsid') && localStorage.getItem('localnum')) {
    let arrsid = localStorage.getItem('localsid').split(',');
    let arrnum = localStorage.getItem('localnum').split(',');
    for (let i = 0; i < arrsid.length; i++) {
        render(arrsid[i], arrnum[i]);
    }
}

//封装函数实现渲染过程 - 克隆方式
function render(sid, num) {
    $.ajax({
        url: 'http://192.168.64.2/www/workspace/changhong.com/php/alldata.php',
        dataType: 'json'
    }).done(function(data) {
        $.each(data, function(index, value) {
            if (value.sid === sid) {
                let $clonebox = $('.tool-tips-row:hidden').clone(true, true);

                $clonebox.find('p a').html(value.title);
                $clonebox.find('h1 span').html(value.price);
                $clonebox.find('h1 b').html('x ' + num);
                $clonebox.css('display', 'block');
                $('.tips-nogoods').hide();
                $('.tool-container-tips-warp').append($clonebox);
                $('.tool-goods-pay').show();

                // index_allprice();
            }
        })
    })
}
//总价
function index_allprice() {
    let $allnum = 0;
    let $allprice = 0;
    $('.tool-tips-row:visible').each(function(index, element) { //索引  元素的元素对象
        if ($(this).find('.car-checkbox input').prop('checked')) { //判断当前商品前面的复选框是否是选中状态的
            $allnum += parseInt($(this).find('.qt-form input').val());
            $allprice += parseInt(($(this).find('.car-detail-price span').html()) * ($(this).find('.qt-form input').val()));
        }

    });
    $('.sum-pro-count span').html($allnum);
    $('.sum-price span').html($allprice);
    $('.total-type').html($allnum);
}

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

//轮播图
const $banner = $('.home-banner');
const $piclist = $('.home-banner-container a'); //三张图片
const $btnlist = $('.home-banner-num a'); //三个按钮

let $index = 0; //存放索引的变量。
let $timer = null;

function tabswitch() {
    $btnlist.eq($index).addClass('active').siblings('.home-banner-num a').removeClass('active'); //当前的按钮添加类，其他的按钮删除类。
    $piclist.eq($index).stop(true).animate({ //当前的图片显示，其他的图片隐藏  eq支持负数，负数从-1开始从后往前数。
        opacity: 1
    }).siblings('.home-banner-container a').stop(true).animate({
        opacity: 0
    });
}

$btnlist.on('click', function() {
    $index = $(this).index(); //当前的索引
    tabswitch();
});
$timer = setInterval(function() {
    $index++;
    if ($index > $btnlist.length - 1) {
        $index = 0;
    }
    tabswitch();
}, 4000)

//楼梯效果
let $louti = $('.xhome-fixl'); //整个楼梯的div
let $louceng = $('.home-series'); //楼层的div
let $loutinav = $('.xhome-fixl li'); //每个楼梯

function scroll() {
    //楼梯的显示与隐藏
    let $top = $(window).scrollTop();
    if ($top >= 400) {
        $louti.show();
        $('.pro-float-toTop').show();
    } else {
        $('.pro-float-toTop').hide();
        $louti.hide();
    }

    //通过滚动条的改变，给对应的楼梯添加激活状态(active)
    $louceng.each(function(index, element) {
        let $loucengtop = $(element).offset().top + 200; //每一个楼层的top值。
        if ($loucengtop >= $top) {
            $loutinav.removeClass('clicked'); //清除所有的楼梯上面的active。
            $loutinav.eq(index).addClass('clicked'); //当前对应的楼梯显示
            return false; //保证都是满足条件的第一个添加active.
        }
    });
}
scroll();

$(window).on('scroll', function() {
    scroll();
});

//点击楼梯切换到对应的楼层(运动)
$loutinav.on('click', function() {
    $(window).off('scroll'); //取消滚轮事件。
    $(this).addClass('clicked').siblings('li').removeClass('clicked');
    let $top = $louceng.eq($(this).index()).offset().top;
    //赋值给滚动条
    $('html').animate({
        scrollTop: $top
    }, function() { //点击运动结束，开启滚轮事件
        $(window).on('scroll', function() {
            scroll();
        });
    });
});

//右侧悬浮框的回到顶部效果
$('.pro-float-toTop').on('click', function() {
    //赋值给滚动条
    $('html').animate({
        scrollTop: 0
    });
});