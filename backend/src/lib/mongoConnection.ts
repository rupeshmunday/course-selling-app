import mongoose from "mongoose";
import { CONFIG } from "../config/vars";
class MongoConnection {
    static mongoInstance : any;

    static async connect(){
        if(this.mongoInstance){
            return this.mongoInstance;
        }
        try {
            const dbString = 'mongodb://' + CONFIG?.MONGO.host + '/' + CONFIG?.MONGO.dbName;
            const conn = await mongoose.connect(dbString, CONFIG?.MONGO.option);
            
            if(!conn) {
                console.error('MongoDB connection failed');
                return;
            }

            console.log('Mongo Connected');
            
            this.mongoInstance = conn.connection;
            this.mongoInstance.on('error',(error:any)=>{
                console.error('Could not connect to MongoDB',error);
            })

            this.mongoInstance.on('disconnected',(err:any)=>{
                console.error('Lost MongoDB connection...', err);
                return MongoConnection.connect();
            })

            this.mongoInstance.on('open',()=>{
                console.info("MongoDb connected successfully");
            })
            mongoose.set('debug', CONFIG?.MONGO.debug);
            return this.mongoInstance;
        } catch (error) {
            console.error('Error while connecting...', error);
        }
    }

    static getInstance() {
        return this.mongoInstance;
    }
}
export default MongoConnection;