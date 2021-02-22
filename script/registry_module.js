import {} from "https://cdn.bootcdn.net/ajax/libs/jquery/1.12.4/jquery.js";
const $phone = $('.phone');
const $phone_success = $('.phone_success');
const $phone_error = $('.phone_error');
let $flag = true;
const $form = $('form');
const $password = $('.password');
const $repass = $('.repass');
const $pass_success = $('.pass_success');
const $pass_error = $('.pass_error');
const $tips = $('.tips');
const $repass_success = $('.repass_success');
const $repass_error = $('.repass_error');
let $passflag = true;
let $agreement_flag = true;

$phone.on('blur', function() {
    if ($phone.val() !== '') {
        let $reg = /^1[35789]\d{9}$/;
        if ($reg.test($phone.val())) {
            $.ajax({
                type: 'post',
                url: 'http://192.168.64.2/www/workspace/changhong.com/php/reg.php',
                data: {
                    checkphone: $phone.val()
                }
            }).done(function(data) {
                if (data === 'true') {
                    $phone_error.show().html('手机号已被注册');
                    $phone_success.hide();
                    $flag = false;
                } else if (data === 'false') {
                    $phone_error.hide();
                    $phone_success.show();
                    $flag = true;
                }
            })
        } else {
            $phone_error.show();
            $phone_success.hide();
        }
    } else {
        $phone_error.show().html('手机号不能为空');
        $phone_success.hide();
    }



});

$password.on('input', function() {
    if ($password.val().length >= 8 && $password.val().length <= 16) {
        let $reg1 = /\d+/; //数字
        let $reg2 = /[A-z]+/; //大小写字母

        let $count = 0; //计算字符的种类
        if ($reg1.test($password.val())) {
            $count++;
        }
        if ($reg2.test($password.val())) {
            $count++;
        }
        switch ($count) {
            case 1:
                $tips.hide()
                $pass_success.hide();
                $pass_error.show();
                $passflag = false;
                break;
            case 2:
                $tips.hide();
                $pass_success.show();
                $pass_error.hide();
                $passflag = true;
        }
    } else {
        $tips.hide()
        $pass_success.hide();
        $pass_error.show().html('密码长度有误');
        $passflag = false;
    }
});

$password.on('blur', function() {
    if ($password.val() !== '') {
        if ($passflag) {
            $tips.hide();
            $pass_success.show();
            $pass_error.hide();
        }
    } else {
        $tips.hide();
        $pass_success.hide();
        $pass_error.show().html('密码不能为空');
    }
});

$repass.on('blur', function() {
    if ($repass.val() !== '') {
        if ($repass.val() === $password.val()) {
            $repass_success.show();
            $repass_error.hide();
            $passflag = true;
        } else {
            $repass_success.hide();
            $repass_error.show().html('两次密码不一致')
        }
    } else {
        $repass_success.hide();
        $repass_error.show().html('密码不能为空')
    }
})
$('#checkbox').on('click', function() {
    if ($('#checkbox').prop("checked") === false) {
        $('.agreement_tips').show();
        $agreement_flag = false;
    } else {
        $('.agreement_tips').hide();
        $agreement_flag = true;
    }
})


$form.on('submit', function() {
    if (!$flag && !$passflag && !$agreement_flag) {
        return false;
    }
})