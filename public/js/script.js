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

function showTeamInfo(newLeader = false)
{
    document.getElementById('teamInfo').style.display = 'block';
    var html = '';
    var tmp = [];
    var userInTeamIndex = -1;
    console.log(teams);
    if (teams.length)
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
        if (userInTeamIndex != -1)
        {console.log('Line 40.');
            html += '<label>' + teams[userInTeamIndex]['teamName'] + '</label>';
            var indexLeaderElected = -1;
            for (var k = 0; k < teams[userInTeamIndex]['users'].length; k++)
            {
                if (teams[userInTeamIndex]['users'][k]['leader'])
                {
                    indexLeaderElected = k;
                    if (teams[userInTeamIndex]['users'][k]['status'] == 'waitingAnsweringQuestionArea1')
                    {
                        document.getElementById('area1').style.display = 'none';
                        document.getElementById('area2').style.display = 'none';
                        document.getElementById('area3').style.display = 'none';
                        document.getElementById('submitAnswerButton').style.display = 'none';
                    }
                }
            }
            for (var k = 0; k < teams[userInTeamIndex]['users'].length; k++)
            {
                html += '<br>' + teams[userInTeamIndex]['users'][k]['userName'] + ' ' + teams[userInTeamIndex]['users'][k]['userSurname'];
                if ((teams[userInTeamIndex]['users'][k]['userName'] == userName) && 
                    (teams[userInTeamIndex]['users'][k]['userSurname'] == userSurname))
                {
                    html += ' (you)';
                }
                if (k == indexLeaderElected)
                {
                    html += ' (leader)';
                }
                if ((teams[userInTeamIndex]['users'].length > 1) && (indexLeaderElected == -1) && (!vote))
                {//Se debe habilitar la elección de lider.
                    html += '<button id="vl_' + userInTeamIndex + '_' + k + '" onclick="voteLeader(userName, userSurname, roomCode, ' + userInTeamIndex + ', \'' + teams[userInTeamIndex]['users'][k]['userName'] + '\', \'' + teams[userInTeamIndex]['users'][k]['userSurname'] + '\', ' + newLeader + ');document.getElementById(this.id).style.display = \'none\';">Vote for leader</button>';
                }
            }
            html += '</div>';
        }
    }
    document.getElementById('teamInfo').innerHTML = html;
}
function showGameInfo()
{
    document.getElementById('gameInfo').style.display = 'block';
    if (teams != undefined)
    {
        for (var j = 0; j < teams.length; j++)
        {
            if (teams[j]['teamName'] == teamName)
            {
                for (var k = 0; k < teams[j]['users'].length; k++)
                {
                    if ((teams[j]['users'][k]['userName'] == userName) && 
                        (teams[j]['users'][k]['userSurname'] == userSurname))
                    {
                        document.getElementById('teamScore').style.display = 'block';
                        document.getElementById('teamScore').innerHTML = 'Team score: DILEMMAS: ' + teams[j]['scoreArea1'] + ' KNOWLEDGE ABOUT US: ' + teams[j]['scoreArea2'] + ' RISKS AND OPPORTUNITIES: ' + teams[j]['scoreArea3'];
                    }
                }
            }
        }
    }
}
function gameFinished()
{
    if (teams != undefined)
    {
        for (var j = 0; j < teams.length; j++)
        {
            if (teams[j]['teamName'] == teamName)
            {
                document.getElementById('teamScore2').innerHTML = 'DILEMMAS: ' + teams[j]['scoreArea1'] + ' KNOWLEDGE ABOUT US: ' + teams[j]['scoreArea2'] + ' RISKS AND OPPORTUNITIES: ' + teams[j]['scoreArea3'];
            }
        }
    }
}
function getTeams(rooms)
{
    for (var i = 0; i < rooms.length; i++)
    {
        if (rooms[i]['roomCode'] == roomCode)
        {
            return rooms[i]['teams'];
        }
    }
    return [];
}