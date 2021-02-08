var rooms = [];
var questions = [
	{
		'question' : 'You are a new employee and have been working at CGI for two weeks. A day before a meeting with clients your manager tells you that you will be giving a presentation. You just laugh and jokingly say sure, because you do not have enough experience to complete this task. Just before the meeting, your manager asks you if you are prepared and you tell him that you are not. During the meeting, your manager tells you to present what you have prepared. You are shocked and you shake your head stating that you have not prepared anything. Your manager manages the situation and the meeting goes well anyway. However, you are unsure if the same thing could happen next time. What do you do now?', 
		'options' : [
			{
				'option' : 'I think of this as a lesson and realize that when I gain more experience, there will not be any more situations like this.', 
				'score' : 0, 
				'response' : 'You shouldn’t ignore this situation. Our value is open communication.'
			}, 
			{
				'option' : 'I ask my manager not to invite me to meetings with this client for now.', 
				'score' : -200, 
				'response' : 'Problems in the company should not be ignored, they should be solved.'
			}, 
			{
				'option' : 'I openly tell my manager that I felt very uncomfortable and suggest that next time we should discuss such meetings beforehand.', 
				'score' : +500, 
				'response' : 'Open and constructive communication is the best solution.'
			}, 
			{
				'option' : 'I sign up my manager to a comedy club without him knowing.', 
				'score' : -500, 
				'response' : 'Will revenge change anything?'
			}, 
			{
				'option' : 'After this meeting, I suggest to make the presentation for the next meeting myself.', 
				'score' : +300, 
				'response' : 'That’s a good idea but your manager should know about the issue so the same things doesn’t happen again.'
			}, 
			{
				'option' : 'After the meeting, I go back to my office and tell my colleagues about what happened. Everybody laughs.', 
				'score' : -400, 
				'response' : 'Gossip does not solve problems, it only creates new ones.'
			}
		], 
		'topic' : 'Objectivity and Integrity'
	}, 
	{
		'question' : 'You are an employee. You work in an open space with other colleagues. You’ve had a few conflicts because Kornelijus and Vitalija talk on the phone loudly and bother others. You’ve had an agreement that if someone needs to make a phone call or have a conference call, they leave the open work space. Less than a month has passed since the agreement, the situation is repeating again. Kornelijus is always making phone calls and talking loudly and Vitalija is on conference calls all day, even though there are free meeting rooms available. What do you do?', 
		'options' : [
			{
				'option' : 'Next time I see my manager, I tell him about the noisy work environment and ask him for advice.', 
				'score' : +250, 
				'response' : 'It’s good that you’re not giving up but you should talk to you manager about your colleagues’ behavior and not about the work environment.'
			}, 
			{
				'option' : 'I buy noise-cancelling headphones and continue working.', 
				'score' : +150, 
				'response' : 'Sometimes it’s best to start with yourself.'
			}, 
			{
				'option' : 'I meet some friends on the weekend and discuss this with them – maybe they’ll have some ideas.', 
				'score' : -200, 
				'response' : 'It’s not the best idea to share such problems with people who are uninvolved in the situation.'
			}, 
			{
				'option' : 'I invite both colleagues to lunch and suggest a game “Meeting in an open space = free lunch for your colleagues“.', 
				'score' : +500, 
				'response' : 'Given the situation, this is the best solution.'
			}, 
			{
				'option' : 'I also start speaking with clients in the open space, hoping that my other colleagues will take the hint.', 
				'score' : -500, 
				'response' : 'This might only make things worse.'
			}, 
			{
				'option' : 'I make a ball of paper and throw it at a noisy colleague.', 
				'score' : -100, 
				'response' : 'You don’t know how your colleagues will react to this.'
			}
		], 
		'topic' : 'Partnership and Quality'
	}, 
	{
		'question' : 'You are an employee working on one project for a long time now. The old project manager used to motivate employees and manage risks well, the strategy, processes and responsibilities were clear.    Your team used to get good reviews from clients, it was a pleasure to work in that team. After the project manager changed, the team spirit was gone. There are not enough employees in the team, everybody has to do several assignments at once, it is difficult to concentrate and productivity is falling. Some people are looking for a new job. What do you do?', 
		'options' : [
			{
				'option' : 'I send an e-mail to the project manager with my understanding of the situation, the possible risks and solutions.', 
				'score' : +500, 
				'response' : 'Great, you‘re not afraid to state your opinion and share your experience. It doesn‘t have to be an e-mail but it‘s important that you give constructive feedback.    '
			}, 
			{
				'option' : 'I invite the project manager to eat a kebab after work and let him know that I am there to help if he faces any difficulties. ', 
				'score' : +400, 
				'response' : ' Great idea! But letting someone know you will help is not the same as constructive feedback.'
			}, 
			{
				'option' : 'I talk to the department manager about this project manager‘s abilities. ', 
				'score' : +50, 
				'response' : 'It‘s good that you‘re taking initiative to solve problems but it would be better to talk to the project manager.'
			}, 
			{
				'option' : 'I inform the project manager that I want to work on a different project.', 
				'score' : -100, 
				'response' : 'It‘s fine to make a decision but you‘re thinking only about yourself. '
			}, 
			{
				'option' : 'During coffee break, I talk to my colleagues from another project about the problems I‘m facing and ask what they think about it. ', 
				'score' : -300, 
				'response' : 'This is not constructive communication, it is gossip. '
			}, 
			{
				'option' : 'I don’t go into project management specifics, that’s not my responsibility. I do the work that I think needs to be done to finish the project.', 
				'score' : -500, 
				'response' : 'Don‘t be indifferent, give your ideas about how to successfully implement the project to the project manager.'
			}

		], 
		'topic' : 'Intrapreneurship & sharing'
	}, 
	{
		'question' : 'A project team at work didn’t have enough specialists so you were assigned to it. You never worked with that team before. This team has an old way of doing things and you think it is ineffective. There are no software testers so the client often receives software that isn’t fully completed. You try to suggest using best practices but you see that the other team members are passive, they say “Why should we add more work if it is fine just as we are working now?”. What do you do?', 
		'options' : [
			{
				'option' : 'You are a new team member, so you try to adjust.', 
				'score' : -100, 
				'response' : 'You should be proactive, not passive.'
			}, 
			{
				'option' : 'I organize team meetings about best practices. ', 
				'score' : +300, 
				'response' : 'Maybe you will engage the whole team but they might resist the changes.'
			}, 
			{
				'option' : 'I use my own methods and hope that with time they will stick. ', 
				'score' : +100, 
				'response' : 'It’s hard to achieve things alone.'
			}, 
			{
				'option' : 'I share my ideas next time I speak to the manager. ', 
				'score' : +500, 
				'response' : 'If you get your manager’s support, it is more likely that the team will become less resistant to change.'
			}, 
			{
				'option' : 'I print out some pictures with motivational quotes about change.', 
				'score' : -200, 
				'response' : 'You should save paper. The trees will thank you.'
			}, 
			{
				'option' : 'I cannot deal with such work order so I send my CV to another company.', 
				'score' : -500, 
				'response' : 'Will running from the problem solve it? '
			}
		], 
		'topic' : 'Partnership and Quality'
	}, 
	{
		'question' : 'You are a new employee. You invite your manager for a short discussion about how you are doing during your trial period. You write down some questions and read them to your manager – what goals should I achieve during my trial period? How will my achievements be measured? Am I going towards the right direction? You want to set goals for yourself during this trial period. You get a short answer that “If there is anything wrong, we will let you know. Everything is okay now, we will evaluate you based on the teams’ feedback”. After this short answer, your manager starts talking about yesterday’s basketball game where his favorite team won. What do you do?', 
		'options' : [
			{
				'option' : 'I browse CynerGI and try to find out what kind of goals would a person in my position have.', 
				'score' : +100, 
				'response' : 'You can find a lot of useful information in CynerGI, but you should coordinate your goals with you manager.'
			}, 
			{
				'option' : 'I write my own goals and send them to my manager for approval. ', 
				'score' : +400, 
				'response' : 'It’s great that you are showing initiative but a mentor should be the person to help you in this situation. '
			}, 
			{
				'option' : 'Maybe my manager is in a bad mood today – I’ll try again tomorrow.', 
				'score' : 0, 
				'response' : 'You will get an answer if you are not afraid to ask.'
			}, 
			{
				'option' : 'I ask my mentor to help me set goals. ', 
				'score' : +500, 
				'response' : 'Great choice, your mentor can help you here, but you will still have to deal with the relationship between you and your manager.'
			}, 
			{
				'option' : 'If the manager says so, then it must be true. I try to form relationships with my colleagues because my performance will be based on their feedback.', 
				'score' : -200, 
				'response' : 'It’s good to form relationships with your colleagues but you have to set goals for yourself.'
			}, 
			{
				'option' : 'I realize that I will not get along with my boss as I am a fan of another basketball team. ', 
				'score' : -500, 
				'response' : 'Such prejudice won’t help you solve problems.'
			}
		], 
		'topic' : 'Intrapreneurship and Sharing'
	}
];
/*CASE NO. 9
CASE NO. 10 
You are a manager of a department. After long negotiations, you signed a deal with a client for system support. It’s an old, problematic client and your team knows it. However, this deal is very profitable. You‘re starting to form a project team from the people who are currently free from any assignments. You‘re happy that they will finally have some tasks. Other colleagues sarcastically say “Condolences for those on this project“.    Old team members don‘t want to be a part of the team, newer employees are afraid to commit. What do you do?
	•	 You don‘t have a discussion, you just form a team that will work on that project.
-200 There is a risk that the employees will also make their own decisions without further discussion.
	•	I honestly tell my employees that this project will have challenges.
+500 Great! You are lowering the risks by talking about the actual situation of this project.
	•	I remind my employees that they are paid for a reason and ask them to work on this project for at least half a year.
-100 The employees won‘t appreciate such a reminder and a short-term solution won‘t ensure the continuation of this project.
	•	I assemble the team out of new employees that don‘t know anything about this client. 
-500 Will this choice bring you profit? You don‘t care about the satisfaction of the client.
	•	I invite the old employees to individual conversations to tell them not to demotivate the team.
+400 Good choice but it would also be good to talk to the whole team, not with the old employees only.
	•	I promise that good results will be generously rewarded. 
0 This is not the way to involve employees in a project.
Financial Strength

                                                                                                                                                CASE NO. 11
You are a programmer and you have been working in the company for a long time now. Because of the heavy workload, Simon, a longtime and unmotivated employee, has been added to your team. He usually doesn’t have a lot of tasks due to lack of competences. You have to redo his assignments because the quality of the work is poor. The manager is aware of the employee's lack of competence, but takes no action. What are your actions?
	•	I share my workload with my colleagues working on the same project so that I would have time to correct Simon’s mistakes.
-50 It‘s a temporary solution, the whole team could become unmotivated in the long run. You should talk about the real problem.
	•	I approach HR and explain this problem.
+200 It‘s good that you‘re still looking for help even when you manager is indifferent.
	•	I accept this situation and do all the work myself because I do not have time to explain the problem to the manager. 
-500 Bad idea. You can‘t do everything yourself and there could be several “Simons“ in the next project.
	•	I initiate a conversation with Simon about the current situation in the team and his contribution to the project. 
+500 It‘s very good that you are taking initiative.
	•	I request to add another person to the team or be reassigned to another project myself because we will not be able to finish the tasks with the assigned colleague. 
-250 It would be better if you spoke to Simon about how to improve his work quality and not ran away from problems.
	•	I give updates to the project manager everyday about our finished/unfinished tasks.
+50 It‘s good that you are informing your manager about the situation, but they might not understand the real issue. Communicate clearly.
Objectivity and Integrity                                                                                                             
CASE NO. 13
You are a department manager and today Danute, one of your best employees, comes to you and says that she wishes to be transferred to another project because she cannot stand working with Aloyzas, who is also a great specialist. Danute says she cannot get along with him. This project needs them both. What do you do first? 
	•	I organize a meeting with Danute and Aloyzas to find the reasons of the conflict and to try to find a compromise.
+350 We value open discussion. We should also hear Aloyzas out.
	•	I organize a training on conflict resolution for the project team.
+50 It could be a good long-term solution to prevent similar situations in the future, however you should focus on direct communication with these two employees now.
	•	I ask Aloyzas to come and try to find out what happened.
+500 That‘s great, first of all, we are trying to hear out both sides of the conflict.
	•	I listen to Danute‘s story and agree that it is a problem, but as soon as she leaves, I get back to my work. 
-400 As department manager, you should respect your colleagues and not ignore their needs.
	•	As it is their personal problem, I buy a coupon for a dinner for the two best employees of the project.
-500 Are you sure that these colleagues who cannot get along will really take your offer to meet after work?
	•	I leave Danute and Aloyzas on the same project and ask the project manager to give tasks in such a way that would ensure minimal communication between them. 
-100 The problem won‘t go away, it’s a ticking bomb.
Partnership and Quality
CASE NO. 16 
You are a manager of a department. Nojus, an employee from your department, is and expert working with technology that not a lot of people know how to use. You‘d have to train new specialists in your own company. Young employees quit working in that team quickly because Nojus acts arrogantly and only gives meaningless jobs to the other team members and doesn‘t help them improve. Nojus only does assignments that he finds interesting and anything else goes to other employees. He doesn‘t care about other peoples‘ opinion, you have tried talking to him several times. What do you do?
	•	 I decide to fire Nojus and start training new employees. 
+400 People who aren‘t respectful cannot work in our company but maybe you should give Nojus a last chance.
	•	I invite Nojus to speak in an informal environment as a friend because everybody has feelings.
+500 Great! You should try to find out the reasons for this behavior. Openness is our value.
	•	I find new interns every year hoping that someone will finally get along with Nojus.
-300 And how long will that take?
	•	I ask my manager for help because I don‘t know what to do anymore. 
+100 It‘s okay to ask for advice but you are also a manager and you need to make decisions.
	•	Because we need this specialist, I try to fulfill all of Nojus‘ needs.
-500  Nojus is not the team and you need a whole team.
	•	I talk to the employees working with Nojus and suggest that they should find common ground with Nojus themselves. 
-400 This is an old problem that needs to be solved.
Respect
CASE NO. 17
You are a programmer. Your project manager tells you about an assignment that needs to be done immediately. This is not the first time this has happened. In the assignment registry you notice that this assignment has been created and given to your manager a month ago. Often times you have to stay overtime to finish these immediate assignments. What do you do?
	•	I talk to my department‘s manager and ask them to solve this issue. 
+250 Good choice, but maybe you should talk to your project manager first.
	•	I do as much as I can during my 8 work hours. 
-400 Such an outlook doesn’t add value to the team. Maybe you should start looking for solutions for the recurring time management problem? 
	•	I drop my current work and start doing the assignment my PM gave me, because the client really needs this. 
-500 We should solve the time management problem so that we avoid similar situations in the future.
	•	I talk to my PM, I explain the issue and try to negotiate a bonus.    
+500 Great! Our value “Partnership and Quality“ promotes open communication.
	•	I ask other colleagues who have worked with this PM, how they prioritize their work. 
-100 Information from you colleagues will only help you adjust to the situation but won‘t solve the time management issue.
	•	I suggest organizing a training on time management.
+50 Trainings are good but first you need to identify a problem that the training will solve.

 Partnership and Quality*/
function userDisconected(id)
{
	var r = [null, null];
	var auxUsers = [];
	var auxUsersIds = [];
	var auxUsersPoints = [];
	var auxUsersTurns = [];
	var auxUsersUsed = [];
	for (var i = 0; i < rooms.length; i++)
	{
		var aux = rooms[i]['usersIds'].indexOf(id);
		if (aux != -1)
		{
			r = [rooms[i]['roomCode'], rooms[i]['users'][aux]];
			for (var j = 0; j < rooms[i]['users'].length; j++)
			{
				if (j != aux)
				{
					auxUsers.push(rooms[i]['users'][j]);
					auxUsersIds.push(rooms[i]['usersIds'][j]);
					auxUsersPoints.push(rooms[i]['usersPoints'][j]);
				}
			}
			for (var j = 0; j < rooms[i]['usersTurns'].length; j++)
			{
				if (j != aux)
				{
					auxUsersTurns.push(rooms[i]['usersTurns'][j]);
				}
			}
			for (var j = 0; j < rooms[i]['usersUsed'].length; j++)
			{
				if (j != aux)
				{
					auxUsersUsed.push(rooms[i]['usersUsed'][j]);
				}
			}
			rooms[i]['users'] = [...auxUsers];
			rooms[i]['usersIds'] = [...auxUsersIds];
			rooms[i]['usersPoints'] = [...auxUsersPoints];
			rooms[i]['usersTurns'] = [...auxUsersTurns];
			rooms[i]['usersUsed'] = [...auxUsersUsed];
		}
	}
	return r;
}
function extractUserName(message)
{
	var tmp = '';
	for (var i = 0; i < message['user'].split('_').length - 1; i++)
	{
		tmp += message['user'].split('_')[i];
	}
	message['user'] = tmp;
}
function usersInRoom(rc, used = [])
{
	var r = [];
	for (var i = 0; i < rooms.length; i++)
	{
		if (rc == rooms[i]['roomCode'])
		{
			for (var j = 0; j < rooms[i]['users'].length; j++)
			{
				if (used.indexOf(rooms[i]['users'][j]) == -1)
				{
					r.push(rooms[i]['users'][j]);
				}
			}
		}
	}
	return r;
}
/*function searchUserInTeam(userName, userSurname, teamName, index)
{
	for (var i = 0; i < rooms[index]['teams'].length; i++)
	{
      if (rooms[index]['teams'][i]['teamName'] == teamName)
      {
      	for (var j = 0; j < rooms[index]['teams'][i]['users'].length; j++)
      	{
      		//return i;
      	}
      }
    }
	return -1;
}*/
function searchTeam(teamName, index)
{
	for (var i = 0; i < rooms[index]['teams'].length; i++)
	{
      if (rooms[index]['teams'][i]['teamName'] == teamName)
      {
      	return i;
      }
    }
	return -1;
}
function searchUserInRoom(userName, userSurname, index)
{
	for (var i = 0; i < rooms[index]['teams'].length; i++) {
      if ((rooms[index]['users'][i]['userName'] == userName) && 
      	(rooms[index]['users'][i]['userSurname'] == userSurname))
      {
      	return i;
      }
    }
	return -1;
}
function searchRoomCode(rc, newUser = true, type = null)
{
	for (var i = 0; i < rooms.length; i++)
	{
		//if ((rc == '') && (!rooms[i]['private']))
		if ((rc == '') && (!rooms[i]['private']) && ((!rooms[i]['full']) || (!newUser)))
		{//Cuando se busca un room aleatorio.
			return i;
		}
		else
		{
			//if (rc == rooms[i]['roomCode'])
			//if ((rc == rooms[i]['roomCode']) && (!rooms[i]['full']))
			if (rc == rooms[i]['roomCode'])
			{
				if (newUser)
				{
					if (!rooms[i]['full'])
					{
						return i;
					}
				}
				else
				{
					if (type == 'rematch')
					{
						rooms[i]['full'] = false;
					}
					return i;
				}
			}
		}
	}
	return -1;
}
function generateRoomCode()
{
	//175dPAYrwNpF
	var characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	var rc = '';
	for (var i = 0; i < 12; i++)
	{
		rc += characters[Math.floor(Math.random() * Math.floor(characters.length))];
	}
	if (searchRoomCode(rc) != -1)
	{
		generateRoomCode();
	}
	else
	{
		return rc;
	}
}
module.exports.userDisconected = userDisconected;
module.exports.extractUserName = extractUserName;
module.exports.usersInRoom = usersInRoom;
module.exports.searchRoomCode = searchRoomCode;
module.exports.searchTeam = searchTeam;
//module.exports.searchUserInTeam = searchUserInTeam;
module.exports.searchUserInRoom = searchUserInRoom;
module.exports.generateRoomCode = generateRoomCode;
module.exports.questions = questions;
module.exports.rooms = rooms;