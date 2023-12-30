fetch("/exercise")
  .then((res) => res.json())
  .then((data) => {
    console.log("completed exercises: ", data);
  });