//importanto do express 
//tudo que o express importa vai esta na variavel const express
const express = require('express');

//instaciar a função express no server
const server = express();

//O use é como fosse instalar um plugin(ou modulo) no express
//nesse caso estamo dizendo pro express pra ele ler json no corpo da requisição
server.use(express.json());

const users = ['joao', 'taina grana', 'vanja']

//Middleware global
server.use((req, res, next) =>{
  console.time('Request');
  console.log(`Metodo: ${req.method}; URL: ${req.url}`);
  
  next();

  console.timeEnd('Request')
});
//middleware que verifica se a requisição ta passando um name
function checkUserExists(req, res, next) {
  if(!req.body.name) {
    return res.status(400).json({ error: "User name is required"})
  }

  return next();
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];

  if(!user){
    return res.status(400).json({ error: "User does not exists"});
  }
  req.user = user;

  return next();
}

server.get('/users' ,(req, res) => {
    return res.json(users);
})

server.get('/users/:index',checkUserInArray ,(req, res) => {

  return res.json(req.user);
})

server.post('/users',checkUserExists,(req, res) => {
  const { name } = req.body;

  users.push(name);

  res.json(users);
});

server.put('/users/:index',checkUserExists ,checkUserInArray ,(req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;
  
  return res.json(users);
});

server.delete('/users/:index',checkUserInArray ,(req, res) =>{
  const { index } = req.params;
  users.splice(index , 1);

  return res.send();
});

//para ouvir um porta, nesse caso a 3000 no localhost
server.listen(3000);
