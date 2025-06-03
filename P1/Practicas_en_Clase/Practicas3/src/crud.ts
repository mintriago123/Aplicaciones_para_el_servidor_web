import { appdataSource } from "./data-source";
import { User } from "./models/user";
import { View } from "./models/view";

export const insertUser = async (name:string,email:string) => {
    const user1 = new User()
    user1.name = name;
    user1.email = email;
    return await appdataSource.manager.save(user1)
}

export const obtenerUsers = async () => {
    return await appdataSource.manager.find(User);
}

export const obtenerUser = async (id: number) => {
    return await appdataSource.manager.findOne(User, {
        where: { id}
    });
}  

export const actualizarUser = async (id: number, name: string, email: string) => {
    const user = await obtenerUser(id);
    if (user){
        user.name = name;
        user.email = email;
        return await appdataSource.manager.save(user);
    }
    return null;
}

export const eliminarUser = async (id: number) => {
    const user = await obtenerUser(id);
    if (user){
        return await appdataSource.manager.remove(user);
    }
    return null;
}

 export const CreateView = async (vista:string, userId:number) => {
    const user = await obtenerUser(userId);
    if (user){
        const view = new View();
        view.vista = vista;
        view.user = user;
        return await appdataSource.manager.save(view);
    }
    return null;
}
export const DeleteView = async (id: number) => {
     const view1 = await appdataSource.manager.findOne(View, {where: {id}});
     if (view1){
         return await appdataSource.manager.remove(view1);
         }
         return null;
     }


