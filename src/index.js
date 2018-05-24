/* ДЗ 6 - Асинхронность и работа с сетью */

/*
 Задание 1:

 Функция должна возвращать Promise, который должен быть разрешен через указанное количество секунду

 Пример:
   delayPromise(3) // вернет promise, который будет разрешен через 3 секунды
 */
function delayPromise(seconds) {
  seconds = 1000;
  return new Promise ((resolve, reject)=>{
    setTimeout(()=>{
      resolve();
    },seconds)
  });
}

/*
 Задание 2:

 2.1: Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов пожно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json

 2.2: Элементы полученного массива должны быть отсортированы по имени города

 Пример:
   loadAndSortTowns().then(towns => console.log(towns)) // должна вывести в консоль отсортированный массив городов
 */
function loadAndSortTowns() {
  return new Promise ((resolve)=>{
     let xhr = new XMLHttpRequest();
      xhr.open ('GET','https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json', true);
      xhr.responseType = 'json';
        xhr.addEventListener('load',function(){
          //console.log('load',data);
          //let towns = JSON.parse(xhr.responseText);
          let data = xhr.response;
          //console.log(xhr.response);
          data.sort(function(a,b){
            //console.log(b)
            if(a.name > b.name){
              return 1;
            } else {
              return -1;
            }
          });
          resolve(data);
      });
      xhr.send();
    });
}

export {
    delayPromise,
    loadAndSortTowns
};
