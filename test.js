var data = {
  '2018.01~2018.03': 100,
  '2019.04~2019.06': 100,
  '2018.10~2018.12': 100,
  '2019.10~2019.12': 100,
  '2019.01~2019.03': 100,
  '2018.07~2018.09': 100,
  '2018.04~2018.06': 100,
  '2019.07~2019.09': 100,
}





function formateChartData(data) {
  const arr = Object.keys(data).sort((a, b) => {
    return a < b
  })
  console.log(arr);

  var obj = {}

  arr.map(item => {
    obj[item] = data[item]
  })

  return obj
}

console.log(formateChartData(data));