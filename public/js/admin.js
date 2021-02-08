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
    console.log(data);
    document.getElementById('loginDiv').style.display = 'none';
    rooms = data['rooms'];
    questions = data['questions'];
    updateQuestionsList();
    //updateRoomsList();
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
function updateRoomsList()
{
    document.getElementById('roomsDiv').innerHTML = '';
    //document.getElementById('lblQuestionsInfo').style.display = 'block';
    var html = '';
    for (var i = 0; i < questions.length; i++)
    {
        //<button onclick="//editQuestion();">Submit</button>';
        html += '<input id="room_' + i + '" type="text" value="' + questions[i]['question'] + '"><br>';
        html += '<label class="lblUsers">Users<br></label>';//here
        for (var j = 0; j < questions[i]['options'].length; j++)
        {
            html += '<input id="question_' + i + '_option_' + j + '" type="text" value="' + questions[i]['options'][j] + '"><br>';
        }
        html += '<hr>';
    }
    html += '<button onclick="editQuestions();">Submit modifications</button>';
    document.getElementById('questionsDiv').innerHTML = html;
    //questionsDiv
/*game.rooms.push({
    'roomCode' : message['roomCode'], 
    'users' : [{'userName' : message['userName'], 'userSurname' : message['userSurname'], 'userType' : undefined}], 
    'usersIds' : [socket.id], 
    'usersPoints' : [0], 
    'usersTurns' : [{'userName' : message['userName'], 'userSurname' : message['userSurname'], 'userType' : undefined}], 
    'usersUsed' : [], 
    'private' : private, 
    'full' : false, 
    'selectedUser' : '', 
    'round' : [1, rounds], 
    'teams' : []
});*/
}
//clients[client].con.write(JSON.stringify(data));
/*function handleTimeOut()
{
    socket.emit('timeOut', JSON.stringify({
        type: 'timeOut', 
        roomCode: roomCode
    }));
}*/