<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name     = htmlspecialchars($_POST['name']);
    $email    = htmlspecialchars($_POST['email']);
    $subject  = htmlspecialchars($_POST['subject']);
    $category = htmlspecialchars($_POST['category']);
    $message  = htmlspecialchars($_POST['message']);

    $to      = "23110172@iitgn.ac.in"; // Change to your email
    $headers = "From: $email\r\nReply-To: $email\r\n";
    $body    = "Name: $name\nEmail: $email\nSubject: $subject\nCategory: $category\n\nMessage:\n$message";

    if (mail($to, $subject, $body, $headers)) {
        echo "success";
    } else {
        echo "error";
    }
}
?>
