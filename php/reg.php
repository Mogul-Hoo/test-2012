<?php

include "connect.php";

//判断重名

if(isset($_POST['checkphone'])){
    $checkphone = $_POST['checkphone'];
    $result = $conn -> query("SELECT * FROM registry WHERE telephone = '$checkphone'");
    if($result -> fetch_assoc()){
        echo 'true';
    }else{
        echo 'false';
    }
}
//将前端传入的值放入数据库
if(isset($_POST['submit'])){
    $phone = $_POST['phone'];
    $password = sha1($_POST['password']);
    $repass = sha1($_POST['repass']);

    $conn ->query("insert registry values(null,'$password','$repass','$phone')");

    //登录成功，跳转页面
    header('location:http://192.168.64.2/www/workspace/changhong.com/src/login.html');
}

