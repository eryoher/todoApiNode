const mysql = require('mysql');

connect = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'password',
  database:'todo'
});

let listModel = {};

listModel.getLists = (callback) => {
  if(connect){
    connect.query('SELECT * FROM lists ORDER By id DESC', (err, rows)=>{
      if(err){
        throw err;
      }else{
        callback(null, rows);
      }
    });
  }
}

listModel.addTodo = (data,callback) => {
  if(connect){
      connect.query('INSERT INTO lists SET ?' , data, (err, result) => {
        if(err){
          throw err;
        }else{
          //devolvemos la última id insertada
          callback(null,{"id" : result.insertId});
        }
      });
  }
}

listModel.updateTodo = (data,callback) => {
  var sql = 'UPDATE lists SET ';
  if(data.name){
   sql += ` name = ${connect.escape(data.name)}`;
  }
  if(data.checked != null){
   sql += `checked = ${connect.escape(data.checked)}`;
  }
  sql += ` WHERE id = ${data.id}`;

  if(connect){
    console.log(sql);
      connect.query(sql, data, (err, result) => {
        if(err){
          throw err;
        }else{
          //devolvemos la última id insertada
          callback(null,{"success" : true});
        }
      });
  }
}

listModel.deleteTodo = (id, callback) => {
  if(connect){
    connect.query(`DELETE FROM lists WHERE id = ${connect.escape(id)}`, (err, res)=>{
      if(err){
        throw err;
      }else{
        callback(null, {"success" : true});
      }
    });
  }
}

listModel.completeAllTodo = (checked, callback) => {
  var update = (checked) ? 0 : 1;
  if(connect){
    connect.query(`UPDATE lists SET checked = ${checked} WHERE checked = ${update}`, (err, res)=>{
      if(err){
        throw err;
      }else{
        callback(null, {"success" : true});
      }
    });
  }
}

listModel.deleteAllTodo = (checked, callback) => {
  var update = (checked) ? 0 : 1;
  if(connect){
    connect.query(`DELETE FROM lists WHERE checked = ${checked}`, (err, res)=>{
      if(err){
        throw err;
      }else{
        callback(null, {"success" : true});
      }
    });
  }
}

module.exports = listModel;
