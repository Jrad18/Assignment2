var linePoints = [];
var canvasState = [];
var canvas = document.getElementsByTagName("canvas")[0];
var context = canvas.getContext('2d');

var undoButton = document.querySelector('[data-action=undo]');

//set default tool selection
var toolMode = 'draw';
var toolSize = 5;

//set default value of colour stroke
var colourSelected = '#b7802d';
var shadowSelected = 1;
var colourCategorySelected = 'Flat';

var feedbackColourCate = document.querySelector('#selected-colour-category');
var feedbackColour = document.querySelector('#selected-colour');
var feedbackTool = document.querySelector('#selected-tool');
var feedbackSize = document.querySelector('#selected-size');

let t = setTimeout(clearCanvas, 300000);

//populate default values into feedback
feedbackColour.style.backgroundColor = colourSelected;
feedbackColourCate.innerHTML = colourCategorySelected;
feedbackTool.innerHTML = toolMode + ": ";
feedbackSize.innerHTML = toolSize;

context.strokeStyle = colourSelected;
context.lineWidth = toolSize;
context.lineJoin = 'round';
context.lineCap = 'round';

//Event Listeners
canvas.addEventListener('touchstart', draw, {passive: false});
canvas.addEventListener('touchend', stop, {passive: false});

document.querySelector('#tools').addEventListener('click', selectTool);
document.querySelector('#manage').addEventListener('click', selectTool);
document.querySelector('#colours').addEventListener('click', selectColour);



function draw( e ) {
	e.preventDefault();
	
	var mouseX = e.changedTouches[0].pageX - canvas.offsetLeft;
	var mouseY = e.changedTouches[0].pageY - canvas.offsetTop;
	var mouseDrag = e.type === 'touchmove';  // determine if the point being added is the start or continuation of a line
	
	if ( e.type === 'touchstart' ) { saveState(); }
	
	canvas.addEventListener( 'touchmove', draw , {passive: false});
	window.addEventListener( 'touchmove', draw , {passive: false});
		

	linePoints.push( { x: mouseX, y: mouseY, drag: mouseDrag, colour: colourSelected, shadow: shadowSelected, width: toolSize } );

	updateCanvas(); // request canvas to update
	clearTimeout(t);
	

}

function stop( e ) {
//    console.log(e);
    canvas.style.touchAction = 'auto';
	

    canvas.removeEventListener( 'touchmove', draw );
    window.removeEventListener( 'touchmove', draw );
	t = setTimeout(clearCanvas, 300000);
}

function updateCanvas() {
    context.clearRect( 0, 0, canvas.width, canvas.height );
    context.putImageData( canvasState[0], 0, 0 );
    renderLine();
}

function renderLine() {
    for ( var i = 0, length = linePoints.length; i < length; i++ ) {
        if ( !linePoints[i].drag ) {
            //context.stroke();
            context.beginPath();
            context.lineWidth = linePoints[i].width;
            context.strokeStyle = linePoints[i].colour;
			context.globalAlpha = linePoints[i].shadow;
            context.moveTo( linePoints[i].x, linePoints[i].y );
            context.lineTo( linePoints[i].x + 0.5, linePoints[i].y + 0.5 );
        } else {
            context.lineTo( linePoints[i].x, linePoints[i].y );
        }
    }
    if ( toolMode === 'erase' ) {
        context.globalCompositeOperation = 'destination-out';
    } 
    else {
        context.globalCompositeOperation = 'source-over';
    }
    context.stroke();
}

function saveState() {
    canvasState = context.getImageData( 0, 0, canvas.width, canvas.height );
    linePoints = [];
	
}

//select tool, manage options and colour
function selectTool(e){
    if (e.target === e.currentTarget) { return; }
    toolMode = e.target.dataset.mode || toolMode;
    toolSize = e.target.dataset.size || toolSize;
	
	console.log(toolSize);
    
    if(e.target.dataset.mode) { highlightTool(e.target); }
    
    feedbackTool.innerHTML = toolMode + ": ";
    feedbackSize.innerHTML = toolSize;
    
    if (e.target === undoButton) { undoState(); }
}

function selectColour(e) {   
    if (e.target === e.currentTarget) { return; }
    
    // select single colour
    if (e.target.className === 'colour') {
        colourSelected = e.target.dataset.color || colourSelected;
        
        highlightColour(e.target);
        feedbackColour.style.backgroundColor = colourSelected;
		//select shading
		if (e.target.id === 'shadow') {
			shadowSelected = e.target.dataset.shadow || shadowSelected;
			
			highlightshadow(e.target);
			feedbackColour.style.opacity = shadowSelected;
		}
    }
	
    
    // select colour type
    if (e.target.className === 'colour-choice-button') { 
        var tabs = document.querySelectorAll('.palette');
        
        colourCategorySelected = e.target.dataset.cate || colourCategorySelected;
        
        highlightColourChoice(e.target); //highlight the category selected
        selectPalette(tabs, colourCategorySelected);  //switch palette tab
        feedbackColourCate.innerHTML = colourCategorySelected;
    }
}

// switch palette
function selectPalette (tabs, targetButtonId) {
    tabs.forEach( function(elem){ elem.classList.add('non-active'); } ); 
    document.getElementById(targetButtonId).classList.remove('non-active');
}

// highlight tools that are selected
function highlightTool(button) {
    var buttons = button.parentNode.querySelectorAll('.option');
    buttons.forEach( function(elem){ elem.classList.remove('active'); } );
    button.classList.add('active');
}

function highlightColour(button) {
    var buttons = button.parentNode.querySelectorAll('.colour');
    buttons.forEach( function( element ){ element.classList.remove('active'); } );
    button.classList.add('active');
}

function highlightColour(button) {
    var buttons = button.parentNode.querySelectorAll('.colour#shadow');
    buttons.forEach( function( element ){ element.classList.remove('active'); } );
    button.classList.add('active');
}

function highlightColourChoice (button) {
    var buttons = button.parentNode.querySelectorAll('.colour-choice-button');
    buttons.forEach( function( element ){ element.classList.remove('active'); } );
    button.classList.add('active');
}

function clearCanvas (){
	canvasState = [];
    //saveState();
	updateCanvas();
	console.log('clear');
}

// canvas state
function saveState() {
    canvasState.unshift( context.getImageData( 0, 0, canvas.width, canvas.height ));
    if (canvasState.length > 25) { canvasState.length = 25; }
    linePoints = [];
    undoButton.classList.remove( 'disabled' );
}

function undoState() {
    context.putImageData(canvasState.shift(), 0, 0);
    if (!canvasState.length) { undoButton.classList.add( 'disabled' ); }
}