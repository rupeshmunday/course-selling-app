import { Router } from "express";
import path from 'path';
import fs from 'fs';

const router = Router();

const routesFolder = path.join(__dirname);
const routeFiles = fs.readdirSync(routesFolder);

routeFiles.forEach((file)=>{
    // Ignore this file (router.ts itself) or non-route files
    if (file === 'router.ts' || !file.endsWith('.ts')) {
        return;
    }

    const routePath = path.join(routesFolder, file);
    const routeName = file.replace('.ts', '');

    import(routePath).then((routerModule)=>{
        if(routerModule && routerModule[Object.keys(routerModule)[0]]){
            const module = routerModule[Object.keys(routerModule)[0]];
            router.use(`/${routeName}`, module );
        }
        
    }).catch((err)=>{
        console.error(`Error loading route ${routeName}:`, err);
        
    })
    
})
export {
    router
}
