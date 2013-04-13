// Generated by CoffeeScript 1.4.0
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __slice = [].slice;

  window.manufactory = {
    _modules: {},
    _instances: {},
    find: function(moduleName) {
      return this._instances[moduleName] || [];
    },
    init: function(moduleName, context) {
      return this._modules[moduleName].init(context);
    },
    initAll: function(context) {
      var Module, moduleName, _ref, _results;
      if (context == null) {
        context = document;
      }
      _ref = this._modules;
      _results = [];
      for (moduleName in _ref) {
        Module = _ref[moduleName];
        if (Module.AUTO_INIT) {
          _results.push(this.init(moduleName, context));
        }
      }
      return _results;
    }
  };

  manufactory.module = function(moduleName, builder) {
    var currentScope, newModule, part, parts, theName, _i, _len;
    if (!builder) {
      builder = moduleName;
      moduleName = null;
    }
    newModule = (function(_super) {

      __extends(_Class, _super);

      function _Class() {
        return _Class.__super__.constructor.apply(this, arguments);
      }

      return _Class;

    })(manufactory.Module);
    newModule.build(moduleName);
    builder(new manufactory.ModuleInfo(newModule));
    if (newModule.AUTO_INIT) {
      newModule.init();
    }
    if (!newModule.LAMBDA) {
      parts = newModule.NAME.split('.');
      theName = parts.pop();
      currentScope = window;
      for (_i = 0, _len = parts.length; _i < _len; _i++) {
        part = parts[_i];
        currentScope = (currentScope[part] || (currentScope[part] = {}));
      }
      currentScope[theName] = newModule;
    }
    return newModule;
  };

  manufactory.Module = (function() {
    var GLOBAL, cloneArray, cloneObject, notOption, selectorToName, splitToLines, whitespace;

    GLOBAL = 'global';

    whitespace = /\s+/;

    splitToLines = function(str) {
      return _(str.split('\n')).filter(function(i) {
        return i !== '';
      });
    };

    notOption = function(i) {
      return i !== GLOBAL;
    };

    selectorToName = function(selector) {
      return $.camelCase(selector.replace(/[^a-z0-9]+/ig, '-').replace(/^-/, '').replace(/-$/, '').replace(/^js-/, ''));
    };

    cloneArray = function(arr) {
      if (_.isArray(arr)) {
        return arr.slice(0);
      } else {
        return [];
      }
    };

    cloneObject = function(obj) {
      if (_.isObject(obj)) {
        return _.clone(obj);
      } else {
        return {};
      }
    };

    Module.AUTO_INIT = true;

    Module.build = function(moduleName) {
      var _this = this;
      if (moduleName) {
        this.LAMBDA = false;
        this.NAME = moduleName;
      } else {
        this.LAMBDA = true;
        this.NAME = _.uniqueId('LambdaModule');
      }
      manufactory._modules[this.NAME] = this;
      this.ELEMENTS = cloneObject(this.ELEMENTS);
      this.EVENTS = cloneArray(this.EVENTS);
      this.DEFAULT_SETTINGS = cloneObject(this.DEFAULT_SETTINGS);
      this.EXPECTED_SETTINGS = cloneArray(this.EXPECTED_SETTINGS);
      return _.defer(function() {
        return $(function() {
          if (_this.AUTO_INIT) {
            return _this.init();
          }
        });
      });
    };

    Module.init = function(context) {
      var el, _i, _len, _ref, _results;
      if (context == null) {
        context = document;
      }
      if (this.ROOT_SELECTOR) {
        _ref = $(this.ROOT_SELECTOR, context).add($(context).filter(this.ROOT_SELECTOR));
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          el = _ref[_i];
          _results.push(new this($(el)));
        }
        return _results;
      } else {
        return [];
      }
    };

    Module.autoInit = function(value) {
      return this.AUTO_INIT = value;
    };

    Module.root = function(rootSelector) {
      return this.ROOT_SELECTOR = $.trim(rootSelector);
    };

    Module.element = function(selector, name, global) {
      if (name == null) {
        name = null;
      }
      if (global == null) {
        global = false;
      }
      if (name === null) {
        name = selectorToName(selector);
      }
      return this.ELEMENTS[name] = {
        selector: selector,
        global: global
      };
    };

    Module.tree = function(treeString) {
      var line, lines, name, options, rootSelector, selector, _i, _len, _ref, _ref1, _results;
      lines = splitToLines(treeString);
      rootSelector = $.trim((_ref = lines.shift()) != null ? _ref.split('/')[0] : void 0);
      if (rootSelector !== '%root%') {
        this.root(rootSelector);
      }
      _results = [];
      for (_i = 0, _len = lines.length; _i < _len; _i++) {
        line = lines[_i];
        _ref1 = _.map(line.split('/'), $.trim), selector = _ref1[0], options = _ref1[1];
        options = (options || '').split(whitespace);
        name = _.filter(options, notOption)[0] || null;
        if (selector) {
          _results.push(this.element(selector, name, __indexOf.call(options, GLOBAL) >= 0));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Module.event = function(eventName, elementName, handler) {
      return this.EVENTS.push({
        elementName: elementName,
        eventName: eventName,
        handler: handler
      });
    };

    Module.events = function(eventsString) {
      var elementName, eventName, handlerName, line, lines, _i, _len, _ref, _results;
      lines = splitToLines(eventsString);
      _results = [];
      for (_i = 0, _len = lines.length; _i < _len; _i++) {
        line = lines[_i];
        _ref = line.split(whitespace), eventName = _ref[0], elementName = _ref[1], handlerName = _ref[2];
        if (!(handlerName != null)) {
          handlerName = elementName;
          elementName = 'root';
        }
        _results.push(this.event(eventName, elementName, handlerName));
      }
      return _results;
    };

    Module.defaultSettings = function(newDefaultSettings) {
      return _.extend(this.DEFAULT_SETTINGS, newDefaultSettings);
    };

    Module.expectSettings = function(expectedSettings) {
      return this.EXPECTED_SETTINGS = _.union(this.EXPECTED_SETTINGS, expectedSettings.split(whitespace));
    };

    function Module(root, settings) {
      var DEFAULT_SETTINGS, EXPECTED_SETTINGS, NAME, dataSettings, existing, _base, _ref;
      _ref = this.constructor, EXPECTED_SETTINGS = _ref.EXPECTED_SETTINGS, DEFAULT_SETTINGS = _ref.DEFAULT_SETTINGS, NAME = _ref.NAME;
      if (existing = root.data(NAME)) {
        return existing;
      }
      ((_base = manufactory._instances)[NAME] || (_base[NAME] = [])).push(this);
      this.root = root;
      this.root.data(NAME, this);
      dataSettings = _.pick(this.root.data() || {}, EXPECTED_SETTINGS);
      this.settings = _.extend({}, DEFAULT_SETTINGS, dataSettings, settings);
      this.__createElements();
      this["__bind"]();
      if (typeof this.initializer === "function") {
        this.initializer();
      }
    }

    Module.prototype.updateElements = function() {
      var name, _results;
      _results = [];
      for (name in this.constructor.ELEMENTS) {
        _results.push(this["$" + name].update());
      }
      return _results;
    };

    Module.prototype.find = function() {
      var args, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref = this.root).find.apply(_ref, args);
    };

    Module.prototype.setOption = function(name, value) {
      this.settings[name] = value;
      return this;
    };

    Module.prototype.__createElements = function() {
      var element, name, _ref, _results;
      this.$root = this.root;
      _ref = this.constructor.ELEMENTS;
      _results = [];
      for (name in _ref) {
        element = _ref[name];
        this["$" + name] = this.__findElement(element);
        _results.push(this["$$" + name] = this.__buildDynamicElement(element));
      }
      return _results;
    };

    Module.prototype.__findElement = function(element) {
      var context, result;
      context = element.global ? document : this.root;
      result = $(element.selector, context);
      result.update = function() {
        var el, _i, _len, _ref;
        this.splice(0, this.length);
        _ref = $(element.selector, context);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          el = _ref[_i];
          this.push(el);
        }
        return this;
      };
      return result;
    };

    Module.prototype.__fixHandler = function(handler) {
      if (typeof handler === 'string') {
        handler = this[handler];
      }
      handler = _.bind(handler, this);
      return function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        args.unshift(this);
        return handler.apply(null, args);
      };
    };

    Module.prototype["__bind"] = function() {
      var ELEMENTS, EVENTS, MODULE_EVENTS, elementName, eventMeta, eventName, handler, _i, _len, _ref;
      _ref = this.constructor, ELEMENTS = _ref.ELEMENTS, EVENTS = _ref.EVENTS, MODULE_EVENTS = _ref.MODULE_EVENTS;
      for (_i = 0, _len = EVENTS.length; _i < _len; _i++) {
        eventMeta = EVENTS[_i];
        handler = eventMeta.handler, eventName = eventMeta.eventName, elementName = eventMeta.elementName;
        (!elementName || elementName === 'root' ? this.root : this["$$" + elementName]).on(eventName, this.__fixHandler(handler));
      }
      return this;
    };

    Module.__dynamicElementMixin = {
      byChild: function(child) {
        return $(child).parents(this.selector);
      },
      byParent: function(parent) {
        return $(parent).find(this.selector);
      },
      on: function(eventName, handler) {
        return (this.global ? $(document) : this.module.root).on(eventName, this.selector, handler);
      }
    };

    Module.prototype.__buildDynamicElement = function(element) {
      var fn;
      fn = function(filter) {
        if (filter) {
          return this.__findElement(element).filter(filter);
        } else {
          return this.__findElement(element);
        }
      };
      return _.extend(fn, {
        module: this
      }, element, this.constructor.__dynamicElementMixin);
    };

    return Module;

  })();

  manufactory.ModuleInfo = (function() {

    function ModuleInfo(Module) {
      this.Module = Module;
    }

    ModuleInfo.prototype.methods = function(newMethods) {
      _.extend(this.Module.prototype, newMethods);
      return this;
    };

    ModuleInfo.prototype.autoInit = function(value) {
      this.Module.autoInit(value);
      return this;
    };

    ModuleInfo.prototype.root = function(rootSelector) {
      this.Module.root(rootSelector);
      return this;
    };

    ModuleInfo.prototype.element = function(selector, name, global) {
      if (name == null) {
        name = null;
      }
      if (global == null) {
        global = false;
      }
      this.Module.element(selector, name, global);
      return this;
    };

    ModuleInfo.prototype.tree = function(treeString) {
      this.Module.tree(treeString);
      return this;
    };

    ModuleInfo.prototype.event = function(eventName, elementName, handler) {
      this.Module.event(eventName, elementName, handler);
      return this;
    };

    ModuleInfo.prototype.events = function(eventsString) {
      this.Module.events(eventsString);
      return this;
    };

    ModuleInfo.prototype.defaultSettings = function(newDefaultSettings) {
      this.Module.defaultSettings(newDefaultSettings);
      return this;
    };

    ModuleInfo.prototype.expectSettings = function(expectedSettings) {
      this.Module.expectSettings(expectedSettings);
      return this;
    };

    return ModuleInfo;

  })();

  _.extend($.fn, {
    module: function(moduleName) {
      if (this.length) {
        return new manufactory._modules[moduleName](this.first());
      }
    }
  });

}).call(this);
