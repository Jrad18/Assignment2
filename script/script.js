var linePoints = [];
var canvas = document.querySelector('#canvas');
var context = canvas.getContext('2d');

var colourSelected = '#b7802d';

context.strokeStyle = colourSelected;
context.lineWidth = 5;
context.lineJoin = 'round';
context.lineCap = 'round';

canvas.addEventListener('mousedown', draw);
//canvas.addEventListener('touchstart', draw);
canvas.addEventListener('mouseup', stop);
//canvas.addEventListener('touchend', stop);
window.addEventListener( 'mouseup', stop );

document.querySelector('#colors').addEventListener('click', selectTool);

function draw( e ) {
    e.preventDefault();
    if ( e.which === 1 ) {
        var mouseX = e.pageX - canvas.offsetLeft;
        var mouseY = e.pageY - canvas.offsetTop;
        var mouseDrag = e.type === 'mousemove';  // determine if the point being added is the start or continuation of a line
        //console.log(e);
        canvas.addEventListener( 'mousemove', draw );
        window.addEventListener( 'mousemove', draw );
    
        linePoints.push( { x: mouseX, y: mouseY, drag: mouseDrag } );
    
        updateCanvas(); // request canvas to update
    }
}

function stop( e ) {
//    console.log(e);
    canvas.removeEventListener( 'mousemove', draw );
    window.removeEventListener( 'mousemove', draw );
}

function updateCanvas() {
    context.clearRect( 0, 0, canvas.width, canvas.height );
    renderLine();
}

function renderLine() {
    for ( var i = 0, length = linePoints.length; i < length; i++ ) {
        if ( !linePoints[i].drag ) {
            context.stroke();
            context.beginPath();
            context.moveTo( linePoints[i].x, linePoints[i].y );
            context.lineTo( linePoints[i].x + 0.5, linePoints[i].y + 0.5 );
        } else {
            context.lineTo( linePoints[i].x, linePoints[i].y );
        }
    }
    context.stroke();
}

function selectTool(e) {
    console.log(e.target);
    console.log(e.currentTarget);
    
    if ( e.target === e.currentTarget ) return;
    highlightButton(e.target);
}

function highlightButton( button ) {
    var buttons = button.parentNode.querySelectorAll( '.colour' );
    buttons.forEach( function( element ){ element.classList.remove('active') } );
    button.classList.add('active');
}