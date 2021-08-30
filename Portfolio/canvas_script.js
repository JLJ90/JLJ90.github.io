/* To do:
- basically make it the same as the DatCreator app
    - add r-squared, N and std
    - 
- make the pause functionality better
- make the data downloadable as csv - https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
- rather than manually calcualting the mean, I should use the math.js package.
Bugs:
- If you click the animate button after it is already animating, the speed gets added.

*/

const canvas = document.getElementById('sandbox')


//  why do we need to get the context? I am not sure at this stage, but it seems it is required to add 2d objects to the element (canvas)
const context = canvas.getContext('2d')

// This only works when you wnt a number between 1 and x. see https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

// x,y, radius, color
function circle (x, y, r, c) {
    this.x = x
    this.y = y
    this.r = r
    this.c = c

    this.dx = randomInteger(-4, 4)  
    this.dy= randomInteger(-4, 4)

    this.draw = function () {

        context.beginPath()
        context.fillStyle = this.c
        context.arc(this.x, this.y, this.r, 0, Math.PI *2, false)
        context.fill()
    }
    // Draw on creation
    this.draw()

    
    this.animate = function() {
        this.x += this.dx
        this.y += this.dy

        if (this.x + this.r > canvas.width || this.x - this.r < 0){
            this.dx = -this.dx
        }
        if (this.y +this.r > canvas.height || this.y - this.r < 0){
            this.dy = -this.dy
        }
        // Animate the particles will need to check for collisions here.
        // Make a list of all the positions, then loop through and check if this


        this.draw()
        }

}

// store all our objects.
const balls = []

// When we click the canvas. Make a new circle and add it to out list.
canvas.addEventListener('click', function (e){
    let rect = canvas.getBoundingClientRect();
    let r = 5
    // Normalise to the canvas position
    let x = Math.round((e.clientX-rect.left)/(rect.right-rect.left)*canvas.width)
    let y = Math.round((e.clientY-rect.top)/(rect.bottom-rect.top)*canvas.height)
    balls.push(new circle(x, y, r, 'blue'))
    get_mean()
    // balls.push(new circle(e.clientX, e.clientY, r, 'blue'))
})



// Used for reseting 
function clear_array() {
    //console.log('clearing array..')
    while(balls.length > 0) {
        balls.pop()
    }
    // Visibly remove them from the canvas.
    clear_canvas()
    clear_table()    
}

// Clear the canvas visually, used for animating
function clear_canvas() {
    context.clearRect(0, 0, canvas.width, canvas.height)
    document.getElementById("current_xmean").innerHTML = ""
    document.getElementById("current_ymean").innerHTML =  ""    
}


// Becuase this updating every time the screen refreshes, anything I put in here is called everytime the screen refreshes
function update() {
    clear_canvas() // For some reason we are clearing the entire canvas rather than just clearing each item.
    if(balls.length > 0){
        for (let i = 0; i < balls.length; i++) {
        balls[i].animate()
        }
    get_mean()
    requestAnimationFrame(update) // generally 60 fps, but will match the browser's refresh rate.https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
                                  // By calling it here, it is recursively calling itself
   }   
}


// Used for getting the runnung mean
function get_mean() {
    let rect = canvas.getBoundingClientRect()
    let mean_x = 0
    let mean_y = 0

    for (let i = 0; i< balls.length; i++){
        mean_x += balls[i].x
        mean_y += balls[i].y
        
        }
    // update the mean
    document.getElementById("current_xmean").innerHTML = ((mean_x / balls.length) / rect.width).toFixed(2) 
    document.getElementById("current_ymean").innerHTML = ((rect.height - (mean_y / balls.length))/ rect.height).toFixed(2) 
}


// Temporary pause button.
function pause() {
    window.alert('close this notification to unpause')
}

// Generate table to save data

function generate_data() {
    // for some reason I can't get the table from the new window. I need to figure out how to reference the new window
    for (let i = 0; i< balls.length; i++) {
        // Get a reference to the table
        let tableRef = document.getElementById('table-data');
        // Insert a row at the end of the table
        let newRow = tableRef.insertRow(-1);
      
        // Insert a cell in the row at index 0
        let newCell1 = newRow.insertCell(0);
        let newCell2 = newRow.insertCell(1);

        let rect = canvas.getBoundingClientRect()
        let x_val = (balls[i].x / rect.width).toFixed(2)
        let y_val = ((rect.height - balls[i].y) / rect.height).toFixed(2)
        // Append a text node to the new cells
        newCell1.innerHTML = x_val;
        newCell2.innerHTML = y_val;
      }
    

}

// clear table

function clear_table() {
    let tableRef = document.getElementById('table-data');
    for(let i = 1;i<tableRef.rows.length;){
        tableRef.deleteRow(i);
    }
}
