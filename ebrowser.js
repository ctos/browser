// Create main function.
function ebrowser_application(checknum, pid, args)
{
	var app = new eyeos.application.ebrowser(checknum, pid, args);
	app.drawGUI();
}

qx.Class.define("twitter.MainWindow",
{
	extend: qx.ui.window.Window,
	
	construct : function(app)
	{
		
		this.base(arguments, "EYEs on ME BROWSER", "index.php?extern=/images/16x16/status/user-online.png");
		this.setShowStatusbar(true);
		var layout = new qx.ui.layout.VBox();
		this.setLayout(layout);
		
		var urlEditor = new qx.ui.form.TextField("").set({});
		this.add(urlEditor);

		urlEditor.addListener("keypress", function(e) {
			if (e.getKeyIdentifier() == "Enter")
			{
				alert("keydown");
			}
                }, this);
		var toolBar = new qx.ui.toolbar.ToolBar();
		this.add(toolBar);
		
		var forwardButton = new qx.ui.toolbar.Button("",app.getExternFile("extern/forward.png"));
		toolBar.add(forwardButton);
		/*var frame = new qx.ui.embed.ThemedIframe("http://www.google.com").set({allowStretchY : true,  height : 400});
		this.add(frame);
		this.setContentPadding(0);
		alert(frame.getMaxHeight());
                //layout.setColumnFlex(0, 1);*/

		var tabView = new eyeos.ebrowser.WebView();
		this.add(tabView, {flex:1});



	}

});


// Define class for this application.
qx.Class.define('eyeos.application.ebrowser',
{
	extend: eyeos.system.EyeApplication,
	construct: function(checknum, pid, args)
	{
		arguments.callee.base.call(this, 'ebrowser', checknum, pid);
		this.hellovar = checknum;
	},
	members:
	{
		drawGUI: function()
		{
			var main = new twitter.MainWindow(this).set({width : 800, height : 600});
			main.open();
			main.moveTo(100, 30);

			main.addListener("post", function(e) {
				alert(e.getData());
			}, this);
		},
		getExternFile: function(path)
		{
			return "index.php?appName=ebrowser&appFile="+path+"&checknum="+this.hellovar;
		}
	}
});

qx.Class.define("eyeos.ebrowser.WebView",
{
	extend : qx.ui.tabview.TabView,
	construct : function()
	{
                this.base(arguments);
		var page1 = new eyeos.ebrowser.TabPage("page1");
		this.add(page1);
		var page2 = new eyeos.ebrowser.TabPage("");
		this.add(page2);
		alert(page1);
		alert(page2);
		this.addListener("changeSelection", function(e){
//			alert(this.getChildren().length);
//			pages = getSelection();
//			alert(pages);
//			alert(this.indexOf(pages[0])
			//alert(e.getCurrentTarget());
			alert(this.getSelection());
			alert(e.getData() == page2);
		}, this);
	}
});

qx.Class.define("eyeos.ebrowser.TabPage",
{
        extend : qx.ui.tabview.Page,

        construct : function(label)
        {
                this.base(arguments);
		this.setLabel(label);
		this.setShowCloseButton(true);
        }
});

qx.Class.define("eyeos.ebrowser.NewPage",
{
        extend : qx.ui.tabview.Page,

        construct : function()
        {
                this.base(arguments);
                //this.setLabel(label);
                //this.setShowCloseButton(true);
        }
});


