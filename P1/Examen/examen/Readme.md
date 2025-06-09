Definicion de las entidades, relaciones y atributos que modelan el sistema 

    - Pelicula.- En esta entidad son las peliculas que estaran en proyeccion sea en cartelera o preventa.
        El sistema debe gestionar tanto películas ya estrenadas como aquellas en preventa.
        -	Id_Pelicula Int PK
        -	Titulo String
        -	Clasificacion_edad Int
        -   Estrenada Boolean  //True=Cartelera False=Preventa

    - Idioma.- Tabla Intermedia que nos permite tener varios Idiomas de una misma pelicula
        Permite gestionar múltiples versiones de una película (doblada, subtitulada, etc.).
        - Id_Idioma PK, Int
        - Nombre String

    - Sala.- Es la entidad de la sala donde se proyectara la pelicula, nos dice el total de asientos y sus asientos ocupados
        Es el espacio físico donde se proyectan las películas.
        -   Id_Sala Int PK
        -	Id_Pelicula Int FK
        -	Asientos Int 

    - Asientos.- El Asiento representa una ubicación específica dentro de una sala
        -   Id_Asiento (PK)
        -   Id_Sala (FK)
        -   Fila
        -   Numero

    - Funcion.- En esta entidad estaran las peliculas, salas, fechas de proyeccion
        Representa la programación específica de una película en una sala a una fecha y hora determinadas. 
        -	Id_Funcion Int  PK 
        -	Id_Pelicula  FK
        -   Id_Sala FK 
        -	ID_Idioma FK
        -	Fechas DateTime
        -   Asientos_ocupados Int 

    - Ticket.- Esta entidad es el comprobante de que genero una transaccion, en ella encontramos informacion de la funcion, el precio del ticket y si fue usado o no.
        Es la evidencia de que el cliente tiene derecho a acceder a una función específica.
        -   Id_Ticket  Int PK
        -	Id_Funcion FK
        -	Precio Int
        -   Canjeado Boolean

    - ReservaAsiento.-
        -   Id_ReservaAsiento (PK)
        -   Id_Funcion (FK)
        -   Id_Asiento (FK)
        -   Id_Ticket (FK)


Relaciones

    -   Pelicula (1) —— (N) Funcion
    Una película puede tener muchas funciones.

    -   Pelicula (1) —— (N) Pelicula_Idioma —— (N) Idioma
    Una película puede estar disponible en muchos idiomas y un idioma puede estar asociado a muchas películas.

    -   Sala (1) —— (N) Asiento
    Una sala contiene muchos asientos.

    -   Sala (1) —— (N) Funcion
    Una sala puede tener muchas funciones.

    -   Funcion (1) —— (N) Ticket
    Una función puede tener muchos tickets vendidos.

    -   Funcion (1) —— (N) ReservaAsiento
    Una función puede tener muchas reservas de asientos.

    -   Asiento (1) —— (N) ReservaAsiento
    Un asiento puede estar reservado para diferentes funciones.

    -   Ticket (1) —— (1) ReservaAsiento
    Un ticket está asociado a una reserva de asiento específica.