// reading name from user and search for a user by this name
// document.querySelector('.form').addEventListener('submit', async (e) => {
//     e.preventDefault()
//     const name = document.querySelector('.name').value
//     const res = await fetch(`http://localhost:3000/for/${name}`)
//     res.json().then((data) => {
//         console.log(data[0].password)
//     }).catch((e) => {
//         console.log('this is an errpro')
//     })
// })

// alert("done")

// document.querySelector(".form").addEventListener("submit", async (e) => {
//   e.preventDefault();
//   fetch("/users", {
//     method: "POST",
//     headers: {
//       "Content-type": "application/json",
//     },
//     body: JSON.stringify({
//       name: e.target.elements.name.value,
//       email: e.target.elements.email.value,
//       password: e.target.elements.password.value,
//       role: e.target.elements.role.value,
//       phoneNumber: e.target.elements.num.value,
//     }),
//   })
//     .then((res) => {
//       return res.json();
//     })
//     .then((data) => {
//       console.log(data);
//     })
//     .catch((e) => console.error("here is error " + e.error));
// });
