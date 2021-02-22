var mouse = {x: null, y: null};
var touch;
var drawingTool = 'pencil';
var canvas;

var started = false;

var lineColour = '#000000';
var pencilSize = 0.005;
var eraserSize = 0.0125;

var ctx;
var points = [];
var auxPoints = [];
var drawingTools;
var canvasDisplay = 'none';
var pr = false;

function showTeamInfo()
{
    document.getElementById('teamInfo').style.display = 'block';
    var html = '';
    var tmp = [];
    var userInTeamIndex = -1;
    if (teams != undefined)
    {
        for (var j = 0; j < teams.length; j++)
        {
            for (var k = 0; k < teams[j]['users'].length; k++)
            {
                if ((teams[j]['users'][k]['userName'] == userName) && 
                    (teams[j]['users'][k]['userSurname'] == userSurname))
                {
                    userInTeamIndex = j;
                }
            }
        }
        for (var j = 0; j < teams.length; j++)
        {
            document.getElementById('lblTeamsInfo').style.display = 'block';
            html += '<label>' + teams[userInTeamIndex]['teamName'] + '</label>';
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
                html += '<br>' + teams[j]['users'][k]['userName'] + ' ' + teams[j]['users'][k]['userSurname'];
                if ((teams[j]['users'][k]['userName'] == userName) && 
                    (teams[j]['users'][k]['userSurname'] == userSurname))
                {
                    html += ' (you)';
                }
                if (k == indexLeaderElected)
                {
                    html += ' (leader)';
                }
                if ((teams[j]['users'].length > 1) && (indexLeaderElected == -1) && (userInTeamIndex == j))
                {//Se debe habilitar la elección de lider.
                    html += '<button id="vl_' + j + '_' + k + '" onclick="voteLeader(userName, userSurname, roomCode, ' + j + ', \'' + teams[j]['users'][k]['userName'] + '\', \'' + teams[j]['users'][k]['userSurname'] + '\');document.getElementById(this.id).style.display = \'none\';">Vote for leader</button>';
                }
            }
            html += '</div>';
        }
    }
    document.getElementById('teamInfo').innerHTML = html;
}
function updateUsersInfo()
{
    var html = '';
    var tl = document.getElementById('teams');
    var html2 = '';
    var tmp = [];
    var userInTeamIndex = -1;
    //for (var i = 0; i < users.length; i++)
    {
        //var add = true;
        if (teams != undefined)
        {
            for (var j = 0; j < teams.length; j++)
            {
                for (var k = 0; k < teams[j]['users'].length; k++)
                {
                    if ((teams[j]['users'][k]['userName'] == userName) && 
                        (teams[j]['users'][k]['userSurname'] == userSurname))
                    {
                        if (started)
                        {
                            document.getElementById('teamScore').innerHTML = 'Team score: Area 1: ' + teams[j]['scoreArea1'] + ' Area 2: ' + teams[j]['scoreArea2'] + ' Area 3: ' + teams[j]['scoreArea3'];
                        }
                        document.getElementById('inputTeamName').style.display = 'none';
                        userInTeamIndex = j;
                    }
                    /*if ((teams[j]['users'][k]['userName'] == users[i]['userName']) || 
                        (teams[j]['users'][k]['userSurname'] == users[i]['userSurname']))
                    {
                        add = false;
                    }*/
                }
            }

        }
        //console.log(users);
        /*if (add)
        {
            document.getElementById('lblUsersInfo').style.display = 'block';
            var subHtml = users[i]['userName'] + ' ' + users[i]['userSurname'];
            html += '<div id="u_' + i + '">' + subHtml + '</div>';
        }*/
    }
    if (userInTeamIndex == -1)
    {
        if (connected)
        {//No está en un team y está conectado.//Pendiente ver si funciona.
            document.getElementById('inputTeamName').style.display = 'block';
        }
    }
    if (teams != undefined)
    {
        for (var j = 0; j < teams.length; j++)
        {
            document.getElementById('lblTeamsInfo').style.display = 'block';
            html2 += '<div id="t_' + j + '">' + teams[j]['teamName'];
            if (userInTeamIndex == -1)
            {//No está en un team.//Pendiente ver por qué no aparece el Join con el u3 al principio. Parece estar relacionado con la falta del status: Starting game
                html2 += '<button id="jt_' + j + '" onclick="joinTeam(userName, userSurname, roomCode, ' + j + ');">Join</button>';
            }
            //else
            //{
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
                if ((teams[j]['users'][k]['userName'] == userName) && 
                    (teams[j]['users'][k]['userSurname'] == userSurname))
                {
                    html2 += ' (you)';
                }
                if (k == indexLeaderElected)
                {
                    html2 += ' (leader)';
                }
                if ((teams[j]['users'].length > 1) && (indexLeaderElected == -1) && (userInTeamIndex == j))
                {//Se debe habilitar la elección de lider.
                    html2 += '<button id="vl_' + j + '_' + k + '" onclick="voteLeader(userName, userSurname, roomCode, ' + j + ', \'' + teams[j]['users'][k]['userName'] + '\', \'' + teams[j]['users'][k]['userSurname'] + '\');document.getElementById(this.id).style.display = \'none\';">Vote for leader</button>';
                }
            }
            //}
            html2 += '</div>';
        }
    }
    tl.innerHTML = html2;
}
function rollDice()
{
    socket.emit('rollingDice', JSON.stringify({
        type: 'rollingDice',
        userName: userName, 
        userSurname: userSurname, 
        roomCode: roomCode, 
        teamName: teamName
    }));
    document.getElementById('rollDiceButton').style.display = 'none';
}
function rematch()
{
    socket.emit('rematch', JSON.stringify({
        type: 'rematch',
        user: username, 
        roomCode: roomCode
    }));
}