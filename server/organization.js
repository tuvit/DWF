
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
 
app.get('/createOrg', function (req, res) {
	var url_parts = url.parse(req.url, true);
	var data = url_parts.query;
	
	if (!data.id || data.id == -1) {
	  createOrganization(req, data, function (err, data) {
		if (!err && data) {
		  var text = '';
		  text += data;
		  res.end(text);
		} else {
		  res.end('Unable to fetch data');
		}
	  });
	} else {
		updateOrganization(req, data, function(err, data) {
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

function createOrganization(req,data,cb) {
  pool.getConnection(function (err, connection) {
	var sql = 'select workflow.create_org(?, ?, ?, ?) as org_id;';
	console.log(sql);
    var text = '';
    connection.query(sql, [data.org_name , data.manager_id , data.analyst_id , data.create_user], function (err, rows) {
		if (rows.length) {
			rows.forEach(function (row) {	
				text += row.org_id;
				create_org_post_page(text, cb);
			});
		}
	});
	connection.end();
  });
}

function updateOrganization(req, data, cb) {
	pool.getConnection(function (err, connection) {
		var sql = 'select workflow.update_org(?, ?, ?, ?) as org_id;';
		console.log(sql + [data.id, data.org_name , data.manager_id , data.analyst_id]);
		var text = '';
		connection.query(sql, [data.id, data.org_name , data.manager_id , data.analyst_id], function (err, rows) {
			if (rows.length) {
				rows.forEach(function (row) {	
					text += data.id;
					create_org_post_page(data.id, cb);
				});
			}
		});
		connection.end();
	});
}

function create_org_post_page(id, cb)
{
	var text = '';
	pool.getConnection(function (err, connection) {
		var sql = 'SELECT name as org_name, manager ,analyst, active, create_user, date_format(create_date, \'%d/%l/%Y %H:%m\') as create_date FROM workflow.organization where id = \''+id+'\';';
		
		connection.query(sql,function (err, rows) {
				if (rows.length) {
					rows.forEach(function (row) {
						text += 'Oraganization Name:' + row.org_name + '<br>';
						text += 'Manager:' + row.manager + '<br>';
						text += 'Analyst:' + row.analyst + '<br>';
						text += 'active:' + row.active + '<br>';
						text += 'create user:' + row.create_user + '<br>';
						text += 'create date:' + row.create_date + '<br>';
						cb("", text);
					});
				}
		});
	});
	return text;
}

app.get('/showAllOrg', function (req, res, next) {
  showOrganizations(req, function (err, data) {
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

app.get('/getOrgList', function (req, res) {
  getOrgList(req, function (err, data) {
    if (!err && data) {
		console.log(JSON.stringify(data))
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(data));
    } else {
      res.end('Unable to fetch data');
    }
  })
});

function showOrganizations(req,cb) {
  pool.getConnection(function (err, connection) {
	var sql = 'SELECT org.id, org.name, mgr.id as mgr_id, CONCAT_WS(\' \',mgr.first_name,mgr.last_name) as mgr_name , CONCAT_WS(\' \',analyst.first_name,analyst.last_name) as analyst_name, analyst.id as analyst_id, act.value as act';
		sql +=' FROM organization org, contacts mgr, contacts analyst, actbool act';
		sql +=' where mgr.id = org.manager';
		sql +=' and analyst.id = org.analyst';
		sql +=' and act.id = org.active;';
	var data = req.body;
	var colums = '<tr><th>Name</th><th>Manager</th><th>Analyst</th><th>Active</th><th>Action</th></tr>'; 
	console.log(sql);
    var text = '';
	
	text += '<thead>'+colums+'</thead>';
	text += '<tfoot>'+colums+'</tfoot><tbody>';
    connection.query(sql, function (err, rows) {
		if (rows.length) {
			rows.forEach(function (row) {
				text += '<tr>';
				text += '<td>'+row.name+'</td>';
				text += '<td>'+row.mgr_name+'</td>';
				text += '<td>'+row.analyst_name+'</td>';
				text += '<td>'+row.act+'</td>';
				text += '<td><a href="#" onclick="editOrg(';
				text += row.id + ',\'' + row.name + '\',' + row.mgr_id + ',' + row.analyst_id;
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

app.get('/ShowTreeOrg', function (req, res, next) {
  ShowTreeOrg(req, function (err, data) {
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

function ShowTreeOrg(req,cb) {
  pool.getConnection(function (err, connection) {
	var sql = 'SELECT org.name as org';
		sql += ' FROM workflow.organization org';
		sql += ' where org.id = 8;';
	
	console.log(sql);
    var text = '';
    connection.query(sql, function (err, rows) {
		text += rows[0].org;
		cb(err, text);
		connection.end();
	});	
  });  
}

function getOrgList(req, cb) {
	pool.getConnection(function (err, connection) {
	var sql = 'SELECT org.id as id, org.name as org';
		sql += ' FROM workflow.organization org;';
	
	console.log(sql);
    var text = '';
    connection.query(sql, function (err, rows) {
	
		orgs = {'orgs': []}
		for (var i=0; i<rows.length; i++) {
			orgs['orgs'].push({'id': rows[i].id, 'name': rows[i].org})
		}
		cb(err, orgs);
		connection.end();
	});	
  });
}


app.get('/api/v1/organizations/tree', function (req, res) {
  getOrgTree(req, function (err, data) {
    if (!err && data) {
		console.log(JSON.stringify(data))
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(data));
    } else {
      res.end('Unable to fetch data');
    }
  })
});

function getOrgTree(req, cb) {
	var all_data = {"name": "system", children: []}
	
	pool.getConnection(function (err, connection) {
	var sql = "SELECT org.name as org, site.name as site, dept.name as dept, CONCAT_WS(' ',contact.first_name,contact.last_name) as contact\
		FROM organization org, sites site, depts dept, actbool act, contacts contact\
		WHERE dept.id = contact.dept AND act.id = contact.active AND org.id = site.organization AND site.id = dept.site AND act.value = 'active';";
	
	console.log(sql);
    var text = '';
	var order = ['org', 'site', 'dept', 'contact'];
    connection.query(sql, function (err, rows) {
		rows.forEach(function (row) {
			var index = all_data.children;
			order.forEach(function(item) {
				var location = -1;
				for (var i=0; i<index.length; i++) {
					if (row[item] == index[i].name) {
						location = i;
					}
				}
				if (location == -1) {
					location = index.length;
					index.push({"name": row[item], "size": 50, "children": []});
				}
				index = index[location].children;
			});
		});
		cb(err, all_data.children[0]);
		connection.end();
	});	
  });
}

