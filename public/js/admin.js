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
    document.getElementById('loginDiv').style.display = 'none';
    rooms = data['rooms'];
    questions = data['questionsArea1'];
    document.getElementById('addQuestionBtn').style.display = 'block';
    document.getElementById('lblQuestionsInfo').style.display = 'block';
    document.getElementById('lblRoomsInfo').style.display = 'block';
    document.getElementById('submitQuestionsBtn').style.display = 'block';
    updateQuestionsList();
    updateRoomsList();
});
socket.on('update', (data) => {
    rooms = data['rooms'];
    updateRoomsList();
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
    document.getElementById('questionsDiv').style.display = 'none';
    document.getElementById('addQuestionBtn').style.display = 'none';
    document.getElementById('lblQuestionsInfo').style.display = 'none';
    document.getElementById('submitQuestionsBtn').style.display = 'none';
    updateRoomsList();
});
socket.on('ro', (data) => {
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
socket.on('leaderVotation', (data) => {
    rooms = data['rooms'];
    updateRoomsList();
});
function updateQuestionsList()
{
    document.getElementById('questionsDiv').innerHTML = '';
    var html = '';
    for (var i = 0; i < questions.length; i++)
    {
        html += '<div id="question_' + i + '"><input class="questionText" id="question_text_' + i + '" type="text" onchange="verifyQuestions();" value="' + questions[i]['question'] + '">';
        html += '<button class="deleteQuestionButton" id="delete_' + i + '" onclick="deleteQuestion(this.id);">Delete</button>';
        html += '<label class="lblRepeatedQuestion" id="lblRepeatedQuestion_' + i + '"></label><br>';
        html += '<label class="lblOptions">Options</label><br>';
        for (var j = 0; j < questions[i]['options'].length; j++)
        {
            html += '<label class="lblOption">Option </label><input class="optionText" id="option_' + j + '_question_text_' + i + '" type="text" value="' + questions[i]['options'][j]['option'] + '"><br>';
            html += '<label class="lblScore">Score </label><input class="scoreInput" id="score_option_' + j + '_question_text_' + i + '" type="number" value="' + questions[i]['options'][j]['score'] + '"><br>';
        }
        html += '<hr></div>';
    }
    document.getElementById('questionsDiv').innerHTML = html;
}
function addQuestion()
{
    var nextId = 0;
    var c = document.getElementById('questionsDiv').children;
    if (c.length)
    {
        for (var i = 0; i < c.length; i++)
        {
            if (c[i].id.length)
            {
                nextId += 1;
            }
        }
    }
    $("#questionsDiv").append(`
        <div id="question_` + nextId + `">
            <input class="questionText" id="question_text_` + nextId + `" type="text" onchange="verifyQuestions();" value="Question ` + (nextId + 1) + `...">
            <button class="deleteQuestionButton" id="delete_` + nextId + `" onclick="deleteQuestion(this.id);">Delete</button>
            <label class="lblRepeatedQuestion" id="lblRepeatedQuestion_` + nextId + `"></label><br>
            <label>Options</label><br>
            <label class="lblOption">Option </label><input class="optionText" id="option_0_question_text_` + nextId + `" type="text" value="option 1..."><br>
            <label class="lblScore">Score </label><input class="scoreInput" id="score_option_0_question_text_` + nextId + `" type="number" value="0"><br>
            <label class="lblOption">Option </label><input class="optionText" id="option_1_question_text_` + nextId + `" type="text" value="option 2..."><br>
            <label class="lblScore">Score </label><input class="scoreInput" id="score_option_1_question_text_` + nextId + `" type="number" value="0"><br>
            <label class="lblOption">Option </label><input class="optionText" id="option_2_question_text_` + nextId + `" type="text" value="option 3..."><br>
            <label class="lblScore">Score </label><input class="scoreInput" id="score_option_2_question_text_` + nextId + `" type="number" value="0"><br>
            <label class="lblOption">Option </label><input class="optionText" id="option_3_question_text_` + nextId + `" type="text" value="option 4..."><br>
            <label class="lblScore">Score </label><input class="scoreInput" id="score_option_3_question_text_` + nextId + `" type="number" value="0"><br>
            <label class="lblOption">Option </label><input class="optionText" id="option_4_question_text_` + nextId + `" type="text" value="option 5..."><br>
            <label class="lblScore">Score </label><input class="scoreInput" id="score_option_4_question_text_` + nextId + `" type="number" value="0"><br>
            <label class="lblOption">Option </label><input class="optionText" id="option_5_question_text_` + nextId + `" type="text" value="option 6..."><br>
            <label class="lblScore">Score </label><input class="scoreInput" id="score_option_5_question_text_` + nextId + `" type="number" value="0"><br>
        <hr></div>
    `);
    verifyQuestions();
}
function deleteQuestion(item)
{
    $('#question_' + Number(item.split('_')[1])).remove()
    var j = 0;
    var items = document.getElementById('questionsDiv').children;
    if (items.length)
    {
        for (var i = 0; i < items.length; i++)
        {
            if (items[i].id.length)
            {
                var subItems = document.getElementById(items[i].id).children;
                for (var k = 0; k < subItems.length; k++)
                {
                    if (subItems[k].id != '')
                    {
                        var finalIndex;
                        for (var l = 0; l < subItems[k].id.length; l++)
                        {
                            if (subItems[k].id[l] == '_')
                            {
                                finalIndex = l;
                            }
                        }
                        var aux = '';
                        for (var l = 0; l < subItems[k].id.length; l++)
                        {
                            if (l <= finalIndex)
                            {
                                aux += subItems[k].id[l];
                            }
                        }
                        var n = '' + j;
                        for (var l = 0; l < n.length; l++)
                        {
                            aux += n[l];
                        }
                        subItems[k].id = aux;
                    }
                }
                items[i].id = 'question_' + j;
                j += 1;
            }
        }
    }
}
function getQuestions()
{
    var order = [];
    questions = [];
    
    var c = document.getElementById('questionsDiv').children;

    for (var i = 0; i < c.length; i++)
    {
        order.push(Number(c[i].id.split('_')[1]));
    }
    for (var i = 0; i < order.length - 1; i++)
    {
        var aux;
        if (order[i] > order[i + 1])
        {
            aux = order[i];
            order[i] = order[i + 1];
            order[i + 1] = aux;
            i = -1;
        }
    }
    if (c.length)
    {
        for (var i = 0; i < order.length; i++)
        {
            var text = document.getElementById('question_text_' + order[i]).value;
            questions.push({
                'question' : text, 
                'options' : getOptions(order[i])
            });
        }
    }
}
function getOptions(index)
{
    var options = [];
    for (var i = 0; i < 6; i++)
    {
        var text = document.getElementById('option_' + i + '_question_text_' + index).value;
        var score = parseInt(document.getElementById('score_option_' + i + '_question_text_' + index).value);
        options.push({
            'option' : text, 
            'score' : score, 
            'response' : ''
        });
    }
    return options;
}
function verifyQuestions()
{
    document.getElementById('submitQuestionsBtn').style.display = 'block';
    getQuestions();
    var repetidos = [];
    for (var i = 0; i < questions.length - 1; i++)
    {
        for (var j = i + 1; j < questions.length; j++)
        {
            if (questions[i]['question'] == questions[j]['question'])
            {
                repetidos.push(i);
                repetidos.push(j);
            }
        }
    }
    for (var i = 0; i < questions.length; i++)
    {
        document.getElementById('lblRepeatedQuestion_' + i).innerHTML = '';
    }
    for (var i = 0; i < repetidos.length; i++)
    {
        document.getElementById('lblRepeatedQuestion_' + repetidos[i]).innerHTML = ' (repeated question)';
        document.getElementById('submitQuestionsBtn').style.display = 'none';
    }
}
function submitQuestions()
{
    getQuestions();
    socket.emit('submitQuestionsArea1', JSON.stringify({
        questionsArea1: questions, 
        password: document.getElementById('adminPassword').value
    }));
}
function updateRoomsList()
{
    document.getElementById('roomsDiv').innerHTML = '';
    var html = '';
    for (var i = 0; i < rooms.length; i++)
    {
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
        }
    }
    document.getElementById('roomsDiv').innerHTML = html;
}