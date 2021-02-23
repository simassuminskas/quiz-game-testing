var options = ["DILEMMAS", "KNOWLEDGE ABOUT US", "RISKS AND OPPORTUNITIES"];
var fontSizes = [50, 25, 22];

// Initialize Variables
var inicioAngulo = 0;
var tiemoutSpin = null;
var optRuleta;
var SpinArcStart = 10;
var SpinTime = 0;
var SpinTimeTotal = 0;
var arc = Math.PI / (options.length / 2);

// Evento de girar del index principal.
document.getElementById("spinner").addEventListener("click", spin);

function byte2Hex(n) {
  var nybHexString = "0123456789ABCDEF";
  return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
}

// Función para RGB.
function RGB2Color(r,g,b) {
    return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}

// Obtenemos los colores, determinando el RGB.
function getColor2RGB(item, maxitem) {
  var fase = 0;
  var centrar = 128;
  var width = 127;
  var frecuencia = Math.PI*2/maxitem;
// R G B.
  red   = Math.sin(frecuencia*item+2+fase) * width + centrar;
  green = Math.sin(frecuencia*item+0+fase) * width + centrar;
  blue  = Math.sin(frecuencia*item+4+fase) * width + centrar;
  return RGB2Color(red,green,blue);
}
function drawSpin() {
  // Obtenemos el canvas desde el Id Canvas.
  var canvas = document.getElementById("spinner");
  if (canvas.getContext)
  {
    var outsideRadius = 200;
    var textRadius = 100;
    var insideRadius = 0;//Esto indica la distancia de los colores con el centro.
    optRuleta = canvas.getContext("2d");
    optRuleta.clearRect(0,0,500,500);
    optRuleta.strokeStyle = "white";
    optRuleta.lineWidth = 2;
    for(var i = 0; i < options.length; i++)
    {
      optRuleta.font = fontSizes[i] + 'px Verdana, Arial';
      //optRuleta.font = '35px Verdana, Arial';
      var angle = inicioAngulo + i * arc;
      optRuleta.fillStyle = getColor2RGB(i, options.length);
      optRuleta.beginPath();
      optRuleta.arc(250, 250, outsideRadius, angle, angle + arc, false);
      optRuleta.arc(250, 250, insideRadius, angle + arc, angle, true);
      optRuleta.stroke();
      optRuleta.fill();
      optRuleta.save();
      optRuleta.shadowOffsetX = -1;
      optRuleta.shadowOffsetY = -1;
      optRuleta.shadowBlur = 0;
      optRuleta.shadowColor = "rgb(220,110,220)";
      optRuleta.fillStyle = "black";
      optRuleta.translate(250 + Math.cos(angle + arc / 2) * textRadius,
                    250 + Math.sin(angle + arc / 2) * textRadius);
      optRuleta.rotate(angle + arc / 2 + Math.PI / 2);
      var text = options[i];
      optRuleta.fillText(text, - optRuleta.measureText(text).width / 2, 0);
      optRuleta.restore();
    }
    // Flecha, color y "movimiento".
    optRuleta.fillStyle = "red";
    optRuleta.beginPath();
    optRuleta.moveTo(250 - 4, 250 - (outsideRadius + 5));
    optRuleta.lineTo(250 + 4, 250 - (outsideRadius + 5));
    optRuleta.lineTo(250 + 4, 250 - (outsideRadius - 5));
    optRuleta.lineTo(250 + 9, 250 - (outsideRadius - 5));
    optRuleta.lineTo(250 + 0, 250 - (outsideRadius - 13));
    optRuleta.lineTo(250 - 9, 250 - (outsideRadius - 5));
    optRuleta.lineTo(250 - 4, 250 - (outsideRadius - 5));
    optRuleta.lineTo(250 - 4, 250 - (outsideRadius + 5));
    optRuleta.fill();
  }
}

function spin() {
  SpinAngleStart = Math.random() * 10 + 10;
  SpinTime = 0;
  SpinTimeTotal = Math.random() * 3 + 4 * 1000;
  spin2();
}

// Función que realiza el giro de la ruleta.
function spin2() {
  SpinTime =  SpinTime + 30;
  if(SpinTime >= SpinTimeTotal) {
    detenerRotacionRuleta();
    return;
  }
  var SpinAngle = SpinAngleStart - mathOperations(SpinTime, 0, SpinAngleStart, SpinTimeTotal);
  inicioAngulo += (SpinAngle * Math.PI / 180);
  drawSpin();
  tiemoutSpin = setTimeout('spin2()', 5);
}
// Detener la ruleta.
function detenerRotacionRuleta() {
  clearTimeout(tiemoutSpin);
  var degrees = inicioAngulo * 180 / Math.PI + 90;
  var arcd = arc * 180 / Math.PI;
  var index = Math.floor((360 - degrees % 360) / arcd);
  if (options[index] == 'DILEMMAS')
  {
    index = 1;
  }
  else
  {
    if (options[index] == 'KNOWLEDGE ABOUT US')
    {
      index = 2;
    }
    else
    {
      if (options[index] == 'RISKS AND OPPORTUNITIES')
      {
        index = 3;
      }
    }
  }
  index = 1;
  optRuleta.save();
  optRuleta.font = 'bold 30px Verdana, Arial';
  socket.emit('spin', JSON.stringify({
    userName: userName, 
    userSurname: userSurname, 
    roomCode: roomCode, 
    teamName: teamName, 
    area: index
  }));
  document.getElementById('spinner').style.display = 'none';
}
function mathOperations(SpinTime, b, SpinAngleStart, SpinTimeTotal)
{
  var ts = (SpinTime/=SpinTimeTotal)*SpinTime;
  var tc = ts*SpinTime;
  return b+SpinAngleStart*(tc + -3*ts + 3*SpinTime);
}
// Llamamos nuestra función que invocará las demás.
drawSpin();