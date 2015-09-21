
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
 
app.get('/createSite', function (req, res) {
  var url_parts = url.parse(req.url, true);
	var data = url_parts.query;
	console.log("------>" + data.id);
	if (!data.id || data.id == -1) {
	  createSite(req, data, function (err, data) {
		if (!err && data) {
		  var text = '';
		  text += data;
		  res.end(text);
		} else {
		  res.end('Unable to fetch data');
		}
	  });
    } else {
		updateSite(req, data, function (err, data) {
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

function createSite(req,data,cb) {
  pool.getConnection(function (err, connection) {
	var sql = 'select workflow.create_site(?, ?, ?, ?) as site_id;';
	console.log(sql);
    var text = '';
    connection.query(sql, [data.site_name , data.manager_id , data.organization_id , data.create_user], function (err, rows) {
		if (rows.length) {
			rows.forEach(function (row) {	
				text += row.site_id;
				create_site_post_page(text, cb);
			});
		}
	});
	
	connection.end();
    
  });
}

function updateSite(req,data,cb) {
  pool.getConnection(function (err, connection) {
	var sql = 'select workflow.update_site(?, ?, ?, ?) as site_id;';
	console.log(sql + [data.id, data.site_name , data.manager_id , data.organization_id]);
    var text = '';
    connection.query(sql, [data.id, data.site_name , data.manager_id , data.organization_id], function (err, rows) {
		if (rows.length) {
			rows.forEach(function (row) {	
				text += row.site_id;
				create_site_post_page(text, cb);
			});
		}
	});
	
	connection.end();
    
  });
}


function create_site_post_page(id, cb)
{
	var text = '';
	pool.getConnection(function (err, connection) {
		var sql = 'SELECT name as site_name, manager, organization, active, date_format(create_date, \'%d/%l/%Y %H:%m\') as create_date, create_user FROM workflow.sites where id = \''+id+'\';';
		console.log(sql);
		connection.query(sql,function (err, rows) {
				if (rows.length) {
					rows.forEach(function (row) {
						text += 'Site Name: ' + row.site_name + '<br>';
						text += 'manager: ' + row.manager + '<br>';
						text += 'organization: ' + row.organization + '<br>';
						text += 'active: ' + row.active + '<br>';
						text += 'create data: ' + row.create_date + '<br>';
						text += 'create user: ' + row.create_user + '<br>';
						cb("", text);
					});
				}
		});
	});
	return text;
}

app.get('/showAllSite', function (req, res, next) {
  showSites(req, function (err, data) {
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

app.get('/getSitesList', function (req, res) {
  getSitesList(req, function (err, data) {
    if (!err && data) {
		console.log(JSON.stringify(data))
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(data));
    } else {
      res.end('Unable to fetch data');
    }
  })
});

function showSites(req,cb) {
  pool.getConnection(function (err, connection) {
	var sql = 'SELECT sit.id as site_id, sit.name as s_name, CONCAT_WS(\' \',mgr.first_name,mgr.last_name) as mgr_name, mgr.id as mgr_id, act.value as act, org.name as o_name, org.id as org_id';
		sql +=' FROM workflow.sites sit, contacts mgr, actbool act, organization org';
		sql +=' where mgr.id = sit.manager';
		sql +=' and act.id = sit.active';
		sql +=' and org.id = sit.organization;';
		
	var data = req.body;
	var colums = '<tr><th>Name</th><th>Manager</th><th>Organization</th><th>Active</th><th>Action</th></tr>'; 
	console.log(sql);
    var text = '';
	
	text += '<thead>'+colums+'</thead>';
	text += '<tfoot>'+colums+'</tfoot><tbody>';
    connection.query(sql, function (err, rows) {
		if (rows.length) {
			rows.forEach(function (row) {
				text += '<tr>';
				text += '<td>'+row.s_name+'</td>';
				text += '<td>'+row.mgr_name+'</td>';
				text += '<td>'+row.o_name+'</td>';
				text += '<td>'+row.act+'</td>';
				text += '<td><a href="#" onclick="editSite(';
				text += row.site_id + ',\'' + row.s_name + '\',' + row.mgr_id + ',' + row.org_id;
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

app.get('/ShowTreeSite', function (req, res, next) {
  ShowTreeSite(req, function (err, data) {
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

function ShowTreeSite(req,cb) {
  pool.getConnection(function (err, connection) {
	var sql = 'SELECT name as siteName, id'
		sql += ' FROM workflow.sites site'
		sql += ' where site.organization = ?;';
	
	var url_parts = url.parse(req.url, true);
	var data = url_parts.query;
	
	console.log(sql);
    var text = '';
    connection.query(sql, data.org_id, function (err, rows) {
		if (rows.length) {
			var counter = 0;
			rows.forEach(function (row) {
				text += 'id: "'+ row.id + '",';
				text += 'name: "'+ row.siteName + '"';
				counter++;
				if (counter != rows.length){
					text += ',';
				}
			});
		}
		cb(err, text);
		connection.end();
	});	
  });
}

function getSitesList(req, cb) {
	pool.getConnection(function (err, connection) {
	var sql = 'SELECT sites.id as id, sites.name as name';
		sql += ' FROM workflow.sites sites;';
	
	console.log(sql);
    var text = '';
    connection.query(sql, function (err, rows) {
	
		sites = {'sites': []}
		for (var i=0; i<rows.length; i++) {
			sites['sites'].push({'id': rows[i].id, 'name': rows[i].name})
		}
		cb(err, sites);
		connection.end();
	});	
  });
}
