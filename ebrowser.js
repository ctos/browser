// Create main function.
function ebrowser_application(checknum, pid, args)
{
	var app = new eyeos.application.ebrowser(checknum, pid, args);
	app.drawGUI();
}

var pageCount = 0;
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
			homeButton.addListener("execute", function(){
				this._tabView.gotoUrl("http://www.google.com");
			}, this);
			toolBar.add(homeButton);
			var refreshButton = new qx.ui.toolbar.Button("",this.getExternFile("extern/refresh.png"));
			refreshButton.setShow("icon");
			refreshButton.addListener("execute", function(e) {
				this._tabView.refresh();
			}, this);
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

			this._tabView.addListener('urlChanged', function(e){
					urlEditor.setValue(e.getData());
				}
			);
			main.add(this._tabView, {flex:1});
			main.open();
			
			this._setCheckTimer();
			
			eyeos.callMessage(this.getChecknum(), 'getCookies', "MD", this._setCookies, this);
			main.addListener('beforeClose', this._aboutToClose, this);
		},
		_setCheckTimer: function()
		{
			var timer = new qx.event.Timer(50);
			timer.addListener('interval', function(e){
				this._check();
			}, this);
			timer.start();
		},
		_setCookies: function(cookies)
		{
			var setCookiesInput = document.getElementById("setCookiesInput");
			setCookiesInput.value = cookies;
			alert("cookie ok");
		},
		_getCookies: function()
		{
			var getCookiesInput = document.getElementById("getCookiesInput");
			return getCookiesInput.value;
		},
		_delCookies: function()
		{
			var delCookiesInput = document.getElementById("delCookiesInput");
			delCookiesInput.value = "1";
		},
		_aboutToClose: function(e)
		{
			var cookies = this._getCookies();
			this._delCookies();
			eyeos.callMessage(this.getChecknum(), 'setCookies', cookies, function(e){alert("good")});
			alert("closed");
		},
		getExternFile: function(path)
		{
			return "index.php?appName=ebrowser&appFile="+path+"&checknum="+this.hellovar;
		},
		_check: function()
                {
			var listTop = document.getElementsByName("pageJumpForm")[0];
        		if (listTop != null)
       	 		{
				var topObj = eval("("+listTop.pageJumpType.getAttribute("value")+")");
				if (topObj.pageJumpType == "anchorJump")
				{
					apage.setUrl(topObj.pageJumpURL);
					this._tabView.gotoUrl(topObj.pageJumpURL);
				}
				if (topObj.pageJumpType == "selfJump")
				{
					this._tabView.setPageUrl(listTop.id, topObj.pageJumpURL);
					this._tabView.setPageTitle(listTop.id, topObj.pageJumpTitle);
				}
                		document.body.removeChild(listTop);
        		}
	
		}
	}
});


qx.Class.define("eyeos.ebrowser.WebView",
{
	extend : qx.ui.tabview.TabView,
	construct : function()
	{
                this.base(arguments);
		var page1 = new eyeos.ebrowser.TabPage("new page");
		this.add(page1);
		var page2 = new eyeos.ebrowser.TabPage("");
		this.add(page2);
		page2.setShowCloseButton(false);
		this.addListener("changeSelection", function(e){
			var page = this.getSelection()[0];
			if (this.indexOf(page) == this.getChildren().length - 1)
			{
				page.setShowCloseButton(true);
				var pageLast = new eyeos.ebrowser.TabPage("");
				pageLast.setShowCloseButton(false);
				this.add(pageLast);
				page.setLabel("new page");
				this.fireDataEvent("urlChanged", "");
			}
			else
			{
				this.fireDataEvent('urlChanged', page.getUrl());
				this.fireDataEvent('titleChanged', page.getTitle());	
			}
		}, this);
	},
	members:
	{
		gotoUrl: function(url)
		{
			var currentPage = this.getSelection()[0];
			currentPage.load(url);
			this.fireDataEvent('urlChanged', currentPage.getUrl());
		},
		refresh: function()
		{
			var currentPage = this.getSelection()[0];
			currentPage.reload();
			this.fireDataEvent('urlChanged', currentPage.getUrl());
		},
		setPageUrl: function(pageId, url)
		{
			var page = this.getPageById(pageId);
			if (page != null)
			{
				page.setUrl(url);
				if (page == this.getCurrentPage())
				{
					this.fireDataEvent('urlChanged', url);
				}
			}
		},
		setPageTitle: function(pageId, title)
		{
			var page = this.getPageById(pageId);
			if (page != null)
			{
				page.setTitle(title);
			}
		},
		getPageById: function(pageId)
		{
			var cpages = this.getChildren();
                        for (var i = 0; i < cpages.length; i++)
                        {
                        	apage = cpages[i];
				if (apage.getPageId() == pageId)
				{
					return apage;
				}
			}
			return null;
		},
		getCurrentPage: function()
		{
			return this.getSelection()[0];
		},
		openInNewTab: function(url)
		{
			var allPages = this.getChildren();
			var lastPage = allPages[allPages.length - 1];
		}
	},
	events:
	{
		urlChanged: 'qx.event.type.Data',
		titleChanged: 'qx.event.type.Data'
	}
});

qx.Class.define("eyeos.ebrowser.TabPage",
{
        extend : qx.ui.tabview.Page,

        construct : function(label)
        {
                this.base(arguments);
		this.setLabel(label);
                this._pageId = pageCount++;
		this.setShowCloseButton(true);
		this._htmlFrame = new qx.ui.embed.ThemedIframe("");
		this.setLayout(new qx.ui.layout.VBox);
		this.add(this._htmlFrame, {flex:1});
		this._srcUrl = "";
		this._htmlFrame.setFrameName(this._pageId);
        },
	members:
	{
		_pageId: null,
		_srcUrl: null,
		_title: null,
		_htmlFrame: null,
		load: function(url)
		{
			this._srcUrl = url;
			this._htmlFrame.setSource(url);
		},
		reload: function()
		{
			this._htmlFrame.reload();
			//this._htmlFrame.setSource(this._htmlFrame.getSource());
		},
		getUrl: function()
		{
			return this._htmlFrame.getSource();
		},
		getPageId: function()
		{
			return this._pageId;
		},
		setUrl: function(newUrl)
		{
			this._srcUrl = newUrl;
		},
		setTitle: function(newTitle)
		{
			this._title = newTitle;
			this.setLabel(newTitle);
		},
		getTitle: function()
		{
			return this._title;
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

