/**
 * Copyright 2015 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

var express = require("express");
var util = require("util");
var path = require("path");
var fs = require("fs");
var clone = require("clone");

var defaultContext = {
    page: {
        title: "Node-RED",
        favicon: "favicon.ico"
    },
    header: {
        title: "Node-RED",
        image: "red/images/node-red.png"
    },
    asset: {
        red: (process.env.NODE_ENV == "development")? "red/red.js":"red/red.min.js"
    }
};

var theme = null;
var themeContext = clone(defaultContext);
var themeSettings = null;

function serveFile(app,baseUrl,file) {
    try {
        var stats = fs.statSync(file);
        var url = baseUrl+path.basename(file);
        //console.log(url,"->",file);
        app.get(url,function(req, res) {
            res.sendFile(file);
        });
        return "theme"+url;
    } catch(err) {
        //TODO: log filenotfound
        return null;
    }
}

module.exports = {
    init: function(runtime) {
        var settings = runtime.settings;
        themeContext = clone(defaultContext);
        if (runtime.version) {
            themeContext.version = runtime.version();
        }
        themeSettings = null;
        theme = settings.editorTheme;

    },

    app: function() {
        var i;
        var url;
        themeSettings = {};

        var themeApp = express();

        if (theme.page) {
            if (theme.page.css) {
                var styles = theme.page.css;
                if (!util.isArray(styles)) {
                    styles = [styles];
                }
                themeContext.page.css = [];

                for (i=0;i<styles.length;i++) {
                    url = serveFile(themeApp,"/css/",styles[i]);
                    if (url) {
                        themeContext.page.css.push(url);
                    }
                }
            }

            if (theme.page.favicon) {
                url = serveFile(themeApp,"/favicon/",theme.page.favicon)
                if (url) {
                    themeContext.page.favicon = url;
                }
            }
            if (theme.page.favicon16) {
                url = serveFile(themeApp,"/favicon/",theme.page.favicon16)
                if (url) {
                    themeContext.page.favicon16 = url;
                }
            }
            if (theme.page.favicon32) {
                url = serveFile(themeApp,"/favicon/",theme.page.favicon32)
                if (url) {
                    themeContext.page.favicon32 = url;
                }
            }
            if (theme.page.favicon64) {
                url = serveFile(themeApp,"/favicon/",theme.page.favicon64)
                if (url) {
                    themeContext.page.favicon64 = url;
                }
            }
            if (theme.page.favicon196) {
                url = serveFile(themeApp,"/favicon/",theme.page.favicon196)
                if (url) {
                    themeContext.page.favicon196 = url;
                }
            }

            themeContext.page.title = theme.page.title || themeContext.page.title;
        }

        if (theme.header.vendor) {

            themeContext.header.title = theme.header.title || themeContext.header.title;

            if (theme.header.hasOwnProperty("url")) {
                themeContext.header.url = theme.header.url;
            }

            if (theme.header.hasOwnProperty("image")) {
                if (theme.header.image) {
                    url = serveFile(themeApp,"/header/",theme.header.image);
                    if (url) {
                        themeContext.header.image = url;
                    }
                } else {
                    themeContext.header.image = null;
                }
            }
            if (theme.header.vendor) {
                if(!themeContext.header.vendor) {
                    themeContext.header.vendor = {};
                }
                themeContext.header.vendor.title = theme.header.vendor.title || themeContext.header.vendor.title;

                if (theme.header.vendor.hasOwnProperty("url")) {
                    themeContext.header.vendor.url = theme.header.vendor.url;
                }

                if (theme.header.vendor.hasOwnProperty("image")) {
                    if (theme.header.vendor.image) {
                        url = serveFile(themeApp,"/header.vendor/",theme.header.vendor.image);
                        if (url) {
                            themeContext.header.vendor.image = url;
                        }
                    } else {
                        themeContext.header.vendor.image = null;
                    }
                }
            }
        }

        if (theme.deployButton) {
            if (theme.deployButton.type == "simple") {
                themeSettings.deployButton = {
                    type: "simple"
                }
                if (theme.deployButton.label) {
                    themeSettings.deployButton.label = theme.deployButton.label;
                }
                if (theme.deployButton.icon) {
                    url = serveFile(themeApp,"/deploy/",theme.deployButton.icon);
                    if (url) {
                        themeSettings.deployButton.icon = url;
                    }
                }
            }
        }

        if (theme.hasOwnProperty("userMenu")) {
            themeSettings.userMenu = theme.userMenu;
        }

        if (theme.login) {
            if (theme.login.image) {
                url = serveFile(themeApp,"/login/",theme.login.image);
                if (url) {
                    themeContext.login = {
                        image: url
                    }
                }
            }
        }

        if (theme.hasOwnProperty("menu")) {
            themeSettings.menu = theme.menu;
        }

        return themeApp;
    },
    context: function() {
        return themeContext;
    },
    settings: function() {
        return themeSettings;
    }
}
