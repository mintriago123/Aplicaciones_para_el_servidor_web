import { promises } from "dns";

interface IEstudiante{
    id:number;
    name:string;
    calificacion?: number;

}
const Estudiantes:IEstudiante[] = [
    {
        id:20,
        name:'Walther', 
    },
    {
        id:21,
        name:'Emilio',
        calificacion: 10
    },
    {
        id:22,
        name:'Jorge',
        calificacion: 8
    },
    {
        id:23,
        name:'Luis',
        calificacion: 9
    }
    

];



console.log (Estudiantes);


Estudiantes.push(
    {
        id:24,
        name:'Carlos',
        calificacion: 10
    }
)
console.log (Estudiantes);


function AgregarEstudiante(estudiante:IEstudiante):void{
    Estudiantes.push(estudiante);
    console.log("El estudiante "+estudiante.name+" fue agregado correctamente");
}

AgregarEstudiante(
    {
        id:25,
        name:'Natalia',
        calificacion: 10
    }
)

console.log(Estudiantes);

function AgregarEstudianteCallback(estudiante:IEstudiante, callback:(estudiante:IEstudiante) => void):void{
    Estudiantes.push(estudiante);
    callback(estudiante);
}

AgregarEstudianteCallback(
    {
        id:26,
        name:'Oscar',
        calificacion: 9
    },
    (estudiante) => {
        console.log("El estudiante "+estudiante.name+" fue agregado correctamente");
    }
)


function AgregarEstudiantePromise(parametro:IEstudiante):Promise<IEstudiante>{
    return new Promise((resolve, reject) => {
        Estudiantes.push(parametro);
        setTimeout(()=>{
            resolve(parametro);
        })

        reject("Error al agregar el estudiante");
    });
}


// function EliminarEstudianteId(id:number):void{
//     const index = Estudiantes.findIndex(estudiante => estudiante.id === id);
//     if (index !== -1) {
//         Estudiantes.splice(index, 1);
//         console.log("El estudiante con ID " + id + " fue eliminado correctamente");
//     } else {
//         console.log("No se encontró un estudiante con ID " + id);
//     }
// }

// EliminarEstudianteId(24);


//console.log(Estudiantes);

    