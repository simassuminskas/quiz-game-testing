var socket = io();
/* Variables */
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
var finished = false;
var vote = false;
var answerType;

socket.on('update', (data) => {//message['newTeam']
    if ((data['userName'] != undefined) && (data['userSurname'] != undefined) && (!finished))
    {//Pendiente modificar para ser más parecido a los otros y que muestre los equipos desde el principio como en otras ocasiones.
        if ((data['userName'] == userName) && (data['userSurname'] == userSurname))
        {
            if (!connected)
            {
                roomCode = data['roomCode'];
                teams = getTeams(data['rooms']);
                teamName = data['teamName'];
                connected = true;
            }
            teams = getTeams(data['rooms']);
            document.getElementById('divLogin').style.display = 'none';
            document.getElementById('teamInfo').style.display = 'block';
            //showTeamInfo();
        }
        else
        {//data['newTeam']
            if (connected)
            {
                teams = getTeams(data['rooms']);
                document.getElementById('divLogin').style.display = 'none';
                document.getElementById('teamInfo').style.display = 'block';
            }
            //if (connected)
            {
                //showTeamInfo(false);
            }
        }
        showTeamInfo();
        //console.log('Teams:');
        //console.log(teams);
    }
});//b.style.backgroundImage = "url('./img/3.png')"//ac0034
socket.on('showSpinner', (data) => {
    if ((data['roomCode'] == roomCode) && (!finished))
    {
        console.log('startGame');
        document.getElementById('statusInfo').innerHTML = data['status'];
        started = true;
        teams = getTeams(data['rooms']);
        //updateUsersInfo();
        if ((data['userName'] == userName) && 
            (data['userSurname'] == userSurname))
        {
            document.getElementById('area3').style.display = 'none';
            document.getElementById('spinner').style.display = 'block';
            /*<center id="gameInfo" style="display: none;">
                <label id="teamScore"></label>
                <label id="statusInfo"></label>
                <label id="userInfo"></label>
            </center>*/
        }
        showTeamInfo();
        showGameInfo();
    }
});
socket.on('question', (data) => {
    if ((data['roomCode'] == roomCode) && (!finished))console.log('Line 134: ' + data['roomCode'])
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
        if ((data['teamName'] == teamName))console.log('Line 157: ' + leader + ', ' + data['teamName'] + ', ' + data['area'] + ', ' + leader);
        {
            document.getElementById('area3').style.display = 'none';
            if (((data['area'] == 1) && (!leader)) || ((data['area'] == 2) && (data['userName'] == userName) && (data['userSurname'] == userSurname)))
            {
                document.getElementById('area' + data['area']).style.display = 'block';
                document.getElementById('area' + data['area'] + 'QuestionsDiv').innerHTML = '<label id="question">' + data['question']['question'] + '</label>';
                var html = '';
                for (var j = 0; j < data['question']['options'].length; j++)
                {
                    html += '<input type="radio" id="question_option_' + j + '" name="answer">';
                    html += '<label id="lbl_question_option_' + j + '" for=question_option_' + j + '">' + data['question']['options'][j]['option'] + '</label><br>';
                }
                //html += '<button onclick="submitAnswer(\'allUsersVotation\');">Submit answer</button>';
                document.getElementById('area' + data['area'] + 'AnswersDiv').innerHTML = html;
                document.getElementById('submitAnswerButton').style.display = 'block';
                if (area == 2)
                {
                    answerType = 'questionArea2';
                }
                else
                {
                    answerType = 'allUsersVotation';
                }
            }
        }
        //updateUsersInfo();
    }
});
socket.on('voteAnswerAllTeam', (data) => {
    if ((data['roomCode'] == roomCode) && (!finished))
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
                    document.getElementById('area2').style.display = 'none';
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
                document.getElementById('area1QuestionsDiv').innerHTML = '';
                var html = '<label id="question">' + data['question']['question'] + '</label><br>';
                for (var j = 0; j < data['question']['options'].length; j++)
                {
                    html += '<input type="radio" id="question_option_' + j + '" name="answer">';
                    html += '<label id="lbl_question_option_' + j + '" for=question_option_' + j + '">' + data['question']['options'][j]['option'] + '</label><br>';
                }
                document.getElementById('area1QuestionsDiv').innerHTML = html;
                document.getElementById('submitAnswerButton').style.display = 'block';
                answerType = 'allUsersVotation';
            }
        }
    }
});
socket.on('leaderVotation', (data) => {
    if ((data['roomCode'] == roomCode) && (!finished))
    {
        teams = getTeams(data['rooms']);
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
        }console.log('Line 252: ' + leader + ', ' + teamIndex + ', ' + data['teamName']);
        if (leader && (teamIndex != -1) && (data['teamName'] == teamName))
        {
            document.getElementById('area1').style.display = 'block';
            document.getElementById('area1QuestionsDiv').innerHTML = '';
            document.getElementById('area1QuestionsDiv').innerHTML = '<label id="question">' + data['question']['question'] + '</label><br>';
            var html = '';
            for (var j = 0; j < data['question']['options'].length; j++)
            {
                html += '<input type="radio" id="question_option_' + j + '" name="answer">';
                html += '<label id="lbl_question_option_' + j + '" for=question_option_' + j + '">' + data['question']['options'][j]['option'] + '</label><br>';
            }
            html += '<input type="radio" id="question_option_' + j + '" name="answer">';
            html += '<label id="lbl_question_option_' + j + '" for=question_option_' + j + '">no mutual agreement</label><br>';
            document.getElementById('area1AnswersDiv').innerHTML = html;
            document.getElementById('submitAnswerButton').style.display = 'block';
            answerType = 'leaderVotation';
        }
    }
});
socket.on('personalEvaluation', (data) => {
    if ((data['roomCode'] == roomCode) && (!finished))
    {
        document.getElementById('statusInfo').innerHTML = 'Personal evaluation.';
        teams = getTeams(data['rooms']);
        if (data['teamName'] == teamName)
        {
            /*document.getElementById('area1').style.display = 'block';
            document.getElementById('area1QuestionsDiv').innerHTML = '';
            document.getElementById('area1QuestionsDiv').innerHTML = '<label id="question">' + data['question']['question'] + '</label><br>';
            var html = '';
            for (var j = 0; j < data['question']['options'].length; j++)
            {
                html += '<input type="radio" id="question_option_' + j + '" name="answer">';
                html += '<label id="lbl_question_option_' + j + '" for=question_option_' + j + '">' + data['question']['options'][j]['option'] + '</label><br>';
            }
            html += '<input type="radio" id="question_option_' + j + '" name="answer">';
            html += '<label id="lbl_question_option_' + j + '" for=question_option_' + j + '">no mutual agreement</label><br>';
            document.getElementById('area1AnswersDiv').innerHTML = html;
            document.getElementById('submitAnswerButton').style.display = 'block';
            answerType = 'leaderVotation';*/
            var html = '<label id="question">' + data['question'] + '</label><br>';
            html += '<label>Final answer</label><br>';
            html += '<label>' + data['answer'] + '</label><br>';
            html += '<label>Close to reality: </label>';
            html += '<input type="range" id="personalEvaluationRange" min="0" max="4">';

            document.getElementById('submitPersonalEvaluation').style.display = 'block';
            
            document.getElementById('area1').style.display = 'block';
            document.getElementById('lblDilemmas').style.display = 'none';
            document.getElementById('area1Table').style.display = 'none';
            document.getElementById('area1QuestionsDiv').style.display = 'none';
            document.getElementById('area1AnswersDiv').style.display = 'none';

            document.getElementById('personalEvaluation').innerHTML = html;
            showGameInfo();
        }
        //updateUsersInfo();
    }
});
socket.on('ro', (data) => {
    if ((data['roomCode'] == roomCode) && (!finished))
    {
        area = data['area'];
        teams = getTeams(data['rooms']);
        console.log(data);
        if (data['teamName'] == teamName)
        {
            if ((data['userName'] == userName) && 
                (data['userSurname'] == userSurname))
            {//area3TextAndPoints
                document.getElementById('area3').style.display = 'block';
                var html = '<label>' + data['ro']['text'] + '</label><br>';
                html += '<label class="lblArea3Score">Score: ' + data['ro']['score'] + '</label>';
                document.getElementById('area3TextAndPoints').innerHTML = html;
            }
            showGameInfo();
        }
    }
});
socket.on('finishGame', (data) => {
    if ((data['roomCode'] == roomCode) && (!finished))
    {
        if (data['teamName'] == teamName)
        {
            teams = getTeams(data['rooms']);
            document.getElementById('teamInfo').style.display = 'none';
            document.getElementById('gameInfo').style.display = 'none';
            document.getElementById('spinner').style.display = 'none';
            document.getElementById('area1').style.display = 'none';
            document.getElementById('area2').style.display = 'none';
            document.getElementById('area3').style.display = 'none';
            document.getElementById('submitAnswerButton').style.display = 'none';
            document.getElementById('submitPersonalEvaluation').style.display = 'none';
            document.getElementById('divGameFinished').style.display = 'block';
            finished = true;
            gameFinished();
        }
    }
});
socket.on('userDisconected', (data) => {
    if (data['roomCode'] == roomCode)
    {
        //console.log(data);
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
socket.on('error', (data) => {
    /*if ((id == undefined) || (data['id'] == id))//Pendiente revisar.
    {
        document.getElementById(panelMessages).style.display = 'block';
        showChat(data.type, data.user, data['error'], '', '');
        userName = undefined;
    }*/
});
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
    vote = true;
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
function submitAnswer()
{
    document.getElementById('submitAnswerButton').style.display = 'none';
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
    switch (answerType)
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
    document.getElementById('area1').style.display = 'none';
    document.getElementById('area2').style.display = 'none';
}
function submitPersonalEvaluation()
{
    var question;
    question = document.getElementById('question').innerHTML;
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
    document.getElementById('area1').style.display = 'none';
    document.getElementById('submitPersonalEvaluation').style.display = 'none';
}
function login(newTeam = false)
{
    if ((!connected) && (userName === undefined) && (userSurname === undefined))
    {
        userName = $('#nameInput').val().replace(regex, ' ').trim();
        userSurname = $('#surnameInput').val().replace(regex, ' ').trim();
        var data = JSON.stringify({
            'type' : 'update', 
            'userName' : userName, 
            'userSurname' : userSurname, 
            'teamName' : document.getElementById('teamName').value, 
            'newTeam' : newTeam
        });
        socket.emit('update', data);
    }
}