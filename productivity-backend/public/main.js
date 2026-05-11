function openFeature(){
  var allElem=document.querySelectorAll(".elm");
var allFullElem=document.querySelectorAll(".fullElem")
var allBack=document.querySelectorAll(".fullElem .back")
allElem.forEach(function(elm){

  elm.addEventListener("click",()=>{
    allFullElem[elm.id].style.display="block";
    allFullElem[elm.id].style.display="flex";
allFullElem[elm.id].style.flexDirection="column"; // This ensures everything stacks neatly!
  })
})
allBack.forEach(function(back){
   back.addEventListener("click",()=>{
   allFullElem[back.id].style.display="none"
   
   })
})
window.location.reload = function() { 
    console.log("Refresh blocked!"); 
    return; 
};
}
openFeature()


async function todoFeature() {
    let task = document.querySelector(".addTask #task");
    let taskDetails = document.querySelector(".addTask #taskDetails");
    let markImp = document.querySelector("#checkbox");
    let submit = document.querySelector(".addTask form");
    let allTasks = document.querySelector(".allTask");

    let currentTask = [];

    // 1. Fetch tasks from the DB on load
    async function fetchTasks() {
        try {
            const response = await fetch('http://localhost:5000/api/tasks');
            currentTask = await response.json();
            renderTask();
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    }

    function renderTask() {
        let sum = '';
        currentTask.forEach(function(elements, idx) {
            // Note: We use elements._id for MongoDB's unique ID to handle deletions properly
            sum += `
            <div class="task-container">
                <div class="dets">
                    <h3>${elements.Tname} <span class="imps" style="display: ${elements.checking ? 'inline' : 'none'}">imp</span></h3>
                    <details>
                        <summary style="color:black;">Details</summary>
                        <div class="innerDets">${elements.Tdetails}</div>
                    </details>
                </div>
                <button data-id="${elements._id}" class="mark_complete">Mark as completed</button>
            </div>`;
        });
        allTasks.innerHTML = sum;

        // Add Delete Listeners
        document.querySelectorAll('.mark_complete').forEach(function(btn) {
            btn.addEventListener('click', async function() {
                const taskId = btn.getAttribute('data-id');
                try {
                    await fetch(`http://localhost:5000/api/tasks/${taskId}`, { method: 'DELETE' });
                    fetchTasks(); // Re-fetch after deletion
                } catch (error) {
                    console.error("Error deleting task:", error);
                }
            });
        });
    }

    // 2. Save new task to DB
    submit.addEventListener("submit", async function(e) {
        e.preventDefault();
        
        const newTaskData = {
            Tname: task.value,
            Tdetails: taskDetails.value,
            checking: markImp.checked
        };

        try {
            await fetch('http://localhost:5000/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTaskData)
            });
            
            markImp.checked = false;
            task.value = '';
            taskDetails.value = '';
            fetchTasks(); // Refresh the list
        } catch (error) {
            console.error("Error saving task:", error);
        }
    });

    fetchTasks(); // Initialize
}
todoFeature()

// async function DailyPlanner() {
//     var dayPlanner = document.querySelector(".dayplanner");
//     var hour = Array.from({length: 18}, (elm, idx) => `${4 + idx}:00-${5 + idx}:00`);
//     var dayPlanData = {};

//     // 1. Fetch Plan Data from DB
//     try {
//         const response = await fetch('http://localhost:5000/api/dayplan');
//         dayPlanData = await response.json();
//     } catch (error) {
//         console.error("Error fetching day plan:", error);
//     }

//     var Daily_sum = '';
//     hour.forEach(function(elm, idx) {
//         var saveData = dayPlanData[idx] || '';
//         Daily_sum += `
//         <div class="day-planner-time">
//             <p>${elm}</p>
//             <input id="${idx}" type="text" placeholder="...." value="${saveData}">
//         </div>`;
//     });
//     dayPlanner.innerHTML = Daily_sum;

//     var dayPlannerInput = document.querySelectorAll(".day-planner-time input");

//     dayPlannerInput.forEach(function(elm) {
//         elm.addEventListener('blur', async function() { // Changed to 'blur' (when user clicks away) so it doesn't spam the DB on every keystroke
//             dayPlanData[elm.id] = elm.value;
            
//             try {
//                 await fetch('http://localhost:5000/api/dayplan', {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify(dayPlanData)
//                 });
//             } catch (error) {
//                 console.error("Error saving plan:", error);
//             }
//         });
//     });
// }

// DailyPlanner()
// async function DailyPlanner() {
//     var dayPlanner = document.querySelector(".dayplanner");
//     var hour = Array.from({length: 18}, (elm, idx) => `${4 + idx}:00-${5 + idx}:00`);
//     var dayPlanData = {};

//     // 1. Fetch Plan Data from DB
//     try {
//         const response = await fetch('http://localhost:5000/api/dayplan');
//         dayPlanData = await response.json();
//     } catch (error) {
//         console.error("Error fetching day plan:", error);
//     }

//     var Daily_sum = '';
//     hour.forEach(function(elm, idx) {
//         var saveData = dayPlanData[idx] || '';
//         Daily_sum += `
//         <div class="day-planner-time">
//             <p>${elm}</p>
//             <input id="${idx}" type="text" placeholder="...." value="${saveData}">
//         </div>`;
//     });
//     dayPlanner.innerHTML = Daily_sum;

//     var dayPlannerInput = document.querySelectorAll(".day-planner-time input");

//     dayPlannerInput.forEach(function(elm) {
//         elm.addEventListener('blur', async function() { 
//             dayPlanData[elm.id] = elm.value;
//             try {
//                 await fetch('http://localhost:5000/api/dayplan', {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify(dayPlanData)
//                 });
//             } catch (error) {
//                 console.error("Error saving plan:", error);
//             }
//         });
//     });

//     // ==========================================
//     // NEW: SMART DAILY PLANNER ALERTS
//     // ==========================================

//     // Request permission for desktop notifications
//     if (Notification.permission !== "granted") {
//         Notification.requestPermission();
//     }

//     let lastAlertedTime = null; // Prevents the alert from spamming multiple times in the same minute

//     setInterval(() => {
//         const now = new Date();
//         const currentHour = now.getHours();
//         const currentMinute = now.getMinutes();
//         const timeString = `${currentHour}:${currentMinute}`;

//         // If we already fired an alert this exact minute, skip to avoid spam
//         if (lastAlertedTime === timeString) return;

//         // Loop through all the text saved in the daily planner
//         Object.keys(dayPlanData).forEach(idx => {
//             const taskText = dayPlanData[idx];
            
//             // Skip empty inputs
//             if (!taskText || taskText.trim() === "") return;

//             // Default alert time is the start of the block (e.g., Index 1 = 5:00 AM)
//             let alertHour = 4 + parseInt(idx);
//             let alertMinute = 0;

//             // SMART PARSER: Check if the user typed a specific time (like "5:30" or "14:45")
//             // This Regex looks for any standard time format hidden in your text
//             const timeMatch = taskText.match(/\b([0-1]?[0-9]|2[0-3]):([0-5][0-9])\b/);
            
//             if (timeMatch) {
//                 alertHour = parseInt(timeMatch[1]);
//                 alertMinute = parseInt(timeMatch[2]);
//             }

//             // Fire notification if current computer time matches the alert time
//             if (currentHour === alertHour && currentMinute === alertMinute) {
//                 if (Notification.permission === "granted") {
//                     new Notification("Daily Schedule", {
//                         body: `Up next: ${taskText}`,
//                         icon: "https://cdn-icons-png.flaticon.com/512/4305/4305432.png" 
//                     });
//                     lastAlertedTime = timeString; // Record that we successfully alerted you
//                 }
//             }
//         });
//     }, 60000); // Check the time every 60 seconds
// }
async function DailyPlanner() {
    var dayPlanner = document.querySelector(".dayplanner");
    var dayPlanData = {};

    // 1. Fetch Plan Data from DB
    try {
        const response = await fetch('http://localhost:5000/api/dayplan');
        dayPlanData = await response.json();
    } catch (error) {
        console.error("Error fetching day plan:", error);
    }

    function formatAMPM(hours) {
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; 
        return hours + ':00 ' + ampm;
    }

    // 2. Generate the UI using contenteditable <p> tags
    var Daily_sum = '';
    for(let idx = 0; idx < 18; idx++) {
        var saveTask = dayPlanData[idx] || '';
        var defaultLabel = formatAMPM(4 + idx); 
        var saveLabel = dayPlanData[`label_${idx}`] || defaultLabel;

        Daily_sum += `
        <div class="day-planner-time" style="display: flex; align-items: center;">
            
            <p id="label_${idx}" class="time-label" contenteditable="true" style="outline: none; cursor: text; margin: 0; padding-right: 15px; color: var(--yellow); font-weight: bold; min-width: 85px;">${saveLabel}</p>
            
            <input id="${idx}" class="task-input" type="text" placeholder="...." value="${saveTask}" style="flex: 1;">
            
        </div>`;
    }
    dayPlanner.innerHTML = Daily_sum;

    // 3. Save Data Safely
    var allTaskInputs = document.querySelectorAll(".dayplanner .task-input");
    var allTimeLabels = document.querySelectorAll(".dayplanner .time-label");

    // Save the Main Tasks
    allTaskInputs.forEach(function(elm) {
        elm.addEventListener('focus', function() {
            if (Notification.permission === "default") Notification.requestPermission();
        });
        elm.addEventListener('blur', async function() { 
            dayPlanData[elm.id] = elm.value; 
            saveToDatabase();
        });
    });

    // Save the Custom Times (uses innerText because it is a <p> tag)
    allTimeLabels.forEach(function(elm) {
        elm.addEventListener('blur', async function() { 
            dayPlanData[elm.id] = elm.innerText.trim(); 
            saveToDatabase();
        });
    });

    async function saveToDatabase() {
        try {
            await fetch('http://localhost:5000/api/dayplan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dayPlanData)
            });
        } catch (error) {
            console.error("Error saving plan:", error);
        }
    }

    // ==========================================
    // 4. SMART AM/PM ALERTER ENGINE
    // ==========================================
    function extractTime(text) {
        if (!text) return null;
        const match = text.match(/\b(?:([01]?[0-9]|2[0-3]):([0-5][0-9])\s*(am|pm)?|(1[0-2]|0?[1-9])\s*(am|pm))\b/i);
        if (!match) return null;
        
        let hour, minute, ampm;
        if (match[1] !== undefined) { 
            hour = parseInt(match[1]);
            minute = parseInt(match[2]);
            ampm = match[3] ? match[3].toLowerCase() : null;
        } else { 
            hour = parseInt(match[4]);
            minute = 0;
            ampm = match[5].toLowerCase();
        }
        
        if (ampm === 'pm' && hour < 12) hour += 12;
        if (ampm === 'am' && hour === 12) hour = 0;
        return { hour, minute };
    }



let lastAlertedTime = null; 

    setInterval(() => {
        // The Clean Engine: Just ask Windows what time it is!
        const now = new Date();
        const currentHour = now.getHours(); // Automatically reads 0-23 in PM
        const currentMinute = now.getMinutes(); 
        
        const timeString = `${currentHour}:${currentMinute}`;

        if (lastAlertedTime === timeString) return; 

        // X-RAY BEACON
        console.log(`[ENGINE WOKE UP] Local Time is -> ${currentHour}:${currentMinute}`);

        for(let idx = 0; idx < 18; idx++) {
            const taskText = dayPlanData[idx] || ""; 
            let parsedTime = extractTime(taskText);
            
            if (!parsedTime) {
                const labelText = dayPlanData[`label_${idx}`] || formatAMPM(4 + idx);
                parsedTime = extractTime(labelText);
            }

            if (parsedTime && currentHour === parsedTime.hour && currentMinute === parsedTime.minute) {
                console.log(`[SUCCESS] Alarm Triggered for Row ${idx}!`);
                
                // if (Notification.permission === "granted") {
                //     const cleanTaskText = taskText.replace(/\b(?:([01]?[0-9]|2[0-3]):([0-5][0-9])\s*(am|pm)?|(1[0-2]|0?[1-9])\s*(am|pm))\b/ig, '').trim();
                    
                //     const alertSound = new Audio('alert.mp3');
                //     alertSound.loop = true; 
                //     alertSound.play().catch(err => console.log("Audio blocked:", err));

                //     const taskNotification = new Notification("Daily Schedule", {
                //         body: `Up next: ${cleanTaskText || "Scheduled Task"}`
                //     });

                //     taskNotification.onclick = function() {
                //         alertSound.pause();
                //         alertSound.currentTime = 0; 
                //     };

                //     taskNotification.onclose = function() {
                //         alertSound.pause();
                //         alertSound.currentTime = 0;
                //     };
                    
                //     lastAlertedTime = timeString; 
                // }
              if (Notification.permission === "granted") {
                    const cleanTaskText = taskText.replace(/\b(?:([01]?[0-9]|2[0-3]):([0-5][0-9])\s*(am|pm)?|(1[0-2]|0?[1-9])\s*(am|pm))\b/ig, '').trim();
                    
                    // 1. START SOUND IMMEDIATELY
                    const alertSound = new Audio('alert.mp3');
                    alertSound.loop = true; 
                    alertSound.play().catch(err => console.log("Audio blocked:", err));

                    // 2. SHOW MESSAGE IMMEDIATELY (And force it to stay on screen)
                    const taskNotification = new Notification("Daily Schedule", {
                        body: `Up next: ${cleanTaskText || "Scheduled Task"}`,
                        requireInteraction: true // This stops Windows from hiding it after 5 seconds!
                    });

                    // 3. THE 30-SECOND AUTO-KILL SWITCH
                    const stopTimer = setTimeout(() => {
                        alertSound.pause();
                        alertSound.currentTime = 0;
                        taskNotification.close(); // Hides the visual popup
                        console.log("[SILENCED] Alarm auto-stopped after 30 seconds.");
                    }, 30000); 

                    // 4. STOP EARLY IF YOU CLICK THE MESSAGE
                    taskNotification.onclick = function() {
                        clearTimeout(stopTimer); // Cancels the 30s timer
                        alertSound.pause();
                        alertSound.currentTime = 0; 
                        taskNotification.close();
                    };

                    // 5. STOP EARLY IF YOU CLICK THE "X" TO CLOSE IT
                    taskNotification.onclose = function() {
                        clearTimeout(stopTimer); // Cancels the 30s timer
                        alertSound.pause();
                        alertSound.currentTime = 0;
                    };
                    
                    lastAlertedTime = timeString; 
                }
            }
        }
    }, 10000);


}
DailyPlanner()
function motivationalQuote(){

let motivation=document.querySelector(".motivation-2 h1");
let author=document.querySelector(".motivation-3 h2");
async function fetchQuote(){
  let response=await fetch('http://api.quotable.io/random');
  let data=await response.json()

  motivation.textContent=data.content;
  author.innerHTML=data.author;

}
fetchQuote()
}
motivationalQuote()


function pomodoroTimer(){
let timer=document.querySelector(".pomotimer h2")
let startBtn=document.querySelector(".pomotimer .pomo-start")
let pauseBtn=document.querySelector(".pomotimer .pomo-pause")
let resetBtn=document.querySelector(".pomotimer .pomo-reset")
let session=document.querySelector(".pomodoro-fullpage h4")
// console.log("sees "+session.innerHTML)
var isWorkSession=true
let totalSeconds=25*60
let timeInterval=null

function updateTimer(){
  let minutes=Math.floor(totalSeconds/60)
  let seconds=totalSeconds%60
  timer.innerHTML=`${String(minutes).padStart('2','0')}:${String(seconds).padStart('2','0')}`
}
function startTimer() {
    // Always clear any existing interval first so timers don't overlap if "Start" is clicked twice
    clearInterval(timeInterval);

    // Start the repeating loop
    timeInterval = setInterval(function() {
        
        if (totalSeconds > 0) {
            totalSeconds--;
            updateTimer();
        } else {
            // TIMER HIT ZERO!
            clearInterval(timeInterval); // Stop the countdown
            
            if (isWorkSession) {
                // 1. SAVE THE SESSION TO MONGODB
                fetch('http://localhost:5000/api/focus', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ durationInMinutes: 25 })
                })
                .then(() => {
                    console.log("Pomodoro session saved to database!");
                    loadAnalytics(); // Refresh the chart with the new data
                })
                .catch(err => console.error("Error saving session:", err));

                // 2. Switch to Break Mode
                isWorkSession = false;
                timer.innerHTML = '05:00';
                session.innerHTML = "Take a break";
                session.style.backgroundColor = 'var(--blue)';
                totalSeconds = 5 * 60;
                
            } else {
                // 3. Switch back to Work Mode
                isWorkSession = true;
                timer.innerHTML = '25:00';
                session.innerHTML = "Work Session";
                session.style.backgroundColor = 'var(--green)';
                totalSeconds = 25 * 60;
            }
        }
    }, 10); // 1000 ms = 1 second real-time countdown
}
function pauseTimer()
{
  clearInterval(timeInterval)
}
function resetTimer(){
  if(isWorkSession){
  totalSeconds=25*60
  clearInterval(timeInterval)
  }else{
  totalSeconds=5*60
  clearInterval(timeInterval)
  }


  updateTimer()
}
startBtn.addEventListener('click',startTimer)
pauseBtn.addEventListener('click',pauseTimer)
resetBtn.addEventListener('click',resetTimer)
}
pomodoroTimer()

function landinngpage(){
  var apiKey='840f9487baa44bfaad7194041261204';
var city='Mysore'
var degree=document.querySelector(".header-2 h2")
const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];   
const months=["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
let dates=document.querySelector(".header-1 h2")

async function weatherCall(){
  let response=await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`)
   let data=await response.json()
   degree.innerHTML=`${data.current.temp_c} ℃`
   var date=new Date();

//    console.log(weekDays[date.getDay()+1])
//    console.log(date.getHours())
//    console.log(date.getMinutes())
//    console.log(months[date.getMonth()])
//    console.log(date.toLocaleString())
   var dateee=`${weekDays[date.getDay()+1]}/${months[date.getMonth()]}/${date.getFullYear()}`
   dates.innerHTML=`${dateee}, ${String(date.getHours()).padStart('2','0')}:${String(date.getMinutes()).padStart('2','0')}`
}
setInterval(() => {
  weatherCall()
}, 100);
}
landinngpage()
let myChart = null; // Keep track of the chart

async function loadAnalytics() {
    try {
        const response = await fetch('http://localhost:5000/api/focus');
        const data = await response.json();

        // Group data by date
        const groupedData = {};
        data.forEach(session => {
            const dateObj = new Date(session.completedAt);
            // Format date beautifully (e.g., "Oct 24")
            const dateString = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); 

            if (!groupedData[dateString]) {
                groupedData[dateString] = 0;
            }
            groupedData[dateString] += session.durationInMinutes;
        });

        const labels = Object.keys(groupedData);
        const chartData = Object.values(groupedData);

        // --- NEW: Tracking Goal ---
        // Let's set a daily goal of 100 minutes (4 Pomodoros). 
        // This creates an array of '100's to draw a straight tracking line across the chart.
        const dailyGoal = 100; 
        const goalData = labels.map(() => dailyGoal); 

        // Get the canvas context
        const ctx = document.getElementById('productivityChart').getContext('2d');
        
        // --- NEW: Visual Appeal (Gradient) ---
        // Create a sleek gradient that fades from solid yellow at the top to transparent at the bottom
        let gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(254, 186, 23, 0.9)'); // Solid var(--yellow)
        gradient.addColorStop(1, 'rgba(254, 186, 23, 0.1)'); // Faded

        // Destroy existing chart if it exists
        if (myChart) {
            myChart.destroy();
        }

        // Draw the Advanced Mixed Chart
        myChart = new Chart(ctx, {
            data: {
                labels: labels,
                datasets: [
                    {
                        // The Tracking Line
                        type: 'line',
                        label: 'Daily Goal (100 mins)',
                        data: goalData,
                        borderColor: '#ffffff', // White line
                        borderWidth: 2,
                        borderDash: [5, 5], // Makes it a dashed line
                        fill: false,
                        pointBackgroundColor: '#ffffff',
                        pointRadius: 4,
                        tension: 0.4 // Adds a slight curve
                    },
                    {
                        // The Focus Bars
                        type: 'bar',
                        label: 'Total Focus Minutes',
                        data: chartData,
                        backgroundColor: gradient, // Apply the custom gradient
                        borderColor: '#FEBA17',
                        borderWidth: { top: 2, right: 0, bottom: 0, left: 0 }, // Only border on top
                        borderRadius: 8, // Rounded corners on the bars
                        maxBarThickness: 50 // Prevents bars from getting too wide
                    }
                ]
            },
           options: {
                responsive: true,           // <--- MANDATORY FOR MOBILE!
                maintainAspectRatio: false, // <--- THE "ULTIMATE" FIX!
                interaction: {
                    mode: 'index',
                    intersect: false, 
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        suggestedMax: 150, // Gives some breathing room above the 100 goal
                        ticks: { 
                            color: 'rgba(255, 255, 255, 0.8)',
                            font: { family: 'aeonic', size: 14 }
                        },
                        grid: { 
                            color: 'rgba(255, 255, 255, 0.05)', // Very subtle background lines
                            drawBorder: false
                        }
                    },
                    x: {
                        ticks: { 
                            color: 'rgba(255, 255, 255, 0.8)',
                            font: { family: 'aeonic', size: 14 }
                        },
                        grid: { display: false } // Hide vertical lines for a cleaner look
                    }
                },
                plugins: {
                    legend: { 
                        labels: { color: 'white', font: { family: 'aeonic', size: 14 } },
                        position: 'top'
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleFont: { size: 16, family: 'aeonic' },
                        bodyFont: { size: 14, family: 'aeonic' },
                        padding: 15,
                        cornerRadius: 10
                    }
                }
            }
        });

    } catch (error) {
        console.error("Failed to load analytics:", error);
    }
}
loadAnalytics() 


//     try {
//         const response = await fetch('http://localhost:5000/api/focus');
//         const data = await response.json();

//         // Group data by date
//         const groupedData = {};
//         data.forEach(session => {
//             // Extract just the date part (YYYY-MM-DD)
//             const dateObj = new Date(session.completedAt);
//             const dateString = dateObj.toLocaleDateString(); 

//             if (!groupedData[dateString]) {
//                 groupedData[dateString] = 0;
//             }
//             groupedData[dateString] += session.durationInMinutes;
//         });

//         const labels = Object.keys(groupedData); // The dates (X-axis)
//         const chartData = Object.values(groupedData); // The total minutes (Y-axis)

//         // Draw the Chart
//         const ctx = document.getElementById('productivityChart').getContext('2d');
        
//         // Destroy existing chart if it exists so they don't overlap
//         if (myChart) {
//             myChart.destroy();
//         }

//         myChart = new Chart(ctx, {
//             type: 'bar',
//             data: {
//                 labels: labels,
//                 datasets: [{
//                     label: 'Total Focus Minutes',
//                     data: chartData,
//                     backgroundColor: 'rgba(254, 186, 23, 0.7)', // Uses your var(--yellow)
//                     borderColor: '#FEBA17',
//                     borderWidth: 2,
//                     borderRadius: 5
//                 }]
//             },
//             options: {
//                 responsive: true,
//                 scales: {
//                     y: {
//                         beginAtZero: true,
//                         ticks: { color: 'white' },
//                         grid: { color: 'rgba(255, 255, 255, 0.1)' }
//                     },
//                     x: {
//                         ticks: { color: 'white' },
//                         grid: { display: false }
//                     }
//                 },
//                 plugins: {
//                     legend: { labels: { color: 'white' } }
//                 }
//             }
//         });

//     } catch (error) {
//         console.error("Failed to load analytics:", error);
//     }
// }

// // Call this once when the page loads
// loadAnalytics();