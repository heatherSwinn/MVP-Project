const form = document.getElementById("workoutForm");
const exerciseResults = document.getElementById("exerciseResults");

//date selector
var select = document.getElementById("selectMonth");
var options = ["January","February","March","April","May","June",
"July","August","September","October","November","December"];
for(var i = 0; i < options.length; i++) {
    var opt = options[i];
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    select.appendChild(el);
}

var select1 = document.getElementById("selectDay");
var options = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"];
for(var i = 0; i < options.length; i++) {
    var opt = options[i];
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    select1.appendChild(el);
}


var select2 = document.getElementById("selectYear");

var options = ["2020", "2021", "2022", "2023", "2024"];

for(var i = 0; i < options.length; i++) {
    var opt = options[i];
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    select2.appendChild(el);
}

//submit button to post workouts
form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    // const userName = formData.get("userName");
    const workout = formData.get("workout");
    const duration = formData.get("duration");
    const selectedMonth = document.getElementById("selectMonth").value;
    const selectedDay = document.getElementById("selectDay").value;
    const selectedYear = document.getElementById("selectYear").value;

    // Combine selected values into a date string (YYYY-MM-DD)
    const date = `${selectedYear}-${selectedMonth}-${selectedDay}`;

    const exerciseData = {
        // userName,
        workout,
        duration,
        date,
    };

    console.log('Submitting form...');
    fetch("/exercise", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(exerciseData),
    })
    .then((res) => res.json())
    .then((data) => {
        console.log("Submitted exercise:", data);
        displayExerciseResults();
        // getCurrentUsername().then((currentUsername) => {
        //     if (currentUsername) {
        //         displayExerciseResults(currentUsername);
        //     } else {
        //         throw new Error("Error getting current username");
        //     }
        // });
    })
    .catch((error) => {
        console.error("Error submitting exercise: ", error);
    });
});

function displayExerciseResults() {
    fetch("/exercise")
        .then((res) => {
            if (!res.ok) {
                throw new Error(`Failed to fetch exercise data. Status: ${res.status}`);
            }
            return res.json();
        })
        .then((data) => {
            exerciseResults.innerHTML = "";

            console.log(data);
            data
                // .filter((exercise) => exercise.username === currentUsername)
                .forEach((exercise) => {
                    // format date
                    const formattedDate = new Date(exercise.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    });

                    const exerciseItem = document.createElement("div");
                    exerciseItem.textContent = ` > ${exercise.name} for ${exercise.duration} minutes on ${formattedDate}    `;

                    const deleteButton = document.createElement("button");
                    deleteButton.textContent = "Delete";
                    deleteButton.addEventListener("click", () => deleteWorkout(exercise.workout_id));

                    const patchButton = document.createElement("button");
                    patchButton.textContent = "Modify";
                    patchButton.addEventListener("click", () => updateWorkout(exercise.workout_id));

                    exerciseItem.appendChild(deleteButton);
                    exerciseItem.appendChild(patchButton);

                    exerciseResults.appendChild(exerciseItem);
                });
        })
        .catch((error) => {
            console.error("Error displaying exercise results:", error.message);
        });
}

displayExerciseResults();
// //check for current user
// function getCurrentUsername(){
//     fetch("/api/current-user")
//     .then((res) => {
//         if (!res.ok) {
//             throw new Error("Unable to fetch current user");
//         }
//         return res.json();
//     })
//     .then((currentUser) => {
//         const username = currentUser.username;

//         return fetch("/exercise")  
//             .then((res) => {
//                 if (!res.ok) {
//                     throw new Error("Unable to fetch exercise data");
//                 }
//                 return res.json();
//             })
//             .then((exerciseData) => {
//                 // Check if the current user has logged a workout before
//                 const hasLoggedWorkout = exerciseData.some((exercise) => exercise.username === username);

//                 if (hasLoggedWorkout) {
//                     return `Welcome back ${username}!`;
//                 } else {
//                     return `Welcome ${username}! You logged your first workout! Input more data with the same username to continue tracking your workouts!`;
//                 }
//             })
//             .catch((error) => {
//                 console.error("Error fetching exercise data:", error);
//                 return null;
//             });
//     })
//     .catch((error) => {
//         console.error("Error fetching current user:", error);
//         return null;
//     });
// }

//delete workout function
function deleteWorkout(workoutId) {
    fetch(`/exercise/${workoutId}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ workoutId }),
    })
    .then(res => {
        if(!res.ok) {
            throw new Error('OOPS! Network response was not ok');
        }
        return res.json();
    })
    .then(() => {
        displayExerciseResults();
        console.log('workout deleted:', data);
    })
    .catch(error => {
        console.error('Error deleting workout: ', error);
    });
}

//patch workout function
function updateWorkout(workoutId) {
    const newName = prompt("Enter the new workout name:");
    const newDuration = prompt("Enter the new duration as an integer (minutes):");
    const newDate = prompt("Enter the new date (YYYY-MM-DD):");

    //check that all values were entered
    if(!newName || !newDuration || !newDate){
        alert("Please enter all fields to update the workout!");
        return;
    }

    const updatedWorkout = {
        workout: newName,
        duration: parseInt(newDuration),
        date: newDate,
    };

    fetch(`/exercise/${workoutId}`, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedWorkout),
    })

    .then(res => {
        if(!res.ok) {
            throw new Error('OOPS! Network response was not ok');
        }
        return res.json();
    })
    .then(data => {
        displayExerciseResults();
        console.log('Workout updated:', data);
    })
    .catch(error => {
        console.error('Error updating workout: ', error);
    })
}