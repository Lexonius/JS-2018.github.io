
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
            for(let i = 0; i<friends.length; i++){
                console.log(a)
                let friend = document.createElement('div');
                let avatarContainer = document.createElement('div');
                let name = document.createElement('div');
                let button = document.createElement('div'); 
                let firstName = friends[i].first_name;
                let lastName = friends[i].last_name;
                name.innerHTML = friends[i].first_name + ' ' + friends[i].last_name;
                let avatarImage = document.createElement('img');
                avatarImage.setAttribute('src',friends[i].photo_100);
                avatarContainer.appendChild(avatarImage);
                friend.appendChild(avatarContainer);
                friend.appendChild(name);
                //friend.appendChild(button);
                container.appendChild(friend);
                
        }
        })
}
window.onload = init();
