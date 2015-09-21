
/* 
 * Create By: 	Roy Barnaes
 * Create Date: 18/03/2015
 * Description: This js configure all the function on organization table
 *
 */

/*
 * Create new organization
 * Get: organization name   - Text
 *		manager_id			- Number
 *		analyst_id			- Number
 *		create_user 		- Number
 *
 */
 
app.get('/createUser', function (req, res) {
  var url_parts = url.parse(req.url, true);
  var data = url_parts.query;

  if (!data.id || data.id == -1) {
	  createUser(req, data, function (err, data) {
		if (!err && data) {
		  var text = '';
		  text += data;
		  res.end(text);
		} else {
		  res.end('Unable to fetch data');
		}
	});
  } else {
	  updateUser(req, data, function (err, data) {
  	  if (!err && data) {
	    var text = '';
	    text += data;
	    res.end(text);
	  } else {
	    res.end('Unable to fetch data');
	  }
	});
  }
});

function createUser(req,data,cb) {
  pool.getConnection(function (err, connection) {
	var sql = 'select workflow.create_contact(?, ?, ?, ?, ?, ?, ?) as contact;';
	
	console.log(sql);
    var text = '';
	var bb = [data.first_name , data.last_name , data.phone , data.other_phone, data.email, data.dept, data.contact_id]
	console.log(bb);				
    connection.query(sql, [data.first_name , data.last_name , data.phone , data.other_phone, data.email, data.dept, data.contact_id], function (err, rows) {
		if (rows.length) {
			rows.forEach(function (row) {	
				text += row.contact;
				create_contact_post_page(text, cb);
			});
		}
	});
	
	connection.end();
    
  });
}

function updateUser(req,data,cb) {
  pool.getConnection(function (err, connection) {
	var sql = 'select workflow.update_contact(?, ?, ?, ?, ?, ?) as contact;';
	
	console.log(sql);
    var text = '';
	var bb = [data.id, data.first_name , data.last_name , data.phone, data.email, data.dept]
	console.log(bb);				
    connection.query(sql, bb, function (err, rows) {
		if (rows.length) {
			rows.forEach(function (row) {	
				text += row.contact;
				create_contact_post_page(text, cb);
			});
		}
	});
	
	connection.end();
    
  });
}


function create_contact_post_page(id, cb)
{
	var text = '';
	pool.getConnection(function (err, connection) {
		var sql = 'SELECT first_name, last_name, phone, other_phone, email, dept, active, date_format(create_date, \'%d/%l/%Y %H:%m\') as create_date, last_update_user, contact_id FROM workflow.contacts where id = \''+id+'\';';
		console.log(sql);
		connection.query(sql,function (err, rows) {
				if (rows.length) {
					rows.forEach(function (row) {
						text += 'first name: ' + row.first_name + '<br>';
						text += 'last name: ' + row.last_name + '<br>';
						text += 'phone: ' + row.phone + '<br>';
						text += 'other phone: ' + row.other_phone + '<br>';
						text += 'email: ' + row.email + '<br>';
						text += 'dept: ' + row.dept + '<br>';
						text += 'active: ' + row.active + '<br>';
						text += 'create date: ' + row.create_date + '<br>';
						text += 'last update date: ' + row.last_update_user + '<br>';
						text += 'worker id: ' + row.contact_id + '<br>';
						cb("", text);
					});
				}
		});
	});
	return text;
}

app.get('/showAllContacts', function (req, res, next) {
  showContacts(req, 'html', function (err, data) {
    if (!err && data) {
      var text = '';
	  text += '<table id="example" class="display" cellspacing="0" width="100%">';
      text += data;
	  text += '</table>';
      res.end(text);
    } else {
      res.end('Unable to fetch data');
    }
  })
});

app.get('/api/v1/contacts', function (req, res, next) {
	showContacts(req, 'json', function (err, data) {
		if (!err && data) {
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(data));
		} else {
			res.send('{"error": "unable to retrieve contacts"}');
		}
	});
});

function showContacts(req, format, cb) {
  pool.getConnection(function (err, connection) {		
	var sql = 'SELECT con.id as id, CONCAT_WS(\' \',con.first_name,con.last_name) as con_name, con.first_name as first_name, con.last_name as last_name, con.phone, con.email, dep.name as dept, dep.id as dept_id, act.value as act, CONCAT_WS(\' \',mgr.first_name,mgr.last_name) as mgr_name';
		sql +=' FROM contacts con, depts dep, actbool act, contacts mgr';
		sql +=' WHERE dep.id = con.dept';
		sql +=' AND act.id = con.active';
		sql +=' AND dep.manager = mgr.id;';
		
		
	var data = req.body;
	var colums = '<tr><th>Name</th><th>Phone</th><th>Email</th><th>Manager</th><th>Dept</th><th>Active</th><th>Action</th></tr>'; 
	console.log(sql);
    connection.query(sql, function (err, rows) {
		
		if (format == 'html') {
			var text = '';
			text += '<thead>'+colums+'</thead>';
			text += '<tfoot>'+colums+'</tfoot><tbody>';
			if (rows.length) {
				rows.forEach(function (row) {
					text += '<tr>';
					text += '<td>'+row.con_name+'</td>';
					text += '<td>'+row.phone+'</td>';
					text += '<td>'+row.email+'</td>';
					text += '<td>'+row.mgr_name+'</td>';
					text += '<td>'+row.dept+'</td>';
					text += '<td>'+row.act+'</td>';
					text += '<td><a href="#" onclick="editContact(';
					text += row.id + ',\'' + row.first_name + '\',\'' + row.last_name + '\',\'' + row.phone + '\',\'' + row.email + '\',' + row.dept_id;
					text += ');return false;">edit</a></td>';
					text += '</tr>';
				});
			}
			text += '</tbody>';
			cb(err, text);
		} else {
			data = {'contacts': {
				
			}};
			if (rows.length) {
				rows.forEach(function (row) {
					data['contacts'][row.id] = {'name': row.con_name};
				});
			}
			cb(err, data);
		}
		connection.end();
	});	
  });
}