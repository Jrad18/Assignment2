var linePoints = [];
var canvasState = [];
var canvas = document.querySelector('#canvas');
var context = canvas.getContext('2d');

var undoButton = document.querySelector('[data-action=undo]');

//set default tool selection
var toolMode = 'draw';
var toolSize = 5;

//set default value of colour stroke
var colourSelected = '#b7802d';
//<<<<<<< HEAD
//=======
var shadowSelected = 1;
//>>>>>>> 277b8dc54b167c3222e0f95733fb86647a040e03
var colourCategorySelected = 'Flat';

var feedbackColourCate = document.querySelector('#selected-colour-category');
var feedbackColour = document.querySelector('#selected-colour');
var feedbackTool = document.querySelector('#selected-tool');
var feedbackSize = document.querySelector('#selected-size');
//<<<<<<< HEAD
//=======

let t = setTimeout(clearCanvas, 300000);
//>>>>>>> 277b8dc54b167c3222e0f95733fb86647a040e03

//populate default values into feedback
feedbackColour.style.backgroundColor = colourSelected;
feedbackColourCate.innerHTML = colourCategorySelected;
feedbackTool.innerHTML = toolMode + ": ";
feedbackSize.innerHTML = toolSize;

context.strokeStyle = colourSelected;
context.lineWidth = toolSize;
context.lineJoin = 'round';
context.lineCap = 'round';

resizeCanvas(); // fit the canvas size once the page initially loads

window.addEventListener( 'resize', resizeCanvas ); //resize the canvas
canvas.addEventListener('mousedown', draw);
canvas.addEventListener('touchstart', draw);
canvas.addEventListener('mouseup', stop);
canvas.addEventListener('touchend', stop);
window.addEventListener( 'mouseup', stop );
window.addEventListener('touchend', stop);

document.querySelector('#tools').addEventListener('click', selectTool);
document.querySelector('#manage').addEventListener('click', selectTool);
document.querySelector('#colours').addEventListener('click', selectColour);

//<<<<<<< HEAD
//function draw( e ) {
//    e.preventDefault();
//    if ( e.which === 1 ) {
//        var mouseX = e.pageX - canvas.offsetLeft;
//        var mouseY = e.pageY - canvas.offsetTop;
//        var mouseDrag = e.type === 'mousemove';  // determine if the point being added is the start or continuation of a line
//        
//        if ( e.type === 'mousedown' ) { saveState(); }
//        
//        canvas.addEventListener( 'mousemove', draw );
//        window.addEventListener( 'mousemove', draw );
//    
//        linePoints.push( { x: mouseX, y: mouseY, drag: mouseDrag, width: toolSize, colour: colourSelected } );
//    
//        updateCanvas(); // request canvas to update
//    }
//}
//
//function stop( e ) {
//    canvas.removeEventListener( 'mousemove', draw );
//    window.removeEventListener( 'mousemove', draw );
//=======


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
//>>>>>>> 277b8dc54b167c3222e0f95733fb86647a040e03
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

//<<<<<<< HEAD
//=======
//function saveState() {
//    canvasState = context.getImageData( 0, 0, canvas.width, canvas.height );
//    linePoints = [];
//	
//}
//
//>>>>>>> 277b8dc54b167c3222e0f95733fb86647a040e03
//select tool, manage options and colour
function selectTool(e){
    if (e.target === e.currentTarget) { return; }
    toolMode = e.target.dataset.mode || toolMode;
    toolSize = e.target.dataset.size || toolSize;
//<<<<<<< HEAD
//=======
//	
//	console.log(toolSize);
//>>>>>>> 277b8dc54b167c3222e0f95733fb86647a040e03
    
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
    }
    
    //select shading
    if (e.target.className === 'colour shadow') {
        shadowSelected = e.target.dataset.shadow || shadowSelected;
			
        highlightshadow(e.target);
        feedbackColour.style.opacity = shadowSelected;
    }
//<<<<<<< HEAD
//=======
//	
//>>>>>>> 277b8dc54b167c3222e0f95733fb86647a040e03
    
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

//<<<<<<< HEAD
//=======
function highlightshadow(button) {
    var buttons = button.parentNode.querySelectorAll('.colour.shadow');
    buttons.forEach( function( element ){ element.classList.remove('active'); } );
    button.classList.add('active');
}

//>>>>>>> 277b8dc54b167c3222e0f95733fb86647a040e03
function highlightColourChoice (button) {
    var buttons = button.parentNode.querySelectorAll('.colour-choice-button');
    buttons.forEach( function( element ){ element.classList.remove('active'); } );
    button.classList.add('active');
}

//<<<<<<< HEAD
//=======
function clearCanvas (){
    canvasState = [];
    //saveState();
    updateCanvas();
    console.log('clear');
}

//>>>>>>> 277b8dc54b167c3222e0f95733fb86647a040e03
// canvas state
function saveState() {
    canvasState.unshift( context.getImageData( 0, 0, canvas.width, canvas.height ));
    if (canvasState.length > 25) { canvasState.length = 25; } //limit the canvas states up to 25 to save memories
    linePoints = [];
    undoButton.classList.remove( 'disabled' );
}

function undoState() {
    context.putImageData(canvasState.shift(), 0, 0);
    if (!canvasState.length) { undoButton.classList.add( 'disabled' ); }
}

function confirmClearCanvas() {
    var confirm = window.confirm("Are you sure you want to clear your works?");
    if (confirm) {
        clearCanvas();
    }
}

function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    if (canvasState.length) { updateCanvas(); }
}