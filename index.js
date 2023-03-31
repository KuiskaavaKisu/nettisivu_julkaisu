var canv = document.getElementById('canvas');
canv.style.width = '100%';
canv.style.height = '100%';
canv.width = window.innerWidth;
canv.height = window.innerHeight;
var ctx = canv.getContext('2d');

//canv.addEventListener('mousemove', bezir);


let rect = canv.getBoundingClientRect(); 
function randomHsl() {
    return 'hsla(' + (Math.random() * 360) + ', 100%, 50%, 1)';
}
function hslGrad(x,y){
    if (x == 0) {
        return 'hsla(0, 100%, 50%, 1)';
    }
    if (y == 0) {
        return 'hsla(0, 100%, 50%, 0.5)';
    }
    return 'hsla(' + y + ', 100%, 50%, 0.5)';

}
function bezir(){

   //get mouse position
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    var grd = ctx.createLinearGradient(0, 0, 200, 0);
    grd.addColorStop(0, hslGrad(x,y));
    grd.addColorStop(1, randomHsl());
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(100, 200, 350 , 250 , x, y);
    ctx.lineWidth = 50;
    ctx.strokeStyle = grd;
 
   
   
    ctx.stroke();
    
}
function clean(){
    ctx.canvas.width = ctx.canvas.width;
    console.log('clean');
}



var squares = [
    {
   x:0,
        y:0,
   old: [1,1],
    width: 100,
    height: 100,
   
    acc: [1.0,0.0],
    vel:[0.0,0.0],
    radius: 100
}/*,
 {
    x:0,
    y:200.0,
    old: [0.0,200.0],
   
    width: 100,
    height: 100,
    acc:[1.0,0.0] ,
    vel:[0.0,0.0],
    radius: 100
},{
x:200.0,
y:200.0,
old: [200.0,200.0],
width: 10,
height: 10,
acc:[1.0,0.0],
vel:[0.0,0.0],
radius: 100
},{
    x:300,y:200.0,
    old: [300.0,200.0],
    width: 100,
    height: 100,
    acc:[1.0,0.0],
    vel:[0.0,0.0],
    radius: 100
    },{
        x:300.0,y:300.0,
        old: [300.0,300.0],
        width: 100,
        height: 100,
        acc:[1.0,0.0],
        vel:[0.0,0.0],
        radius: 100
        }*/
];



canv.addEventListener('click',clicks);

 function clicks(event){
    event.preventDefault(); // prevent default behavior of the click event

    let clickpos = [event.clientX - rect.left, event.clientY - rect.top];
    let squareRemoved = false; // flag to check if a square was removed
    for (let i = 0; i < squares.length; i++) {
        let distance = Math.sqrt(Math.pow(clickpos[0] - squares[i].x, 2) + Math.pow(clickpos[1]  - squares[i].y, 2));
        if (distance <= squares[i].radius){
            squares.splice(i, 1); // remove the square at index i from the squares array
            squareRemoved = true; // set the flag to true
            i--; // adjust the index to account for the removed square
        }
    }
}
    function timedorb(){
        // prevent default behavior of the click event
    
        let clickpos = [canv.width/2, canv.height/2];
        let squareRemoved = false; // flag to check if a square was removed
        for (let i = 0; i < squares.length; i++) {
            let distance = Math.sqrt(Math.pow(clickpos[0] - squares[i].x, 2) + Math.pow(clickpos[1]  - squares[i].y, 2));
            if (distance <= squares[i].radius){
                squares.splice(i, 1); // remove the square at index i from the squares array
                squareRemoved = true; // set the flag to true
                i--; // adjust the index to account for the removed square
            }
        }
    // Only add a new square if no square was removed
    if (!squareRemoved) {
        squares.push({
            x: clickpos[0],
            y: clickpos[1],
            old: [clickpos[0] -1.0,clickpos[1]-1.0],
            width: 100,
            height: 100,
            acc:[1.0,0.0],
            vel:[0.0,0.0],
            radius: 10
        });
    }
};
function render(){
    
    clean();
    
    for (let i = 0; i < squares.length; i++) {
        
        ctx.beginPath();
        ctx.arc(squares[i].x, squares[i].y, squares[i].radius, 0, 2 * Math.PI);
        ctx.fillStyle = hslGrad(squares[i].x, squares[i].y);
        ctx.fill();
        
       update(squares[i]);
    }
    
    for (let i = 0; i < squares.length; i++) {
        for (let j = i+1; j < squares.length; j++) {
            circleCollision(squares[i], squares[j]);
        }
    }
   
}
function update(square){
        
    square.vel = [square.x - square.old[0], square.y - square.old[1]];
    square.old[0] = square.x;
    square.old[1] = square.y;
    
    constraints(square);
    
    
    
    // Apply friction
    const frictionCoeff = 0.00; // adjust this value as needed
    const frictionForce = [-square.vel[0] * frictionCoeff, -square.vel[1] * frictionCoeff];
    square.acc[0] += frictionForce[0];
    square.acc[1] += frictionForce[1];
    
    square.x += square.vel[0] + square.acc[0]; 
    square.y += square.vel[1] + square.acc[1];
    square.acc = [0.0, 0.0];
}
    function constraints(square){
     
        
        
        
        if (square.x <= 0.0){
            square.x = 0.0;
        }
        if (square.x >= canv.width - square.width){
            square.x = canv.width - square.width;
        }
        if (square.y <= 0.0){
            square.y =0.0;
        }
        if (square.y >= canv.height - square.height){
            square.y = canv.height - square.height;
        }

    }
    function circleCollision(circle1, circle2) {
        // Calculate distance between circle centers
        const dx = circle2.x - circle1.x;
        const dy = circle2.y - circle1.y;
        const distance = Math.sqrt(dx*dx + dy*dy);
    
        // Check if circles are touching
        if (distance <= circle1.radius + circle2.radius) {
            // Calculate minimum translation distance
            const overlap = (circle1.radius + circle2.radius) - distance;
            const mtv = [dx * (overlap / distance), dy * (overlap / distance)];
    
            // Move circles apart
            circle1.x -= mtv[0] / 2;
            circle1.y -= mtv[1] / 2;
            circle2.x += mtv[0] / 2;
            circle2.y += mtv[1] / 2;
    
            // Calculate collision normal and tangent
            const collisionNormal = [dx / distance, dy / distance];
            const collisionTangent = [-collisionNormal[1], collisionNormal[0]];
    
            // Calculate relative velocity
            const relVel = [            circle2.vel[0] - circle1.vel[0],
                circle2.vel[1] - circle1.vel[1]
            ];
    
            // Calculate relative velocity in terms of normal and tangent components
            const velNormal = relVel[0] * collisionNormal[0] + relVel[1] * collisionNormal[1];
            const velTangent = relVel[0] * collisionTangent[0] + relVel[1] * collisionTangent[1];
    
            // Calculate new normal velocity after collision
            const newVelNormal = -velNormal * circle2.restitution;
    
            // Calculate new tangent velocity after collision (no change)
            const newVelTangent = velTangent;
    
            // Calculate new relative velocity vector
            const newRelVel = [            newVelNormal * collisionNormal[0] + newVelTangent * collisionTangent[0],
                newVelNormal * collisionNormal[1] + newVelTangent * collisionTangent[1]
            ];
    
            // Update circle velocities
            circle1.vel[0] = circle2.vel[0] - newRelVel[0];
            circle1.vel[1] = circle2.vel[1] - newRelVel[1];
            circle2.vel[0] = circle1.vel[0] + newRelVel[0];
            circle2.vel[1] = circle1.vel[1] + newRelVel[1];
        }
    }

    window.setInterval(render, 1000/60);
    window.setInterval(timedorb, 1000);
   