
function init (){
    VK.init({
        apiId: 6502079
       });
    
    function auth(){
        return new Promise((resolve, reject)=>{
            VK.Auth.login(data =>{
                if(data.session) {
                    resolve();
                }else{
                    reject(new Error('Не удалось авторизироваться'));
                }
            } ,2);
        });
    }
    
    function callAPI(method, params){
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
    }
    auth()
        .then(()=> {return callAPI('users.get',{name_case:'gen'});
    })
    .then(([me]) => {
        return callAPI('friends.get', {fields:'photo_100'})
    })
        .then(friends => {  
        //console.log(friends)
            let container = document.querySelector('.friends');
            console.log(friends)    
            for(let i = 0; i<friends.items.length; i++){
                //console.log(a)
                let friend = document.createElement('div');
                friend.classList.add("friend");
                friend.setAttribute('draggable', true)
                friend.setAttribute('id', 'drop_start');
                friend.setAttribute('ondragstart','dragStart(event)');
                function dragStart(e) { 
                    e.dataTransfer.effectAllowed='move';
                    e.dataTransfer.setData("Text", e.target.getAttribute('id'));
                    return true;
                    }
                friend.ondragenter = function dragEnter(e) {
                    event.preventDefault();
                    return true;
                    }
                function dragDrop(e) {
                    var data = e.dataTransfer.getData("text/plain");
                    e.target.appendChild(document.getElementById(data));
                    ev.stopPropagation();
                    }  
                function dragOver(e) {
                    event.preventDefault();
                }
                //console.log(friend);
                let avatarContainer = document.createElement('div');
                let name = document.createElement('div');
                name.classList.add("name");
                let button = document.createElement('div'); 
                let firstName = friends.items[i].first_name;
                let lastName = friends.items[i].last_name;
                name.innerHTML = friends.items[i].first_name + ' ' + friends.items[i].last_name;
                let avatarImage = document.createElement('img');
                avatarImage.classList.add("avatar_img");
                avatarImage.setAttribute('src',friends.items[i].photo_100);
                avatarContainer.appendChild(avatarImage);
                friend.appendChild(avatarContainer);
                friend.appendChild(name);
                //friend.appendChild(button);
                container.appendChild(friend);
                //const newFriend = `<div><div> <img src="${friends.items[i].photo_100}> </div><div></div><div></div></div>`
        }
        })
}
window.onload = init();
