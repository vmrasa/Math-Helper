"use strict";
$(document).ready( function(){

var GROUPSIZE = Math.floor((Math.random() * 10) + 1);
var NAME = null;
var problemsPerLevel = 5;

/*
Sets the <NAME> of the player
//TODO: fix that this doesn't actually track the name from page to page
*/
function setNAME(playerNAME) {
    NAME= playerNAME;
    GROUPSIZE = Math.floor((Math.random() * 10) + 1); 
}


/*
Object containing all information related to a problem
- probText - the story text for the problem. Automatically replaces variable declarations
    <NAME> = <NAME>
    <<GROUPSIZE> = <GROUPSIZE>
    <N1>,<N2> = the operands for the equation
- op - the type of operator for the problem. Only standard mathematical operators allowed.
*/
function Problem(probText, op) {
	this.storyText = probText;
    
    //generate random numbers for equation
    this.num1 = Math.floor((Math.random() * 10) + 1);
    this.num2 = Math.floor((Math.random() * 10) + 1);
    
    //Create the mathematical equation (for hint text)
    this.equation = this.num1 + " " + op + " " + this.num2;
    
    //store the solution for comparison
    this.solution = eval(this.equation);

    /*
    Insert the appropriate variables into the paragraph
    */
    this.formatProblemText = function (num1, num2) {
		this.storyText = this.storyText.replace("<NAME>", NAME);
        this.storyText = this.storyText.replace("<GROUPSIZE>", GROUPSIZE);
        this.storyText = this.storyText.replace("<N1>", num1);
        this.storyText = this.storyText.replace("<N2>", num2);
    }
	
	this.display = function() {
		this.formatProblemText(this.num1, this.num2);
	    $("#probText").text(this.storyText);
		$("#answer").val("");
		
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
								" You have 2 groups of friends looking to join" +
								" us; 1 of size <N1> and another of size <N2>. How " +
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
								" of them. It looks like we have picked RESULT" +
								" blueberries. Your group is <GROUPSIZE> people, and you" +
								" have RESULT berries. How many berries does each person get?","/"),
					new Problem("I love blueberries! Too bad you had to share... Uh-oh," +
								" what is that up ahead? It looks like a witch! She says" +
								" that your group cannot continue until you pick a total" +
								" of RESULT mushrooms for her cauldron stew. Well, you have" +
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

var hardProblems = [new Problem("I wonder what that sign meant by “CONSTRUCTION”... Oh, look at this," +
								" a roadblock. Uh oh, it says that we cannot pass until we correctly" +
								" answer this question: If <N1> + z = RESULT, what is z?","+"),
					new Problem("That sure was a strange type of question, <NAME>.  Have you ever seen" +
								" one of those before? I wonder if we’ll be seeing more of those. I " +
								"think I see a cave up ahead! Let’s approach it. Oh no, a troll lives " +
								"here, and he says that we must pay the troll toll. He says you need to" +
								" put <N1> coins into his pouch. You better do it! Now he’s saying that" +
								" you may only pass if you empty the pouch and tell him how many coins" +
								" were in there before you paid. After emptying the bag, there seem to " +
								"be a total of RESULT coins. How many were there before you threw any " +
								"inside?","+"),
					new Problem("I’m glad we’re out of there. That troll was hideous! It was a good " +
								"idea to steal all those coins after we solved that problem, now we have" +
								" a good amount of money to spend. Looks like our luck isn’t lasting that" +
								" long, though. Here’s another roadblock! If <N1> * y = RESULT, what is y?","*"),
					new Problem("Oh, my… We’re here… Pirate Cove! I’d recognize that giant stone door from" +
								" anywhere. Open it up! What?... It won’t budge?! Let me see. It seems as " +
								"though we have to solve this riddle to proceed: Yarrr! There be some " +
								"crocodiles here, each with <N1> teeth. There are RESULT total teeth from " +
								"all the crocodiles. How many crocodiles be there in this here cove?","*"),
					new Problem("The door’s opening! Amazing! Oh, look! It’s Captain Peg-Leg’s ship! Let’s" +
								" board it. Do you see it? Because I do. It’s the Lost Treasure Chest of " +
								"Captain Peg-Leg! Open it up! What? It’s locked just like the door?! Ugh… " +
								"Alrighty, well let’s solve this final riddle: <N1> * y * z = RESULT; what are" +
								" possible numbers for y and z? This one seems tough, <NAME>, but I believe in you!","*")]



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

// Check player's answers
$('#submitBtn').click( function() {
	if ($('#answer').val() == level.problemArr[level.probNum].solution) {
		if(level.probNum == 2 && level.difficulty == "easy") {
			GROUPSIZE = level.problemArr[level.probNum].solution;
			alert(GROUPSIZE);
		}
		level.probNum++;
		if (level.probNum < problemsPerLevel)
			level.problemArr[level.probNum].display();
		else
			alert("Not implemented");
	} else {
		alert("Here's the equation, you can do it!\n" + level.problemArr[level.probNum].equation);
	}
});

//Spits out how many questions were scored correctly in each section
//takes in an array of all the sections
function summaryContent() {
    
}
});