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
    //updateQuestionsList();
    updateRoomsList();
});
socket.on('update', (data) => {
    rooms = data['rooms'];
    updateRoomsList();
    /*console.log(data);
    updateRoomsList();*/
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
socket.on('newTeamName', (data) => {
    rooms = data['rooms'];
    updateRoomsList();
});
socket.on('joinTeam', (data) => {
    rooms = data['rooms'];
    updateRoomsList();
});
socket.on('startGame', (data) => {
    rooms = data['rooms'];
    updateRoomsList();
});
socket.on('startGame', (data) => {
    rooms = data['rooms'];
    updateRoomsList();
});
socket.on('allUsersVotationAdmin', (data) => {
    rooms = data['rooms'];
    updateRoomsList();
});
socket.on('personalEvaluation', (data) => {
    rooms = data['rooms'];
    updateRoomsList();
});
socket.on('personalEvaluationAdmin', (data) => {
    rooms = data['rooms'];
    updateRoomsList();
});
socket.on('leaderVotation', (data) => {//Pendiente ver si funciona para el último que tiene que votar.
    rooms = data['rooms'];
    updateRoomsList();
});
//Pendiente ver si hace falta con 'question'.
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
function updateRoomsList()
{
    document.getElementById('roomsDiv').innerHTML = '';
    //document.getElementById('lblQuestionsInfo').style.display = 'block';
    var html = '';
    for (var i = 0; i < rooms.length; i++)
    {
        //<button onclick="//editQuestion();">Submit</button>';
        html += '<label id="room_' + i + '">Room code: ' + rooms[i]['roomCode'] + '</label><br>';
        html += '<label class="lblTeams">Teams<br></label>';
        for (var j = 0; j < rooms[i]['teams'].length; j++)
        {
            html += '<label id="room_' + i + '_team_' + j + '">Team name: ' + rooms[i]['teams'][j]['teamName'] + '</label><br>';
            html += '<label>Team score: Area 1: ' + rooms[i]['teams'][j]['scoreArea1'] + ' Area 2: ' + rooms[i]['teams'][j]['scoreArea2'] + ' Area 3: ' + rooms[i]['teams'][j]['scoreArea3'] + '</label><br>';
            html += '<label class="lblUsers">Users</label>';
            for (var k = 0; k < rooms[i]['teams'][j]['users'].length; k++)
            {
                html += '<br>' + rooms[i]['teams'][j]['users'][k]['userName'] + ' ' + rooms[i]['teams'][j]['users'][k]['userSurname'];
                if (rooms[i]['teams'][j]['users'][k]['leader'])
                {
                    html += ' (leader)';
                }
            }
            if (rooms[i]['teams'][j]) {}
            //Falta agregar las respuestas y evaluacionces del Área 1.
            //html += '<input id="room_' + i + '_team_' + j + '_option_' + j + '" type="text" value="' + questions[i]['options'][j] + '"><br>';
            html += '<br>Votation:<br>';
            /*game.rooms[index]['teams'][i]['sendedQuestions']['area' + message['area']][j]['otherAnswers'].push({
              'answer' : message['answer'], 
              'votes' : 1
            });*/
            for (var k = 0; k < rooms[i]['teams'][j]['sendedQuestions']['area1'].length; k++)
            {//votation
                /*if (game.rooms[index]['teams'][i]['sendedQuestions']['area' + message['area']][j]['question'] == message['question'])
                {//Pregunta actual encontrada en sendedQuestions.
                game.rooms[index]['teams'][i]['sendedQuestions']['area' + message['area']][j]['finalAnswer'] = message['answer'];*/
                html += 'Question:<br>';
                html += rooms[i]['teams'][j]['sendedQuestions']['area1'][k]['question'] + '<br>Answers:<br>';
                for (var l = 0; l < rooms[i]['teams'][j]['sendedQuestions']['area1'][k]['otherAnswers'].length; l++)
                {
                    html += rooms[i]['teams'][j]['sendedQuestions']['area1'][k]['otherAnswers'][l]['answer'] + '<br>Votes: ' + rooms[i]['teams'][j]['sendedQuestions']['area1'][k]['otherAnswers'][l]['votes'] + '<br>';
                }
                if (rooms[i]['teams'][j]['sendedQuestions']['area1'][k]['finalAnswer'] != '')
                {
                    html += 'Final answer:<br>';
                    html += rooms[i]['teams'][j]['sendedQuestions']['area1'][k]['finalAnswer'] + '<br>';
                }
                console.log('Line 155: ' + rooms[i]['teams'][j]['sendedQuestions']['area1'][k]['evaluation'].length);
                if (rooms[i]['teams'][j]['sendedQuestions']['area1'][k]['evaluation'].length)
                {//evaluation
                    html += 'Evaluation:<br>';
                    for (var l = 0; l < rooms[i]['teams'][j]['sendedQuestions']['area1'][k]['evaluation'].length; l++)
                    {
                        html += 'User: ' + rooms[i]['teams'][j]['sendedQuestions']['area1'][k]['evaluation'][l]['userName'] + ' ' + rooms[i]['teams'][j]['sendedQuestions']['area1'][k]['evaluation'][l]['userSurname'] + '<br>';
                        html += '<label>Close to reality: ' + rooms[i]['teams'][j]['sendedQuestions']['area1'][k]['evaluation'][l]['evaluation'] + '</label><br>';
                    }
                }

            }
            /*game.rooms[index]['teams'][i]['sendedQuestions']['area' + message['area']][j]['evaluation'].push({
                'evaluation' : message['evaluation'], 
                'userName' : message['userName'], 
                'userSurname' : message['userSurname']
            });*/
        }
    }
    document.getElementById('roomsDiv').innerHTML = html;
}