app.post('/createFlow', function (req, res) {
  createWF(req, function (err, data) {
    if (!err && data) {
      var text = '';
      text += data;
      res.end(text);
    } else {
      res.end('Unable to fetch data');
    }
  })
});

function createWF(req,cb) {
  pool.getConnection(function (err, connection) {
	var sql = 'select workflow.create_workflow(?,?,?,?,?) as formId;';
	var data = req.body;
	
	console.log(sql);
    var text = '';
	// 16 and 8 need to change
    connection.query(sql, [data.label ,'16' ,'8' ,data.description,'1' ], function (err, rows) {
      if (rows.length) {
        rows.forEach(function (row) {
			text += row.formId;
        });
		sql = '';
		sql = 'select workflow.create_chg(?,?,?,?,?,?,?,?,?);';
		var seq = 100;
		var status_chg = 5;
		var flag = 1;
		data.fields.forEach(function (field){
			if(field.id != 'save_button')
			{
				//console.log(field.label);
				//when i create an form i need to update him to send the mail to the opener user
				
				if(field.label == 'Form_Field'){
					var params = [text, field.label, status_chg, seq, field.required, '8', '1', '', field.maxlength];
				}else if(field.label == 'Timer_Notification'){
					var params = [text, field.label, status_chg, seq, field.required, '8', '1', field.maxlength, ''];
				}else{
					var params = [text, field.label, status_chg, seq, field.required, field.maxlength, '1', '', ''];
				}
				
				if(flag == 1){
					connection.query(sql, params, function (err, rows) {});
					flag = 0;
					status_chg = 4;
				}else{
					connection.query(sql, params, function (err, rows) {});					
				}
				console.log('seq:' + seq + ' ' +sql);
				seq = seq + 100;
			}
		});
      }
      cb(err, text);
      connection.end();
    });
  });
}

app.get('/startFlow', function (req, res) {
  startWF(req, function (err, data) {
    if (!err && data) {
      var text = '';
      text += data;
      res.end(text);
    } else {
      res.end('Unable to fetch data');
    }
  })
});


function startWF(req,cb) {
  pool.getConnection(function (err, connection) {
	var sql = 'call workflow.start_flow(?);';
	var url_parts = url.parse(req.url, true);
	var data = url_parts.query;
	
	console.log(sql);
    var text = '';
    connection.query(sql, [data.wfid], function (err, rows) {
      cb(err, text);
      connection.end();
    });
  });
}

app.get('/showMostPopularWF', function (req, res, next) {
  showPopular(req, function (err, data) {
    if (!err && data) {
      var text = '';
	  text += '<div class=\'content\'><section class=\'example\'><div class=\'gridly\'>';
      text += data;
	  text += '<p class=\'actions\'><a class=\'add button\' href=\'#\'>Open</a></p></section></div>';
      res.end(text);
    } else {
      res.end('Unable to fetch data');
    }
  })
});

function showPopular(req,cb) {
  pool.getConnection(function (err, connection) {		
	var sql = 'SELECT id, title, description FROM workflow.workFlow WHERE wf_type = 1 AND active = 1 LIMIT 12;';		
		
	console.log(sql);
    var text = '';
	
    connection.query(sql, function (err, rows) {
		if (rows.length) {
			rows.forEach(function (row) {
				text += '<div class=\'brick small\'><a  href=\'#\'><h2 class="color-w">';
				text += row.title;
				text += '</h2><h5 class="show_and_hide" id="'+row.id+'_h5">';
				text += row.description;
				text += '</h5></a>';
				text += '<a class="show_and_hide action" href="#" onclick="startFlowRuning('+row.id+');">Start Flow</a>';
				text += '</div>';
			});
		}
		sql = 'SELECT id, title FROM workflow.workFlow WHERE wf_type = 1 AND active = 1;';
		connection.query(sql, function (err, rows) {
			if (rows.length) {
				text += '</div><select id="list_of_all">';
				rows.forEach(function (row) {
					text += '<option value=\''+row.id+'\'>';
					text += row.title;
					text += '</option>';
				});
				text += '</select>';
			}
			cb(err, text);
			connection.end();
		});	
	});	
  });
}

app.get('/ConfirmChg/:id', function (req, res, next) {
  Confirm(req, function (err, data) {
    if (!err && data) {
      var text = '';
      text += data;
      res.end(text);
    } else {
      res.end('Unable to fetch data');
    }
  })
});

function Confirm(req,cb) {
  pool.getConnection(function (err, connection) {		
	var sql = 'call workflow.confirm_chg(?);';		
	var data = req.params.id;
	console.log("data to send=" + data);
	console.log(sql);
    var text = '';
    connection.query(sql, data, function (err, rows) {
		if (!err) {
			text = "Thanks!";
		}
		cb(err, text);
		connection.end();
	});	
  });
}

app.get('/RefusedChg/:id', function (req, res, next) {
  RefusedFlow(req, function (err, data) {
    if (!err && data) {
      var text = '';
      text += data;
      res.end(text);
    } else {
      res.end('Unable to fetch data');
    }
  })
});

function RefusedFlow(req,cb) {
  pool.getConnection(function (err, connection) {		
	var sql = 'call workflow.refused_chg(?);';		
	var data = req.params.id;
		
	console.log(sql);
    var text = '';
    connection.query(sql, data, function (err, rows) {
		text += 'thnks!';
		cb(err, text);
		connection.end();
	});	
  });
}

app.get('/showAllFlow', function (req, res, next) {
  showFlow(req, function (err, data) {
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

function showFlow(req,cb) {
  pool.getConnection(function (err, connection) {		
	var sql = 'SELECT sts.id, sts.title, act.value as active, sts.wf_status ,date_format(sts.createDate, \'%d/%l/%Y\') as startDate, concat(con.first_name,\' \',con.last_name) as fullName';
		sql += ' FROM workflow.wf_status sts, contacts con, actbool act';
		sql += ' where con.id =  sts.createUser';
		sql += ' and act.id = sts.active';
		sql += ' order by startDate desc;';
		
		
	var data = req.body;
	var colums = '<tr><th>Flow Number</th><th>Title</th><th>Active</th><th>Status</th><th>Start Date</th><th>User</th></tr>'; 
	console.log(sql);
    var text = '';
	
	text += '<thead>'+colums+'</thead>';
	text += '<tfoot>'+colums+'</tfoot><tbody>';
    connection.query(sql, function (err, rows) {
		if (rows.length) {
			rows.forEach(function (row) {
				text += '<tr>';
				text += '<td>'+row.id+'</td>';
				text += '<td>'+row.title+'</td>';
				text += '<td>'+row.active+'</td>';
				text += '<td>'+row.wf_status+'</td>';
				text += '<td>'+row.startDate+'</td>';
				text += '<td>'+row.fullName+'</td>';
				text += '</tr>';
			});
		}
		text += '</tbody>';
		cb(err, text);
		connection.end();
	});	
  });
}

app.get('/ListOfColumsInFlow', function (req, res, next) {
  GetListOfColumsInFlow(req, function (err, data) {
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

function GetListOfColumsInFlow(req,cb) {
  pool.getConnection(function (err, connection) {
		
	var sql = 'SELECT col.id, f.title as formName, col.title as colum';
		sql += ' FROM workflow.columns col, workflow.form f';
		sql += ' WHERE col.form_id in (22)';
		sql += ' AND f.id = col.form_id';
	
	var url_parts = url.parse(req.url, true);
	var data = url_parts.query;
	
	console.log(sql);
    var text = '';
    connection.query(sql, data.formList ,function (err, rows) {
		if (rows.length) {
			var counter = 0;
			rows.forEach(function (row) {
				text += 'rowId: ' + row.id + 'formTitle: ' + row.formName + 'columName: ' + row.colum;
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


app.get('/showWorkFlow/:id', function (req, res) {
  showWF(req, function (err, data) {
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

function showWF(req,cb) {
  pool.getConnection(function (err, connection) {
	var sql = 'SELECT chg.sequence, wf.title, chg.id, stat.status, typ.symbol, concat(con.first_name, \' \', con.last_name) as contact, chg.startDate, chg.endDate';
		sql += ' FROM workflow.change_order chg, workflow.chg_status stat, workflow.chg_types typ, workflow.contacts con, workflow.workFlow wf';
		sql += ' WHERE chg.wf_id = ?';
		sql += ' AND wf.id = chg.wf_id';
		sql += ' AND chg.status = stat.id';
		sql += ' AND chg.chg_type = typ.id';
		sql += ' AND. chg.contact_id = con.id';
		sql += ' ORDER BY sequence;';
	
	var data = req.params.id;
	
	console.log(sql);
    var text = '';
    connection.query(sql, data, function (err, rows) {
      if (rows.length) {
		text += rows[0].title;
		text += '<br>';
        rows.forEach(function (row) {
			text += row.symbol + ' ';
			text += row.status;
			text += '<br>';
        });
		text += '</form>';
      }
      cb(err, text);
      connection.end();
    });
  });
}

