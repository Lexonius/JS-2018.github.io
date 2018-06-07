
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
            console.log(results);
            const template = document.querySelector('#user-template').textContent;
            const render = Handlebars.compile(template);
            const html = render(friends.items);
            const results = document.querySelector('#results');
            //results.innerHTML = html;
        })
}
window.onload = init();
