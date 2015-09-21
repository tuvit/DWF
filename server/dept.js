
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
 
app.get('/createDept', function (req, res) {
  var url_parts = url.parse(req.url, true);
  var data = url_parts.query;
  console.log('----->' + data.id);
  if (!data.id || data.id == -1) {
	  createDept(req, data, function (err, data) {
		if (!err && data) {
		  var text = '';
		  text += data;
		  res.end(text);
		} else {
		  res.end('Unable to fetch data');
		}
	  });
  } else {
	  updateDept(req, data, function (err, data) {
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

function createDept(req,data,cb) {
  pool.getConnection(function (err, connection) {
	var sql = 'select workflow.create_dept(?, ?, ?, ?) as dept_id;';	
	
	console.log(sql);
    var text = '';
    connection.query(sql, [data.dept_name , data.manager_id , data.site_id , data.create_user], function (err, rows) {
		if (rows.length) {
			rows.forEach(function (row) {	
				text += row.dept_id;
				create_dept_post_page(text, cb);
			});
		}
	});
	
	connection.end();
    
  });
}

function updateDept(req,data,cb) {
  pool.getConnection(function (err, connection) {
	var sql = 'select workflow.update_dept(?, ?, ?, ?) as dept_id;';	
	
	console.log(sql);
    var text = '';
    connection.query(sql, [data.id, data.dept_name , data.manager_id , data.site_id], function (err, rows) {
		if (rows.length) {
			rows.forEach(function (row) {	
				text += row.dept_id;
				create_dept_post_page(text, cb);
			});
		}
	});
	
	connection.end();
    
  });
}

function create_dept_post_page(id, cb)
{
	var text = '';
	pool.getConnection(function (err, connection) {
		var sql = 'SELECT name as dept_name, manager, site, active, date_format(create_date, \'%d/%l/%Y %H:%m\') as create_date, create_user FROM workflow.depts where id = \''+id+'\';';
		console.log(sql);
		connection.query(sql,function (err, rows) {
				if (rows.length) {
					rows.forEach(function (row) {
						text += 'dept name: ' + row.dept_name + '<br>';
						text += 'manager: ' + row.manager + '<br>';
						text += 'site id: ' + row.site + '<br>';
						text += 'active: ' + row.active + '<br>';
						text += 'create date: ' + row.create_date + '<br>';
						text += 'create user: ' + row.create_user + '<br>';
						cb("", text);
					});
				}
		});
	});
	return text;
}

app.get('/showAllDepts', function (req, res, next) {
  showDepts(req, function (err, data) {
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

app.get('/getDeptsList', function (req, res) {
  getDeptsList(req, function (err, data) {
    if (!err && data) {
		console.log(JSON.stringify(data))
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(data));
    } else {
      res.end('Unable to fetch data');
    }
  })
});

function showDepts(req,cb) {
  pool.getConnection(function (err, connection) {		
	var sql = 'SELECT dep.id as d_id, dep.name as d_name, CONCAT_WS(\' \',mgr.first_name,mgr.last_name) as mgr_name, mgr.id as mgr_id, sit.id as site_id, sit.name as s_name, act.value as act';
		sql +=' FROM depts dep, contacts mgr, sites sit, actbool act';
		sql +=' WHERE mgr.id = dep.manager';
		sql +=' AND sit.id = dep.site';
		sql +=' AND act.id = dep.active;';
		
		
	var data = req.body;
	var colums = '<tr><th>Name</th><th>Manager</th><th>Site</th><th>Active</th><th>Action</th></tr>'; 
	console.log(sql);
    var text = '';
	
	text += '<thead>'+colums+'</thead>';
	text += '<tfoot>'+colums+'</tfoot><tbody>';
    connection.query(sql, function (err, rows) {
		if (rows.length) {
			rows.forEach(function (row) {
				text += '<tr>';
				text += '<td>'+row.d_name+'</td>';
				text += '<td>'+row.mgr_name+'</td>';
				text += '<td>'+row.s_name+'</td>';
				text += '<td>'+row.act+'</td>';
				text += '<td><a href="#" onclick="editDept(';
				text += row.d_id + ',\'' + row.d_name + '\',' + row.mgr_id + ',' + row.site_id;
				text += ');return false;">edit</a></td>';
				text += '</tr>';
			});
		}
		text += '</tbody>';
		cb(err, text);
		connection.end();
	});	
  });
}

app.get('/ShowTreeDept', function (req, res, next) {
  ShowTreeDept(req, function (err, data) {
    if (!err && data) {
      var text = '';
      text += data;
	  //res.write(JSON.stringify(data));
      res.end(text);
    } else {
      res.end('Unable to fetch data');
    }
  })
});

function ShowTreeDept(req,cb) {
  pool.getConnection(function (err, connection) {
	var sql = 'SELECT name as dept_name ';
		sql += ' FROM workflow.depts';
		sql += ' where site = ?';
	
	var url_parts = url.parse(req.url, true);
	var data = url_parts.query;
	
	console.log(sql);
    var text = '';
    connection.query(sql, data.site_id ,function (err, rows) {
		if (rows.length) {
			var counter = 0;
			rows.forEach(function (row) {
				text += '"'+ row.dept_name + '"';
				counter++;
				if (counter != rows.length){
					text += ',';
				}
			});
		}
		console.log(text);
		cb(err, text);
		connection.end();
	});	
  });
 }
  
  function getDeptsList(req, cb) {
	pool.getConnection(function (err, connection) {
	var sql = 'SELECT depts.id as id, depts.name as name';
		sql += ' FROM workflow.depts depts;';
	
	console.log(sql);
    var text = '';
    connection.query(sql, function (err, rows) {
	
		depts = {'depts': []}
		for (var i=0; i<rows.length; i++) {
			depts['depts'].push({'id': rows[i].id, 'name': rows[i].name})
		}
		cb(err, depts);
		connection.end();
	});	
  });
}

