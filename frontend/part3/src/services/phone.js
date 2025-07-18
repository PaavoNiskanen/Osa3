import axios from 'axios';

const baseUrl = 'http://localhost:3001/api/persons';

const getAll = () => {
  return axios.get(baseUrl);
}

const create = newPerson => {
  return axios.post(baseUrl, newPerson);
}

const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`);
}

const update = (id, newObject) => axios.put(`${baseUrl}/${id}`, newObject)

export default { 
    getAll, 
    create, 
    remove, 
    update 
}
