// Create main function.
function ebrowser_application(checknum, pid, args)
{
	var app = new eyeos.application.ebrowser(checknum, pid, args);
	app.drawGUI();
}
	

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
		_tabView: null,
		drawGUI: function()
		{
			var main = new eyeos.ui.Window(this, "Eye Browser").set({width : 800, height : 600});
			main.setShowStatusbar(true);
			this._tabView = new eyeos.ebrowser.WebView();
			var layout = new qx.ui.layout.VBox(5);
			main.setLayout(layout);
			var headerComposite = new qx.ui.container.Composite(new qx.ui.layout.HBox(4));
			headerComposite.setPadding(10);
			main.add(headerComposite);

			var toolBar = new qx.ui.toolbar.ToolBar();
			var backwardButton = new qx.ui.toolbar.Button("",this.getExternFile("extern/backward.png"));
			backwardButton.setShow("icon");
			toolBar.add(backwardButton);
			var forwardButton = new qx.ui.toolbar.Button("",this.getExternFile("extern/forward.png"));
			forwardButton.setShow("icon");
			toolBar.add(forwardButton);
			var homeButton = new qx.ui.toolbar.Button("",this.getExternFile("extern/home.png"));
			homeButton.setShow("icon");
			toolBar.add(homeButton);
			var refreshButton = new qx.ui.toolbar.Button("",this.getExternFile("extern/refresh.png"));
			refreshButton.setShow("icon");
			toolBar.add(refreshButton);
			headerComposite.add(toolBar);


			var urlEditor = new qx.ui.form.TextField().set({
				allowGrowX : true,
				placeholder : "Input url",
				maxWidth : 1000,
				minWidth : 400}
			);
			
			urlEditor.addListener("keypress", function(e) {
				if (e.getKeyIdentifier() == "Enter")
				{
					this._tabView.gotoUrl(urlEditor.getValue());
				}
                	}, this);
			headerComposite.add(urlEditor, {flex : 1});
			
			
			var rightToolBar = new qx.ui.toolbar.ToolBar();
			var goButton = new qx.ui.toolbar.Button("",this.getExternFile("extern/go.png"));
			goButton.setShow("icon");
			rightToolBar.add(goButton);
			var bookButton = new qx.ui.toolbar.Button("",this.getExternFile("extern/book.png"));
			bookButton.setShow("icon");
			rightToolBar.add(bookButton);
			var historyButton = new qx.ui.toolbar.Button("",this.getExternFile("extern/history.png"));
			historyButton.setShow("icon");
			rightToolBar.add(historyButton);

			var mainMenu = new qx.ui.menu.Menu();
			var undoButton = new qx.ui.menu.Button("Undo", "icon/16/actions/edit-undo.png");
			mainMenu.add(undoButton);
			var configButton = new qx.ui.toolbar.MenuButton("",this.getExternFile("extern/config.png"), mainMenu);
			configButton.setShow("icon");
			rightToolBar.add(configButton);
			headerComposite.add(rightToolBar);

			main.add(this._tabView, {flex:1});
			main.open();

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
		this.addListener("changeSelection", function(e){
			var page = this.getSelection()[0];
			if (this.indexOf(page) == this.getChildren().length - 1)
			{
				var pageLast = new eyeos.ebrowser.TabPage("");
				this.add(pageLast);
				page.setLabel("new page");
			}
		}, this);
	},
	members:
	{
		gotoUrl: function(url)
		{
			var currentPage = this.getSelection()[0];
			currentPage.load(url);
		}
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
		this._htmlFrame = new qx.ui.embed.ThemedIframe("http://www.google.com");
		this.setLayout(new qx.ui.layout.VBox);
		this.add(this._htmlFrame, {flex:1});
        },
	members:
	{
		_htmlFrame: null,
		load: function(url)
		{
			this._htmlFrame.setSource(url);
		}
	}
});

qx.Class.define("eyeos.ebrowser.NewPage",
{
        extend : qx.ui.tabview.Page,

        construct : function()
        {
                this.base(arguments);
                this.setShowCloseButton(false);
        }
});

