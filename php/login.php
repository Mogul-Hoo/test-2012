<?php

    include "connect.php";
    if(isset($_POST['phone'])&& isset($_POST['password'])){
        $phone = $_POST['phone'];
        $password = sha1($_POST['password']);
        $result = $conn -> query("select * from registry where telephone = '$phone' and password = '$password'");
        if($result -> fetch_assoc()){
            echo 'true';
        }else{
            echo 'false';
        }

        // $result_phone = $conn -> query("select * from registry where telephone = '$phone'");
        // if($result_phone -> fetch_assoc()){
        //     echo 'phone_true';
        // }else{
        //     echo 'phone_false';
        // }
        // $result_password = $conn -> query("select * from registry where password = '$password'");
        // if($result_password -> fetch_assoc()){
        //     echo 'password_true';
        // }else{
        //     echo 'password_false';
        // }
    }