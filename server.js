const express = require("express");
const app = express();
const mongoose = require('mongoose');


const AnimalSchema = new mongoose.Schema({
    kingdom:  {type: String},
    genus:  String,
    species: String,
    gender: String,
    age: Number,
    },
   {timestamps: true})  
    const Animal = mongoose.model('Animal', AnimalSchema);


mongoose.connect('mongodb://localhost/animals', {useNewUrlParser: true});

app.use(express.static(__dirname + "/static"));
app.use(express.urlencoded({extended: true})); //add this to cheat sheet 

app.get('/', (req, res) => {
    Animal.find()
        .then(animals => {
            console.log(animals)
            res.render("index", {animals:animals})})
        .catch (err => res.json(err));
    });

app.get('/animal', (req, res) => {res.render('index')});

app.get('/animal/new', (req, res) => {res.render('new')});

app.get('/animal/edit/:id', (req, res)=> {
    Animal.findById(req.params.id)
        .then(_animal => {
            res.render("edit", {animal:_animal})
        }
            )
        .catch (err => res.json(err));
    });

    app.get('/animal/delete/:id', (req, res) => {
        console.log('*'.repeat(20),'reached delete method',"*".repeat(20));
        console.log('*'.repeat(20), req.params ,"*".repeat(20))
        Animal.remove({_id: req.params.id})
        .then (deletedAnimal =>{
            res.redirect('/');
            })
            .catch(err => res.json(err));
        });

app.get('/animal/:id', (req, res) => {res.render('detail')});

app.post('/animal/add', (req, res) => {
    const animal = new Animal()
    animal.kingdom=req.body.kingdom;
    animal.genus=req.body.genus;
    animal.species=req.body.species;
    animal.gender=req.body.gender;
    animal.age=req.body.age;
    animal.save()
        .then (newAnimal =>{
        console.log(newAnimal);
        res.redirect('/');
    })
        .catch (err => res.json(err));
});

app.post('/animal/update/:id', (req, res) => {
    console.log('*'.repeat(20),'reached Update method',"*".repeat(20));
    Animal.update({_id: req.params.id}, {
            kingdom: req.body.kingdom,
            genus: req.body.genus,
            species: req.body.species,
            gender: req.body.gender,
            age:req.body.age,
        //     $push: {pets: {name: 'Sprinkles', type: 'Chubby Unicorn' }}
    },{multi:true})
        .then(result => {res.redirect('/')})
        .catch(err => {res.json(err)})})
    

app.post('/animal/:id', (req, res) => {
});


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.listen(8008, () => console.log("listening on port 8008"));