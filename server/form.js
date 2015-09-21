app.post('/createForm', function (req, res) {
  createForm(req, function (err, data) {
    if (!err && data) {
      var text = '';
      text += data;
      res.end(text);
    } else {
      res.end('Unable to fetch data');
    }
  })
});


function createForm(req,cb) {
  pool.getConnection(function (err, connection) {
	var sql = 'select workflow.create_form(?,?,?,?,?,?) as formId;';
	var data = req.body;
	
	console.log(data);
	console.log(sql);
    var text = '';
    connection.query(sql, [data.title , data.label , data.description , data.submit_text , data.redirect_url , data.conditionLogic], function (err, rows) {
      if (rows.length) {
        rows.forEach(function (row) {
			text += row.formId;
			console.log(text);
        });
		sql = '';
		sql = 'select workflow.create_column(?, ?, \''+ text +'\', ?, ?, ?, ?, ?, ?, ?, ?, ?);';
		var seq = 100;
		data.fields.forEach(function (field){
			connection.query(sql, [field.type , field.title , field.label , field.required , field.error_message , field.maxlength, field.datasource, field.visible, field.date_formet, field.time_required, seq], function (err, rows) {
			});
			console.log('seq:' + seq + ' ' +sql);
			seq = seq + 100;
		});
      }
      cb(err, text);
      connection.end();
    });
  });
}

app.get('/showForm/:id', function (req, res) {
  showForm(req, function (err, data) {
    if (!err && data) {
      var text = '<!DOCTYPE html><html><body>';
      text += data;
	  text += '</body></html>';
      res.end(text);
    } else {
      res.end('Unable to fetch data');
    }
  })
});

function showForm(req,cb) {
  pool.getConnection(function (err, connection) {
	var sql = 'SELECT c.* , f.title as ftitle, f.submit_text';
		sql += ' FROM workflow.columns c, workflow.form f';
		sql += ' where c.form_id = (SELECT form_id FROM workflow.change_order WHERE id = ?)';
		sql += ' and f.id = c.form_id';
		sql += ' order by c.seq;';

	
	var data = req.params.id;
	
	console.log(sql);
    var text = '';
    connection.query(sql, data, function (err, rows) {
      if (rows.length) {
		text += rows[0].ftitle;		  
		text += '<br><br><form method="post" action="http://localhost:8080/commitForm">';
        rows.forEach(function (row) {
			if(row.title != 'Button'){
				text += '<label>' + row.label + '</label><br>';
			}
			if(row.title != 'Button'){
				text += '<input type="'+row.title+'" name="'+row.id+'"';
				if(row.required == 1)
					text += 'required';
				text += '><br>';
			}else{
				text += '<input type="hidden" name="chgId" value="'+data+'">';
				text += '<br><br><input type="submit" name="Button" value="'+row.submit_text+'">';
			}
        });
		text += '</form>';
      }
      cb(err, text);
      connection.end();
    });
  });
}

app.post('/commitForm', function (req, res) {
	var data = req.body;
		
	sql = 'call workflow.confirm_chg(?);';	
	pool.getConnection(function (err, connection) {
		connection.query(sql, data.chgId, function (err, rows) {	
			sql = 'INSERT INTO `workflow`.`columns_values` (`column_id`, `column_value`, `chg_id`) VALUES (?,?,?);';
			for(var key in data) {
				var value = data[key];
				if(key != 'chgId' && key != 'Button'){
					var params = [key ,value ,data.chgId];
					console.log(sql + ' ' + params);
					connection.query(sql, params, function (err, rows) {
					});					
				}
			}
		});
		connection.end();
    });
	
  res.end("i got your form!");
  
});

app.get('/api/v1/forms', function (req, res) {
  getFormList(req, function (err, data) {
    if (!err && data) {
		console.log(JSON.stringify(data))
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(data));
    } else {
      res.end('Unable to fetch data');
    }
  })
});

function getFormList(req, cb) {
	pool.getConnection(function (err, connection) {
	var sql = 'SELECT form.id as id, form.lable as title';
		sql += ' FROM workflow.form form WHERE active=1;';
	
	console.log(sql);
    var text = '';
    connection.query(sql, function (err, rows) {
	
		form = {'forms': []}
		for (var i=0; i<rows.length; i++) {
			form['forms'].push({'id': rows[i].id, 'title': rows[i].title})
		}
		cb(err, form);
		connection.end();
	});	
  });
}

