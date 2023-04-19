import debounce from 'lodash.debounce';
import './css/styles.css';
import { fetchCountries } from './helpers/fetchCountries';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const counrtyList = document.querySelector('#country-list');
const counrtyInfo = document.querySelector('#country-info');

input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(evt) {
  const inputText = evt.target.value.trim();

  fetchCountries(inputText)
    .then(countryArray => {
      if (countryArray.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (countryArray.length < 10 && countryArray.length !== 1) {
        counrtyInfo.innerHTML = '';
        counrtyList.innerHTML = createMarkupForCountryes(countryArray);
      } else if (true) {
        counrtyList.innerHTML = '';
        counrtyInfo.innerHTML = createMarkupForCountry(countryArray);
      }
    })
    .catch(() => {
      counrtyList.innerHTML = '';
      counrtyInfo.innerHTML = '';
      if (inputText !== '') {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      }
    });
}

function createMarkupForCountryes(array) {
  return array
    .map(
      ({ flags, name }) =>
        `<li class = "list-element"><img class="list-img" src="${flags.svg}" alt="${name.official} flag" width = 100><span class="list-text">${name.official}</span></li>`
    )
    .join('');
}

function createMarkupForCountry(array) {
  return array
    .map(
      ({ capital, languages, population, name, flags }) =>
        `<div>
            <img class = "main-img" src="${flags.svg}" alt="${
          name.official
        }" width = 300>
            <h2 class="country-name">${name.official}<h2>
        </div>
        <ul>
            <li>
              <span class="info-title">Capital:</span>
              <span class="info">${capital}</span>
            </li>
            <li>
              <span class="info-title">Languages:</span>
              <span class="info"> ${Object.values(languages)}</span>
            </li>
            <li>
              <span class="info-title">Population:</span>
              <span class="info">${population}</span>
            </li>
        </ul>
        `
    )
    .join('');
}
