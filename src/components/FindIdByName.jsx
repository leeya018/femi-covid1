import React from 'react';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';


// const COORDS_ID = "7ef6e001-97e1-46c1-8d09-9932e441c2f5"

export default function FindIdByName({ allClienstFromInstitution, updateNumId, updateIdType, updateIdIputFocus }) {

  const [filter, setFilter] = useState('');
  const [focus, setFocus] = useState(false);


  function chooseClient(client) {
    if (client) {
      updateNumId(client.idNum)
      updateIdType(client.idType)
      setFilter(client.firstName + ' ' + client.lastName)
      console.log(client);
      console.log(filter);

      setFocus(false)
    }
  }



  return <div>
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={allClienstFromInstitution}
      sx={{ width: 200 }}
      renderInput={(params) => <TextField autoFocus  {...params} label="client" />}
      onFocus={() => updateIdIputFocus(false)}
      onChange={(event, client) => {
        chooseClient(client)
        updateIdIputFocus(true)

      }}

    />

  </div>;
}
