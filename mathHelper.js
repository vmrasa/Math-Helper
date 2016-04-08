"use strict";

$(document).ready( function(){

var problemsPerLevel = 5;
var usedOnce = 11;
var numWrong = 0;
var numQuest = 0;

$('#leftBtn').hide();
$('#rightBtn').hide();

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

/*
Object containing all information related to a problem
- probText - the story text for the problem. Automatically replaces variable declarations
    <NAME> = <NAME>
    <GROUPSIZE> = <GROUPSIZE>
    <N1>,<N2> = the operands for the equation
- op - the type of operator for the problem. Only standard mathematical operators allowed.
*/
function Problem(probText, op) {
	this.storyText = probText;
    
    //generate random numbers for equation
    this.num1 = Math.floor((Math.random() * 10) + 1);
    this.num2 = Math.floor((Math.random() * 10) + 1);
    
	if (op == "+" || op == "-" || op == "*") {
		//Create the mathematical equation (for hint text)
		this.equation = this.num1 + " " + op + " " + this.num2;
		
		//store the solution for comparison
		this.solution = eval(this.equation);
	}
	else if (op == "/") {
		this.numerator = this.num1 * this.num2;
		this.solution = this.num2;
		this.equation = this.numerator + " / " + this.num1;
	}
	else if (op == "a+") {
		this.num2 = this.num2 + this.num1;
		this.equation = this.num2 + " - " + this.num1;
		this.solution = eval(this.equation);
	}
	else if (op == "a/") {
		this.numerator = this.num1 * this.num2 * 10;
		this.solution = this.num2 * 10;
		this.equation = this.numerator + " / " + this.num1;
	}
		
    /*
    Insert the appropriate variables into the paragraph
    */
    this.formatProblemText = function (num1, num2) {
		this.storyText = this.storyText.replace("<NAME>", getCookie("NAME"));
        this.storyText = this.storyText.replace("<GROUPSIZE>", getCookie("GROUPSIZE"));
        this.storyText = this.storyText.replace("<N1>", num1);
        this.storyText = this.storyText.replace("<N2>", num2);
		this.storyText = this.storyText.replace("<NUMERATOR>", this.numerator);
		this.storyText = this.storyText.replace("<RESULT>", this.solution);
    }
	
	this.display = function() {
		this.formatProblemText(this.num1, this.num2);
	    $("#probText").text(this.storyText);
		$("#answer").val("");
		$("#hint").text("");
		$('#rightBtn').hide();
		$('#leftBtn').hide();
		$('#answer').show();
		$('#submitBtn').show();
		
		return;
	}
}

var easyProblems = [new Problem("Greetings, <NAME>!\nI am your trusty compass, " +
								"and we are about to embark on a fantastic journey!" +
								" Together, we will find the lost treasure of " +
								"Captain Peg-Leg, the world's richest pirate in all" +
								" of history. Before we begin, we should stock up on" +
								" supplies. You currently have <N1> apples in your lunch" +
								" box; you should probably bring <N2> more. How many will" +
								" you then have total?", "+"),
					new Problem("Apples are great, but you need some food" +
								" other than fruit. Let's grab some sandwiches" +
								" and beef jerky. You already have <N1> pieces of" +
								" beef jerky, but you should grab <N2> more pieces. How many total will that give you for your journey?","+"),
					new Problem("Let's grab the map and get ready to leave. Of" +
								" course, you can't go on this journey alone." +
								" You have two groups of friends looking to join" +
								" us; one of size <N1> and another of size <N2>. How " +
								"many total friends is that, <NAME>?","+"),
					new Problem("Now that you have supplies and and a group of" +
								" <GROUPSIZE> people, let's head out! The first " +
								"landmark on your map seems to be some sort of " +
								"rock formation. Oh, look! I think that's it up " +
								"ahead! I see <N1> mountaintops ahead. Oh! There's " +
								"<N2> more! How many is that all together?","+"),
					new Problem("Those mountains sure were beautiful! The next stop" +
								" looks like a forest. Oh, look at that, we're here!" +
								" Let's walk through. Mmmmm... I love the smell of" +
								" forests.  I saw <N1> owls in the trees.  How" +
								" many did you see? <N2>?! Wow, how many owls " +
								"is that total?","+")]

var medProblems = [new Problem("I've heard wonderful things about Great Valley; I'm" +
								" so glad we're about to see it first-hand! Hey, " +
								"there's an orange orchard! Let's pick some oranges." +
								" You have <GROUPSIZE> people in your group, and" +
								" everyone should pick <N1> oranges. How many total " +
								"oranges is that?","*"),
					new Problem("Oranges are tasty! I'm so glad we found that orchard!" +
								" What is that up ahead? It looks like a berry bush." +
								" Oh, how wonderful! A blueberry bush! Let's pick all" +
								" of them. It looks like we have picked <NUMERATOR>" +
								" blueberries. Your group is <GROUPSIZE> people, and you" +
								" have <NUMERATOR> berries. How many berries does each person get?","/"),
					new Problem("I love blueberries! Too bad you had to share... Uh-oh," +
								" what is that up ahead? It looks like a witch! She says" +
								" that your group cannot continue until you pick a total" +
								" of <NUMERATOR> mushrooms for her cauldron stew. Well, you have" +
								" <GROUPSIZE> people in your group. So, <NAME>, how many " +
								"mushrooms does each person have to pick?","/"),
					new Problem("That witch sure was ugly! The map says that the next" +
								" landmark will be a large meadow. Oh, I think I see it." +
								" Something is strange, though; it seems as though this is a" +
								" meadow of potted flowers! A sign says that there are <N1> " +
								"flower pots in this meadow, each with <N2> flowers inside them." +
								" How many total flowers is that, <NAME>?","*"),
					new Problem("What a strange, but pretty place. You're going to have a tough" +
								" time explaining that one to your friends. I think I see " +
								"another forest up ahead. There seems to be another sign here. " +
								"It says that there are <N1> trees growing in this forest, and " +
								"they each have <N2> branches. How many total branches is that?","*")]

var hardProblems = [new Problem("I wonder what that sign meant by \"CONSTRUCTION\"... Oh, look at this," +
								" a roadblock. Uh oh, it says that we cannot pass until we correctly" +
								" answer this question: If <N1> + z = <N2>, what is z?","a+"),
					new Problem("That sure was a strange type of question, <NAME>.  Have you ever seen" +
								" one of those before? I wonder if we\'ll be seeing more of those. I " +
								"think I see a cave up ahead! Let\'s approach it. Oh no, a troll lives " +
								"here, and he says that we must pay the troll toll. He says you need to" +
								" put <N1> coins into his pouch. You better do it! Now he\'s saying that" +
								" you may only pass if you empty the pouch and tell him how many coins" +
								" were in there before you paid. After emptying the bag, there seem to " +
								"be a total of <N2> coins. How many were there before you threw any " +
								"inside?","a+"),
					new Problem("I\'m glad we\'re out of there. That troll was hideous! It was a good " +
								"idea to steal all those coins after we solved that problem, now we have" +
								" a good amount of money to spend. Looks like our luck isn\'t lasting that" +
								" long, though. Here\'s another roadblock! If <N1> * y = <NUMERATOR>, what is y?","/"),
					new Problem("Oh, my… We\'re here… Pirate Cove! I\'d recognize that giant stone door from" +
								" anywhere. Open it up! What?... It won\'t budge?! Let me see. It seems as " +
								"though we have to solve this riddle to proceed: Yarrr! There be some " +
								"crocodiles here, each with <N1> teeth. There are <NUMERATOR> total teeth from " +
								"all the crocodiles. How many crocodiles be there in this here cove?","/"),
					new Problem("The door\'s opening! Amazing! Oh, look! It\'s Captain Peg-Leg\'s ship! Let\'s" +
								" board it. Do you see it? Because I do. It\'s the Lost Treasure Chest of " +
								"Captain Peg-Leg! Open it up! What? It\'s locked just like the door?! Ugh... " +
								"Alrighty, well let\'s solve this final riddle: <N1> * z = <NUMERATOR>; what " +
								"is z? This one seems tough, <NAME>, but I believe in you!","a/")]

var easyToMedText = "It seems as though we've come to a fork in the road. A sign " +
						"reads:\n\"Left -> Pirate Cove\" and\n\"Right -> Great Valley\". " +
						"\nWhich way should we go?";
								
var medToHardText = "What a wonderful forest! That one may be prettier than the first one." +
					"It looks like there's another fork in the road. There's a sign here. " +
					"It reads: \n\"Left -> Pirate Cove\" and \n\"Right -> CONSTRUCTION\".\nWhich " +
					"path should we take?";

/*
Constructor for the level object.
*/
function Level(levelType) {
	this.difficulty = levelType;
	
	var problemArr;
	switch (levelType) {
		case "easy":
			problemArr = easyProblems;
			break;
		case "medium":
			problemArr = medProblems;
			break;
		case "hard":
			problemArr = hardProblems;
			break;
		default:
			alert("Error on level create");
			break;
	}
	
	this.problemArr = problemArr;
	this.probNum = 0;
	this.problemArr[0].display();
}

var level = new Level("easy");
var easyLevel = null;
var medLevel = null;
var hardLevel = null

// Check player's answers
$('#submitBtn').click(checkAnswer);
$('#answer').on('keydown', function (event) {
	if (event.which == 13 || event.keyCode == 13) {
		checkAnswer();
	}
	else {
		return true;
	}
});

function checkAnswer() {
	//alert("probNum: " + level.probNum + "\ndifficulty: " + level.difficulty + "\nResult: " + getCookie("RESULT"));
	if ($('#answer').val() == level.problemArr[level.probNum].solution) {
		if(level.probNum == 2 && level.difficulty == "easy") {
			usedOnce = getCookie("GROUPSIZE");
			//alert("usedOnce: " + usedOnce);
			if(level.problemArr[level.probNum].solution < getCookie("GROUPSIZE")){
				setCookie("RESULT","Some more friends join you. ",1);
			}else if(level.problemArr[level.probNum].solution > getCookie("GROUPSIZE")){
				setCookie("RESULT","Some friends left your party and went to the beach. ",1);
			}
				
			setCookie("GROUPSIZE",level.problemArr[level.probNum].solution,1);
			
		}
		if(level.probNum == 4 && level.difficulty == "easy")
		{
			//setCookie("RESULT",level.problemArr[level.probNum].solution,1);
			setCookie("GROUPSIZE",usedOnce,1)
			
		}
		level.probNum++;
		if (level.probNum < problemsPerLevel) {
			level.problemArr[level.probNum].display();
		} else {
			if (level.difficulty == "easy" || level.difficulty == "medium") {
				$('#rightBtn').show();
				$('#leftBtn').show();
				$('#answer').hide();
				$('#submitBtn').hide();
				$("#hint").text("");
				
				var choiceText;
				if (level.difficulty == "easy")
					choiceText = easyToMedText;
				else
					choiceText = medToHardText;
				
				$('#probText').text(choiceText);
			} else {
                window.location.assign("summary.html");
			}
		}
	}
	else {
		$("#hint").text(level.problemArr[level.probNum].equation);
		$("#answer").val("");
		numWrong++;
	}
}

$('#leftBtn').click(function() {
	if (level.difficulty == "easy") {
		numQuest = 5;
	} else if (level.difficulty == "medium") {
		numQuest = 10;
	} else if (level.difficulty == "hard") {
		numQuest = 15;
	}
	summaryContent();
});

$('#rightBtn').click(function() {
	if (level.difficulty == "easy") {
		easyLevel = level;
		level = new Level("medium");
	} else if (level.difficulty == "medium") {
		medLevel = level;
		level = new Level("hard");
	} else if (level.difficulty == "hard") {
		numQuest = 15;
		summaryContent();
	}
});

//Spits out how many questions were scored correctly in each section
//takes in an array of all the sections
function summaryContent() {
	setCookie("NUMWRONG", numWrong,1);
	setCookie("NUMQUEST", numQuest, 1);
	window.location.assign("summary.html");
}

//TODO: make the display pretty
$('#summaryText').text("Wrong Answers submitted: " + getCookie("NUMWRONG") + "\n" + "Questions completed:" + getCookie("NUMQUEST"));
    
$('#nameBtn').click(setName);
$('#nameInput').on('keydown', function(event) {
	if (event.which == 13 || event.keyCode == 13) {
		setName();
	}
	else {
		return true;
	}
});

function setName() {
    var name = document.getElementById("nameInput").value;
    var groupsize = 10;
    var result = "Its a beautiful day! ";
    setCookie("NAME",name,1);
    setCookie("GROUPSIZE",groupsize,1);
    setCookie("RESULT", result,1);
    window.location.assign("game.html");
}
    
});
