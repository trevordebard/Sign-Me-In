import axios from 'axios';

const generateRoom = async fields => {
  let api;
  let response;
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    api = 'http://localhost:3000/api';
  } else {
    api = process.env.API_URL;
  }
  api = `${api}/room`;
  try {
    console.log(fields);
    response = await axios.post('/room', {
      fields,
    });
  } catch (err) {
    console.log(err);
  }

  return response;
};

export default generateRoom;
