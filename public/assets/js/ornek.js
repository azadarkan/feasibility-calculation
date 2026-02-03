axios.post("/api/save-data", JSON.stringify(data), {headers: {'Content-Type': 'application/json'}})
.then(function (response) { 
     
      if(response.data == 'success') {
          console.log(response.data); 
      }
    })
    .catch(function (error) { 
      console.log(error); 
    });