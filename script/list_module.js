//引入jquery模块
import {} from "https://cdn.bootcdn.net/ajax/libs/jquery/1.12.4/jquery.js";

//引入懒加载模块
import {} from "./jquery.lazyload.js";

//引入分页的模块
import {} from "./jquery.pagination.js";

//渲染
const $list = $('.list>ul');
let $page = null;
//排序的操作-设置初始变量
let $array = []; //排序后的数组
let $array_default = []; //排序前的数组
let $prev = 0; //上一个价格
let $next = 0; //下一个价格

$.ajax({
    url: 'http://192.168.64.2/www/workspace/changhong.com/php/list.php',
    dataType: 'json'
}).done(function(data) {
    $page = data.pagesize;
    // console.log(data);
    let $arrdata = data.pagecontent; //获取初始的数据。
    let $strhtml = '';
    $.each($arrdata, function(index, value) {
        $strhtml += `
        <li>
            <a href="detail.html?sid=${value.sid}" class="product-pic"><img src="${value.picurl}" alt=""></a>
            <p class="title">${value.title}</p>
            <span>¥</span> <span class="price">${value.price}</span>
            <div class="goods-choose clear">
                <div class="db clear">
                    <div class="db-check">
                        <input type="checkbox">
                    </div>
                    <p>对比</p>
                </div>
                <div class="shoucang">
                    <p>收藏</p>
                </div>
                <div class="car">
                    <p>加入购物车</p>
                </div>
            </div>
        </li>
        `;
    });
    $list.html($strhtml); //追加

    //排序
    $array = []; //排序后的数组
    $array_default = []; //排序前的数组
    $('.list>ul li').each(function(index, element) {
        $array[index] = $(this);
        $array_default[index] = $(this); //保留初始状态
    });

    //添加懒加载
    $('img.lazy').lazyload({
        effect: "fadeIn" //切换形式
    });

    //分页
    $('.page').pagination({
        pageCount: $page, //总的页数
        jump: false, //是否开启跳转到指定的页数，布尔值。
        prevContent: '上一页', //将图标改成上一页下一页。
        nextContent: '下一页',
        callback: function(api) { //包含当前点击的分页的页码
            // console.log(api.getCurrent()); //获取当前的点击的页码。

            //将获取的页面传递给后端
            $.ajax({
                url: 'http://192.168.64.2/www/workspace/changhong.com/php/list.php',
                data: {
                    page: api.getCurrent() //将页码传递给后端。
                },
                dataType: 'json'
            }).done(function(data) {
                let $arrdata = data.pagecontent; //获取初始的数据。
                let $strhtml = '';
                $.each($arrdata, function(index, value) {
                    $strhtml += `
                    <li>
                    <a href="detail.html?sid=${value.sid}" class="product-pic"><img src="${value.picurl}" alt=""></a>
                    <p class="title">${value.title}</p>
                    <span>¥</span> <span class="price">${value.price}</span>
                    <div class="goods-choose clear">
                        <div class="db clear">
                            <div class="db-check">
                                <input type="checkbox">
                            </div>
                            <p>对比</p>
                        </div>
                        <div class="shoucang">
                            <p>收藏</p>
                        </div>
                        <div class="car">
                            <p>加入购物车</p>
                        </div>
                    </div>
                </li>
                `;
                });
                $list.html($strhtml); //追加


                //分页也要重排
                $array = []; //排序后的数组
                $array_default = []; //排序前的数组

                $('.list>ul li').each(function(index, element) {
                    $array[index] = $(this);
                    $array_default[index] = $(this); //保留初始状态
                });



                //添加懒加载
                $('img.lazy').lazyload({
                    effect: "fadeIn" //切换形式
                });
            });
        }
    });


});

//排序-添加按钮事件-冒泡排序
$('.sale').on('click', function() {
    $.each($array_default, function(index, value) { //value:每一个li元素
        $list.append(value); //append相当于appendChild,逐个追加
    });
    return;
});
$('.price_choose').on('click', function() {
    for (let i = 0; i < $array.length - 1; i++) {
        for (let j = 0; j < $array.length - i - 1; j++) {
            $prev = parseFloat($array[j].find('.price').html()); //第一个价格
            $next = parseFloat($array[j + 1].find('.price').html()); //第二个价格
            if ($prev > $next) { //交换位置。
                let temp = $array[j];
                $array[j] = $array[j + 1];
                $array[j + 1] = temp;
            }
        }
    }

    $.each($array, function(index, value) { //value:每一个li元素
        $list.append(value); //append相当于appendChild,逐个追加
    });
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