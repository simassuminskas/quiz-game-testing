var socket = io();
var rooms = [];
var questions = [];

function adminLogin()
{
    socket.emit('adminLogin', JSON.stringify({
        password: document.getElementById('adminPassword').value
    }));
}
socket.on('adminLogged', (data) => {
    //console.log(data);
    document.getElementById('loginDiv').style.display = 'none';
    rooms = data['rooms'];
    questions = data['questions'];
    updateQuestionsList();
    updateRoomsList();
});
socket.on('readyToStartGame', (data) => {
    console.log(data);
    rooms = data['rooms'];
    updateRoomsList();
    //document.getElementById('statusInfo').innerHTML = 'Waiting for admin.';
    /*for (var j = 0; j < teams.length; j++)
    {
        //var indexLeaderElected = -1;
        for (var k = 0; k < teams[j]['users'].length; k++)
        {
            if (teams[j]['users'][k]['leader'] && 
                (teams[j]['users'][k]['userName'] == userName) && 
                (teams[j]['users'][k]['userSurname'] == userSurname))
            {
                document.getElementById('startGameButton').style.display = 'block';
                //indexLeaderElected = k;
            }
        }
    }*/
});
function updateQuestionsList()
{
    document.getElementById('questionsDiv').innerHTML = '';
    //document.getElementById('lblQuestionsInfo').style.display = 'block';
    var html = '';
    for (var i = 0; i < questions.length; i++)
    {
        //<button onclick="//editQuestion();">Submit</button>';
        html += '<input id="question_' + i + '" type="text" value="' + questions[i]['question'] + '"><br>';
        html += '<label class="lblOptions">Options<br></label>';
        for (var j = 0; j < questions[i]['options'].length; j++)
        {
            html += '<input id="question_' + i + '_option_' + j + '" type="text" value="' + questions[i]['options'][j]['option'] + '"><br>';
        }
        html += '<hr>';
    }
    html += '<button onclick="editQuestions();">Submit modifications</button>';
    document.getElementById('questionsDiv').innerHTML = html;
    //questionsDiv
/*var questions = [
    {
        'question' : 'You are a new employee and have been working at CGI for two weeks. A day before a meeting with clients your manager tells you that you will be giving a presentation. You just laugh and jokingly say sure, because you do not have enough experience to complete this task. Just before the meeting, your manager asks you if you are prepared and you tell him that you are not. During the meeting, your manager tells you to present what you have prepared. You are shocked and you shake your head stating that you have not prepared anything. Your manager manages the situation and the meeting goes well anyway. However, you are unsure if the same thing could happen next time. What do you do now?', 
        'options' : [
            {
                'option' : 'I think of this as a lesson and realize that when I gain more experience, there will not be any more situations like this.', 
                'score' : 0, 
                'response' : 'You shouldn’t ignore this situation. Our value is open communication.'
        'topic' : 'Objectivity and Integrity'*/
}
function editQuestions()
{
    socket.emit('editQuestions', JSON.stringify({
        questions: questions
    }));
}
function authorizeStart(i)
{
    socket.emit('authorizeStart', JSON.stringify({
        'roomCode': rooms[i]['roomCode']
    }));
}
function updateRoomsList()
{
    document.getElementById('roomsDiv').innerHTML = '';
    //document.getElementById('lblQuestionsInfo').style.display = 'block';
    var html = '';
    for (var i = 0; i < rooms.length; i++)
    {
        //<button onclick="//editQuestion();">Submit</button>';
        html += '<label id="room_' + i + '">Room code: ' + rooms[i]['roomCode'] + '<br></label>';
        if (rooms[i]['readyToStartGame'])
        {
            html += '<button id="s_' + i + '" onclick="authorizeStart(' + i + ');">Authorize Start</button>';
        }
        html += '<label class="lblTeams">Teams<br></label>';
        for (var j = 0; j < rooms[i]['teams'].length; j++)
        {
            html += '<label id="room_' + i + '">Team name: ' + rooms[i]['teams'][j]['teamName'] + '<br></label>';
            var indexLeaderElected = -1;
            for (var k = 0; k < rooms[i]['teams'][j]['users'].length; k++)
            {
                if (rooms[i]['teams'][j]['users'][k]['leader'])
                {
                    indexLeaderElected = k;
                }
            }
            html += '<label class="lblUsers">Users<br></label>';
            for (var k = 0; k < rooms[i]['teams'][j]['users'].length; k++)
            {
                html += '<br>' + rooms[i]['teams'][j]['users'][k]['userName'] + ' ' + rooms[i]['teams'][j]['users'][k]['userSurname'];
                if (k == indexLeaderElected)
                {
                    html += ' (leader)';
                }
                if ((rooms[i]['teams'][j]['users'].length > 1) && (indexLeaderElected == -1) && (userInTeamIndex != k))
                {//Se debe habilitar la elección de lider.
                    html += '<button id="vl_' + j + '_' + k + '" onclick="voteLeader(userName, userSurname, roomCode, ' + j + ', \'' + teams[j]['users'][k]['userName'] + '\', \'' + teams[j]['users'][k]['userSurname'] + '\');">Vote for leader</button>';
                }
            }
            //html += '<input id="room_' + i + '_team_' + j + '_option_' + j + '" type="text" value="' + questions[i]['options'][j] + '"><br>';
            html += '<hr>';
        }
    }
    document.getElementById('roomsDiv').innerHTML = html;
    //questionsDiv
/*game.rooms[index]['readyToStartGame']
game.rooms.push({
    'roomCode' : message['roomCode'], 
    'users' : [{'userName' : message['userName'], 'userSurname' : message['userSurname'], 'userType' : undefined}], 
    ...
    'teams' : []
});*/
}