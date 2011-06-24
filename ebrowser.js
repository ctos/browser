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
			this._tabView = new eyeos.ebrowser.WebView(this.getChecknum());
			var layout = new qx.ui.layout.VBox(5);
			main.setLayout(layout);
			var headerComposite = new qx.ui.container.Composite(new qx.ui.layout.HBox(4));
			headerComposite.setPadding(10);
			main.add(headerComposite);

			var toolBar = new qx.ui.toolbar.ToolBar();
			var backwardButton = new qx.ui.toolbar.Button("",this.getExternFile("extern/backward.png"));
			backwardButton.setShow("icon");
			backwardButton.addListener("execute", function(e){
				this._tabView.getBackPage();
			}, this);
			toolBar.add(backwardButton);
			var forwardButton = new qx.ui.toolbar.Button("",this.getExternFile("extern/forward.png"));
			forwardButton.setShow("icon");
			forwardButton.addListener("execute", function(e){
				this._tabView.getForwardPage();
			}, this);
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
			bookButton.addListener('execute', function(e){
				this._tabView.addBookmark();
			}, this);

			var historyButton = new qx.ui.toolbar.Button("",this.getExternFile("extern/history.png"));
			historyButton.setShow("icon");
			rightToolBar.add(historyButton);
			historyButton.addListener('execute', function(e){
				this._tabView.openHistoryPage();
			}, this);

			var mainMenu = new qx.ui.menu.Menu();
			var viewBookButton = new qx.ui.menu.Button("ViewBookmarks");
			viewBookButton.addListener("execute", function(e)
			{
				this._tabView.openBookmarkPage();
			}, this);
			mainMenu.add(viewBookButton);
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
			
			//eyeos.callMessage(this.getChecknum(), 'getCookies', "MD", this._setCookies, this);
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
					if (topObj.pageJumpTarget == '_blank')
					{
						this._tabView.openInNewTab(topObj.pageJumpURL);
					}
					else
					{
						this._tabView.gotoUrl(topObj.pageJumpURL);
					}
				}
				if (topObj.pageJumpType == "selfJump")
				{
		//			this._tabView.setPageUrl(listTop.id, topObj.pageJumpURL);
	//				this._tabView.setPageTitle(listTop.id, topObj.pageJumpTitle);
					this._tabView.setPageTitleAndUrl(listTop.id, topObj.pageJumpTitle, topObj.pageJumpURL);
				}
                		document.body.removeChild(listTop);
        		}
	
		}
	}
});


qx.Class.define("eyeos.ebrowser.WebView",
{
	extend : qx.ui.tabview.TabView,
	construct : function(checknum)
	{
                this.base(arguments);
		this._checknum = checknum;
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
			else if (page.getPageId() != -1)
			{
				this.fireDataEvent('urlChanged', page.getUrl());
				this.fireDataEvent('titleChanged', page.getTitle());	
			}
		}, this);
	},
	members:
	{
		_checknum: null,
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
		setPageTitleAndUrl: function(pageId, title, url)
		{
			this.setPageTitle(pageId, title);
			this.setPageUrl(pageId, url);
			var curTime = this.getTimestamp();
			eyeos.callMessage(this._checknum, 'addHistory', {hdate: this.getTimestamp(), hurl: url, htitle: title}, function(e){}, this);	
		},
		getTimestamp: function()
		{
			var curDate = new Date();
			var timestamp = "";
			timestamp += curDate.getFullYear();
			timestamp += "-";
			timestamp += curDate.getMonth();
			timestamp += "-";
			timestamp += curDate.getDate();
			timestamp += " ";
			timestamp += curDate.getHours();
			timestamp += ":";
			timestamp += curDate.getMinutes();
			timestamp += ":";
			timestamp += curDate.getSeconds();
			return timestamp;
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
		getLastPage: function()
		{
			var allPages = this.getChildren();
			var lastPage = allPages[allPages.length - 1];
			return lastPage;
		},
		openInNewTab: function(url)
		{
			var lastPage = this.getLastPage();
			lastPage.load(url)
			this.fireDataEvent('urlChanged', url);
			this.setSelection([lastPage]);
		},
		openHistoryPage: function()
		{
			var lastPage = this.getLastPage();
			this.remove(lastPage);
			
			var historyPage = new eyeos.ebrowser.HistoryPage(this._checknum);
			this.add(historyPage);
			this.setSelection([historyPage]);			
			historyPage.addListener("historyClick", function(e){this.openInNewTab(e.getData())}, this);
			historyPage.setLabel("Historys");
			//var newPageLast = new eyeos.ebrowser.TabPage("");
                        //newPageLast.setShowCloseButton(false);
                        //this.add(newPageLast);

		},
		openBookmarkPage: function()
		{
			var lastPage = this.getLastPage();
			this.remove(lastPage);
			
			var bookmarkPage = new eyeos.ebrowser.BookmarkPage(this._checknum);
			this.add(bookmarkPage);
			this.setSelection([bookmarkPage]);			
			bookmarkPage.addListener("bookmarkClick", function(e){this.openInNewTab(e.getData())}, this);
			bookmarkPage.setLabel("Bookmarks");
		},
		printCurrentPage: function()
		{
			var currentPage = this.getCurrentPage();
			var currentId = current.getPageId();
		},
		getForwardPage: function()
		{
			var currentPage = this.getCurrentPage();
			if (currentPage != null && typeof(currentPage) != "eyeos.ebrowser.TabPage")
			{
				currentPage.goForward();
			}
		},
		getBackPage: function()
		{
			var currentPage = this.getCurrentPage();
			if (currentPage != null && typeof(currentPage) != "eyeos.ebrowser.TabPage")
			{
				currentPage.goBack();
			}
		},
		addBookmark: function()
		{
			var currentPage = this.getCurrentPage();
			if (currentPage != null && typeof(currentPage) != "eyeos.ebrowser.TabPage")
			{
				var title = currentPage.getTitle();
				var url = currentPage.getUrl();
				eyeos.callMessage(this._checknum, 'createBookmark', {btitle: title, burl: url, bgroup: 'none'}, function(e){}, this);
			}
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
		this._historyList = [];
		this._historyIndex = -1;
        },
	members:
	{
		_pageId: null,
		_srcUrl: null,
		_title: null,
		_htmlFrame: null,
		_historyList: null,
		_historyIndex: null,
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
			if (this._historyList == -1)
			{
				this._historyList.push(newUrl);
				this._historyIndex++;
			}
			else if (newUrl != this._historyList[this._historyIndex])
			{
				this._historyList.splice(this._historyIndex);
				this._historyList.push(newUrl);
				this._historyIndex++;
			}
		},
		setTitle: function(newTitle)
		{
			this._title = newTitle;
			this.setLabel(newTitle);
		},
		getTitle: function()
		{
			return this._title;
		},
		goForward: function()
		{
			if (this._historyIndex >= this._historyList.length - 1)
			{
				return;
			}
			this._historyIndex++;
			this.load(this._historyList[this._historyIndex]);
		},
		goBack: function()
		{
			if (this._historyIndex <= 0)
			{
				return;
			}
			this._historyIndex--;
			this.load(this._historyList[this._historyIndex]);
		}
	}
});

/*qx.Class.define("eyeos.ebrowser.NewPage",
{
        extend : qx.ui.tabview.Page,

        construct : function()
        {
                this.base(arguments);
                this.setShowCloseButton(false);
        },
	members :
	{
		getPageById: function()
		{
			return -1;
		}
	}
});*/

qx.Class.define("eyeos.ebrowser.HistoryPage",
{
	extend : qx.ui.tabview.Page,

	construct : function(checknum)
	{
		this.base(arguments);
		this._checknum = checknum;
		var layout = new qx.ui.layout.VBox(5);
		this.setLayout(layout);
      		var box = new qx.ui.layout.VBox();
      		box.setSpacing(10);
		this.setShowCloseButton(true);
		var container = new qx.ui.container.Composite(box);
		var button = new qx.ui.form.Button("Clear History");
		button.addListener('execute', this._delAllHistorys, this);
		container.add(button);
		this.add(container);
		this._tableModel = new qx.ui.table.model.Simple();
		this._tableModel.setColumns([ "Date", "Title", "URL" ]);
		this._historyTable = new qx.ui.table.Table(this._tableModel);
		container.add(this._historyTable);
		this._getAllHistorys();
		this._historyTable.addListener("cellClick", this._cellCilcked, this);
	},
	members:
	{
		_checknum: null,
		_historyTable: null,
		_tableModel: null,
		_getAllHistorys: function()
		{
			var allHistory = [];
			eyeos.callMessage(this._checknum, "getAllHistorys", null, function(historys){
				for (i = 0; i < historys.length; i++)
				{
					var oneHistory = historys[i];
					allHistory.push([oneHistory.hdate, oneHistory.htitle, oneHistory.hurl]);
				}
				this._tableModel.setData(allHistory);		
			}, this);
		},
		_getHistorysByDate: function()
		{
		},
		_delAllHistorys: function()
		{
			eyeos.callMessage(this._checknum, "delAllHistorys", null, function(e){
				this._getAllHistorys();
			}, this);
		},
		_cellCilcked: function(cellEvent)
		{
			var col = cellEvent.getColumn();
			var row = cellEvent.getRow();
			var url = this._tableModel.getValue(2, row);
			this.fireDataEvent('historyClick', url);
		},
		getPageId: function()
		{
			return -1;
		}
	},
	events:
	{
		historyClick: 'qx.event.type.Data'
	}
});

qx.Class.define("eyeos.ebrowser.BookmarkPage",
{
	extend : qx.ui.tabview.Page,

	construct : function(checknum)
	{
		this.base(arguments);
		this._checknum = checknum;
		var layout = new qx.ui.layout.VBox(5);
		this.setLayout(layout);
      		var box = new qx.ui.layout.VBox();
      		box.setSpacing(10);
		this.setShowCloseButton(true);
		var container = new qx.ui.container.Composite(box);
	//	var button = new qx.ui.form.Button("Clear History");
	//	button.addListener('execute', this._delAllBookmarks, this);
		//container.add(button);
		this.add(container);
		this._tableModel = new qx.ui.table.model.Simple();
		this._tableModel.setColumns(["Id", "Title", "URL", "Go", "Delete"]);
		this._bookmarkTable = new qx.ui.table.Table(this._tableModel);
		container.add(this._bookmarkTable);
		this._getAllBookmarks();
		this._bookmarkTable.addListener("cellClick", this._cellCilcked, this);
	},
	members:
	{
		_checknum: null,
		_bookmarkTable: null,
		_tableModel: null,
		_getAllBookmarks: function()
		{
			var allBookmarks = [];
			eyeos.callMessage(this._checknum, "getAllBookmarks", null, function(bookmarks){
				for (i = 0; i < bookmarks.length; i++)
				{
					var oneBookmark = bookmarks[i];
					allBookmarks.push([oneBookmark.bid, oneBookmark.btitle, oneBookmark.burl, "Go", "Delete"]);
				}
				this._tableModel.setData(allBookmarks);		
			}, this);
		},
		_getBookmarksByDate: function()
		{
		},
		_delAllBookmarks: function()
		{
			eyeos.callMessage(this._checknum, "delAllBookmarks", null, function(e){
				this._getAllBookmarks();
			}, this);
		},
		_cellCilcked: function(cellEvent)
		{
			var col = cellEvent.getColumn();
			var row = cellEvent.getRow();
			if (col == 4)
			{
				var bid = this._tableModel.getValue(0, row);
				eyeos.callMessage(this._checknum, 'delBookmarkById', bid, function(e){}, this);
				this._getAllBookmarks();
			}
			else
			{
				var url = this._tableModel.getValue(1, row);
				this.fireDataEvent('bookmarkClick', url);
			}
		},
		getPageId: function()
		{
			return -1;
		}
	},
	events:
	{
		bookmarkClick: 'qx.event.type.Data'
	}
});
