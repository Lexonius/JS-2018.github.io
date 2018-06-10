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
            myModule.allFriends = friends.items;
            console.log(myModule.allFriends)    
            myModule.render(friends.items, myModule.leftList);
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
      filter:() =>{
            const filterInput = document.querySelector('#search_left');
            filterInput.addEventListener('keyup', function() {
            let result = [];
            console.log(result);
                for( let i = 0; i <myModule.allFriends.length; i++){
                    let nameFilter = 'myModule.allFriends[i].first_name' + ' ' + 'myModule.allFriends[i].last_name';
                    //console.log(nameFilter);
                    if(myModule.isMatching(nameFilter, event.target.value)){
                        result.push(myModule.allFriends[i]);
                    }
                }
            myModule.render(result).myModule.leftList;  
            }
        )},
    render: (array, container) =>{
        container.innerHTML = '';
        for(let i = 0; i<array.length; i++){
        let friend = document.createElement('div');
        friend.classList.add("friend");
        friend.setAttribute('draggable', true)
        friend.setAttribute('id',array[i].id);
        friend.setAttribute('ondragstart','dragStart(event)');
        console.log(friend);
        let avatarContainer = document.createElement('div');
        let name = document.createElement('div');
        name.classList.add("name");
        let button = document.createElement('div'); 
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
        //friend.appendChild(button);
        container.appendChild(friend);
        //const newFriend = `<div><div> <img src="${friends.items[i].photo_100}> </div><div></div><div></div></div>`
    }
    }
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
    list.appendChild(document.getElementById(data));
    e.stopPropagation();
    }  
window.dragOver = function(e) {
    event.preventDefault();
}


//прочитать про closest 
// ООП
//обратботчик на инпут перед рендером