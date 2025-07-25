

const firebird = require('node-firebird');
const fs = require('fs');

const dbPath= 'C:/bancotestelocal/bancolocalteste.fdb';
const options ={

host: 'localhost',
port: 3050,
database: dbPath,
user:'Admynsys',
password: 'Pref@23',
role: null,
pageSize:4096

};

if (fs.existsSync(dbPath)){
    console.log('ja existe');
}
else
{
firebird.create(options, function(err,db){
if(err) throw err;
console.log('banco criado');
db.detach();
});


}