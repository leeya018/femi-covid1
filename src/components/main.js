

  let clients = [
    {

        "firstName": "בסאם",
        "requestTime": "2021-10-14T09:22:19.52"
    },
    {

        "firstName": "לי",
        "requestTime": "2021-10-14T07:22:19.52"
    }

  ]

  let data = clients.sort((a, b) => Date.parse(a.requestTime) -Date.parse(b.requestTime)  )
  console.log(data)