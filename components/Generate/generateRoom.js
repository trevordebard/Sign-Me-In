import axios from 'axios';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const generateRoom = async fields => {
  let response;
  let api = publicRuntimeConfig.API_URL;
  api = `${api}/room`;
  try {
    response = await axios.post(api, {
      fields,
    });
  } catch (err) {
    console.log(err);
    return { err };
  }

  return response;
};

export default generateRoom;
