const myModule = {
    leftList:undefined,
    rightList:undefined,
    allFriends:undefined,
    leftFriends:undefined,
    rightFriends:undefined,

    init: () => {
        VK.init({
            apiId: 6502079
           });
         
        myModule.auth()
            .then(()=> {return myModule.callAPI('users.get',{name_case:'gen'});
        })
        .then(([me]) => {
            return myModule.callAPI('friends.get', {fields:'photo_100'})
        })
        .then(friends => {  
            //console.log(friends)
            myModule.leftList = document.querySelector('.friends.left');
            myModule.leftList.addEventListener('click', myModule.moveToRight);

            //console.log(myModule.leftList);
            myModule.rightList = document.querySelector('.friends.right');
            myModule.rightList.addEventListener('click', myModule.moveToLeft);
            myModule.allFriends = friends.items;
            //myModule.leftFriends = friends.items;
            //console.log(myModule.leftFriends);
            //myModule.rightFriends = [];
            //console.log(myModule.allFriends)
            if (localStorage.getItem('leftList')) {
                myModule.leftFriends = JSON.parse ('localStorage.getItem.leftList');
            } else {
                myModule.leftFriends = friends.items;
            }
            if (localStorage.getItem('rightList')) {
                myModule.rightFriends = JSON.parse ('localStorage.getItem.rightList');
            } else {
                myModule.rightFriends = [];
            }
            
            myModule.filter('#search_left',myModule.leftFriends,myModule.leftList);
            myModule.filter('#search_right', myModule.rightFriends,myModule.rightList);
            myModule.render(myModule.leftFriends, myModule.leftList);
            myModule.render(myModule.rightFriends, myModule.rightList);
            myModule.save();
            //console.log(friends.items)
            
             
            })
    },
    auth: () =>{
        return new Promise((resolve, reject)=>{
            VK.Auth.login(data =>{
                if(data.session) {
                    resolve();
                }else{
                    reject(new Error('Не удалось авторизироваться'));
                }
            } ,2);
        });
    },
    callAPI: (method, params) =>{
        params.v='5.76';

        return new Promise((resolve, reject)=>{
            VK.api(method, params, (data)=>{
                if(data.error){
                    reject(data.error)
                }else{
                    resolve(data.response);
                }
            })
        })
    },
    isMatching:(full, chunk) => {
        //console.log(chunk)
        if(full.toLowerCase().indexOf(chunk.toLowerCase()) !== -1){
          return true;
        } else {
          return false;
        }
      },
      filter:(id, arr, container) => {
            const filterInput = document.querySelector(id);
            filterInput.addEventListener('keyup', function() {
            let result = [];
            //console.log(result);
                for( let i = 0; i <arr.length; i++){
                    let nameFilter = arr[i].first_name + ' ' + arr[i].last_name;
                    //console.log(nameFilter);
                    if(myModule.isMatching(nameFilter, event.target.value)){
                        result.push(arr[i]);
                    }
                }
                myModule.render(result,container);  
            }
        )},
    moveToRight: (e) => {
        if (e.target.classList.contains('button_add')) {
            console.log('CLICK TO BUTTON')
            const parent = e.target.closest('.friend');
            const id = parent.id;
            myModule.move(myModule.rightList, id)
        }   
    },
    moveToLeft: (e) => {
        if (e.target.classList.contains('button_remove')) {
            console.log('CLICK TO BUTTON')
            const parent = e.target.closest('.friend');
            const id = parent.id;
            myModule.move(myModule.leftList, id)
        }
    },
    move: (list, data) => {
        if (list.classList.contains('left')) {
            const index = myModule.rightFriends.findIndex(item => item.id === Number(data));
            myModule.leftFriends.push(myModule.rightFriends[index]);
            myModule.rightFriends.splice(index, 1);
        } else {
            const index = myModule.leftFriends.findIndex(item => item.id === Number(data));
            myModule.rightFriends.push(myModule.leftFriends[index]);
            myModule.leftFriends.splice(index, 1);
        }
        myModule.render(myModule.leftFriends, myModule.leftList);
        myModule.render(myModule.rightFriends, myModule.rightList);
    },
    render: (array, container) => {
        container.innerHTML = '';
        //console.log(array)
        for (let i = 0; i < array.length; i++){
            let friend = document.createElement('div');
            friend.classList.add("friend");
            friend.setAttribute('draggable', true)
            friend.setAttribute('id',array[i].id);
            friend.setAttribute('ondragstart','dragStart(event)');
            //console.log(friend);
            let avatarContainer = document.createElement('div');
            let name = document.createElement('div');
            name.classList.add("name");
            let button = document.createElement('div');
            let className;
            if (container.classList.contains('left')) {
                className = 'button_add'
            } else {
                className = 'button_remove'
            }
            button.classList.add(className);
            let firstName = array[i].first_name;
            let lastName = array[i].last_name;
            name.innerHTML = array[i].first_name + ' ' + array[i].last_name;
            let avatarImage = document.createElement('img');
            avatarImage.classList.add("avatar_img");
            avatarImage.setAttribute('draggable', false);
            avatarImage.setAttribute('src',array[i].photo_100);
            avatarContainer.appendChild(avatarImage);
            friend.appendChild(avatarContainer);
            friend.appendChild(name);
            friend.appendChild(button);
            container.appendChild(friend);
            //const newFriend = `<div><div> <img src="${friends.items[i].photo_100}> </div><div></div><div></div></div>`
        }
    },
    save:() => {
        let storage = localStorage;
        console.log(storage);
        const save = document.querySelector('.footer_submit')
        save.addEventListener('click',() => {
            localStorage.setItem('leftList',JSON.stringify(myModule.leftFriends));
            localStorage.setItem('rightList',JSON.stringify(myModule.rightFriends));
          });
    },
    
}
window.onload = myModule.init();

window.dragStart = function(e) { 
    e.dataTransfer.effectAllowed='move';
    e.dataTransfer.setData("Text", e.target.getAttribute('id'));
    return true;
}
window.dragEnter = function(e) {
    event.preventDefault();
    return true;
}
window.dragDrop = function(e) {
    let data = e.dataTransfer.getData("text/plain");
    const list = e.target.closest ('.friends');
    myModule.move(list, data);
    // list.appendChild(document.getElementById(data));
    e.stopPropagation();
}  
window.dragOver = function(e) {
    event.preventDefault();
}




// ООП
//обратботчик на инпут перед рендером