var mouse = {x: null, y: null};
var touch;
var drawingTool = 'pencil';
var canvas;
var canvasId = 'canvasDiv';

var timeAndRound = 'timeAndRound';
var timeInfo = 'timeInfo';
var roundInfo = 'roundInfo';
var wordsInfo = 'wordsInfo';
var drawingToolsDiv = 'drawingToolsDiv';
var usersDiv = 'users';
var panelMessages = 'panelMessages';
var panel = 'panel';
var send = 'send';
var messageInput = 'message';
var privateRoom = 'privateRoom';
var lblRoomCode = 'lblRoomCode';

var lineColour = '#000000';
var pencilSize = 0.005;
var eraserSize = 0.0125;

var ctx;
var points = [];
var auxPoints = [];
var drawingTools;
var canvasDisplay = 'none';
var time = 90;
var stopTime = false;
var pr = false;
var drawer = false;

$(document).ready(function () {
    $("#message").on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13)
        {
            handleMsg();
        }
    });
});
function selectWord(i)
{
    document.getElementById('waiting').style.display = 'none';
    document.getElementById(wordsInfo).innerHTML = '<label>The word is: ' + words[Number(i.split('_')[1])] + '</label>';
    document.getElementById(drawingToolsDiv).style.display = 'block';
    handleWordSelected(words[Number(i.split('_')[1])]);
    drawer = true;
    changeSize();
}
function initTime()
{
    document.getElementById(timeInfo).style.display = 'block';
    t = time;
    var countdown = () => {
        var timerUpdate = setInterval( () => {
            if (stopTime)
            {
                clearInterval(timerUpdate);
                t = time;
                document.getElementById(timeInfo).style.display = 'none';
            }
            document.getElementById(timeInfo).innerHTML = 'Time remaining: ' + t;
            t--;
            if (t == 0)
            {
                clearInterval(timerUpdate);
                t = time;
                if (selectedUser == username)
                {
                    handleTimeOut();
                }
            }
        }, 1000);
    };
    countdown();
}
function updateUsersInfo()
{
    var ul = document.getElementById(usersDiv);
    var html = '';
    var tmp = [];
    for (var i = 0; i < users.length; i++)
    {
        console.log(users);
        var subHtml = users[i]['userName'] + ' ' + users[i]['userSurname'] + ', ' + users[i]['puntuation'];
        html += '<div id="u_' + i + '">' + subHtml + '</div>';
    }
    ul.innerHTML = html;
}
function rematch()
{
    socket.emit('rematch', JSON.stringify({
        type: 'rematch',
        user: username, 
        roomCode: roomCode
    }));
}