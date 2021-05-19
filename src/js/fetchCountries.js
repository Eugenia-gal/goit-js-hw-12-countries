import axios from 'axios';

export default function fetchCountries(searchQuery) {
  if (!searchQuery) {
    return;
  }
  return axios
    .get(`https://restcountries.eu/rest/v2/name/${searchQuery}`)
    .then(response => response.data);
}
