import {} from "https://cdn.bootcdn.net/ajax/libs/jquery/1.12.4/jquery.js";

const $btn = $('.login_btn');
const $phone = $('.phone');
const $password = $('.password');
const $phone_tips = $('.phone_tips');
const $password_tips = $('.password_tips');
let $flag = true;

$btn.on('click', function() {
    if ($phone.val() == '') {
        $phone_tips.html('手机号不能为空')
        $flag = false;
    }
    if ($password.val() == '') {
        $password_tips.html('密码不能为空')
        $flag = false;
    }
    if (!$flag) {
        return false;
    }
    $.ajax({
        type: 'post',
        url: 'http://192.168.64.2/www/workspace/changhong.com/php/login.php',
        data: {
            phone: $phone.val(),
            password: $password.val()
        }
    }).done(function(data) {
        if (data === 'true') {
            window.localStorage.setItem('loginphone', $phone.val());
            location.href = 'index1.html';
        } else {
            $password_tips.html('手机号或密码错误');
            $password.val('');
        }
    })

});