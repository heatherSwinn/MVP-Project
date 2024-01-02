const form = document.getElementById("workoutForm");
const exerciseResults = document.getElementById("exerciseResults");

//initialize flatpickr for the date input
flatpickr("#date", {
    altInput: true,
    altFormat: "F j, Y",
    dateFormat: "Y-m-d",
})

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const exerciseData = {
        userName: formData.get("userName"),
        workout: formData.get("workout"),
        duration: formData.get("duration"),
        date: formData.get("date"),
    };

    fetch("/exercise", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(exerciseData),
    })
    .then((res) => res.json())
    .then((data) => {
        console.log("Submited exercise:", data);
        displayExerciseResults();
    })
    .catch((error) => {
        console.error("Error submitting exercise: ", error);
    })
})

function displayExerciseResults() {
    fetch("/exercise")
        .then((res) => res.json())
        .then((data) => {
            exerciseResults.innerHTML = "";
            
            data.forEach((exercise) => {
                //format date
                const formattedDate = new Date(exercise.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                })
                const exerciseItem = document.createElement("div");
                exerciseItem.textContent = `Workout: ${exercise.name}\n${exercise.duration} minutes\n${formattedDate}`;
                
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
            console.error("Error fetching exercises: ", error);
        })
}

//initial display of exercises
displayExerciseResults();

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