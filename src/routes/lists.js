const lists = require('../models/lists');

module.exports = function(app){

  app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
  });

  app.get('/lists', (req, res)=>{
    lists.getLists((err, data)=>{
      res.json({lists : data, 'success' : true});
    });
  });

  app.post('/lists', (req, res) => {
    const data = {
      id : null,
      name : req.body.name,
      checked: false,
      created : null,
      modified: null
    };
    lists.addTodo( data, (err, data) => {
        if(data && data.id){
          res.json({
            success : true,
            message : "The todo List was created"
          });
        }else{
          res.status(500).json({
            success : false,
            message : err
          })
        }
    });
  });

  app.post('/lists/delete/:id', (req, res) => {
    var id = req.params.id
    lists.deleteTodo( id, (err, data) => {
        if(data && data.success){
          res.json({
            success : true,
            message : "The todo List was removed"
          });
        }else{
          res.status(500).json({
            success : false,
            message : err
          })
        }
    });
  });

  app.post("/lists/edit/:id", function(req, res){
      var id = req.params.id;
      const data = {
        id : req.params.id,
        name : (req.body.name != undefined) ? req.body.name : null,
        checked: (req.body.checked != undefined) ? req.body.checked : null,
        created : null,
        modified: null
      };
      //solo actualizamos si la id es un número
      console.log(data);
      if(!isNaN(id)){
        lists.updateTodo(data,function(error, result){
        //si existe el usuario mostramos el formulario
        if (result && result.success){
          res.json({ "message": "The list has been saved.", "success": true });
        }else{
          res.json(404,{"message":"The Todo does exists"});
        }
        });
      }else{
        res.json(500,{"msg":"The id must be numeric"});
      }
  });

  app.post('/lists/updateAll', (req, res) => {
    var checked = req.body.checked;
    lists.completeAllTodo( checked, (err, data) => {
        if(data && data.success){
          res.json({
            success : true,
            message : "The todo List are updated"
          });
        }else{
          res.status(500).json({
            success : false,
            message : err
          })
        }
    });
  });

  app.post('/lists/deleteAll', (req, res) => {
    var checked = req.body.checked;
    lists.deleteAllTodo( checked, (err, data) => {
        if(data && data.success){
          res.json({
            success : true,
            message : "The todo List are removed"
          });
        }else{
          res.status(500).json({
            success : false,
            message : err
          })
        }
    });
  });
}
