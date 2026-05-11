function openFeature(){
  var allElem=document.querySelectorAll(".elm");
var allFullElem=document.querySelectorAll(".fullElem")
var allBack=document.querySelectorAll(".fullElem .back")
allElem.forEach(function(elm){

  elm.addEventListener("click",()=>{
    allFullElem[elm.id].style.display="block";
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

function todoFeature(){
let task=document.querySelector(".addTask #task")
let taskDetails=document.querySelector(".addTask #taskDetails")
let markImp=document.querySelector("#checkbox")
let submit=document.querySelector(".addTask form")


// console.log(dropDown)

let currentTask=[]
if(localStorage.getItem('currentTask')){
   currentTask=JSON.parse(localStorage.getItem('currentTask'))

}
else{
  console.log("task is empty")
}


function renderTask(){
let allTasks=document.querySelector(".allTask")
let sum=''
// let index=0
currentTask.forEach(function(elements,idx){
//  index=idx
  sum+=`  <div class="task-container" >
               <div class="dets">
                <h3>${currentTask[idx].Tname}<span class="imps"> imp</span></h3>
                <details>
                <summary style="color:black;">Details</summary>
               <div class="innerDets">
                ${currentTask[idx].Tdetails}
               </div>
              </details>
            </div>
              <button id=${idx} class="mark_complete">Mark as completed</button>
              
            </div>

           `
    
  
})
allTasks.innerHTML=sum;
var details=document.querySelectorAll(".dets details")
var dropDown= document.querySelectorAll(".allTask .task-container");

details.forEach(function(dets,idx){
  console.log(idx)
  dets.addEventListener('click',function(e){
    console.log("details is clicked")
        dropDown[idx].classList.toggle("increase")
  })
})

localStorage.setItem('currentTask',JSON.stringify(currentTask))
document.querySelectorAll('.task-container .mark_complete').forEach(function(elm){
  elm.addEventListener('click',function(){
      currentTask.splice(elm.id,1)
      renderTask()
})

})
      let objs=JSON.parse(localStorage.getItem("currentTask"))
 document.querySelectorAll(".dets h3 .imps").forEach(function(spans,idx){

          if(objs[idx].checking==false){
            spans.style.display='none'
          }
          // console.log()
       
   })

}
renderTask()

console.log(currentTask)
 submit.addEventListener("submit",function(e){
  e.preventDefault()
//  console.log(task.value)
//  console.log(taskDetails.value)
//  console.log(markImp.checked)
 currentTask.push({
  Tname:task.value,
  Tdetails:taskDetails.value,
   checking:markImp.checked
})

renderTask()
markImp.checked=false
task.value=''
taskDetails.value=''
})


}
todoFeature()
function DailyPlanner (){
//local storage implement setup
var dayPlanData=JSON.parse(localStorage.getItem('dayPlanData')) || {}
var dayPlanner=document.querySelector(".dayplanner")
var hour=Array.from({length:18},(elm,idx)=>`${4+idx}:00-${5+idx}:00`)
var Daily_sum=''


hour.forEach(function(elm,idx){
  var saveData=dayPlanData[idx]||''
Daily_sum+=`   <div class="day-planner-time">
          <p>${elm}</p>
          <input id=${idx} type="text" placeholder="...."  value="${saveData}"> 
        </div>
        </div>`
})
dayPlanner.innerHTML=Daily_sum;
var dayPlannerInput=document.querySelectorAll(".day-planner-time input")
console.log(dayPlannerInput)
dayPlannerInput.forEach(function(elm){
  elm.addEventListener('input',function(){
    console.log('hello')
    dayPlanData[elm.id]=elm.value;
    console.log(dayPlanData)
   localStorage.setItem('dayPlanData',JSON.stringify(dayPlanData))
  })
})


}
DailyPlanner ()
// async function todoFeature() {
//     let task = document.querySelector(".addTask #task");
//     let taskDetails = document.querySelector(".addTask #taskDetails");
//     let markImp = document.querySelector("#checkbox");
//     let submit = document.querySelector(".addTask form");
//     let allTasks = document.querySelector(".allTask");

//     let currentTask = [];

//     // 1. Fetch tasks from the DB on load
//     async function fetchTasks() {
//         try {
//             const response = await fetch('http://localhost:5000/api/tasks');
//             currentTask = await response.json();
//             renderTask();
//         } catch (error) {
//             console.error("Error fetching tasks:", error);
//         }
//     }

//     function renderTask() {
//         let sum = '';
//         currentTask.forEach(function(elements, idx) {
//             // Note: We use elements._id for MongoDB's unique ID to handle deletions properly
//             sum += `
//             <div class="task-container">
//                 <div class="dets">
//                     <h3>${elements.Tname} <span class="imps" style="display: ${elements.checking ? 'inline' : 'none'}">imp</span></h3>
//                     <details>
//                         <summary style="color:black;">Details</summary>
//                         <div class="innerDets">${elements.Tdetails}</div>
//                     </details>
//                 </div>
//                 <button data-id="${elements._id}" class="mark_complete">Mark as completed</button>
//             </div>`;
//         });
//         allTasks.innerHTML = sum;

//         // Add Delete Listeners
//         document.querySelectorAll('.mark_complete').forEach(function(btn) {
//             btn.addEventListener('click', async function() {
//                 const taskId = btn.getAttribute('data-id');
//                 try {
//                     await fetch(`http://localhost:5000/api/tasks/${taskId}`, { method: 'DELETE' });
//                     fetchTasks(); // Re-fetch after deletion
//                 } catch (error) {
//                     console.error("Error deleting task:", error);
//                 }
//             });
//         });
//     }

//     // 2. Save new task to DB
//     submit.addEventListener("submit", async function(e) {
//         e.preventDefault();
        
//         const newTaskData = {
//             Tname: task.value,
//             Tdetails: taskDetails.value,
//             checking: markImp.checked
//         };

//         try {
//             await fetch('http://localhost:5000/api/tasks', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(newTaskData)
//             });
            
//             markImp.checked = false;
//             task.value = '';
//             taskDetails.value = '';
//             fetchTasks(); // Refresh the list
//         } catch (error) {
//             console.error("Error saving task:", error);
//         }
//     });

//     fetchTasks(); // Initialize
// }
// todoFeature()

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
console.log("sees "+session.innerHTML)
var isWorkSession=true
let totalSeconds=25*60
let timeInterval=null

function updateTimer(){
  let minutes=Math.floor(totalSeconds/60)
  let seconds=totalSeconds%60
  timer.innerHTML=`${String(minutes).padStart('2','0')}:${String(seconds).padStart('2','0')}`
}
function startTimer(){
  clearInterval(timeInterval)
  if(isWorkSession){
    timeInterval=setInterval(function(){
      if(totalSeconds>0){
        totalSeconds--
        updateTimer()
      }
      else{
        isWorkSession=false
        clearInterval(timeInterval)
        timer.innerHTML='05:00'
        session.innerHTML="Take a break"
        session.style.backgroundColor='var(--blue)'
        totalSeconds=5*60
      }
    },10)
  }
  else{
    timeInterval=setInterval(function(){
      if(totalSeconds>0){
        totalSeconds--
        updateTimer()
      }
      else{
        isWorkSession=true
       clearInterval(timeInterval)
       timer.innerHTML='25:00'
       session.innerHTML="Work Session"
        session.style.backgroundColor='var(--green)'
       totalSeconds=25*60
      }
    },10)
  }
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

   console.log(weekDays[date.getDay()+1])
   console.log(date.getHours())
   console.log(date.getMinutes())
   console.log(months[date.getMonth()])
   console.log(date.toLocaleString())
   var dateee=`${weekDays[date.getDay()+1]}/${months[date.getMonth()]}/${date.getFullYear()}`
   dates.innerHTML=`${dateee}, ${String(date.getHours()).padStart('2','0')}:${String(date.getMinutes()).padStart('2','0')}`
}
setInterval(() => {
  weatherCall()
}, 100);
}
landinngpage()
// YvYXE1cKUdKHt1e5
// mongodb+srv://madeshnayak7712_db_user:YvYXE1cKUdKHt1e5@cluster0.jw0h6i5.mongodb.net/?appName=Cluster0