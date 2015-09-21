app.get('/ShowGlobal', function (req, res) {
  ShowAllStatistic(req, function (err, data) {
    if (!err && data) {
      var text = {"stats": data};
      res.setHeader('Content-Type', 'application/json');
	  res.end(JSON.stringify(text));
    } else {
      res.end('Unable to fetch data');
    }
  })
});

function ShowAllStatistic(req,cb) {
  pool.getConnection(function (err, connection) {
	var sql = 'SELECT x.orgainization, y.wf_status, x.xs, y.sall';
		sql += ' FROM';
		sql += ' (SELECT wf.orgainization, CASE WHEN (sts.wf_status = 1) THEN \'runing\' WHEN (sts.wf_status = 2) THEN \'done\' WHEN (sts.wf_status = 3) THEN \'failed\' END AS wf_status, COUNT(sts.wf_id) AS xs';
		sql += ' FROM workflow.wf_chg_status1 sts, workflow.workFlow wf';
		sql += ' WHERE sts.wf_id = wf.id';
		sql += ' GROUP BY wf.orgainization , wf_status) x,';
		sql += ' (SELECT orgainization, wf_status, COUNT(*) sall';
		sql += ' FROM workflow.wf_status';
		sql += ' GROUP BY wf_status) y';
		sql += ' WHERE x.orgainization = y.orgainization';
		sql += ' AND x.wf_status = y.wf_status';
		sql += ' ORDER BY x.orgainization;';
	
	var url_parts = url.parse(req.url, true);
	var data = url_parts.query;

	console.log(sql);
    //var text = '[';
    connection.query(sql, function (err, rows) {
		var counter = 1;
		var cars = new Array();
		if (rows.length) {
			rows.forEach(function (row) {
				cars.push({"org": row.orgainization, "status": row.wf_status, "count": row.xs ,"total": row.sall});
				/*
				if(counter != rows.length){
					text += '[\'' + row.orgainization + '\',\'' + row.wf_status + '\',' + row.xs + ',' + row.sall + '],' ;
					counter++;
				}else{
					text += '[\'' + row.orgainization + '\',\'' + row.wf_status + '\',' + row.xs + ',' + row.sall + ']' ;
				}
				*/
			});
			//text += ']';
			console.log(cars);
		}
		cb(err, cars);
		connection.end();
	});
  });
}

app.get('/ShowDashboard', function (req, res) {
  ShowDashboard(req, function (err, data) {
    if (!err && data) {
      var text = '';
      text += data;
      res.end(text);
    } else {
      res.end('Unable to fetch data');
    }
  })
});

function ShowDashboard(req,cb) {
  pool.getConnection(function (err, connection) {
	var sql = 'SELECT orgainization, wf_status, count(id) as total';
		sql += ' FROM workflow.wf_status';
		sql += ' group by orgainization, wf_status';

	console.log(sql);
    connection.query(sql, function (err, rows) {
		var cars = new Array();
		if (rows.length) {
			rows.forEach(function (row) {
				//{State:'AL',freq:{low:4786, mid:1319, high:249}}
				// fix it with gershon
				var text = {State: row.orgainization, freq: new Array(row.wf_status,row.total)};
				//text.push(row.orgainization ,new Array(row.wf_status,row.total));
				cars.push(text);
			});
			console.log(cars);
		}
		cb(err, cars);
		connection.end();
	});
  });
}

