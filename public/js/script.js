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
var teamsDiv = 'teams';
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
    //teams.push({'teamName' : data['teamName'], 'users' : [{'userName' : data['userName'], 'userSurname' : data['userSurname']}]});
    var ul = document.getElementById(usersDiv);
    var html = '';
    var tl = document.getElementById(teamsDiv);
    var html2 = '';
    var tmp = [];
    var userInTeam = false;
    for (var i = 0; i < users.length; i++)
    {
        var add = true;
        for (var j = 0; j < teams.length; j++)
        {
            for (var k = 0; k < teams[j]['users'].length; k++)
            {
                if ((teams[j]['users'][k]['userName'] == userName) && 
                    (teams[j]['users'][k]['userSurname'] == userSurname))
                {
                    document.getElementById('inputTeamName').style.display = 'none';
                    userInTeam = true;
                }
                if ((teams[j]['users'][k]['userName'] == users[i]['userName']) || 
                    (teams[j]['users'][k]['userSurname'] == users[i]['userSurname']))
                {
                    add = false;
                }
            }
        }
        //console.log(users);
        if (add)
        {
            document.getElementById('lblUsersInfo').style.display = 'block';
            var subHtml = users[i]['userName'] + ' ' + users[i]['userSurname'];
            html += '<div id="u_' + i + '">' + subHtml + '</div>';
        }
    }
    if (!userInTeam)
    {//No está en un team.
        document.getElementById('inputTeamName').style.display = 'block';
    }
    for (var j = 0; j < teams.length; j++)
    {
        document.getElementById('lblTeamsInfo').style.display = 'block';
        html2 += '<div id="t_' + j + '">' + teams[j]['teamName'];
        if (!userInTeam)
        {//No está en un team.
            html2 += '<button id="jt_' + j + '" onclick="joinTeam(userName, userSurname, roomCode, ' + j + ');">Join</button>';
        }
        var indexLeaderElected = -1;
        for (var k = 0; k < teams[j]['users'].length; k++)
        {
            if (teams[j]['users'][k]['leader'])
            {
                indexLeaderElected = k;
            }
        }
        for (var k = 0; k < teams[j]['users'].length; k++)
        {
            html2 += '<br>' + teams[j]['users'][k]['userName'] + ' ' + teams[j]['users'][k]['userSurname'];
            if (k == indexLeaderElected)
            {
                html2 += ' (leader)';
            }
            if ((teams[j]['users'].length > 1) && (indexLeaderElected == -1))
            {//Se debe habilitar la elección de lider.
                html2 += '<button id="vl_' + j + '_' + k + '" onclick="voteLeader(userName, userSurname, roomCode, ' + j + ', \'' + teams[j]['users'][k]['userName'] + '\', \'' + teams[j]['users'][k]['userSurname'] + '\');document.getElementById(this.id).style.display = \'none\';">Vote for leader</button>';
            }
        }
        html2 += '</div>';
    }
    ul.innerHTML = html;
    tl.innerHTML = html2;
}
/*function verifyNewTeam(data)
{
    if (data['requestTeamName'])
    {
        document.getElementById('inputTeamName').style.display = 'block';
    }
}*/
function rollDice()
{
    socket.emit('rollDice', JSON.stringify({
        type: 'rollDice',
        userName: userName, 
        userSurname: userSurname, 
        roomCode: roomCode
    }));
}
function rematch()
{
    socket.emit('rematch', JSON.stringify({
        type: 'rematch',
        user: username, 
        roomCode: roomCode
    }));
}