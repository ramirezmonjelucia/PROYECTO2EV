//Se piden los ejemplares que están deteriorados para poder reemplazarlos.
db.ejemplares.aggregate([
        {
                $lookup: {
                        from: 'libros',
                        localField: 'ISBN',
                        foreignField: 'ISBN',
                        as: 'Detalles'
                }
        },
        {
                $match: {
                        Deteriorado: false
                }
        },
        {
                $project: {
                        _id: 0,

                }
        }
]).pretty()

/*
{
        "IdEjemplar" : 30823062,
        "Deteriorado" : false,
        "ISBN" : "CY28 8295 9779 ZPNW TLQZ ON2Y CYAM",
        "Detalles" : [
                {
                        "_id" : ObjectId("603f9a3df4ee6e6fa2b31020"),
                        "Título" : "Secuestrado",
                        "Editorial" : "Alba Editorial",
                        "Autor" : "Robert Louis Stevenson",
                        "Fecha" : ISODate("2018-09-19T00:00:00Z"),
                        "NºPáginas" : 280,
                        "ISBN" : "CY28 8295 9779 ZPNW TLQZ ON2Y CYAM",
                        "Géneros" : [
                                "Ficción",
                                "Drama"
                        ]
                }
        ]
}
*/

//Se pide una colección en la misma base de datos en la que aparezca el autor y los libros que ha escrito.

db.getSiblingDB("PROYECTO2EV").libros.aggregate([
        {
                $group: {
                        _id: "$Autor",
                        Libros: {
                                $push: "$Título"
                        }
                }
        },
        {
                $out: "librosyautores"
        }
])

/*
    ESTE MÉTODO NOS DEVUELVE UNA NUEVA COLECCIÓN EN LA BASE DE DATOS UTILIZADA "PROYECTO2EV" CON LOS SIGUIENTES CAMPOS:
 db.librosyautores.find({})
{ "_id" : "Juan José Millas", "Libros" : [ "La vida contada por un sapiens a un neandertal" ] }
{ "_id" : "Rosa Montero", "Libros" : [ "La buena suerte", "Los tiempos del odio", "La ridícula idea de no volver a verte", "La carne" ] }
{ "_id" : "Elena Ferrante", "Libros" : [ "La vida mentirosa de los adultos" ] }
{ "_id" : "Alice Kellen", "Libros" : [ "Las alas de Sophie" ] }
{ "_id" : "Megan Maxwell", "Libros" : [ "¿A qué estás esperando?" ] }
{ "_id" : "Benjamín Labatut", "Libros" : [ "Un verdor terrible" ] }
{ "_id" : "María Reig", "Libros" : [ "Una promesa de juventud" ] }
{ "_id" : "Arturo Pérez Reverte", "Libros" : [ "Línea de fuego", "Sidi" ] }
{ "_id" : "Ken Follett", "Libros" : [ "Las tinieblas y el alba" ] }
{ "_id" : "Blanca García", "Libros" : [ "Dime qué comes y te diré qué bacterias tienes. El intestino, nuestro segundo cerebro" ] }
{ "_id" : "Anne Frank", "Libros" : [ "Diario de Anne Frank" ] }
{ "_id" : "Javier Castillo", "Libros" : [ "La chica de nieve", "El día que se perdió la cordura", "El día que se perdió el amor", "Todo lo que sucedió con Miranda Huff" ] }
{ "_id" : "Eva García Sáenz de Urturi", "Libros" : [ "Aquitania" ] }
{ "_id" : "Robert Louis Stevenson", "Libros" : [ "Secuestrado" ] }
*/


//Línea temporal de autores
//CASO PRÁCTICO: es la semana cultural y en la biblioteca se van a preparar una serie de 
//charlas y se necesita una línea temporal para que sea más visual.
db.autores.aggregate([
        {
                $bucket: {
                        groupBy: { $year: "$FechaNac" },
                        boundaries: [1900, 1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000],
                        default: "Actualidad",
                        output: {
                                "count": { $sum: 1 },
                                "Autores":
                                {
                                        $push: {
                                                "Nombre": "$Nombre",
                                                "AñoNacimiento": { $year: "$FechaNac" }
                                        }
                                }
                        }
                }
        },
        { $merge: "LineaTemporalAutores" }
])

/*
db.LineaTemporalAutores.find({}).pretty()
{
        "_id" : 1920,
        "Autores" : [
                {
                        "Nombre" : "Anne Frank",
                        "AñoNacimiento" : 1929
                }
        ],
        "count" : 1
}
{
        "_id" : 1940,
        "Autores" : [
                {
                        "Nombre" : "Ken Follett",
                        "AñoNacimiento" : 1949
                },
                {
                        "Nombre" : "Juan José Millás",
                        "AñoNacimiento" : 1946
                },
                {
                        "Nombre" : "Blanca García",
                        "AñoNacimiento" : 1948
                },
                {
                        "Nombre" : "Elena Ferrante",
                        "AñoNacimiento" : 1943
                }
        ],
        "count" : 4
}
{
        "_id" : 1950,
        "Autores" : [
                {
                        "Nombre" : "Arturo Pérez Reverte",
                        "AñoNacimiento" : 1951
                },
                {
                        "Nombre" : "Rosa Montero",
                        "AñoNacimiento" : 1951
                }
        ],
        "count" : 2
}
{
        "_id" : 1960,
        "Autores" : [
                {
                        "Nombre" : "Megan Maxwell",
                        "AñoNacimiento" : 1965
                }
        ],
        "count" : 1
}
{
        "_id" : 1970,
        "Autores" : [
                {
                        "Nombre" : "Eva García Sáenz de Urturi",
                        "AñoNacimiento" : 1972
                }
        ],
        "count" : 1
}
{
        "_id" : 1980,
        "Autores" : [
                {
                        "Nombre" : "Javier Castillo",
                        "AñoNacimiento" : 1987
                },
                {
                        "Nombre" : "Benjamín Labatut",
                        "AñoNacimiento" : 1980
                },
                {
                        "Nombre" : "Alice Kellen",
                        "AñoNacimiento" : 1989
                }
        ],
        "count" : 3
}
{
        "_id" : 1990,
        "Autores" : [
                {
                        "Nombre" : "María Reig",
                        "AñoNacimiento" : 1992
                }
        ],
        "count" : 1
}

*/

//Se piden los libros que han alquilado los usuarios.
db.usuarios.aggregate([{
        $lookup: {

                "from": "prestamos",
                "localField": "CodUsuario",
                "foreignField": "CodUsuario",
                "as": "Libros_alquilados"
        }
}, {
        $unwind: {
                path: "$Libros_alquilados"

        }
}, {
        $group: {
                _id: {
                        _id: "$CodUsuario",
                        NombreUsuario: "$Nombre"
                },
                Prestamos: {
                        $push: "$Libros_alquilados"
                }
        }
}, {
        $sort: {
                _id: 1
        }

}]).pretty()

/*
{
        "_id" : {
                "_id" : 1,
                "NombreUsuario" : "Duke Benson"
        },
        "Prestamos" : [
                {
                        "_id" : ObjectId("603f9a86f4ee6e6fa2b31077"),
                        "CodUsuario" : 1,
                        "ISBN" : "RO59 QTIN AF7Y PUAC 57L8 C2MX"
                }
        ]
}
{
        "_id" : {
                "_id" : 3,
                "NombreUsuario" : "Jerome Bumby"
        },
        "Prestamos" : [
                {
                        "_id" : ObjectId("603f9a86f4ee6e6fa2b31078"),
                        "CodUsuario" : 3,
                        "ISBN" : "CY28 8295 9779 ZPNW TLQZ ON2Y CYAM"
                },
                {
                        "_id" : ObjectId("603f9a86f4ee6e6fa2b31079"),
                        "CodUsuario" : 3,
                        "ISBN" : "CY28 8295 9779 ZPNW TLQZ ON2Y CYAM"
                }
        ]
}
{
        "_id" : {
                "_id" : 5,
                "NombreUsuario" : "Stepha Izard"
        },
        "Prestamos" : [
                {
                        "_id" : ObjectId("603f9a86f4ee6e6fa2b3107c"),
                        "CodUsuario" : 5,
                        "ISBN" : "NL52 SJUP 4616 3518 38"
                }
        ]
}
{
        "_id" : {
                "_id" : 7,
                "NombreUsuario" : "Rebbecca Cardenoso"
        },
        "Prestamos" : [
                {
                        "_id" : ObjectId("603f9a86f4ee6e6fa2b3107a"),
                        "CodUsuario" : 7,
                        "ISBN" : "FR12 6397 2255 46LN JWCC J9QJ D27"
                }
        ]
}
{
        "_id" : {
                "_id" : 9,
                "NombreUsuario" : "Ellary Sacco"
        },
        "Prestamos" : [
                {
                        "_id" : ObjectId("603f9a86f4ee6e6fa2b3107b"),
                        "CodUsuario" : 9,
                        "ISBN" : "RO59 QTIN AF7Y PUAC 57L8 C2MX"
                }
        ]
}
{
        "_id" : {
                "_id" : 10,
                "NombreUsuario" : "Lorenzo Mordey"
        },
        "Prestamos" : [
                {
                        "_id" : ObjectId("603f9a86f4ee6e6fa2b3107d"),
                        "CodUsuario" : 10,
                        "ISBN" : "FR30 7930 0386 470Y DOAG NOEA L26"
                }
        ]
}
*/


//Se pide un gráfico que indique cuantos libros han escrito los autores
db.autores.aggregate([
        {
                "$lookup": {
                        "from": "libros",
                        "localField": "Nombre",
                        "foreignField": "Autor",
                        "as": "Libros escritos"
                }
        },
        {
                $unset: [
                        "Nacionalidad",
                        "DNI",
                        "FechaFall",
                        "FechaNac",
                ]
        },
        {
                $project: {
                        "Nombre": 1,
                        "Libros escritos": { $size: "$Libros escritos" }
                }
        },
        { $merge: "Grafico" }
]).pretty()

/*
db.Grafico.find({}).pretty()
{ "_id" : ObjectId("60422ece2ae72858e1f378bc"), "Libros escritos" : 1, "Nombre" : "Robert Louis Stevenson" }
{ "_id" : ObjectId("60422ece2ae72858e1f378bd"), "Libros escritos" : 2, "Nombre" : "Arturo Pérez Reverte" }
{ "_id" : ObjectId("60422ece2ae72858e1f378be"), "Libros escritos" : 1, "Nombre" : "Ken Follett" }
{ "_id" : ObjectId("60422ece2ae72858e1f378bf"), "Libros escritos" : 1, "Nombre" : "Juan José Millas" }
{ "_id" : ObjectId("60422ece2ae72858e1f378c0"), "Libros escritos" : 1, "Nombre" : "Blanca García" }
{ "_id" : ObjectId("60422ece2ae72858e1f378c1"), "Libros escritos" : 1, "Nombre" : "Megan Maxwell" }
{ "_id" : ObjectId("60422ece2ae72858e1f378c2"), "Libros escritos" : 4, "Nombre" : "Rosa Montero" }
{ "_id" : ObjectId("60422ece2ae72858e1f378c3"), "Libros escritos" : 4, "Nombre" : "Javier Castillo" }
{ "_id" : ObjectId("60422ece2ae72858e1f378c4"), "Libros escritos" : 1, "Nombre" : "Anne Frank" }
{ "_id" : ObjectId("60422ece2ae72858e1f378c5"), "Libros escritos" : 1, "Nombre" : "Eva García Sáenz de Urturi" }
{ "_id" : ObjectId("60422ece2ae72858e1f378c6"), "Libros escritos" : 1, "Nombre" : "Benjamín Labatut" }
{ "_id" : ObjectId("60422ece2ae72858e1f378c7"), "Libros escritos" : 1, "Nombre" : "Elena Ferrante" }
{ "_id" : ObjectId("60422ece2ae72858e1f378c8"), "Libros escritos" : 1, "Nombre" : "María Reig" }
{ "_id" : ObjectId("60422ece2ae72858e1f378c9"), "Libros escritos" : 1, "Nombre" : "Alice Kellen" }
*/

//Se pide una agrupación de los libros por géneros, número de páginas y por la fecha cuando de escritura.
db.libros.aggregate([
        {
                $facet: {                                             //Agrupamos por géneros individuales y se cuentan cuantos libros tienen ese genero
                        "AgrupaciónPorGéneros": [
                                { $unwind: "$Géneros" },
                                { $sortByCount: "$Géneros" }
                        ],
                        "AgrupaciónPorNumerodepaginas": [                   //Agrupamos por numero de páginas desde 200 hasta 500 y se recuentan. 
                                //Los libros sobrantes aparecen en el apartado +500
                                {
                                        $bucket: {
                                                groupBy: "$NºPáginas",
                                                boundaries: [200, 300, 400, 500],
                                                default: "+500",
                                                output: {
                                                        "Cantidad": { $sum: 1 }
                                                }
                                        }
                                }
                        ],
                        "AgrupaciónPorAño": [                               //Se agrupan los libros por año, desde el primero al último y se recuentan.
                                {
                                        $bucketAuto: {
                                                groupBy: { $year: "$Fecha" },
                                                buckets: 1
                                        }
                                }
                        ]
                }
        }
]).pretty()

/*
{
       "AgrupaciónPorGéneros" : [
               {
                       "_id" : "Ficción",
                       "count" : 17
               },
               {
                       "_id" : "Evolución",
                       "count" : 6
               },
               {
                       "_id" : "Suspense",
                       "count" : 5
               },
               {
                       "_id" : "Drama",
                       "count" : 5
               },
               {
                       "_id" : "Misterio",
                       "count" : 5
               },
               {
                       "_id" : "Aventura",
                       "count" : 2
               },
               {
                       "_id" : "Autobiografía",
                       "count" : 2
               },
               {
                       "_id" : "Memorias",
                       "count" : 1
               },
               {
                       "_id" : "Guerra",
                       "count" : 1
               },
               {
                       "_id" : "Cocina",
                       "count" : 1
               },
               {
                       "_id" : "Terapia",
                       "count" : 1
               },
               {
                       "_id" : "Antropología",
                       "count" : 1
               },
               {
                       "_id" : "Narrativa romántica",
                       "count" : 1
               }
       ],
       "AgrupaciónPorNumerodepaginas" : [
               {
                       "_id" : 200,
                       "Cantidad" : 6
               },
               {
                       "_id" : 300,
                       "Cantidad" : 4
               },
               {
                       "_id" : 400,
                       "Cantidad" : 6
               },
               {
                       "_id" : "+500",
                       "Cantidad" : 5
               }
       ],
       "AgrupaciónPorAño" : [
               {
                       "_id" : {
                               "min" : 2014,
                               "max" : 2020
                       },
                       "count" : 21
               }
       ]
}
*/

//Se pide un pequeño resumen de los libros que haya escrito Rosa Montero

db.autores.aggregate([
        {
                $match: {
                        "Nombre": "Rosa Montero"
                }
        },
        {
                $graphLookup: {
                        from: "libros",
                        startWith: "$Nombre",
                        connectFromField: "Autor",
                        connectToField: "Autor",
                        as: "Libros"
                }
        },
        {
                $unwind: {
                        path: "$Libros"
                }
        },
        {
                $project: {
                        _id: 0,
                        Título: "$Libros.Título",
                        Editorial: "$Libros.Editorial",
                        ISBN: "$Libros.ISBN",
                        "1ºGénero": {
                                $arrayElemAt: [
                                        "$Libros.Géneros",
                                        0
                                ]
                        },
                        "2ºGénero": {
                                $arrayElemAt: [
                                        "$Libros.Géneros",
                                        1
                                ]
                        }
                }
        }
]).pretty()

/*
{
        "Título" : "La buena suerte",
        "Editorial" : "Alfaguara",
        "ISBN" : "RO59 QTIN AF7Y PUAC 57L8 C2MX",
        "1ºGénero" : "Ficción",
        "2ºGénero" : "Evolución"
}
{
        "Título" : "La carne",
        "Editorial" : "Debolsillo",
        "ISBN" : "CZ64 0022 2438 5103 2864 3882",
        "1ºGénero" : "Ficción",
        "2ºGénero" : "Evolución"
}
{
        "Título" : "La ridícula idea de no volver a verte",
        "Editorial" : "Booket",
        "ISBN" : "KZ46 9541 0BD0 KKEO DKNI",
        "1ºGénero" : "Ficción",
        "2ºGénero" : "Evolución"
}
{
        "Título" : "Los tiempos del odio",
        "Editorial" : "Booket",
        "ISBN" : "NL52 SJUP 4616 3518 38",
        "1ºGénero" : "Ficción",
        "2ºGénero" : "Evolución"
}
*/