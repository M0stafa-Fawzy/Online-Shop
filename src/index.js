const app = require("./app.js");
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});

const fun = () => {
  let yearsarr = [2022, 2021, 2020]
  let year = yearsarr[(Math.round(Math.random()))]
  let month = Math.round(Math.random() * (12 - 1) + 1)
  let day = Math.round(Math.random() * (30 - 1) + 1)
  let hour = Math.round(Math.random() * (24 - 0) + 0)
  let min = Math.round(Math.random() * (60 - 1) + 1)
  let sec = Math.round(Math.random() * (60 - 1) + 1)
  let afterSsec = Math.round(Math.random() * (1000 - 1) + 1)

  month = month.toString().length === 1 ? `0${month}` : month
  day = day.toString().length === 1 ? `0${day}` : day
  hour = hour.toString().length === 1 ? `0${hour}` : hour
  min = min.toString().length === 1 ? `0${min}` : min
  sec = sec.toString().length === 1 ? `0${sec}` : sec
  if(afterSsec.toString().length === 1) afterSsec = `00${afterSsec}`
  else if (afterSsec.toString().length === 2) afterSsec = `0${afterSsec}`
  else afterSsec = afterSsec

  console.log(year, month, day, hour, min, sec, afterSsec);
}

// fun()
