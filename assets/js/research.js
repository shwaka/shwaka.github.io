(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var base_1 = require("./base");
// <reference path="base.ts"/>
var ArticleType;
(function (ArticleType) {
    ArticleType["preprint"] = "preprint";
    ArticleType["toappear"] = "toappear";
    ArticleType["published"] = "published";
    ArticleType["proceedings"] = "proceedings";
})(ArticleType || (ArticleType = {}));
function isArticlePreprintObject(arg) {
    return (typeof arg == "object") && (arg != null) &&
        base_1.hasProperty(arg, "type") && (arg.type == ArticleType.preprint) &&
        base_1.hasPropertyOfType(arg, "title", "string") &&
        base_1.hasPropertyOfType(arg, "arxiv", "string") &&
        base_1.hasPropertyOfType(arg, "year-preprint", "number");
}
function isArticleToappearObject(arg) {
    return (typeof arg == "object") && (arg != null) &&
        base_1.hasProperty(arg, "type") && (arg.type == ArticleType.toappear) &&
        base_1.hasPropertyOfType(arg, "title", "string") &&
        base_1.hasPropertyOfType(arg, "arxiv", "string") &&
        base_1.hasPropertyOfType(arg, "year-preprint", "number") &&
        base_1.hasPropertyOfType(arg, "journal", "string") &&
        base_1.hasPropertyOfType(arg, "journal-url", "string");
}
function isArticlePublishedObjet(arg) {
    return (typeof arg == "object") && (arg != null) &&
        base_1.hasProperty(arg, "type") && (arg.type == ArticleType.published) &&
        base_1.hasPropertyOfType(arg, "title", "string") &&
        base_1.hasPropertyOfType(arg, "arxiv", "string") &&
        base_1.hasPropertyOfType(arg, "year-preprint", "number") &&
        base_1.hasPropertyOfType(arg, "journal", "string") &&
        base_1.hasPropertyOfType(arg, "journal-url", "string") &&
        base_1.hasPropertyOfType(arg, "journal-page", "string") &&
        base_1.hasPropertyOfType(arg, "article-url", "string") &&
        base_1.hasPropertyOfType(arg, "year-published", "number");
}
function isArticleProceedingsObject(arg) {
    return (typeof arg == "object") && (arg != null) &&
        base_1.hasProperty(arg, "type") && (arg.type == ArticleType.proceedings) &&
        base_1.hasPropertyOfType(arg, "title", "string") &&
        base_1.hasPropertyOfType(arg, "year", "number") &&
        base_1.hasPropertyOfType(arg, "journal", "string") &&
        base_1.hasPropertyOfType(arg, "journal-url", "string");
}
function isArticleObject(arg) {
    return isArticlePreprintObject(arg) || isArticleToappearObject(arg) || isArticlePublishedObjet(arg) || isArticleProceedingsObject(arg);
}
function isArticleObjectArray(arg) {
    return (arg instanceof Array) && arg.every(isArticleObject);
}
exports.isArticleObjectArray = isArticleObjectArray;
var Article = /** @class */ (function (_super) {
    __extends(Article, _super);
    function Article(window, articleObj) {
        var _this = _super.call(this, window) || this;
        _this.data = articleObj;
        return _this;
    }
    Article.prototype.getType = function () {
        return this.data.type;
    };
    Article.prototype.getOutputElements = function (outputLang) {
        // title
        var title = this.document.createElement("span");
        title.classList.add("article-title");
        title.appendChild(this.document.createTextNode(this.data.title));
        // journal
        var journal = null;
        if (this.data.type == ArticleType.toappear) {
            journal = this.document.createElement("span");
            journal.appendChild(this.document.createTextNode("to appear in "));
            journal.appendChild(base_1.makeAnchor(this.window, this.data.journal, this.data["journal-url"]));
        }
        else if (this.data.type == ArticleType.published) {
            journal = this.document.createElement("span");
            var journal_str = this.data.journal + ", " + this.data["journal-page"];
            journal.appendChild(base_1.makeAnchor(this.window, journal_str, this.data["article-url"]));
        }
        else if (this.data.type == ArticleType.proceedings) {
            journal = this.document.createElement("span");
            journal.appendChild(base_1.makeAnchor(this.window, this.data.journal, this.data["journal-url"]));
        }
        // year
        var year = this.document.createElement("span");
        if (this.data.type == ArticleType.proceedings) {
            year.appendChild(this.document.createTextNode(String(this.data.year)));
        }
        // arxiv
        var arxiv = this.document.createElement("span");
        if (this.data.type == ArticleType.preprint || this.data.type == ArticleType.toappear || this.data.type == ArticleType.published) {
            var url = "https://arxiv.org/abs/" + this.data.arxiv;
            var a = base_1.makeAnchor(this.window, this.data.arxiv, url);
            a.classList.add("arxiv");
            arxiv.appendChild(a);
        }
        // output
        var outputElements = {
            title: title,
            journal: journal,
            year: year,
            arxiv: arxiv
        };
        return outputElements;
    };
    Article.prototype.toLaTeX = function (outputLang, headerList) {
        var latexCode = "";
        // title
        latexCode += this.data.title;
        // journal
        if (this.data.type == ArticleType.toappear) {
            latexCode += ", to appear in " + this.data.journal;
        }
        else if (this.data.type == ArticleType.published) {
            latexCode += ", " + this.data.journal + ", " + this.data["journal-page"] + ", " + this.data["year-published"];
        }
        else if (this.data.type == ArticleType.proceedings) {
            latexCode += ", " + this.data.journal;
        }
        // arxiv
        if (this.data.type == ArticleType.toappear) {
            latexCode += ", also available at arXiv:" + this.data.arxiv;
        }
        else if (this.data.type == ArticleType.preprint) {
            latexCode += ", arXiv:" + this.data.arxiv;
        }
        return latexCode;
    };
    return Article;
}(base_1.Work));
var ArticleList = /** @class */ (function (_super) {
    __extends(ArticleList, _super);
    function ArticleList(window, articleObjArray) {
        var _this = this;
        var data = articleObjArray.map(function (articleObj) { return new Article(window, articleObj); });
        _this = _super.call(this, window, data) || this;
        return _this;
    }
    ArticleList.getHeaderListNormal = function (outputLang) {
        if (outputLang == base_1.Lang.en) {
            return [["title", "title"],
                ["journal", "journal"],
                // ["year", "year"],
                ["arxiv", "arXiv"]];
        }
        else if (outputLang == base_1.Lang.ja) {
            return [["title", "タイトル"],
                ["journal", "雑誌"],
                // ["year", "出版年"],
                ["arxiv", "arXiv"]];
        }
        else {
            throw Error("invalid lang");
        }
    };
    ArticleList.getHeaderListNonRefereed = function (outputLang) {
        if (outputLang == base_1.Lang.en) {
            return [["title", "title"],
                ["journal", "journal"],
                ["year", "year"]];
        }
        else if (outputLang == base_1.Lang.ja) {
            return [["title", "タイトル"],
                ["journal", "雑誌"],
                ["year", "出版年"]];
        }
        else {
            throw Error("invalid lang");
        }
    };
    return ArticleList;
}(base_1.WorkList));
var ArticleListHandler = /** @class */ (function () {
    function ArticleListHandler(window, articleObjArray, output) {
        this.output = output;
        this.articleList = new ArticleList(window, articleObjArray);
        this.document = window.document;
    }
    ArticleListHandler.prototype.getHeadingNormal = function (outputLang) {
        var h3 = this.document.createElement("h3");
        if (outputLang == base_1.Lang.en) {
            h3.appendChild(this.document.createTextNode("Papers and preprints"));
        }
        else if (outputLang == base_1.Lang.ja) {
            h3.appendChild(this.document.createTextNode("論文・プレプリント"));
        }
        return h3;
    };
    ArticleListHandler.prototype.getHeadingNonRefereed = function (outputLang) {
        var h3 = this.document.createElement("h3");
        if (outputLang == base_1.Lang.en) {
            h3.appendChild(this.document.createTextNode("Non refereed articles"));
        }
        else if (outputLang == base_1.Lang.ja) {
            h3.appendChild(this.document.createTextNode("その他"));
        }
        return h3;
    };
    ArticleListHandler.prototype.show = function (outputFormat, outputLang, reverse) {
        if (reverse === void 0) { reverse = false; }
        var htmlClass = "articles";
        this.output.innerHTML = ""; // clear the content of the HTML element
        var headerListNormal = ArticleList.getHeaderListNormal(outputLang);
        this.output.appendChild(this.getHeadingNormal(outputLang));
        this.output.appendChild(this.articleList.toHTMLElement(outputFormat, outputLang, headerListNormal, reverse, isNormalArticle, htmlClass));
        var headerListNonRefereed = ArticleList.getHeaderListNonRefereed(outputLang);
        this.output.appendChild(this.getHeadingNonRefereed(outputLang));
        this.output.appendChild(this.articleList.toHTMLElement(outputFormat, outputLang, headerListNonRefereed, reverse, isNonRefereedArticle, htmlClass));
    };
    return ArticleListHandler;
}());
exports.ArticleListHandler = ArticleListHandler;
function isNormalArticle(article) {
    return article.getType() == ArticleType.preprint || article.getType() == ArticleType.toappear || article.getType() == ArticleType.published;
}
function isNonRefereedArticle(article) {
    return article.getType() == ArticleType.proceedings;
}

},{"./base":2}],2:[function(require,module,exports){
"use strict";
exports.__esModule = true;
function makeAnchor(window, text, url, target_blank) {
    if (target_blank === void 0) { target_blank = true; }
    var document = window.document;
    var a = document.createElement("a");
    a.appendChild(document.createTextNode(text));
    a.href = url;
    if (target_blank) {
        a.target = "_blank";
        // add icon
        // https://stackoverflow.com/questions/23463072/how-do-i-use-javascript-to-insert-an-svg-use-element-into-an-svg-group
        if (window.target_blankIconUrl != null) {
            var svgns = "http://www.w3.org/2000/svg";
            var svg = document.createElementNS(svgns, "svg");
            svg.classList.add("target-blank-icon");
            var use = document.createElementNS(svgns, "use");
            // const use = document.createElement("use");
            var xlinkns = "http://www.w3.org/1999/xlink";
            var target_blankIconUrl = window.target_blankIconUrl;
            use.setAttributeNS(xlinkns, "href", target_blankIconUrl);
            svg.appendChild(use);
            a.appendChild(svg);
        }
    }
    return a;
}
exports.makeAnchor = makeAnchor;
function hasProperty(obj, prop) {
    return prop in obj;
}
exports.hasProperty = hasProperty;
function hasPropertyOfType(obj, prop, valueType) {
    return hasProperty(obj, prop) && (typeof obj[prop] == valueType);
}
exports.hasPropertyOfType = hasPropertyOfType;
function hasOptionalPropertyOfType(obj, prop, valueType) {
    return !hasProperty(obj, prop) || (typeof obj[prop] == valueType);
}
exports.hasOptionalPropertyOfType = hasOptionalPropertyOfType;
var Lang;
(function (Lang) {
    Lang["ja"] = "ja";
    Lang["en"] = "en";
})(Lang = exports.Lang || (exports.Lang = {}));
var Work = /** @class */ (function () {
    function Work(window) {
        this.window = window;
        this.document = window.document;
    }
    ;
    Work.prototype.toLi = function (outputLang, headerList) {
        var _this = this;
        var li = this.document.createElement("li");
        var outputElements = this.getOutputElements(outputLang);
        var elementAlreadyAdded = false;
        headerList.forEach(function (keyHeader) {
            var key = keyHeader[0];
            var element = outputElements[key];
            // ↑ element の型注釈を省略すると，下の if 節内で element が non-null だと推論してくれない
            if (element != null) {
                if (elementAlreadyAdded) {
                    li.appendChild(_this.document.createTextNode(", "));
                }
                li.appendChild(element);
                elementAlreadyAdded = true;
            }
        });
        return li;
    };
    Work.prototype.toTr = function (outputLang, headerList) {
        var _this = this;
        var tr = this.document.createElement("tr");
        var outputElements = this.getOutputElements(outputLang);
        headerList.forEach(function (keyHeader) {
            var key = keyHeader[0];
            var td = _this.document.createElement("td");
            var element = outputElements[key];
            if (element != null) {
                td.appendChild(element);
            }
            tr.appendChild(td);
        });
        return tr;
    };
    Work.prototype.toLaTeXItem = function (outputLang, headerList) {
        var latexCode = this.toLaTeX(outputLang, headerList);
        return "\\item " + latexCode;
    };
    return Work;
}());
exports.Work = Work;
var WorkList = /** @class */ (function () {
    function WorkList(window, data) {
        this.data = data;
        this.window = window;
        this.document = window.document;
    }
    WorkList.prototype.getData = function (reverse, filter) {
        if (reverse === void 0) { reverse = false; }
        var data;
        if (reverse) {
            data = this.data.slice().reverse();
        }
        else {
            data = this.data;
        }
        if (filter == null) {
            return data;
        }
        return data.filter(filter);
    };
    WorkList.prototype.toList = function (listType, outputLang, headerList, reverse, filter, htmlClass) {
        if (reverse === void 0) { reverse = false; }
        var list = this.document.createElement(listType);
        if (reverse && listType == OutputFormat.ol) {
            var ol = list; // もうちょっとマシな書き方？
            ol.reversed = true;
        }
        if (htmlClass != null) {
            list.classList.add(htmlClass);
        }
        this.getData(reverse, filter).forEach(function (work) {
            list.appendChild(work.toLi(outputLang, headerList));
        });
        return list;
    };
    WorkList.prototype.getTableHeader = function (headerList) {
        var _this = this;
        var tr = this.document.createElement("tr");
        headerList.forEach(function (keyHeader) {
            var header = keyHeader[1];
            var th = _this.document.createElement("th");
            th.appendChild(_this.document.createTextNode(header));
            tr.appendChild(th);
        });
        return tr;
    };
    WorkList.prototype.toTable = function (outputLang, headerList, reverse, filter, htmlClass) {
        if (reverse === void 0) { reverse = false; }
        var table = this.document.createElement("table");
        if (htmlClass != null) {
            table.classList.add(htmlClass);
        }
        table.appendChild(this.getTableHeader(headerList));
        this.getData(reverse, filter).forEach(function (work) {
            table.appendChild(work.toTr(outputLang, headerList));
        });
        return table;
    };
    WorkList.prototype.toLaTeXCodeBlock = function (outputLang, headerList, reverse, filter) {
        var _this = this;
        if (reverse === void 0) { reverse = false; }
        var div = this.document.createElement("div");
        div.classList.add("highlight"); // code block の highlight を適用
        var pre = this.document.createElement("pre");
        div.appendChild(pre);
        pre.appendChild(this.document.createTextNode("\\begin{itemize}\n"));
        this.getData(reverse, filter).forEach(function (work) {
            var item = work.toLaTeXItem(outputLang, headerList);
            pre.appendChild(_this.document.createTextNode("  " + item + "\n"));
        });
        pre.appendChild(this.document.createTextNode("\\end{itemize}\n"));
        return div;
    };
    WorkList.prototype.toHTMLElement = function (outputFormat, outputLang, headerList, reverse, filter, htmlClass) {
        if (reverse === void 0) { reverse = false; }
        if (outputFormat == OutputFormat.ul || outputFormat == OutputFormat.ol) {
            return this.toList(outputFormat, outputLang, headerList, reverse, filter, htmlClass);
        }
        else if (outputFormat == OutputFormat.table) {
            return this.toTable(outputLang, headerList, reverse, filter, htmlClass);
        }
        else if (outputFormat == OutputFormat.itemize) {
            return this.toLaTeXCodeBlock(outputLang, headerList, reverse, filter);
        }
        else {
            throw Error("This can't happen!");
        }
    };
    return WorkList;
}());
exports.WorkList = WorkList;
var OutputFormat;
(function (OutputFormat) {
    OutputFormat["ul"] = "ul";
    OutputFormat["ol"] = "ol";
    OutputFormat["table"] = "table";
    OutputFormat["itemize"] = "itemize";
})(OutputFormat = exports.OutputFormat || (exports.OutputFormat = {}));

},{}],3:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var base_1 = require("./base");
var talk_1 = require("./talk");
var article_1 = require("./article");
function isValidJson(arg) {
    return (typeof arg == "object") && (arg != null) &&
        base_1.hasProperty(arg, "talks") && talk_1.isTalkObjectArray(arg.talks) &&
        base_1.hasProperty(arg, "articles") && article_1.isArticleObjectArray(arg.articles);
}
exports.isValidJson = isValidJson;

},{"./article":1,"./base":2,"./talk":5}],4:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var base_1 = require("./base");
var talk_1 = require("./talk");
var article_1 = require("./article");
var data_1 = require("./data");
// <reference path="talk.ts"/>
// <reference path="article.ts"/>
main();
function main() {
    if (!isWindowWithGlobalVariables(window)) {
        throw Error("window does not have required properties");
    }
    var _window = window;
    document.addEventListener("DOMContentLoaded", function () {
        // scope の関係で window は上書きされてしまうっぽい？
        loadFromJson(_window.researchJsonFile);
    });
    window.updateTalks = updateTalks;
}
function isWindowWithGlobalVariables(win) {
    // ちゃんと実装しよう
    return true;
}
var talkListHandler;
var articleListHandler;
function loadFromJson(file) {
    var httpObj = new XMLHttpRequest();
    httpObj.open("get", file, true);
    httpObj.onload = function () {
        var json = this.responseText;
        var jsonObj = JSON.parse(json);
        if (!data_1.isValidJson(jsonObj)) {
            throw Error("invalid JSON");
        }
        var talkDiv = document.getElementById("talk"); // まずい
        talkListHandler = new talk_1.TalkListHandler(window, jsonObj.talks, talkDiv);
        // talkListGlobal = TalkList.create(json, "talk");
        // talkListGlobal.showList(Lang.ja, true);
        // talkList.showTable(Lang.ja);
        var articleDiv = document.getElementById("article"); // まずい
        articleListHandler = new article_1.ArticleListHandler(window, jsonObj.articles, articleDiv);
        setupForm();
        updateTalks();
    };
    httpObj.send(null);
}
function isConfigForm(arg) {
    // チェックが緩すぎる
    return (typeof arg == "object") && (arg != null) &&
        ("order" in arg) && ("language" in arg) && ("format" in arg) && ("split" in arg);
}
function getForm() {
    var configForm = document.getElementById("config-form");
    if (!isConfigForm(configForm)) {
        throw Error("no config-form found");
    }
    return configForm;
}
function setupForm() {
    ["format-table", "order-new-old", "language-japanese", "split-true"].forEach(function (id) {
        var radioButton = document.querySelector("#" + id); // やばい
        radioButton.checked = true;
    });
}
function updateTalks() {
    var configForm = getForm();
    // order
    var radioOrder = configForm.order;
    var order = radioOrder.value;
    var reverse;
    if (order == "new-old") {
        reverse = true;
    }
    else if (order == "old-new") {
        reverse = false;
    }
    else {
        throw Error("invalid order specification");
    }
    // language
    var radioLanguage = configForm.language;
    var language = radioLanguage.value;
    var outputLang;
    if (language == "en") {
        outputLang = base_1.Lang.en;
    }
    else if (language == "ja") {
        outputLang = base_1.Lang.ja;
    }
    else {
        throw Error("invalid language");
    }
    // format
    var radioFormat = configForm.format;
    var format = radioFormat.value;
    var outputFormat;
    if (format == "ol") {
        outputFormat = base_1.OutputFormat.ol;
    }
    else if (format == "ul") {
        outputFormat = base_1.OutputFormat.ul;
    }
    else if (format == "table") {
        outputFormat = base_1.OutputFormat.table;
    }
    else if (format == "itemize") {
        outputFormat = base_1.OutputFormat.itemize;
    }
    else {
        throw Error("Invalid output format");
    }
    // split
    var radioSplit = configForm.split;
    var split = (radioSplit.value == "true");
    // update
    talkListHandler.show(outputFormat, outputLang, reverse, split);
    articleListHandler.show(outputFormat, outputLang, reverse);
}

},{"./article":1,"./base":2,"./data":3,"./talk":5}],5:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var base_1 = require("./base");
function isTalkBaseInfo(arg) {
    return (typeof arg == "object") && (arg != null) &&
        base_1.hasPropertyOfType(arg, "date", "string") &&
        base_1.hasPropertyOfType(arg, "lang", "string") && (arg.lang in base_1.Lang);
}
exports.isTalkBaseInfo = isTalkBaseInfo;
function isTalkInfo(arg) {
    return (typeof arg == "object") && (arg != null) &&
        base_1.hasPropertyOfType(arg, "title", "string") &&
        base_1.hasPropertyOfType(arg, "conference", "string") &&
        base_1.hasPropertyOfType(arg, "venue", "string") &&
        base_1.hasOptionalPropertyOfType(arg, "url", "string");
}
exports.isTalkInfo = isTalkInfo;
function isTalkObject(arg) {
    return (typeof arg == "object") && (arg != null) &&
        base_1.hasProperty(arg, "base") && isTalkBaseInfo(arg.base) &&
        (!base_1.hasProperty(arg, "ja") || isTalkInfo(arg.ja)) &&
        (!base_1.hasProperty(arg, "en") || isTalkInfo(arg.en));
}
exports.isTalkObject = isTalkObject;
function isTalkObjectArray(arg) {
    return (arg instanceof Array) && arg.every(isTalkObject);
}
exports.isTalkObjectArray = isTalkObjectArray;
var Talk = /** @class */ (function (_super) {
    __extends(Talk, _super);
    function Talk(window, talkObj) {
        var _this = _super.call(this, window) || this;
        _this.data = talkObj;
        return _this;
    }
    Talk.prototype.getLang = function () {
        return this.data.base.lang;
    };
    Talk.prototype.getInfo = function (outputLang) {
        if (this.data[outputLang] != null) {
            return this.data[outputLang]; // 良くないけど…
        }
        else if (this.data.ja != null) {
            return this.data.ja;
        }
        else if (this.data.en != null) {
            return this.data.en;
        }
        else {
            throw new Error("ja nor en found");
        }
    };
    Talk.prototype.getDateString = function (outputLang) {
        var date = new Date(this.data.base.date);
        var year = date.getFullYear();
        var monthZeroIndex = date.getMonth(); // 0, 1,..., 11
        if (outputLang == base_1.Lang.ja) {
            return year + "\u5E74" + (monthZeroIndex + 1) + "\u6708";
        }
        else if (outputLang == base_1.Lang.en) {
            // const monthNames: Array<string> = [
            //     "January", "February", "March", "April", "May", "June",
            //     "July", "August", "September", "October", "November", "December"];
            var monthNames = [
                "Jan.", "Feb.", "Mar.", "Apr.", "May", "June",
                "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."
            ];
            var monthString = monthNames[monthZeroIndex];
            return monthString + " " + year;
        }
        else {
            throw new Error("This can't happen!");
        }
    };
    Talk.prototype.getOutputElements = function (outputLang) {
        var talkInfo = this.getInfo(outputLang);
        // title
        var title = this.document.createElement("span");
        title.appendChild(this.document.createTextNode(talkInfo.title));
        // conference
        var conference;
        if (talkInfo.url) {
            conference = base_1.makeAnchor(this.window, talkInfo.conference, talkInfo.url);
        }
        else {
            conference = this.document.createElement("span");
            conference.appendChild(this.document.createTextNode(talkInfo.conference));
        }
        // venue
        var venue = this.document.createElement("span");
        venue.appendChild(this.document.createTextNode(talkInfo.venue));
        // date
        var date = this.document.createElement("span");
        date.appendChild(this.document.createTextNode(this.getDateString(outputLang)));
        // output
        var outputElements = {
            title: title,
            conference: conference,
            venue: venue,
            date: date
        };
        return outputElements;
    };
    Talk.prototype.toLaTeX = function (outputLang, headerList) {
        var talkInfo = this.getInfo(outputLang);
        var title = talkInfo.title;
        var conference = talkInfo.conference;
        var venue = talkInfo.venue;
        var date = this.getDateString(outputLang);
        return title + ", " + conference + ", " + venue + ", " + date;
    };
    return Talk;
}(base_1.Work));
var TalkList = /** @class */ (function (_super) {
    __extends(TalkList, _super);
    function TalkList(window, talkObjArray) {
        var _this = this;
        var data = talkObjArray.map(function (talkObj) { return new Talk(window, talkObj); });
        _this = _super.call(this, window, data) || this;
        return _this;
    }
    TalkList.getHeaderList = function (outputLang) {
        if (outputLang == base_1.Lang.en) {
            return [["title", "talk title"],
                ["conference", "conference name"],
                ["venue", "venue"],
                ["date", "date"]];
        }
        else if (outputLang == base_1.Lang.ja) {
            return [["title", "講演タイトル"],
                ["conference", "研究集会名"],
                ["venue", "会場"],
                ["date", "日付"]];
        }
        else {
            throw Error("invalid lang");
        }
    };
    return TalkList;
}(base_1.WorkList));
var TalkListHandler = /** @class */ (function () {
    function TalkListHandler(window, talkObjArray, output) {
        this.output = output;
        this.talkList = new TalkList(window, talkObjArray);
        this.document = window.document;
    }
    TalkListHandler.prototype.getHeadingEnglish = function (outputLang) {
        var h3 = this.document.createElement("h3");
        if (outputLang == base_1.Lang.en) {
            h3.appendChild(this.document.createTextNode("Talks in English"));
        }
        else if (outputLang == base_1.Lang.ja) {
            h3.appendChild(this.document.createTextNode("国際研究集会"));
        }
        return h3;
    };
    TalkListHandler.prototype.getHeadingJapanese = function (outputLang) {
        var h3 = this.document.createElement("h3");
        if (outputLang == base_1.Lang.en) {
            h3.appendChild(this.document.createTextNode("Talks in Japanese"));
        }
        else if (outputLang == base_1.Lang.ja) {
            h3.appendChild(this.document.createTextNode("国内研究集会"));
        }
        return h3;
    };
    TalkListHandler.prototype.show = function (outputFormat, outputLang, reverse, split) {
        if (reverse === void 0) { reverse = false; }
        if (split === void 0) { split = true; }
        var htmlClass = "talks";
        var headerList = TalkList.getHeaderList(outputLang);
        this.output.innerHTML = ""; // clear the content of the HTML element
        if (split) {
            this.output.appendChild(this.getHeadingEnglish(outputLang));
            this.output.appendChild(this.talkList.toHTMLElement(outputFormat, outputLang, headerList, reverse, isEnglishTalk, htmlClass));
            this.output.appendChild(this.getHeadingJapanese(outputLang));
            this.output.appendChild(this.talkList.toHTMLElement(outputFormat, outputLang, headerList, reverse, isJapaneseTalk, htmlClass));
        }
        else {
            this.output.appendChild(this.talkList.toHTMLElement(outputFormat, outputLang, headerList, reverse, undefined, htmlClass));
        }
    };
    return TalkListHandler;
}());
exports.TalkListHandler = TalkListHandler;
function isEnglishTalk(talk) {
    return (talk.getLang() == base_1.Lang.en);
}
function isJapaneseTalk(talk) {
    return (talk.getLang() == base_1.Lang.ja);
}

},{"./base":2}]},{},[4]);
