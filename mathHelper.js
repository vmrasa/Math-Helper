"use strict";

var groupsize = null;
var name = null;

/*
Sets the name of the player
//TODO: what to do if user enters numbers, null, other invalids
*/
function setName(playerName) {
    name = playerName;
    groupsize = Math.floor((Math.random() * 10) + 1);
    
}

/*
TODO: Will be used to check the player's answer
*/
function checkAnswer(userAnswer) {
}

/*
Object containing all information related to a problem
- probText - the story text for the problem. Automatically replaces variable declarations
    <NAME> = name
    <GROUPSIZE = groupsize
    <N1>,<N2> = the operands for the equation
- op - the type of operator for the problem. Only standard mathematical operators allowed.
TODO: check for valid operators
*/
function Problem(probText, op) {
    
    var equation, num1, num2, solution;
    
    //generate random numbers for equation
    num1 = Math.floor((Math.random() * 10) + 1);
    num2 = Math.floor((Math.random() * 10) + 1);
    
    //Create the mathematical equation (for hint text)
    equation = num1 + " " + op + " " + num2;
    
    //store the solution for comparison
    solution = eval(equation);

    /*
    Insert the appropriate variables into the paragraph
    */
    function formatProblemText(storyText, num1, num2) {
        storyText.replace("<NAME>", name);
        storyText.replace("<GROUPSIZE>", groupsize);
        storyText.replace("<N1>", num1);
        storyText.replace("<N2>", num2);
    }
    
    probText = formatProblemText(probText, num1, num2);
}




/*
Constructor for the level object.
TODO: Declare Problem array (size 5)
*/
function level(levelType) {
    
    //TODO: Create problem array, then iterate through them
    var prob1 = new Problem(null);
}

//Spits out how many questions were scored correctly in each section
//takes in an array of all the sections
function summaryContent() {
    
}