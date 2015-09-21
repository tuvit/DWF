app.get('/Login', function (req, res) {
  LoginProperty(req, function (err, data) {
    if (!err && data) {
	  var path = 'http://localhost/dynamicform/organization.html?sessionId='+data;
	  res.writeHead(302, {'Location': path});
      res.end();
    } else {
	  var path = 'http://localhost/dynamicform/index.html?conect=no';
	  res.writeHead(302, {'Location': path});
      res.end();
    }
  })
});

function LoginProperty(req,cb) {
  pool.getConnection(function (err, connection) {
	var url_parts = url.parse(req.url, true);
	var data = url_parts.query;
	var sql = 'SELECT id FROM workflow.contacts con';
		sql += ' WHERE con.email = ?';
		sql += ' and con.pass = ?;';	
	
	console.log(sql);
    var text = '';
    connection.query(sql, [data.login , data.password], function (err, rows) {
		if (rows.length == 1) {
			text += rows[0].id;
		}
		cb(err, text);
		connection.end();
	});
  });
}