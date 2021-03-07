/*
Se pide enseñar todos los libros que las editoriales no sean ni Debolsillo ni Booket
*/
db.libros.find({
    $and: [
        {
            Editorial: {
                $ne: "Debolsillo"
            }
        },
        {
            Editorial: {
                $ne: "Booket"
            }
        }
    ]
}).pretty()
/*
Se pide enseñar todos los libros que el autor no sea Javier Castillo
*/
db.libros.find({
    Autor: {
        $not: {
            $eq: "Javier Castillo"
        }
    }
})
/*
Se pide enseñar todos los libros que el autor no sea Rosa Montero ni tenga menos de 400 páginas
*/
db.libros.find({
    $nor: [
        {
            Autor: "Rosa Montero"
        },
        {
            NºPáginas: {
                $lt: 400
            }
        }
    ]
})
/*
Se pide enseñar todos los libros de la editorial Suma y todos los libros que el autor sea Arturo Pérez Reverte
*/
db.libros.find({
    $or: [
        {
            Editorial: {
                $eq: "Suma"
            }
        },
        {
            Autor: "Arturo Pérez Reverte"
        }
    ]
})
/*
Se pide enseñar todos los libros que tengan de fecha de lanzamiento 2019
*/
db.libros.find({
    Fecha: {
        $regex: /2019$/
    }
})
/*
Se pide enseñar todos los libros que el autor empieze por Jav
*/
db.libros.find({
    Autor: {
        $regex: /^JAV/i
    }
})
/*
Se pide enseñar todos los libros que el título empieze por S
*/
db.libros.find({
    Título: {
        $regex: /S/
    }
})

/* 
Se pide enseñar los géneros que estén en el orden especificado
 */
db.libros.find({
    Géneros: [
        "Antropología",
        "Evolución"
    ]
})
/*
Se pide enseñar el libro en el que la primera letra de la autora sea M,
la editorial sea suma y uno de los géneros del libro contiene Fic
*/
db.libros.find({
    $and: [
        {
            Autor: {
                $regex: /^M/i
            }
        },
        {
            Editorial: {
                $eq: "Suma"
            }
        },
        {
            Géneros: {
                $regex: /^Fic/i
            }
        }
    ]
})



/*
Se pide enseñar todos los libros en los que la editorial sea Debolsillo
*/
db.libros.find({
    Editorial: {
        $eq: "Debolsillo"
    }
})
/*
Se pide enseñar todos los libros que tengan más de 600 páginas
*/
db.libros.find({
    NºPáginas: {
        $gt: 600
    }
})
/*
Se pide enseñar todos los libros que tengan 400 páginas o más
*/
db.libros.find({
    NºPáginas: {
        $gte: 400
    }
})
/*
Se pide enseñar todos los libros que el género contenga Ficción
*/
db.libros.find({
    Géneros: {
        $eq: "Ficción"
    }
})
/*
Se pide enseñar todos los libros que tengan menos de 300 páginas
*/
db.libros.find({
    NºPáginas: {
        $lt: 300
    }
})
/*
Se pide enseñar todos los libros que tengan 350 páginas o menos
*/
db.libros.find({
    NºPáginas: {
        $lte: 350
    }
})
/*
Se pide enseñar todos los libros que la editorial no sea Alfaguara
*/
db.libros.find({
    Editorial: {
        $ne: "Alfaguara"
    }
})

