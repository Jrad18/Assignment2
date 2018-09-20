var linePoints = [];
var canvasState = [];
var canvas = document.getElementsByTagName("canvas")[0];
var context = canvas.getContext('2d');

//set default tool selection
var toolMode = 'draw';

//set default value of colour stroke
var colourCategorySelected = 'Flat';
var colourSelected = '#b7802d';

var feedbackColourCate = document.querySelector('#selected-colour-category');
var feedbackColour = document.querySelector('#selected-colour');
var feedbackTool = document.querySelector('#selected-tool');

//populate default values into feedback
feedbackColour.style.backgroundColor = colourSelected;
feedbackColourCate.innerHTML = colourCategorySelected;

context.strokeStyle = colourSelected;
context.lineWidth = 5;
context.lineJoin = 'round';
context.lineCap = 'round';

//Event Listeners
canvas.addEventListener('touchstart', draw, {passive: false});
canvas.addEventListener('touchend', stop, {passive: false});

document.querySelector('#tools').addEventListener('click', selectTool);
document.querySelector('#colours').addEventListener('click', selectColour);


function draw( e ) {
	e.preventDefault();
	
	var mouseX = e.changedTouches[0].pageX - canvas.offsetLeft;
	var mouseY = e.changedTouches[0].pageY - canvas.offsetTop;
	var mouseDrag = e.type === 'touchmove';  // determine if the point being added is the start or continuation of a line
	
	if ( e.type === 'touchstart' ) { saveState(); }
	
	canvas.addEventListener( 'touchmove', draw , {passive: false});
	window.addEventListener( 'touchmove', draw , {passive: false});
		

	linePoints.push( { x: mouseX, y: mouseY, drag: mouseDrag, colour: colourSelected } );

	updateCanvas(); // request canvas to update

}

function stop( e ) {
//    console.log(e);
    canvas.style.touchAction = 'auto';
	

    canvas.removeEventListener( 'touchmove', draw );
    window.removeEventListener( 'touchmove', draw );
}

function updateCanvas() {
    context.clearRect( 0, 0, canvas.width, canvas.height );
    context.putImageData( canvasState, 0, 0 );
    renderLine();
}

function renderLine() {
    for ( var i = 0, length = linePoints.length; i < length; i++ ) {
        if ( !linePoints[i].drag ) {
            //context.stroke();
            context.beginPath();
            context.strokeStyle = linePoints[i].colour;
            context.moveTo( linePoints[i].x, linePoints[i].y );
            context.lineTo( linePoints[i].x + 0.5, linePoints[i].y + 0.5 );
        } else {
            context.lineTo( linePoints[i].x, linePoints[i].y );
        }
    }
    if ( toolMode === 'erase' ) {
    } 
    else {
    }
    context.stroke();
}

function saveState() {
    canvasState = context.getImageData( 0, 0, canvas.width, canvas.height );
    linePoints = [];
	
}

//select tool, manage and colour
function selectTool(e){
    if (e.target === e.currentTarget) { return; }
//    toolMode = e.target.dataset.mode || toolMode;
}

function selectColour(e) {   
    if (e.target === e.currentTarget) { return; }
    if (e.target.className === 'colour') {
        colourSelected = e.target.dataset.color || colourSelected;
        
        highlightColour(e.target);
        feedbackColour.style.backgroundColor = colourSelected;
    }
    if (e.target.className === 'colour-choice-button') { 
        colourCategorySelected = e.target.dataset.cate || colourCategorySelected;
        
        highlightColourChoice(e.target); 
        feedbackColourCate.innerHTML = colourCategorySelected;
    }
}

function highlightColour( button ) {
    var buttons = button.parentNode.querySelectorAll('.colour');
    buttons.forEach( function( element ){ element.classList.remove('active'); } );
    button.classList.add('active');
}

function highlightColourChoice ( button ) {
    var buttons = button.parentNode.querySelectorAll('.colour-choice-button');
    buttons.forEach( function( element ){ element.classList.remove('active'); } );
    button.classList.add('active');
}

function clearCanvas (){
	canvasState = [];
	//linePoints = [];
	updateCanvas();
	console.log('clear');
}