import mongoose from "mongoose";
import { CONFIG } from "../config/vars";
class MongoConnection {
    static mongoInstance : any;

    static async connect(){
        if(this.mongoInstance) {
            return this.mongoInstance;
        }
        return new Promise<void>((resolve, reject) => {
            console.log('Mongo Connected')
            const dbString = 'mongodb://' + CONFIG?.MONGO.host + '/' + CONFIG?.MONGO.dbName;
            this.mongoInstance = mongoose.createConnection(dbString, CONFIG?.MONGO.option);

            this.mongoInstance.on('error',(error:any)=>{
                console.error('Could not connect to MongoDB',error);
                reject('Could not connect to MongoDB');
            })

            this.mongoInstance.on('disconnected',(err:any)=>{
                console.error('Lost MongoDB connection...', err);
                return MongoConnection.connect();
            })

            this.mongoInstance.on('open',()=>{
                console.info("MongoDb connected successfully");
                resolve(this.mongoInstance);
            })
            mongoose.set('debug', CONFIG?.MONGO.debug);
        }).catch((error)=>{
            console.error('Error while connecting...', error);
        })
    }

    static getInstance() {
        return this.mongoInstance;
    }
}
export default MongoConnection;