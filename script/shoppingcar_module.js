//引入js模块
import {} from 'https://cdn.bootcdn.net/ajax/libs/jquery/1.12.4/jquery.js';
if (localStorage.getItem('localsid') && localStorage.getItem('localnum')) {
    let arrsid = localStorage.getItem('localsid').split(',');
    let arrnum = localStorage.getItem('localnum').split(',');
    for (let i = 0; i < arrsid.length; i++) {
        renderList(arrsid[i], arrnum[i]);
    }
}

//封装函数实现渲染过程 - 克隆方式

function renderList(sid, num) {
    $.ajax({
        url: 'http://192.168.64.2/www/workspace/changhong.com/php/alldata.php',
        dataType: 'json'
    }).done(function(data) {
        $.each(data, function(index, value) {
            if (value.sid === sid) {
                let $clonebox = $('.car-item-ls:hidden').clone(true, true);
                $clonebox.find('.car-detail-sp img').attr('src', value.picurl);
                $clonebox.find('.car-detail-sp img').attr('sid', value.sid); //添加的自定义属性

                $clonebox.find('.car-detail-title p').html(value.title);
                $clonebox.find('.car-detail-price span').html(value.price);
                $clonebox.find('.qt-form input').val(num);
                $clonebox.css('display', 'block');
                $('.cart_goods_info').append($clonebox);

                allprice();
            }
        })
    })
}

//封装函数统计商品的数量和总价（会有多次改变，所以需要封装）

function allprice() {
    let $allnum = 0;
    let $allprice = 0;
    $('.car-item-ls:visible').each(function(index, element) { //索引  元素的元素对象
        if ($(this).find('.car-checkbox input').prop('checked')) { //判断当前商品前面的复选框是否是选中状态的
            $allnum += parseInt($(this).find('.qt-form input').val());
            $allprice += parseInt(($(this).find('.car-detail-price span').html()) * ($(this).find('.qt-form input').val()));
        }

    });
    $('.sum-pro-count span').html($allnum);
    $('.sum-price span').html($allprice);
    $('.total-type').html($allnum);
}


//全选
$('.all-check').on('click', function() {
    $('.car-item-ls:visible').find('input:checkbox').prop('checked', $(this).prop('checked'));
    $('.all-check').prop('checked', $(this).prop('checked'));
    allprice();
})

$('.car-checkbox input').on('click', function() {
    if ($('.car-item-ls:visible').find('input:checkbox').length === $('.car-item-ls:visible').find('input:checked').length) {
        $('.all-check').prop('checked', true);
    } else {
        $('.all-check').prop('checked', false);
    }
    allprice();
})

//数量的加减
$('.addbtn').on('click', function() {
    let $num = $(this).parents('.car-item-ls').find('.qt-form input').val();
    $num++;
    $(this).parents('.car-item-ls').find('.qt-form input').val($num);
    allprice();
    localStorageData($(this));
})

$('.downbtn').on('click', function() {
    let $num = $(this).parents('.car-item-ls').find('.qt-form input').val();
    $num--;
    if ($num <= 1) {
        $num = 1;
    }
    $(this).parents('.car-item-ls').find('.qt-form input').val($num);
    allprice;
    localStorageData($(this));
})

$('.qt-form input').on('input', function() {
    let $reg = /^\d+$/; //行首行尾匹配一个或者多个数字
    if (!$reg.test($(this).val())) { //如果不满足条件，值为1
        $(this).val(1);
    }
    allprice;
    localStorageData($(this));
})

//将修改后的值存到本地存储中
let $arrsid = [];
let $arrnum = [];

function getLocalStorage() {
    if (localStorage.getItem('localsid') && localStorage.getItem('localnum')) { //商品已经存储过
        $arrsid = localStorage.getItem('localsid').split(','); //将获取的编号转换成数组，方便后面判断是否存在当前编号。
        $arrnum = localStorage.getItem('localnum').split(',');
    } else {
        $arrsid = [];
        $arrnum = [];
    }
}

function localStorageData(obj) {
    getLocalStorage(); //获得本地存储  并将其转换成为数组
    let $index = obj.parents('.car-item-ls').find('.car-detail-sp img').attr('sid');
    $arrnum[$arrsid.indexOf($index)] = obj.parents('.car-item-ls').find('.qt-form input').val(); //根据sid将对应的新的数量赋值给数组,重新存储。
    localStorage.setItem('localnum', $arrnum); //本地存储
}

function delstorage(arrsid, sid) {
    getLocalStorage();
    let $index = -1;
    $.each(arrsid, function(index, valuesid) {
        if (valuesid == sid) {
            $index = index; //满足条件的值对应的索引赋值给$index
        }
    });
    //获取对应的索引进行删除。
    $arrsid.splice($index, 1);
    $arrnum.splice($index, 1);

    //重新设置本地存储。
    localStorage.setItem('localsid', $arrsid);
    localStorage.setItem('localnum', $arrnum);
}

//删除购物车商品列表
$('.del').on('click', function() {
    let $this = $(this);
    if (window.confirm('确定要删除此商品吗?')) {
        $this.parents('.car-item-ls').remove();
        delstorage($arrsid, $(this).parents('.car-item-ls').find('.car-detail-sp img').attr('sid'))
        allprice();
    }
})

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