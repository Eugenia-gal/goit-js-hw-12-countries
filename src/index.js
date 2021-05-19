import './sass/main.scss';

import debounce from 'lodash.debounce';
import namesListTmpl from './templates/country-list.hbs';
import countryCardTmpl from './templates/country-card';
import { defaultModules } from '@pnotify/core/dist/PNotify.js';
import * as PNotifyMobile from '@pnotify/mobile/dist/PNotifyMobile.js';
import { defaults } from '@pnotify/core';
import { error } from '@pnotify/core';
import fetchCountry from './js/fetchCountries';

defaultModules.set(PNotifyMobile, {});
defaults.styling = 'material';
defaults.icons = 'material';
defaults.shadow = true;
defaults.hide = true;
defaults.delay = 2000;

const refs = {
  searchInputEl: document.querySelector('#search-input'),
  countriesListEl: document.querySelector('.countries-list'),
  countryCardEl: document.querySelector('.country-card'),
};

refs.searchInputEl.addEventListener('input', debounce(onEnterCountryName, 500));

function onEnterCountryName(e) {
  const name = e.target.value;

  // showCountriesInfo('hidden');

  if (!name) {
    showCountriesInfo('hidden');
    return;
  }

  fetchCountry(name)
    .then(result => makeCountriesInfoMarkup(result))
    .catch(err => {
      console.log(err);
      error({
        text: 'Matches not found. Please try another query!',
      });
    });
}

function makeCountriesInfoMarkup(countries) {
  let markUp = '';

  clearCountriesInfo();

  if (countries.length >= 10) {
    showCountriesInfo('hidden');
    error({
      text: 'Too many matches found. Please enter a more specific query!',
    });
    return;
  } else if (countries.length > 1) {
    markUp = namesListTmpl(countries);
    refs.countriesListEl.innerHTML = markUp;
    showCountriesInfo('list');
  } else {
    markUp = countryCardTmpl(countries[0]);
    refs.countryCardEl.innerHTML = markUp;
    showCountriesInfo('card');
  }
}

function clearCountriesInfo() {
  refs.countriesListEl.innerHTML = '';
  refs.countryCardEl.innerHTML = '';
}

function showCountriesInfo(infoType) {
  if (infoType === 'list') {
    refs.countriesListEl.classList.remove('visually-hidden');
    refs.countryCardEl.classList.add('visually-hidden');
  }

  if (infoType === 'card') {
    refs.countriesListEl.classList.add('visually-hidden');
    refs.countryCardEl.classList.remove('visually-hidden');
  }

  if (infoType === 'hidden') {
    refs.countriesListEl.classList.add('visually-hidden');
    refs.countryCardEl.classList.add('visually-hidden');
  }
}
