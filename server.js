const express = require('express'); 
const passport = require('passport'); //libreria de autenticacion de usuarios de passport 
const cokieParser = require('cookie-parser'); //libreria para manejar cookies
const session = require('express-session'); //libreria para manejar sesiones
const passportlocal = require('passport-local').Strategy; //libreria para autenticacion de usuarios, clase Strategy para passport  

const app = express();

app.use(express.urlencoded({extended:true})); //para que se puedan enviar datos por post, leer los datos del formulario, middleware 

app.use(cokieParser('secreto')); //para que se puedan manejar cookies, lo mínimo es enviarle un secreto al iniciar la sesion 

app.use(session({
    secret: 'secreto',
    resave: true, //comportamiento de las sessiones
    saveUninitialized: true //guarde el inicio de sesion de un usuario 

})); 

app.use(passport.initialize()); //inicializa passport
app.use(passport.session()); //para que se puedan manejar sesiones

passport.use(new passportlocal(function(username,password,done){ //enviar el resultado del proceso de autenticación a passport 
    if(username == 'admin' && password == 'admin')
        return done(null,{id:1, name:"cody"}); //si el usuario y contraseña son correctos, se devuelve un objeto con el usuario
    
    done(null,false); //si el usuario y contraseña no son correctos, se devuelve un objeto con false
    
})); //para que se puedan autenticar usuarios

//serialiacion
passport.serializeUser(function(user,done){ //función que recibe al usuario, coincide con el objeto que se devuelve en la función anterior 
    done(null,user.id); //se guarda el usuario en la sesion, no hubo error al iniciar sesión para este caso 
}) //para que se puedan serializar los usuarios

//deserializacion 
passport.deserializeUser(function(id,done){//id de usuario y funcion done
    done(null,{ id:1,  name:"cody"}); //se devuelve un objeto con el usuario, error y usuario completo 
}) //funcion a deserializar el usuario para que se pueda guardar en la sesion 

app.set('view engine', 'ejs'); //motor de vista 

app.get("/",(req,res)=>{
    //inicios de sesion de usuario en la base de datos de la aplicacion
})

app.get("/login",(req,res)=>{
    res.render("login"); //nombre de la vista, debe coincidir con el nombre del archivo ejs en la carpeta views 
})

//recibir nueva vista de inicio de sesion 
app.post("/login",passport.authenticate('local',{ //para que se puedan autenticar usuarios, passport.authenticate es un middleware 
    
    successRedirect:'/', //si el usuario es correcto, se redirige a la pagina principal
    failureRedirect:'/login' //si el usuario es incorrecto, se redirige a la pagina de inicio de sesion
    
})); //para que se puedan autenticar usuarios



app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});