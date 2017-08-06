var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cons = require('consolidate'),
    dust = require('dustjs-helpers'),
    pg = require('pg'),
    //Pool = require('pg-pool'),
    app = express();
    dbConfig = require('./config/db');
    db = require('./db_connection');
    session = require('express-session')


//Assign Dust Engine to .dust Files
app.engine('dust',cons.dust);
//Set deg Ext .dust
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

//Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
//var db = pgp('postgres://eduonix:123456@localhost:5432/recipebookdb');
/*console.log('======>', db);*/

app.get('/', function(req, res){

    console.log('======>', db);
    //Set deg Ext .dust
    db.any('SELECT * FROM recipes', [true])
    .then(function(data){
        res.render('index', {recipes: data});
        console.log(data);
    })
    .catch(function(err){
        console.log('Ошибка----->', err);
    });
    /*pg.connect(connect, function(err, client, done){
       if(err){
           return console.error('err fetching client from pool', err);
       }
       client.query('SELECT * FROM recipes', function(err, result){
           if(err){
               return console.error('error running query', err)
           }

           res.render('index', {recipes: result.rows});
           done();
       });
   });*/
});
app.post('/add', function(req, res){
    /*pg.connect(connect, function(err, client, done){
        if(err){
            return console.error('err fetching client from pool', err);
        }
        client.query('INSERT INTO recipes(name,ingredients,direction) VALUES ($1,$2,$3)',[req.body.name,req.body.ingredients,req.body.direction]);
            done();
            res.redirect('/');


    });*/
    db.none('INSERT INTO recipes (name,ingredients,direction) VALUES ($1,$2,$3)',
        [req.body.name,
         req.body.ingredients,
         req.body.direction]
    )
    .then(() => {
            console.log('Успешно додана запись!')
        res.redirect('/');
    })
    .catch(error => {
        console.log(error);
    });
});
app.delete('/delete/:id', function(req, res){
   /* pg.connect(connect, function(err, client, done){
        if(err){
            return console.error('err fetching client from pool', err);
        }
        client.query('DELETE FROM recipes WHERE id=$1',[req.params.id]);
        done();
        res.sendStatus(200);


    });*/
    db.any('DELETE FROM recipes WHERE id=$1',[req.params.id])
    .then(() => {
            console.log('Запись успешно удалена');
            res.sendStatus(200);
    })
    .catch(error => {
        console.log(error);
    });
});
app.post('/edit', function(req, res){
    /*pg.connect(connect, function(err, client, done){
        if(err){
            return console.error('err fetching client from pool', err);
        }
        client.query('UPDATE recipes SET name=$1, ingredients=$2, direction=$3  WHERE id=$4',[req.body.name, req.body.ingredients, req.body.direction, req.body.id]);
        done();
        res.redirect('/');


    });*/
    db.any('UPDATE recipes SET name=$1, ingredients=$2, direction=$3  WHERE id=$4',[req.body.name, req.body.ingredients, req.body.direction, req.body.id])
    .then(()=>{
           console.log('Запись успешно изменена');
            res.redirect('/');
    })
    .catch(error => {
        console.log('Ошибка при редактировании =====>', error);
    })
});
//Server
app.listen(dbConfig.server_port, function(req, res){
    console.log('Server Started On Port 3000');
});