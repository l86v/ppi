<?php
if (isset($_POST["arquivo"])) {
    $resposta["presenca"] = true;
    $resposta["exclusao"] = (unlink($_POST["arquivo"])) ? true : false;
    $resposta["arquivo"] = $_POST["arquivo"];
    echo json_encode($resposta);
} else {
    $resposta["presenca"] = false;
    $resposta["exclusao"] = false;
    $resposta["arquivo"] = $_POST["arquivo"];
    echo json_encode($resposta);
}
