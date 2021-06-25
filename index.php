<?php


$strImage = $_POST['username'];

$strImage = str_replace('data:image/png;base64,', '', $strImage);
$strImage = str_replace(' ', '+', $strImage);
$strImage = base64_decode($strImage);

$fileName = time() . "_". 'img.png';
$fpng = fopen("images/$fileName", "w");
fwrite($fpng,$strImage);
fclose($fpng);



?>
