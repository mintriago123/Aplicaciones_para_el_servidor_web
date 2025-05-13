import {insertUser} from './crud'
import {initDatabase} from './database'
import {actualizarUser} from './crud'
import {eliminarUser} from './crud'
import {obtenerUser} from './crud'
import {obtenerUsers} from './crud'
import {CreateView} from './crud'

async function main() {
    await initDatabase()
    const user = await insertUser("Juan", "juan1234@gmail.com")
    console.log(user)
    console.log("User inserted")
    console.log("User", user)

    const vista = await CreateView("Vista Reporte de Productos", user.id);
    console.log(vista);

    const users = await obtenerUsers();
    console.log(users);

    const user1 = await obtenerUser(user.id);
    console.log(user1);

    const user1update = await actualizarUser(user.id, "Juanito", "trump1")
    console.log(user1update);

    //const user1delete = await eliminarUser(user.id)
    //console.log(user1delete);

}



main()