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

socket.on('update', (data) => {
    if ((data['userName'] != undefined) && (data['userSurname'] != undefined))
    {
        console.log(data);
        //userName = userName.split('_')[0];//pendiente mejorar
        if ((data['userName'] == userName) && (data['userSurname'] == userSurname))
        {
            document.getElementById('divLogin').style.display = 'none';
            roomCode = data['roomCode'];
            id = data['id'];
            for (var i = 0; i < data['usersInRoom'].length; i++)
            {
                var f = false;
                for (var j = 0; j < users.length; j++)
                {
                    if (users[j][0] == data['usersInRoom'][i])
                    {
                        f = true;
                    }
                }
                if (!f)
                {
                    users.push(data['usersInRoom'][i]);
                    users[users.length - 1]['puntuation'] = 0;
                    updateUsersInfo();
                }
            }
            /*if (data['requestTeamName'])
            {
                document.getElementById('inputTeamName').style.display = 'block';
            }
            else
            {
                updateUsersInfo();
            }*/
            updateUsersInfo();
            if (users.length > 1)
            {
                document.getElementById(panelMessages).style.display = 'block';
            }
            if (users.length > 2)
            {
                handleNewUserNeedsInfo();
            }
            document.getElementById(lblRoomCode).innerHTML = 'The room code is: ' + roomCode;

            if ((data['selectedUser'] != undefined) && (data['selectedUser'] != ''))
            {
                selectedUser = data['selectedUser'];
                updateUsersInfo();
                if ((data['selectedUser']['name'] == userName) && (data['selectedUser']['surname'] == userSurname))
                {
                    words = data['words'];
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
                    document.getElementById('send').childNodes[0].nodeValue = 'Send';
                    updateBar('mdi-content-send', 'Type here', false);
                }
                //document.getElementById(roundInfo).innerHTML = 'Round: ' + data['round'][0] + ' of ' + data['round'][1];
            }
        }
        else
        {
            if ((data['roomCode'] != undefined) && (data['roomCode'] != '')  && (data['roomCode'] == roomCode))
            {
                //document.getElementById('rBtn').style.display = 'none';
                //document.getElementById('rBtn2').style.display = 'none';
                //id = data['id'];
                for (var i = 0; i < data['usersInRoom'].length; i++)
                {
                    var f = false;
                    for (var j = 0; j < users.length; j++)
                    {
                        if ((users[j]['userName'] == data['usersInRoom'][i]['userName']) && 
                            (users[j]['userSurname'] == data['usersInRoom'][i]['userSurname']))
                        {
                            f = true;
                        }
                    }
                    if (!f)
                    {
                        //users.push({data['usersInRoom'][i]['name'], 0});//Pendiente revisar.
                        users.push(data['usersInRoom'][i]);
                        users[users.length - 1]['puntuation'] = 0;
                    }
                }
                if (users.length > 1)
                {
                    document.getElementById(panelMessages).style.display = 'block';
                }
                updateUsersInfo();
                if (users.length > 1)
                {
                    points = [];
                    //changeSize();
                    selectedUser = data['selectedUser'];
                    updateUsersInfo();
                    if ((data['selectedUser'] != undefined) && (data['selectedUser']['name'] != '') && (data['selectedUser']['surname'] != ''))
                    {
                        if ((data['selectedUser']['name'] == userName) && (data['selectedUser']['surname'] == userSurname))
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
                            html += '<label>Select a word: </label>';
                            words = data['words'];
                            /*var w = document.getElementById(wordsInfo);
                            w.style.display = 'flex';
                            w.innerHTML = '';
                            for (var i = 0; i < words.length; i++)
                            {
                                html += '<button id="w_' + i + '" onclick="selectWord(this.id);">' + words[i] + '</button>';
                            }
                            w.innerHTML = html;*/
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
                            html += '<label>' + data['selectedUser'] + ' is selecting a word.</label>';
                            //document.getElementById(wordsInfo).innerHTML = html;
                        }
                        ////document.getElementById(roundInfo).innerHTML = 'Round: ' + data['round'][0] + ' of ' + data['round'][1];
                    }
                    updateBar('mdi-content-send', 'Type here', false);
                    document.getElementById('privateRoom').style.display = 'none';
                    connected = true;
                }
            }
        }
    }
    if ((data['roomCode'] != undefined) && (data['roomCode'] != '')  && (data['roomCode'] == roomCode) && data['teams'])
    {//Si hay teams se le tiene que informar al usuario nuevo.
        for (var i = 0; i < data['teams'].length; i++)
        {
            var index = -1;
            for (var j = 0; j < teams.length; j++)
            {
                if (data['teams'][i]['teamName'] == teams[j]['teamName'])
                {
                    index = j;
                }
            }
            if (index == -1)
            {
                teams.push({'teamName' : data['teams'][i]['teamName'], 'users' : data['teams'][i]['users']});
            }
            else
            {
                teams[index]['users'] = data['teams'][i]['users'];
            }
        }
        updateUsersInfo();
    }
});
socket.on('newTeamName', (data) => {
    if (data['roomCode'] == roomCode)
    {
        if (data['teamOk'])
        {
            teams.push({'teamName' : data['teamName'], 'users' : [{'userName' : data['userName'], 'userSurname' : data['userSurname']}]});
            console.log('Se añadió un team:');
            console.log(teams[teams.length - 1]);
            updateUsersInfo();
        }
    }
});
socket.on('joinTeam', (data) => {
    if (data['roomCode'] == roomCode)
    {
        teams = getTeams(data['rooms']);
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
}
socket.on('voteLeader', (data) => {
    if (data['roomCode'] == roomCode)
    {
        //searchRoomCode(rc, newUser = true, type = null)
        teams = getTeams(data['rooms']);
        updateUsersInfo();
    }
});
socket.on('readyToStartGame', (data) => {
    if (data['roomCode'] == roomCode)
    {
        document.getElementById('statusInfo').innerHTML = 'Waiting for admin.';
        teams = getTeams(data['rooms']);
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
        updateUsersInfo();
    }
});
socket.on('startGame', (data) => {
    if (data['roomCode'] == roomCode)
    {
        console.log('startGame');
        document.getElementById('statusInfo').innerHTML = 'Starting game.';
        teams = getTeams(data['rooms']);
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
        //document.getElementById('statusInfo').innerHTML = 'Starting game.';
        teams = getTeams(data['rooms']);
        if ((data['userName'] == userName) && 
            (data['userSurname'] == userSurname))
        {
            document.getElementById('questionsDiv').innerHTML = '';
            var html = '';
            html += '<label id="question">' + data['question']['question'] + '</label><br>';
            html += '<label class="lblOptions">Options<br></label>';
            /*<p>Please select your gender:</p>
              <input type="radio" id="male" name="gender" value="male">
              <label for="male">Male</label><br>*/
            for (var j = 0; j < data['question']['options'].length; j++)
            {
                html += '<input type="radio" id="question_option_' + j + '" name="answer">';
                html += '<label for=question_option_' + j + '">' + data['question']['options'][j]['option'] + '</label><br>';
                //html += '<input id="question_' + i + '_option_' + j + '" type="text" value="' + data['question']['options'][j]['option'] + '"><br>';
            }
            html += '<button onclick="submitAnswer();">Submit answer</button>';
            document.getElementById('questionsDiv').innerHTML = html;
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
        if ((data['userName'] == userName) && 
            (data['userSurname'] == userSurname))
        {
            document.getElementById('rollDiceButton').style.display = 'block';
        }
    }
});
socket.on('userDisconected', (data) => {
    if (data['roomCode'] == roomCode)
    {
        console.log(data);
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
            if (data['subType'] == 'gameOver')
            {
                /*canvas.removeEventListener('touchstart', onTouch, false);
                canvas.removeEventListener('touchend', onTouchUp, false);
                canvas.removeEventListener('mouseup', onUp, false);
                canvas.removeEventListener('mousemove', onMove, false);*/
                //document.getElementById(drawingToolsDiv).style.display = 'none';
                document.getElementById(panelMessages).style.display = 'block';
                //showChat(data.type, '', 'The word was \'' + data['word'] + '\'.', '', '');
                stopTime = true;
                points = [];
                drawer = false;
                //changeSize();
                selectedUser = '';
                if (data['puntuation'] != undefined)
                {
                    for (var i = 0; i < users.length; i++)
                    {
                        //if (users[i][0] == data['userName'])
                        {
                            users[i]['puntuation'] = data['puntuation'][i];
                            //i = users.length;
                        }
                    }
                    updateUsersInfo();
                    if (data['winners'].length > 1)
                    {
                        var names = data['winners'][0][0];
                        for (var i = 1; i < data['winners'].length; i++)
                        {
                            names += ', ' + data['winners'][i][0];
                        }
                        showChat(data.type, '', 'Winners: ' + names + '.', '', '');
                    }
                    else
                    {
                        showChat(data.type, '', 'Winner: ' + data['winners'][0][0] + '.', '', '');
                    }
                }
                else
                {//Cuando se hace rematch luego de terminar el juego por abandono.
                    //document.getElementById('rBtn2').style.display = 'block';
                }
                showChat(data.type, '', 'Game over.', '', '');
                //document.getElementById('rBtn').style.display = 'block';
            }
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
socket.on('returningGameInfo', (data) => {
    if ((data['roomCode'] == roomCode) && (data['userName'] == userName))
    {
        if ((data['selectedUser'] != undefined) && (data['selectedUser'] != ''))
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
            html += '<label>' + data['selectedUser'] + ' is selecting a word.</label>';
            //document.getElementById(wordsInfo).innerHTML = html;
            //document.getElementById(roundInfo).innerHTML = 'Round: ' + data['round'][0] + ' of ' + data['round'][1];
            selectedUser = data['selectedUser'];
            updateUsersInfo();
            document.getElementById('send').childNodes[0].nodeValue = 'Send';
            updateBar('mdi-content-send', 'Type here', false);
            document.getElementById('privateRoom').style.display = 'none';
        }
    }
});
socket.on('startDrawing', (data) => {
    //console.log(data['roomCode'], roomCode);
    if (data['roomCode'] == roomCode)
    {
        //document.getElementById(canvas).style.display = 'block';
        canvasDisplay = 'block';
        points = [];
        //var b = $('#body');
        //changeSize();
        stopTime = false;
        initTime();
        selectedUser = data['selectedUser'];
        updateUsersInfo();
        if (data['selectedUser'] == userName)
        {
            //changeSize(true);
            document.getElementById('send').childNodes[0].nodeValue = 'Send';
            updateBar('mdi-content-send', 'Type here', false);
        }
        else
        {
            document.getElementById('send').childNodes[0].nodeValue = 'Send';
            updateBar('mdi-content-send', 'Type here', false);
            document.getElementById('privateRoom').style.display = 'none';
        }
    }
});
socket.on('nextTurn', (data) => {
    if (data['roomCode'] == roomCode)
    {
        canvas.removeEventListener('touchstart', onTouch, false);
        canvas.removeEventListener('touchend', onTouchUp, false);
        canvas.removeEventListener('mouseup', onUp, false);
        canvas.removeEventListener('mousemove', onMove, false);
        document.getElementById(drawingToolsDiv).style.display = 'none';
        if (data['timeOut'])
        {
            showChat(data.type, '', 'Time out.', '', '');
        }
        if ((data['userName'] != '') && (data['userName'] != undefined))
        {
            showChat(data.type, '', data['userName'] + ' ' + data['userSurname'] + ' guessed the word!', '', '');
        }
        showChat(data.type, '', 'The word was \'' + data['word'] + '\'.', '', '');
        stopTime = true;
        points = [];
        drawer = false;
        //changeSize();
        selectedUser = data['selectedUser'];
        for (var i = 0; i < users.length; i++)
        {
            //if (users[i][0] == data['userName'])
            {
                users[i][1] = data['puntuation'][i];
                //i = users.length;
            }
        }
        updateUsersInfo();
        if (data['selectedUser'] != '')
        {
            if (data['selectedUser'] == userName)
            {
                var html = '';
                if (!data['full'])//No funciona.
                {
                    //document.getElementById('waiting').style.display = 'block';
                }
                else
                {
                    //document.getElementById('waiting').style.display = 'none';
                }
                html += '<label>Select a word: </label>';
                words = data['words'];
                /*var w = document.getElementById(wordsInfo);
                w.style.display = 'flex';
                w.innerHTML = '';
                for (var i = 0; i < words.length; i++)
                {
                    html += '<button id="w_' + i + '" onclick="selectWord(this.id);">' + words[i] + '</button>';
                }
                w.innerHTML = html;*/
                //console.log(w.innerHTML);
                document.getElementById('send').childNodes[0].nodeValue = 'Send';
                updateBar('mdi-content-send', 'Type here', false);
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
                html += '<label>' + data['selectedUser'] + ' is selecting a word.</label>';
                //document.getElementById(wordsInfo).innerHTML = html;
                document.getElementById('send').childNodes[0].nodeValue = 'Send';
                updateBar('mdi-content-send', 'Type here', false);
                document.getElementById('privateRoom').style.display = 'none';
            }
            //document.getElementById('roundInfo').innerHTML = 'Round: ' + data['round'][0] + ' of ' + data['round'][1];
        }
        else
        {
            //¿Error?
        }
    }
});
socket.on('gameOver', (data) => {
    if (data['roomCode'] == roomCode)
    {
        canvas.removeEventListener('touchstart', onTouch, false);
        canvas.removeEventListener('touchend', onTouchUp, false);
        canvas.removeEventListener('mouseup', onUp, false);
        canvas.removeEventListener('mousemove', onMove, false);
        document.getElementById(drawingToolsDiv).style.display = 'none';
        if (data['timeOut'])
        {
            showChat(data.type, '', 'Time out.', '', '');
        }
        if ((data['userName'] != '') && (data['userName'] != undefined))
        {
            showChat(data.type, '', data['userName'] + ' guessed the word!', '', '');
        }
        showChat(data.type, '', 'The word was \'' + data['word'] + '\'.', '', '');
        stopTime = true;
        points = [];
        drawer = false;
        //changeSize();
        selectedUser = '';
        for (var i = 0; i < users.length; i++)
        {
            //if (users[i][0] == data['userName'])
            {
                users[i][1] = data['puntuation'][i];
                //i = users.length;
            }
        }
        updateUsersInfo();
        if (data['winners'].length > 1)
        {
            var names = data['winners'][0][0];
            for (var i = 1; i < data['winners'].length; i++)
            {
                names += ', ' + data['winners'][i][0];
            }
            showChat(data.type, '', 'Winners: ' + names + '.', '', '');
        }
        else
        {
            showChat(data.type, '', 'Winner: ' + data['winners'][0][0] + '.', '', '');
        }
        showChat(data.type, '', 'Game over.', '', '');

        document.getElementById('rBtn').style.display = 'block';
        document.getElementById('rBtn2').style.display = 'none';
    }
});
socket.on('message', (data) => {
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
function handleNewUserNeedsInfo()
{
    socket.emit('newUserNeedsInfo', JSON.stringify({
        type: 'newUserNeedsInfo',
        userName: userName, 
        userSurname: userSurname, 
        roomCode: roomCode
    }));
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
    socket.emit('answer', JSON.stringify({
        userName: userName, 
        userSurname: userSurname, 
        teamName: document.getElementById('teamName').value, 
        roomCode: roomCode
    }));
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