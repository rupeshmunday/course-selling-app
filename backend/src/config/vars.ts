let env = process.env.NODE_ENV;
console.log("process.env.NODE_ENV",env)
if(!env){
    env = 'development';
}

let config;
switch(env){
    case 'development':
        config = {
            PORT : 3001,
            MONGO:{
                host:'127.0.0.1:27017', // need to be remove
                dbName:'GenZ', // need to be remove
                userName:'', // need to be remove
                password:'', // need to be remove
                option: {
                    connectTimeoutMS: 600000,
                    noDelay: true,
                    socketTimeoutMS: 300000
                },
                debug:true
            },
        }
        
    case 'staging':
        config = {
            PORT : 3001,
            MONGO:{
                host:'127.0.0.1:27017', // need to be remove
                dbName:'GenZ', // need to be remove
                userName:'', // need to be remove
                password:'', // need to be remove
                option: {
                    connectTimeoutMS: 600000,
                    noDelay: true,
                    socketTimeoutMS: 300000
                },
                debug:true
            },
        }
    case 'production':
        config = {
            PORT : 3001,
            MONGO:{
                host:'127.0.0.1:27017', // need to be remove
                dbName:'GenZ', // need to be remove
                userName:'', // need to be remove
                password:'', // need to be remove
                option: {
                    connectTimeoutMS: 600000,
                    noDelay: true,
                    socketTimeoutMS: 300000
                },
                debug:true
            },
        }
    break;
}
export const CONFIG = config;