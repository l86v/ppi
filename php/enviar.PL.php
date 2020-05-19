<?php
if ((isset($_POST["pasta"])) && (isset($_FILES["arquivo"]))) {
    $destino = "./" . $_POST["pasta"] . "/";
    $arquivo = $destino . $_POST["nome"];
    $resposta["envio"] = (move_uploaded_file($_FILES["arquivo"]["tmp_name"], $arquivo)) ? true : false;
    echo json_encode($resposta);
} else {
    $resposta["envio"] = false;
    echo json_encode($resposta);
}
