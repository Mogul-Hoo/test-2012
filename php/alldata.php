<?php
    include "connect.php";
    $result = $conn->query("select * from shoplist");
    $num = $result -> num_rows;

    $arr = array();
    for($i=0;$i<$num;$i++){
        $arr[$i] = $result->fetch_assoc();
    }
    
    echo json_encode($arr);
?>