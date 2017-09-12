<!DOCTYPE html>
<html>
<head>
    <!-- GENERIC META -->
    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
    <meta http-equiv='content-type' content='text/html; charset=utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0, minimal-ui, user-scalable=0'>

    <!-- GENERIC STYLES -->
    <link rel='stylesheet' href='style.css'>

    <!-- GENERIC SCRIPTS -->
    <script src='script.js'></script>

    <!-- Font awesome -->
    <script src="https://use.fontawesome.com/5400611028.js"></script>

</head>
<body>
  <section id='contentContainer'>
    <h1 class='disrupt left'>DISRUPT</h1>
    <h1 class='disrupt right'>DISRUPT</h1>

    <div class="details">
      <div class="date">
        <p>17</p>
        <p>11</p>
        <p>17</p>
      </div>
      <div class="location">
        <p>QUT KELVIN GROVE</p>
      </div>
    </div>

    <div class="register-container">
    </div>

    <div class="socials">
      <a href="https://www.facebook.com/" target="_blank">
        <i class="fa fa-facebook"></i>
      </a>
      <a href="https://www.instagram.com/" target="_blank">
        <i class="fa fa-instagram"></i>
      </a>
    </div>

    <div class='registerInterest'>
      <form class="" action="" method="">
        <div class='inputContainer'>
          <input type="email" name="email" placeholder="Type your email address">

          <?php
            if ($_GET) {
              echo "<span class='buttonText'>Thank you for registering</span>";
            } else {
              echo "<span class='buttonText'>Register your interest</span>";
            }
           ?>
        </div>
      </form>
    </div>
  </section>
</body>
</html>
