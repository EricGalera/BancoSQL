<?php
session_start();
include("conexion.php");

if (isset($_SESSION['usuario_id'])) {
    header("Location: inicio.html");
    exit;
}

$usuario = trim($_POST['usuario'] ?? '');
$clave = $_POST['clave'] ?? '';
$tipoDocumento = trim($_POST['tipoDocumento'] ?? '');
$numeroDocumento = trim($_POST['numeroDocumento'] ?? '');

if ($usuario === '' || $clave === '' || $tipoDocumento === '' || $numeroDocumento === '') {
    header("Location: registro.html?error=datos");
    exit;
}

$verificar = $conexion->prepare("SELECT id FROM usuarios WHERE usuario = ?");

if (!$verificar) {
    header("Location: registro.html?error=db");
    exit;
}

$verificar->bind_param("s", $usuario);
$verificar->execute();
$resultado = $verificar->get_result();

if ($resultado->num_rows > 0) {
    $verificar->close();
    $conexion->close();
    header("Location: registro.html?error=duplicado");
    exit;
}

$verificar->close();

$claveHash = password_hash($clave, PASSWORD_DEFAULT);

$insertar = $conexion->prepare(
    "INSERT INTO usuarios (usuario, clave_hash, tipo_documento, numero_documento)
     VALUES (?, ?, ?, ?)"
);

if (!$insertar) {
    $conexion->close();
    header("Location: registro.html?error=db");
    exit;
}

$insertar->bind_param("ssss", $usuario, $claveHash, $tipoDocumento, $numeroDocumento);

if ($insertar->execute()) {
    $insertar->close();
    $conexion->close();
    header("Location: formulario.html?registro=ok");
    exit;
}

$insertar->close();
$conexion->close();

header("Location: registro.html?error=db");
exit;
