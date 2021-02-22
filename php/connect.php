<?php
    header('content-type:text/html;charset=utf-8');
    define('HOST','localhost'); //主机名
    define('USERNAME','root'); //用户名
    define('PASSWORD',''); //密码
    define('DBNAME','changhong.com'); //数据库

    //连接数据库
    $conn = @new mysqli(HOST,USERNAME,PASSWORD,DBNAME);

    //数据库连接错误提示（自定义）
    if($conn->connect_error){
        die('连接数据库错误'.$conn->connect_error);
    }

    //设置字符集
    $conn->query('SET NAMES UTF8');
?>