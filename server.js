var express = require('express');
var util = require('util');
var app     = express();
var fs = require("fs");
var jade = require("jade");
var jsonSql = require('json-sql')();
var async = require('async');
//var sync = require('synchronize');
var url = require('url');
var mysql      = require('mysql');
var pool = mysql.createPool({
	host     : 'workflow.cmdci40vhwqs.eu-central-1.rds.amazonaws.com',
	user     : 'dbadmin',
	password : 'dbadmin123',
	database : 'workflow',
});
app.set('view engine', 'jade');

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'roybaranes9@gmail.com',
        pass: '051262501'
    }
});

app.use(express.bodyParser());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

function include(file_) {
    with (global) {
        eval(fs.readFileSync(file_) + '');
    };
};

include('server/notification.js');
include('server/organization.js');
include('server/site.js');
include('server/dept.js');
include('server/form.js');
include('server/contact.js');
include('server/workFlow.js');
include('server/statistic.js');
include('server/authentication.js');




function send(sendTo, title, msg)
{
	// setup e-mail data with unicode symbols
	var confirm_page = fs.readFileSync('\confirm_mail.html', 'utf8');
	var mailOptions = {
		from: 'royb', // sender address
		to: sendTo, // list of receivers
		subject: title, // Subject line
		html: msg // html body
	};
	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, info){
		if(error){
			console.log(error);
		}else{
			console.log('Message sent: ' + info.response);
		}
	});
}

function showFormsInMail(id, cb)
{
	var sql = 'SELECT tmp.id FROM workflow.change_order fire, workflow.change_order tmp';
		sql += ' where fire.id = '+id;
		sql += ' and tmp.chg_type = 3';
		sql += ' and fire.wf_id = tmp.wf_id';
		sql += ' and tmp.sequence < fire.sequence';
	var msg = '';
	pool.getConnection(function (err, connection) {
		console.log(sql);
		connection.query(sql, function (err, rows_v) {
			// print all
			async.eachSeries(rows_v, function (row_v, cb) {
				sql = 'SELECT c.label as label, cv.column_value as column_value, f.title as ftitle';
				sql += ' FROM workflow.columns_values cv, workflow.columns c, workflow.form f ';
				sql += ' where cv.column_id = c.id';
				sql += ' and f.id = c.form_id';
				sql += ' and cv.chg_id = ' +row_v.id+ ' order by c.seq;';
					connection.query(sql, function (err, rows_f) {
						if (rows_f.length > 0) {
							msg += '<u>' + rows_f[0].ftitle +'</u><br><br>';
							rows_f.forEach(function (row_f) {
								msg += row_f.label + ': ' + row_f.column_value + '<br>';
							});
						}
						cb();
					});
			}, function(err) {cb(msg);});
		});
		return msg;
	});	
}

function Notification_Confirm()
{
	pool.getConnection(function (err, connection) {
		var sql = 'SELECT co.id as wf, con.email as email FROM workflow.change_order co , contacts con WHERE co.tamplate = 2 AND co.status = 5 AND co.contact_id = con.id AND chg_type = 1;';
		//console.log(sql);
		connection.query(sql, function (err, rows) {
		  if (rows.length) {
			console.log("Send All Waiting emails Confirm!");
			rows.forEach(function (row) {
				showFormsInMail(row.wf, function(msg) {  // need to fix call backs 
					msg += "<p>Do you want to approve this request?</p>";
					msg += "<p></p>";
					msg += '<a href="http://localhost:8080/ConfirmChg/' + row.wf + '" target="_blank"><img title="yes" src="http://ec2-52-28-81-82.eu-central-1.compute.amazonaws.com/dynamicForm/images/yes.png" /></a>';
					msg += '<a href="http://localhost:8080/RefusedChg/' + row.wf + '" target="_blank"><img title="no" src="http://ec2-52-28-81-82.eu-central-1.compute.amazonaws.com/dynamicForm/images/no.png" /></a>';
					msg += '<p><small>This mail was send to <a href="mailto:' + row.email + '">' + row.email + '</a></small>';
					send(row.email, 'Confirm Session', msg);
					sql = 'UPDATE workflow.change_order SET status=1 WHERE id=\'' + row.wf + '\';'
					connection.query(sql, function (err, rows) {	
					});
				});
			});
		  }
		  connection.end();
		});
	});
}

function Notification_WithoutConfirm()
{
	pool.getConnection(function (err, connection) {
		var sql = 'SELECT co.id as wf, con.email as email FROM workflow.change_order co , contacts con WHERE co.tamplate = 2 AND co.status = 5 AND co.contact_id = con.id AND chg_type = 2;';
		//console.log(sql);
		connection.query(sql, function (err, rows) {
		  if (rows.length) {
			console.log("Send All Waiting emails!");
			rows.forEach(function (row) {
				var msg = 'there is an update on '+ row.wf + 'flow';
				send(row.email, 'Notification', msg);
				sql = 'call workflow.confirm_chg(?);';		
				connection.query(sql, row.wf, function (err, rows) {	
				});
			});
		  }
		  connection.end();
		});
	});
}

app.get('/notification', function (req, res) {
  pool.getConnection(function (err, connection) {
		var sql = 'SELECT co.id as wf, con.email as email FROM workflow.change_order co , contacts con WHERE co.tamplate = 2 AND co.status = 5 AND co.contact_id = con.id AND chg_type = 2;';
		//console.log(sql);
		connection.query(sql, function (err, rows) {
		  if (rows.length) {
			console.log("Send All Waiting emails!");
			rows.forEach(function (row) {
				res.render('notification', row);
				//var msg = 'there is an update on '+ row.wf + 'flow';
				//send(row.email, 'Notification', msg);
				//sql = 'call workflow.confirm_chg(?);';		
				//connection.query(sql, row.wf, function (err, rows) {	
				//});
			});
		  } else {
			res.end('no rows!');
		  }
		  connection.end();
		});
	});
});

function Notification_Form()
{
	pool.getConnection(function (err, connection) {
		var sql = 'SELECT co.id as wf, con.email as email FROM workflow.change_order co , contacts con WHERE co.tamplate = 2 AND co.status = 5 AND co.contact_id = con.id AND chg_type = 3;';
		//console.log(sql);
		connection.query(sql, function (err, rows) {
		  if (rows.length) {
			console.log("Send All Waiting emails!");
			rows.forEach(function (row) {
				var msg = 'Please fill in the form! #' + row.wf;
				msg += '<br>open the<a href="http://localhost:8080/showForm/' + row.wf + '"> form!</a>'
				send(row.email, 'Notification - You need to fill the form', msg);
				sql = 'UPDATE workflow.change_order SET status=1 WHERE id=\'' + row.wf + '\';'
				connection.query(sql, function (err, rows) {	
				});
			});
		  }
		  connection.end();
		});
	});
}
	
function Notification_Timer_NonSend()
{
	pool.getConnection(function (err, connection) {
		var sql = 'SELECT co.id as wf, TIMESTAMPDIFF(MINUTE,now(), DATE_ADD(wf.createDate , INTERVAL CAST(co.data AS UNSIGNED) DAY_HOUR)) as timing, con.email AS email';
			sql += ' FROM change_order co, workFlow wf, contacts con';
			sql += ' where co.wf_id = wf.id';
			sql += ' AND co.contact_id = con.id';
			sql += ' AND chg_type = 4';
			sql += ' AND co.tamplate = 2';
			sql += ' AND co.status = 5';
			sql += ' HAVING timing > 0;';

		//console.log(sql);
		connection.query(sql, function (err, rows) {
		  if (rows.length) {
			console.log("Send All Waiting emails!");
			rows.forEach(function (row) {
				sql = 'call workflow.confirm_chg(?);';		
				connection.query(sql, row.wf, function (err, rows) {	
				});
			});
		  }
		  connection.end();
		});
	});
}

function Notification_Timer_Send()
{
	pool.getConnection(function (err, connection) {
		var sql = 'SELECT co.id as wf, TIMESTAMPDIFF(MINUTE,now(), DATE_ADD(wf.createDate , INTERVAL CAST(co.data AS UNSIGNED) DAY_HOUR)) as timing, con.email AS email';
			sql += ' FROM change_order co, workFlow wf, contacts con';
			sql += ' where co.wf_id = wf.id';
			sql += ' AND co.contact_id = con.id';
			sql += ' AND chg_type = 4';
			sql += ' AND co.tamplate = 2';
			sql += ' AND co.status = 5';
			sql += ' HAVING timing < 0;';

		//console.log(sql);
		connection.query(sql, function (err, rows) {
		  if (rows.length) {
			console.log("Send All Waiting emails!");
			rows.forEach(function (row) {
				var msg = 'there is an update on '+ row.wf + 'flow';
				send(row.email, 'Notification', msg);
				sql = 'call workflow.confirm_chg(?);';		
				connection.query(sql, row.wf, function (err, rows) {	
				});
			});
		  }
		  connection.end();
		});
	});
}

function Notification_IF_Question()
{
	pool.getConnection(function (err, connection) {
		var sql = 'SELECT co.id AS chg,';
			sql += ' SPLIT_STR(co.data, \',\', 1) AS type_op,';
			sql += ' SPLIT_STR(co.data, \',\', 2) AS quistion,';
			sql += ' SPLIT_STR(SPLIT_STR(co.data, \',\', 3), \':\', 1) AS true_op,';
			sql += ' SPLIT_STR(SPLIT_STR(co.data, \',\', 3), \':\', 2) AS false_op';
			sql += ' FROM change_order co';
			sql += ' WHERE chg_type = 5 ';
			sql += ' AND co.tamplate = 2';
			sql += ' AND co.status = 5';

		//console.log(sql);
		connection.query(sql, function (err, rows) {
		  var sql = '';
		  if (rows.length) {
			rows.forEach(function (row) {
				switch(row.type_op){
					case 'wf':
						sql = 'select workflow.if_operator_check(?, ?);';
						break;
					case 'chg':
						sql = 'call workflow.confirm_chg(?);';
						break;
				}
				// gershon
				connection.query(sql, row.chg, row.quistion, function (err, rows) {
					var sql = '';
					if(rows[0] > 0){
						sql = 'call workflow.wf_operator(?, ?);'
						connection.query(sql, row.true_op, row.chg, function (err, rows) {});
					}else{
						sql = 'call workflow.wf_operator(?, ?);'
						connection.query(sql, row.false_op, row.chg, function (err, rows) {});						
					}
				});
			});
		  }
		  connection.end();
		});
	});
}

function Thrads()
{
	var minutes = 1, the_interval = minutes * 1 * 1000;
	setInterval(function() {
		Notification_Confirm();
		Notification_WithoutConfirm();
		Notification_Form();
		Notification_Timer_Send();
		Notification_Timer_NonSend();
		Notification_IF_Question();
	}, the_interval);
}

app.listen(8080, function() {
  console.log('Server running...'); 
  Thrads();	
});

