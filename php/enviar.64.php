<?php
    define('UPLOAD_DIR', "./" . $_POST["destino"] . "/");
	$imagem = $_POST["imagem"];
	$imagem = str_replace('data:image/png;base64,', '', $imagem);
	$imagem = str_replace(' ', '+', $imagem);
	$dadosimagem = base64_decode($imagem);
	$arquivo = UPLOAD_DIR . $_POST["nome"];
	$copiado = file_put_contents($arquivo, $dadosimagem);
	$resposta["envio"] = $copiado ? $arquivo : false;
    echo json_encode($resposta);
