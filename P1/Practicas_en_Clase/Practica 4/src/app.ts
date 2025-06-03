import express from 'express';

//tipado de express
import { Request, Response } from 'express';

const app = express();
app.use(express.json()); // Middleware para parsear el cuerpo de las peticiones JSON
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});




interface User {
    id: number;
    name: string;
    email: string;
    }

const Users: User[] = [
    {
        id: 1,
        name: 'John Doe',
        email: 'example@example.com',
    },
]


// Profesor app.get('/', (req: Request, res: Response) => {
app.get('/users', (req, res) => {
    //profesor res.json(Users);
    res.send(Users);
});

app.post('/users', (req: Request, res: Response)=> {
    const {body}= req;
    Users.push(body);
    res.status(201).json({
        message: 'Usuario creado',
        user: body
    });
    //res.send('Hello World!');    
});


app.get('/users/:id', (req: Request, res: Response) => {
    const {id} = req.params;
    const user = Users.find(user => user.id === parseInt(id));
    if (!user) {
        res.status(404).json({message: 'Usuario no encontrado'});
    }
    res.status(200).json(user);
})


app.patch('/users/:id', (req: Request, res: Response) => {
    const {id} = req.params;
    const user = Users.find(user => user.id === parseInt(id));
    if (!user) {
        res.status(404).json({message: 'Usuario no encontrado'});
    }
    else {
        const {name, email} = req.body;
        user.name = name;
        user.email = email;
        res.status(200).json({
            message: 'Usuario actualizado',
            user: user
        });
    }
    res.status(200).json(user);
})

app.delete('/users/:id', (req: Request, res: Response) => {
    const {id} = req.params;
    const userIndex = Users.findIndex(user => user.id === parseInt(id));
    if (userIndex === -1) {
        res.status(404).json({message: 'Usuario no encontrado'});
    }
    else {
        Users.splice(userIndex, 1);
        res.status(200).json({
            message: 'Usuario eliminado',
        });
    }
})