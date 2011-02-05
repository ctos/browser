// Create main function.
function ebrowser_application(checknum, pid, args)
{
	var app = new eyeos.application.ebrowser(checknum, pid, args);
	app.drawGUI();
}

qx.Class.define("twitter.MainWindow",
{
	extend: qx.ui.window.Window,
	
	construct : function()
	{
		
		this.base(arguments, "EYEs on ME BROWSER", "index.php?extern=/images/16x16/status/user-online.png");

		// hide the window buttons
		//this.setShowClose(false);
		//this.setShowMaximize(false);
		//this.setShowMinimize(false);

		this.setWidth(700);
		this.setHeight(500);

		var layout = new qx.ui.layout.Grid(0, 0);
		this.setLayout(layout);

		var Menubar = new qx.ui.menubar.MenuBar();
		this.add(Menubar, {row: 0, column: 0});

		var Toolbar = new qx.ui.toolbar.ToolBar();
		this.add(Toolbar, {row: 1, column: 0});
		Toolbar.setHeight(25);
		
		var ForwardButton = new qx.ui.toolbar.Button("","index.php?extern=/images/22x22/actions/arrow-right.png");
		Toolbar.add(ForwardButton);
		var BackwardButton = new qx.ui.toolbar.Button("","index.php?extern=/images/22x22/actions/arrow-left.png");
		Toolbar.add(BackwardButton);
		var StopButton = new qx.ui.toolbar.Button("","index.php?extern=/images/22x22/actions/dialog-close.png");
		Toolbar.add(StopButton);		
		var RefreshButton = new qx.ui.toolbar.Button("","index.php?extern=/images/22x22/actions/view-refresh.png");
		Toolbar.add(RefreshButton);

	
		var addressarea = new qx.ui.form.TextArea();
		addressarea.setPlaceholder("Enter Address here...");
		this.add(addressarea, {row: 2, column: 0});
		addressarea.setHeight(25);

		this.setContentPadding(0);
		layout.setColumnFlex(0, 1);


		// FILE button
		var fileButton = new qx.ui.menubar.Button("File(F)");
		Menubar.add(fileButton);
		// EDIT button
		var editButton = new qx.ui.menubar.Button("Edit(E)");
		Menubar.add(editButton);
		// VIEW button
		var viewButton = new qx.ui.menubar.Button("View(V)");
		Menubar.add(viewButton);
		// HISTORY button
		var historyButton = new qx.ui.menubar.Button("History(H)");
		Menubar.add(historyButton);

		var goButton = new qx.ui.form.Button("Go","index.php?extern=/images/22x22/actions/go-next.png");
		this.add(goButton,{row: 2,column: 1});


		var iframe = new qx.ui.embed.Iframe(qx.util.ResourceManager.getInstance().toUri("http://localhost/"));
		this.add(iframe, {row:  3,column:0 });



		this.add(Menubar, {row: 0, column: 0, colSpan: 2});
		this.add(Toolbar, {row: 1, column: 0, colSpan: 2});

		this.add(iframe, {row: 3, column: 0, colSpan: 2});
		layout.setRowFlex(3, 3);


		goButton.addListener("execute", function() {
			this.fireDataEvent("post", addressarea.getValue());
			iframe.setSource(addressarea.getValue());
			iframe.reload();
		}, this);

		addressarea.addListener("input", function(e) {
			var value = e.getData();
			goButton.setEnabled(value.length > 0);
		}, this);

		goButton.setEnabled(false);

	},
	events :
	{
		"post": "qx.event.type.Data"
	}


});


// Define class for this application.
qx.Class.define('eyeos.application.ebrowser',
{
	extend: eyeos.system.EyeApplication,
	construct: function(checknum, pid, args)
	{
		arguments.callee.base.call(this, 'ebrowser', checknum, pid);
	},
	members:
	{
		drawGUI: function()
		{
			var main = new twitter.MainWindow();
			main.open();
			main.moveTo(100, 30);

			main.addListener("post", function(e) {
				alert(e.getData());
			}, this);
		}
	}
});

