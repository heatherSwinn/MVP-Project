const form = document.getElementById("workoutForm");
const exerciseResults = document.getElementById("exerciseResults");

//initialize flatpickr for the date input
flatpickr("#date", {
    enableTime: true,
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
                const exerciseItem = document.createElement("div");
                exerciseItem.textContent = `${exercise.name} \n${exercise.duration} minutes \n${exercise.date}`;
                exerciseResults.appendChild(exerciseItem);
            });
        })
        .catch((error) => {
            console.error("Error fetching exercises: ", error);
        })
}

//initial display of exercises
displayExerciseResults();