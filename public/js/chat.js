var socket = io();
/* Variables */
var user;
var id;
var users = [];
var selectedUser;
var words;
var timer;
var socket;
var oldname;
var userName;
var userSurname;
var roomCode;
var privateRoom = false;
var typeTimer;
//var clients = [];
var dev = true;
var unread = 0;
var focus = true;
var connected = false;
var regex = /(&zwj;|&nbsp;)/g;
var d;
var teams = [];
var area;

socket.on('update', (data) => {
    if ((data['userName'] != undefined) && (data['userSurname'] != undefined))
    {//Pendiente modificar para ser más parecido a los otros y que muestre los equipos desde el principio como en otras ocasiones.
        /*console.log('update');
        console.log(data);
        console.log(userName, userSurname);*/
        if ((data['userName'] == userName) && (data['userSurname'] == userSurname))
        {
            document.getElementById('divLogin').style.display = 'none';
            roomCode = data['roomCode'];
            document.getElementById(lblRoomCode).innerHTML = 'The room code is: ' + roomCode;
            document.getElementById(privateRoom).style.display = 'none';

            document.getElementById(panelMessages).style.display = 'block';
            document.getElementById('send').childNodes[0].nodeValue = 'Send';
            updateBar('mdi-content-send', 'Type here', false);
            connected = true;
        }
        teams = getTeams(data['rooms']);
        /*for (var i = 0; i < data['rooms'].length; i++)
        {
            if (data['rooms'][i]['roomCode'] == roomCode)
            {
                for (var j = 0; j < data['rooms'][i]['teams'].length; j++)
                {
                    for (var k = 0; k < data['rooms'][i]['teams'].length; k++)
                    {
                        console.log(data['rooms'][i]['users']);
                    }
                }
            }
        }*/
        console.log('Teams:');
        console.log(teams);
        updateUsersInfo();
    }
});
socket.on('newTeamName', (data) => {
    if (data['roomCode'] == roomCode)
    {
        if (data['teamOk'])
        {
            teams.push({
                'teamName' : data['teamName'], 
                'users' : [{
                    'userName' : data['userName'], 
                    'userSurname' : data['userSurname']
                }], 
                'scoreArea1' : 0, 
                'scoreArea2' : 0, 
                'scoreArea3' : 0
            });
            if ((data['userName'] == userName) && (data['userSurname'] == userSurname))
            {
                teamName = data['teamName'];
            }
            //console.log('Se añadió un team:');
            //console.log(teams[teams.length - 1]);
            updateUsersInfo();
        }
    }
});
socket.on('joinTeam', (data) => {
    if (data['roomCode'] == roomCode)
    {
        teams = getTeams(data['rooms']);
        if ((data['userName'] == userName) && (data['userSurname'] == userSurname))
        {
            teamName = data['teamName'];
        }
        updateUsersInfo();
    }
});
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
socket.on('voteLeader', (data) => {
    if (data['roomCode'] == roomCode)
    {
        //searchRoomCode(rc, newUser = true, type = null)
        teams = getTeams(data['rooms']);
        updateUsersInfo();
    }
});
socket.on('startGame', (data) => {
    if (data['roomCode'] == roomCode)
    {
        console.log('startGame');
        document.getElementById('statusInfo').innerHTML = 'Starting game.';
        teams = getTeams(data['rooms']);
        updateUsersInfo();
        if ((data['userName'] == userName) && 
            (data['userSurname'] == userSurname))
        {
            document.getElementById('rollDiceButton').style.display = 'block';
        }
    }
});
socket.on('question', (data) => {
    if (data['roomCode'] == roomCode)
    {
        area = data['area'];
        teams = getTeams(data['rooms']);
        var teamIndex = -1;
        for (var j = 0; j < teams.length; j++)
        {
            if (teams[j]['teamName'] == data['teamName'])
            {
                teamIndex = j;
            }
        }
        console.log(data);
        var leader = false;
        for (var k = 0; k < teams[teamIndex]['users'].length; k++)
        {
            if ((teams[teamIndex]['users'][k]['userName'] == userName) && 
                (teams[teamIndex]['users'][k]['userSurname'] == userSurname) && 
                teams[teamIndex]['users'][k]['leader'])
            {//Ver que no sea el lider (porque ese vota después).
                leader = true;
            }
        }
        //if ((!leader) && (teamIndex != -1))
        if ((!leader) && (data['teamName'] == teamName))
        {
            document.getElementById('questionsDiv').innerHTML = '';
            var html = '';
            html += '<label id="question">' + data['question']['question'] + '</label><br>';
            html += '<label class="lblOptions">Options<br></label>';
            for (var j = 0; j < data['question']['options'].length; j++)
            {
                html += '<input type="radio" id="question_option_' + j + '" name="answer">';
                html += '<label id="lbl_question_option_' + j + '" for=question_option_' + j + '">' + data['question']['options'][j]['option'] + '</label><br>';
            }
            html += '<button onclick="submitAnswer(\'allUsersVotation\');">Submit answer</button>';
            document.getElementById('questionsDiv').innerHTML = html;
        }
        updateUsersInfo();
    }
});
socket.on('voteAnswerAllTeam', (data) => {
    if (data['roomCode'] == roomCode)
    {
        //document.getElementById('statusInfo').innerHTML = 'Starting game.';
        teams = getTeams(data['rooms']);
        if ((data['userName'] != userName) || 
            (data['userSurname'] != userSurname))
        {
            var leader = false;
            var teamIndex = -1;
            for (var j = 0; j < teams.length; j++)
            {
                if (teams[j]['teamName'] == data['teamName'])
                {
                    teamIndex = j;
                    for (var k = 0; k < teams[j]['users'].length; k++)
                    {
                        if ((teams[j]['users'][k]['userName'] == userName) && 
                            (teams[j]['users'][k]['userSurname'] == userSurname) && 
                            teams[j]['users'][k]['leader'])
                        {//Ver que no sea el lider (porque ese vota después).
                            leader = true;
                        }
                    }
                }
            }
            if ((!leader) && (teamIndex != -1))
            {
                document.getElementById('questionsDiv').innerHTML = '';
                var html = '';
                html += '<label id="question">' + data['question']['question'] + '</label><br>';
                html += '<label class="lblOptions">Options<br></label>';
                for (var j = 0; j < data['question']['options'].length; j++)
                {
                    html += '<input type="radio" id="question_option_' + j + '" name="answer">';
                    html += '<label id="lbl_question_option_' + j + '" for=question_option_' + j + '">' + data['question']['options'][j]['option'] + '</label><br>';
                }
                html += '<button onclick="submitAnswer(\'allUsersVotation\');">Submit answer</button>';
                document.getElementById('questionsDiv').innerHTML = html;
            }
        }
        /*for (var j = 0; j < teams.length; j++)
        {
            for (var k = 0; k < teams[j]['users'].length; k++)
            {
                if ((teams[j]['users'][k]['userName'] == userName) && 
                    (teams[j]['users'][k]['userSurname'] == userSurname))
                {
                    document.getElementById('startGameButton').style.display = 'block';
                    //indexLeaderElected = k;
                }
            }
        }*/
        updateUsersInfo();
        /*if ((data['userName'] == userName) && 
            (data['userSurname'] == userSurname))
        {
            document.getElementById('rollDiceButton').style.display = 'block';
        }*/
    }
});
socket.on('leaderVotation', (data) => {
    if (data['roomCode'] == roomCode)
    {
        //document.getElementById('statusInfo').innerHTML = 'Starting game.';
        teams = getTeams(data['rooms']);
        //if ((data['userName'] != userName) || 
            //(data['userSurname'] != userSurname))
        {//if (data['teamName'] == teamName)
            var leader = false;
            var teamIndex = -1;
            for (var j = 0; j < teams.length; j++)
            {
                if (teams[j]['teamName'] == data['teamName'])
                {
                    teamIndex = j;
                    for (var k = 0; k < teams[j]['users'].length; k++)
                    {
                        if ((teams[j]['users'][k]['userName'] == userName) && 
                            (teams[j]['users'][k]['userSurname'] == userSurname) && 
                            teams[j]['users'][k]['leader'])
                        {
                            leader = true;
                        }
                    }
                }
            }
            if (leader && (teamIndex != -1) && (data['teamName'] == teamName))
            {
                console.log(data);
                document.getElementById('questionsDiv').innerHTML = '';
                var html = '';
                html += '<label id="question">' + data['question']['question'] + '</label><br>';
                html += '<label class="lblOptions">Options<br></label>';
                var j = 0;
                for (;j < data['question']['options'].length; j++)
                {//Agregar opción: "no mutual agreement"
                    html += '<input type="radio" id="question_option_' + j + '" name="answer">';
                    html += '<label id="lbl_question_option_' + j + '" for=question_option_' + j + '">' + data['question']['options'][j]['option'] + '</label><br>';
                }
                html += '<input type="radio" id="question_option_' + j + '" name="answer">';
                html += '<label id="lbl_question_option_' + j + '" for=question_option_' + j + '">no mutual agreement</label><br>';
                
                html += '<button onclick="submitAnswer(\'leaderVotation\');">Submit answer</button>';
                document.getElementById('questionsDiv').innerHTML = html;
            }
        }
        updateUsersInfo();
        /*if ((data['userName'] == userName) && 
            (data['userSurname'] == userSurname))
        {
            document.getElementById('rollDiceButton').style.display = 'block';
        }*/
    }
});
socket.on('personalEvaluation', (data) => {
    if (data['roomCode'] == roomCode)
    {
        document.getElementById('statusInfo').innerHTML = 'Personal evaluation.';
        teams = getTeams(data['rooms']);
        if (data['teamName'] == teamName)
        {
            document.getElementById('questionsDiv').innerHTML = '';
            var html = '<label id="question">' + data['question'] + '</label><br>';
            //Mostrar la opción seleccionada por el líder.
            html += '<label>Final answer</label><br>';
            html += '<label>' + data['answer'] + '</label><br>';
            html += '<label>Close to reality: </label>';
            html += '<input type="range" id="personalEvaluationRange" min="0" max="4">';
            html += '<button onclick="submitPersonalEvaluation();">Submit</button>';
            
            document.getElementById('questionsDiv').innerHTML = html;
        }
        updateUsersInfo();
    }
});
socket.on('ro', (data) => {
    if (data['roomCode'] == roomCode)
    {
        area = data['area'];
        teams = getTeams(data['rooms']);
        console.log(data);
        if (data['teamName'] == teamName)
        {
            if ((data['userName'] == userName) && 
                (data['userSurname'] == userSurname))
            {
                document.getElementById('questionsDiv').innerHTML = '';
                var html = '<label id="question">' + data['ro']['text'] + '</label><br>';
                html += '<label class="lblArea3Score">Score: ' + data['ro']['score'] + '</label>';
                document.getElementById('questionsDiv').innerHTML = html;
            }
            /*if (data['startGame'])
            {
                document.getElementById('rollDiceButton').style.display = 'block';
                document.getElementById('statusInfo').innerHTML = 'Starting game.';
            }*/
        }
        updateUsersInfo();
    }
});
socket.on('questionArea2', (data) => {
    if (data['roomCode'] == roomCode)
    {
        area = data['area'];
        teams = getTeams(data['rooms']);
        console.log(data);
        if (data['teamName'] == teamName)
        {//Pendiente ver que sólamente sea para el usuario indicado.
            if ((data['userName'] == userName) && 
                (data['userSurname'] == userSurname))
            {
                document.getElementById('questionsDiv').innerHTML = '';
                var html = '';
                html += '<label id="question">' + data['question']['question'] + '</label><br>';
                html += '<label class="lblOptions">Options<br></label>';
                var j = 0;
                for (;j < data['question']['options'].length; j++)
                {//Agregar opción: "no mutual agreement"
                    html += '<input type="radio" id="question_option_' + j + '" name="answer">';
                    html += '<label id="lbl_question_option_' + j + '" for=question_option_' + j + '">' + data['question']['options'][j]['option'] + '</label><br>';
                }
                html += '<button onclick="submitAnswer(\'questionArea2\');">Submit answer</button>';
                document.getElementById('questionsDiv').innerHTML = html;
            }
        }
        updateUsersInfo();
    }
});
socket.on('finishGame', (data) => {
    if (data['roomCode'] == roomCode)
    {
        if (data['teamName'] == teamName)
        {
            document.getElementById('statusInfo').innerHTML = 'Game finished.';
            teams = getTeams(data['rooms']);
            updateUsersInfo();
            document.getElementById('rollDiceButton').style.display = 'none';
            document.getElementById('questionsDiv').innerHTML = '';
        }
    }
});
socket.on('userDisconected', (data) => {
    if (data['roomCode'] == roomCode)
    {
        //console.log(data);
        showChat(data.type, '', data['userName'] + ' ' + data['userSurname'] + ' disconnected.', '', '');
        var auxUsers = [];
        for (var i = 0; i < users.length; i++)
        {
            if (users[i][0] != data['userName'])
            {
                auxUsers.push(users[i]);
            }
        }
        updateUsersInfo();
        users = [...auxUsers];
        if (users.length < 2)
        {
            //canvasDisplay = 'none';
            //changeSize();
            document.getElementById(panelMessages).style.display = 'none';
            //document.getElementById(roundInfo).innerHTML = '';
            stopTime = true;
            document.getElementById(timeInfo).innerHTML = 'Time remaining: ' + time;
            //document.getElementById(wordsInfo).innerHTML = '';
            //document.getElementById('waiting').style.display = 'none';
            //document.getElementById(drawingToolsDiv).style.display = 'none';
            selectedUser = undefined;
        }
        else
        {
            if (data['subType'] == 'reasignedSelectedUser')
            {
                stopTime = true;
                selectedUser = data['selectedUser'];
                updateUsersInfo();
                if ((data['selectedUser']['name'] == userName) && (data['selectedUser']['surname'] == userSurname))
                {
                    words = data['words'];
                    /*var w = document.getElementById(wordsInfo);
                    w.style.display = 'flex';
                    w.innerHTML = '';
                    var html = '';
                    if (!data['full'])
                    {
                        //document.getElementById('waiting').style.display = 'block';
                    }
                    else
                    {
                        //document.getElementById('waiting').style.display = 'none';
                    }
                    html += '<label>Select a word: </label>';
                    for (var i = 0; i < words.length; i++)
                    {
                        html += '<button id="w_' + i + '" onclick="selectWord(this.id);">' + words[i] + '</button>';
                    }
                    w.innerHTML = html;*/
                    document.getElementById('send').childNodes[0].nodeValue = 'Send';
                    updateBar('mdi-content-send', 'Type here', false);
                    document.getElementById(privateRoom).style.display = 'none';
                }
                else
                {
                    var html = '';
                    if (!data['full'])
                    {
                        //document.getElementById('waiting').style.display = 'block';
                    }
                    else
                    {
                        //document.getElementById('waiting').style.display = 'none';
                    }
                    html += '<label>' + data['selectedUser']['userName'] + ' ' + data['selectedUser']['userSurname'] + ' is selecting a word.</label>';
                    //document.getElementById(wordsInfo).innerHTML = html;
                    //document.getElementById(wordsInfo).style.display = 'flex';
                    document.getElementById('send').childNodes[0].nodeValue = 'Send';
                    updateBar('mdi-content-send', 'Type here', false);
                }
                //document.getElementById(roundInfo).innerHTML = 'Round: ' + data['round'][0] + ' of ' + data['round'][1];
            }
        }
        updateUsersInfo();
    }
});
socket.on('new message', (data) => {
    if (data['roomCode'] == roomCode)
    {
        showChat(data.type, data['userName'], data['userSurname'], data['guess'], '', '');
    }
});
socket.on('error', (data) => {
    /*if ((id == undefined) || (data['id'] == id))//Pendiente revisar.
    {
        document.getElementById(panelMessages).style.display = 'block';
        showChat(data.type, data.user, data['error'], '', '');
        userName = undefined;
    }*/
});
function updateBar(icon, placeholder, disable)
{
    document.getElementById('icon').className = 'mdi ' + icon;
    $('#' + messageInput).attr('placeholder', placeholder);
    $('#' + messageInput).prop('disabled', disable);
    $('#send').prop('disabled', disable);
}
function showChat(type, userName, userSurname, message, subtxt, mid)
{
    if(subtxt)
    {
        subtxt = '(' + subtxt + ') ';
    }
    $('#' + panel).append('<div class="' + type + '""><span><b><a class="namelink" href="javascript:void(0)">' + userName + ' ' + userSurname + '</a></b></span><span class="timestamp">' + subtxt + getTime() + '</span><br><span class="msg">' + message + '</span></div>');
    
    $('#' + panel).animate({scrollTop: $('#' + panel).prop('scrollHeight')}, 500);
}
function joinTeam(userName, userSurname, roomCode, index)
{
    socket.emit('joinTeam', JSON.stringify({
        type: 'joinTeam',
        userName: userName, 
        userSurname: userSurname, 
        teamName: teams[index]['teamName'], 
        roomCode: roomCode
    }));
}
function voteLeader(userNameVoting, userSurnameVoting, roomCode, teamIndex, userNameVoted, userSurnameVoted)
{
    for (var i = 0; i < teams[teamIndex]['users'].length; i++)
    {
        console.log('vl_' + teamIndex + '_' + i);
        document.getElementById('vl_' + teamIndex + '_' + i).style.display = 'none';
    }
    console.log(userNameVoting, userSurnameVoting, roomCode, teamIndex, userNameVoted, userSurnameVoted);
    //Pendiente ver por qué el último que vota no recibe la información sobre quién es el líder.
    socket.emit('voteLeader', JSON.stringify({
        type: 'voteLeader',
        userNameVoted: userNameVoted, 
        userSurnameVoted: userSurnameVoted, 
        userNameVoting: userNameVoting, 
        userSurnameVoting: userSurnameVoting, 
        teamName: teams[teamIndex]['teamName'], 
        roomCode: roomCode
    }));
}
function submitAnswer(type = 'allUsersVotation')
{
    var question;
    var answer;
    var rads = document.getElementsByName('answer');
    for (var i = 0; i < rads.length; i++)
    {
        if (rads[i].checked)
        {
            question = document.getElementById('question').innerHTML;
            answer = document.getElementById('lbl_question_option_' + rads[i].id.split('_')[rads[i].id.split('_').length - 1]).innerHTML;
            i = rads.length;
        }
    }
    switch (type)
    {
        case 'allUsersVotation':
            socket.emit('allUsersVotation', JSON.stringify({
                "userName" : userName, 
                "userSurname" : userSurname, 
                "teamName" : teamName, 
                "question" : question, 
                "answer" : answer, 
                "area" : area, 
                "roomCode" : roomCode
            }));
        break;
        case 'leaderVotation':
            socket.emit('leaderVotation', JSON.stringify({
                "userName" : userName, 
                "userSurname" : userSurname, 
                "teamName" : teamName, 
                "question" : question, 
                "answer" : answer, 
                "area" : area, 
                "roomCode" : roomCode
            }));
        break;
        case 'questionArea2':
            socket.emit('questionArea2', JSON.stringify({
                "userName" : userName, 
                "userSurname" : userSurname, 
                "teamName" : teamName, 
                "question" : question, 
                "answer" : answer, 
                "area" : area, 
                "roomCode" : roomCode
            }));
        break;
    }
    //Pendiente ver si es necesario ocultar la pregunta luego de enviar.
    document.getElementById('questionsDiv').innerHTML = '';
}
function submitPersonalEvaluation()
{
    var question;
    question = document.getElementById('question').innerHTML;
    /*var answer;
    var rads = document.getElementsByName('answer');
    for (var i = 0; i < rads.length; i++)
    {
        if (rads[i].checked)
        {
            question = document.getElementById('question').innerHTML;
            answer = document.getElementById('lbl_question_option_' + rads[i].id.split('_')[rads[i].id.split('_').length - 1]).innerHTML;
            i = rads.length;
        }
    }*/
    console.log('Line 534.');
    console.log(question);
    socket.emit('personalEvaluation', JSON.stringify({
        "userName" : userName, 
        "userSurname" : userSurname, 
        "teamName" : teamName, 
        "question" : question, 
        "area" : area, 
        "evaluation" : parseInt(document.getElementById('personalEvaluationRange').value) + 1, 
        "roomCode" : roomCode
    }));
    document.getElementById('questionsDiv').innerHTML = '';
}
function handleNewTeamName()
{
    socket.emit('newTeamName', JSON.stringify({
        type: 'newTeamName',
        userName: userName, 
        userSurname: userSurname, 
        teamName: document.getElementById('teamName').value, 
        roomCode: roomCode
    }));
}
function handleMsg()
{
    var value = $('#' + messageInput).val().replace(regex, ' ').trim();
    if ((selectedUser != undefined) && (selectedUser != ''))
    {
        socket.emit('guess', JSON.stringify({
            type: 'guess',
            userName: userName, 
            userSurname: userSurname, 
            guess: value, 
            roomCode: roomCode
        }));
    }
    $('#' + messageInput).val('');
}
function handleLogin(private = false)
{
    var name = $('#nameInput').val().replace(regex, ' ').trim();
    var surname = $('#surnameInput').val().replace(regex, ' ').trim();
    if (private)
    {
        roomCode = 'private';
        privateRoom = true;
    }
    else
    {
        if (!connected)
        {
            roomCode = $('#roomCode').val();
        }
    }
    if ((name.length > 0) && (surname.length > 0) && (!connected) && (userName === undefined) && (userSurname === undefined))
    {
        userName = name;
        userSurname = surname;
        //connect();
        var data = JSON.stringify({'type' : 'update', 'userName' : userName, 'userSurname' : surname, 'roomCode' : roomCode});
        socket.emit('update', data);
    }
    $('#userInput').val('');
    $('#roomCode').val('');
}
function handleTimeOut()
{
    socket.emit('timeOut', JSON.stringify({
        type: 'timeOut', 
        roomCode: roomCode
    }));
}
function handleWordSelected(w)
{
    socket.emit('wordSelected', JSON.stringify({
        type: 'wordSelected', 
        word: w, 
        roomCode: roomCode
    }));
}
function getTime()
{
    var now = new Date();
    var time = [now.getHours(), now.getMinutes(), now.getSeconds()];
 
    for(var i = 0; i < 3; i++)
    {
        if(time[i] < 10)
        {
            time[i] = '0' + time[i];
        }
    } 
    return time.join(':');
}