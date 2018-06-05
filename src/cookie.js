  /*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)
   

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */

const homeworkContainer = document.querySelector('#homework-container');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');
function getCookies () {
  let cookies = [];
  let currentCookies = document.cookie.split('; ');
  for (var i = 0; i< currentCookies.length; i++) {
    let nameValue = currentCookies[i].split('=');
    let cookieObject = { name: nameValue[0], value: nameValue[1] };
      cookies.push(cookieObject);
  }
  return cookies;
}
function loadCookies() {
  let resultCookies = getCookies();
  addAllCookiesToTable(resultCookies);  
}
function addAllCookiesToTable(cookies) {
  for (let j = 0; j < cookies.length; j++) {
      addCookieToTable(cookies[j].name, cookies[j].value);
  }
}
function deleteCookie(name) {
  document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
function createOrUpdateCookie(name, value) {
  document.cookie = name + '=' + value;
}
function filterCookies() {
  let resultCookies = getCookies();
  let filterValue = filterNameInput.value;
  listTable.innerHTML = '';
  if (!filterValue) {
      addAllCookiesToTable(resultCookies);
  } else {
      for (let y = 0; y < resultCookies.length; y++) {
          if (resultCookies[y].name.indexOf(filterValue) !== -1 ||
              resultCookies[y].value.indexOf(filterValue) !== -1) {
              addCookieToTable(resultCookies[y].name, resultCookies[y].value);
          }
      }
  }
}
function addCookieToTable(name, value) {
  if (!name) {
      return;
  }
  let deleteCookieBtn = document.createElement('BUTTON');
  let row = document.createElement('TR');
  deleteCookieBtn.innerText = 'Удалить';
  deleteCookieBtn.setAttribute('cookieName', name);
  listTable.appendChild(row);
  row.insertCell(0).innerHTML = name;
  row.insertCell(1).innerHTML = value;
  row.insertCell(2).appendChild(deleteCookieBtn);
  deleteCookieBtn.addEventListener('click', deleteCookieClick);
}
function deleteCookieClick (e) {
  let cookieName = e.target.getAttribute('cookieName');
  let currentCookieRow = this.parentElement.parentElement;  
  deleteCookie(cookieName);
  deleteCookieBl(cookieName);
  listTable.removeChild(currentCookieRow);
}
function addCookieEmptyFilter(cookie) {
  createOrUpdateCookie(cookie.name, cookie.value);
  let deleteCell = document.querySelector('[cookieName=' + cookie.name + ']');
  if (deleteCell) {
      let tableRow = deleteCell.parentElement.parentElement;
      tableRow.cells[1].innerHTML = cookie.value;
  } else {
      addCookieToTable(cookie.name, cookie.value);
  }
}
function addCookieNoEmptyFilter(cookie) {
  if (cookie.name.indexOf(filterNameInput.value) !== -1 || cookie.value.indexOf(filterNameInput.value) !== -1) {
      addCookieEmptyFilter(cookie);
  } else {
      createOrUpdateCookie(cookie.name, cookie.value);
      if (cookie.name.indexOf(filterNameInput.value) == -1 ||
          cookie.value.indexOf(filterNameInput.value) == -1) {
          let deleteCell = document.querySelector('[cookieName=' + cookie.name + ']');
          if (deleteCell) {
              let tableRow = deleteCell.parentElement.parentElement;
              listTable.removeChild(tableRow);
          }
      }
  }
}
function addCookieClick() {
  let cookie = { name: addNameInput.value, value: addValueInput.value };
  if (filterNameInput.value === '') {
      addCookieEmptyFilter(cookie);
  } else {
      addCookieNoEmptyFilter(cookie);
  }
}

function deleteCookieBl(name) {
  let cookies = getCookies();
  for (let i = 0; i < cookies.length; i++) {
      if (cookies[i].name === name) {
          deleteCookie(name);
          return;
      }
  }
}
window.addEventListener('load', loadCookies);
window.addEventListener('load', () => {
  addButton.addEventListener('click', addCookieClick);
  filterNameInput.addEventListener('keyup', filterCookies);
});