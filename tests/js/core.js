// Generated by CoffeeScript 1.4.0
(function() {

  test("elements", function() {
    var MyModule, a, b, button, list, myDiv, myInstance;
    MyModule = manufactory.module(function(M) {
      return M.root('.abc');
    });
    equal(MyModule.ROOT_SELECTOR, '.abc', 'M.root() works');
    MyModule = manufactory.module(function(M) {
      M.element('.abc', 'foo', true);
      M.element('input[name=abc]');
      M.element('body', null, false, true);
      return M.element('body', 'theBody', true, true);
    });
    deepEqual(MyModule.ELEMENTS, {
      foo: {
        selector: '.abc',
        dynamic: true,
        global: false
      },
      inputNameAbc: {
        selector: 'input[name=abc]',
        dynamic: false,
        global: false
      },
      body: {
        selector: 'body',
        dynamic: false,
        global: true
      },
      theBody: {
        selector: 'body',
        dynamic: true,
        global: true
      }
    }, 'M.element() works');
    MyModule = manufactory.module(function(M) {
      return M.tree(".abc\n\n  [type=button] \n  ul / items %useless_option%  \n    li /  item dynamic\n  .js-something\nbody / theBody  global\nbody  / global dynamic");
    });
    equal(MyModule.ROOT_SELECTOR, '.abc', 'M.tree() works (root)');
    deepEqual(MyModule.ELEMENTS, {
      typeButton: {
        selector: '[type=button]',
        dynamic: false,
        global: false
      },
      items: {
        selector: 'ul',
        dynamic: false,
        global: false
      },
      item: {
        selector: 'li',
        dynamic: true,
        global: false
      },
      theBody: {
        selector: 'body',
        dynamic: false,
        global: true
      },
      body: {
        selector: 'body',
        dynamic: true,
        global: true
      },
      something: {
        selector: '.js-something',
        dynamic: false,
        global: false
      }
    }, 'M.tree() works (elements)');
    myDiv = $("<div>\n  <input type=button value=lick_me>\n  <ul>\n    <li>1</li> <li>2</li> <li>3</li>\n  </ul>\n</div>").appendTo('body');
    myInstance = new MyModule(myDiv);
    a = myInstance.find('li:last-child').get();
    b = myDiv.find('li:last-child').get();
    deepEqual(a, b, '@find() method works');
    a = myInstance.el.root.get();
    b = myDiv.get();
    deepEqual(a, b, '@el.root accesor works');
    a = myInstance.el.typeButton.get();
    b = myDiv.find('[value=lick_me]').get();
    deepEqual(a, b, '@%element_name% accesor works');
    a = myInstance.el.item().get();
    b = myDiv.find('li').get();
    deepEqual(a, b, '@%dynamic_element_name%() accesor works');
    a = myInstance.el.theBody.get();
    b = $('body').get();
    deepEqual(a, b, 'Hey!');
    a = myInstance.el.body().get();
    b = $('body').get();
    deepEqual(a, b, 'Ho!');
    myDiv.remove();
    myDiv = $("<div></div>").appendTo('body');
    button = $("<input type=button value=lick_me>");
    list = $("<ul><li>1</li> <li>2</li> <li>3</li></ul>");
    myInstance = new MyModule(myDiv);
    a = myInstance.el.typeButton.get();
    b = [];
    deepEqual(a, b, 'element accesor empty before element added');
    myDiv.append(button);
    myInstance.updateElements();
    a = myInstance.el.typeButton.get();
    b = button.get();
    deepEqual(a, b, 'element accesed after it was added');
    list.appendTo(myDiv);
    myInstance.updateElements();
    a = myInstance.el.items.get();
    b = list.get();
    deepEqual(a, b, 'element accesed after it was added #2');
    return myDiv.remove();
  });

  test("global variables", function() {
    var MyModule;
    MyModule = manufactory.module('MyApp.MyModule', function(M) {});
    return equal(window.MyApp.MyModule, MyModule, "global varible creates");
  });

  test("methods", function() {
    var MyModule, myInstance;
    expect(2);
    MyModule = manufactory.module(function(M) {
      return M.methods({
        initializer: function() {
          return ok(true, 'initializer() calls on instnace creation');
        },
        foo: function() {
          return 'bar';
        }
      });
    });
    myInstance = new MyModule($('<div></div>'));
    return equal(myInstance.foo(), 'bar', 'method declared in builder goes to module');
  });

  test("settings", function() {
    var MyModule, inst_1, inst_2, inst_3, myDiv;
    MyModule = manufactory.module(function(M) {
      return M.expectSettings('foo bar');
    });
    myDiv = $('<div data-foo="abc" data-bar="def" data-some="abc1"></div>');
    inst_1 = new MyModule(myDiv);
    deepEqual(inst_1.settings, {
      foo: 'abc',
      bar: 'def'
    }, 'settings grubs from data-*');
    myDiv = $('<div data-foo="abc" data-some="abc1"></div>');
    inst_2 = new MyModule(myDiv, {
      baz: 'abc2'
    });
    deepEqual(inst_2.settings, {
      foo: 'abc',
      baz: 'abc2'
    }, 'settings pased to constructor has accepted');
    myDiv = $('<div data-foo="abc" data-some="abc1"></div>');
    inst_3 = new MyModule(myDiv, {
      foo: 'abc2'
    });
    return deepEqual(inst_3.settings, {
      foo: 'abc2'
    }, 'settings pased to constructor overvrites data-settings');
  });

  test("initialization (load)", function() {
    var el, elements, html, _i, _len, _results;
    expect(3);
    html = "<div class=\"my-module\"></div>mo";
    elements = [];
    elements.push($(html).appendTo('body'));
    manufactory.module(function(M) {
      M.root('.my-module');
      return M.methods({
        initializer: function() {
          return ok(true);
        }
      });
    });
    elements.push(el = $(html));
    $('body').append(el);
    manufactory.initAll();
    elements.push($(html).appendTo('body'));
    manufactory.initAll();
    _results = [];
    for (_i = 0, _len = elements.length; _i < _len; _i++) {
      el = elements[_i];
      _results.push($(el).remove());
    }
    return _results;
  });

  test("DOM events", function() {
    var myDiv;
    expect(10);
    manufactory.module(function(M) {
      M.tree(".my-module1\n  [type=button]\n  a");
      M.events("lick typeButton  buttonLicked\nlick  typeButton extraHandler\nkick typeButton onKick\n\nkick a  onKick   \nkick a onKickA");
      M.event('lick', 'typeButton', function(element, event, eventData) {
        equal(typeof this.buttonLicked, 'function', '(inline) `this` in handler is module instance');
        equal(element, this.el.typeButton[0], '(inline) `element` in handler is event target');
        return equal(eventData, 'abc', '(inline) `eventData` in handler ...');
      });
      return M.methods({
        buttonLicked: function(element, event, eventData) {
          equal(typeof this.buttonLicked, 'function', '`this` in handler is module instance');
          equal(element, this.el.typeButton[0], '`element` in handler is event target');
          return equal(eventData, 'abc', '`eventData` in handler ...');
        },
        extraHandler: function() {
          return ok(true, "multiple handlers on same event");
        },
        onKick: function() {
          return ok(true, "Different event on same element,\nand one handler on multiple events.\nShould be called twice.");
        },
        onKickA: function() {
          return ok(true, 'another one');
        }
      });
    });
    myDiv = $("<div class=my-module1>\n  <input type=button value=lick_me>\n  <a href=#>kick me</a>\n</div>");
    myDiv.appendTo('body');
    manufactory.initAll();
    return myDiv.find('input').trigger('lick', 'abc').trigger('kick').end().find('a').trigger('kick').end().remove();
  });

  test("global DOM events", function() {
    var myDiv;
    expect(12);
    myDiv = $("<div>\n  <div class=my-module4 data-a=1></div>\n  <div class=my-module4 data-a=2></div>\n</div>").appendTo('body');
    manufactory.module(function(M) {
      M.root('.my-module4');
      M.element('body', 'theBody', false, true);
      M.event('lick', 'theBody', function(element, event, eventData) {
        equal(typeof this.onLickBody, 'function', '`this` in handler is module instance');
        equal(element, $('body')[0], '`element` in handler is event target');
        return equal(eventData, 'abc', '`eventData` in handler ...');
      });
      M.event('lick', 'theBody', 'onLickBody');
      return M.methods({
        onLickBody: function(element, event, eventData) {
          equal(typeof this.onLickBody, 'function', '`this` in handler is module instance');
          equal(element, $('body')[0], '`element` in handler is event target');
          return equal(eventData, 'abc', '`eventData` in handler ...');
        }
      });
    });
    $('body').trigger('lick', 'abc');
    return myDiv.remove();
  });

  test("jquery-plugin", function() {
    var el, myDiv, _i, _len, _ref;
    myDiv = $("<div>\n  <div class=my-module2 data-a=1></div>\n  <div class=my-module2 data-a=2></div>\n  <div class=my-module2 data-a=3></div>\n</div>").appendTo('body');
    manufactory.module('Module1', function(M) {
      M.root('.my-module2');
      return M.methods({
        foo: function() {
          return 'bar';
        },
        getA: function() {
          return this.el.root.data('a');
        }
      });
    });
    _ref = myDiv.find('div');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      el = _ref[_i];
      equal($(el).data('a'), $(el).module('Module1').getA(), '.module()');
    }
    return myDiv.remove();
  });

  test("module events (local)", function() {
    var MyModule, handler, myInstance;
    expect(3);
    MyModule = manufactory.module(function(M) {});
    myInstance = new MyModule($('<div></div>'));
    handler = function(data, eventName) {
      equal(data, 'abc');
      equal(this, myInstance);
      return equal(eventName, 'event-1');
    };
    myInstance.on('event-1', handler);
    myInstance.fire('event-1', 'abc');
    myInstance.fire('not-listened-event');
    myInstance.off('event-1', handler);
    return myInstance.fire('event-1', 'abc');
  });

  test("module events (global)", function() {
    var handler, myInstance;
    expect(3);
    manufactory.module('SuperModule', function(M) {});
    myInstance = new SuperModule($('<div></div>'));
    handler = function(data, eventName) {
      equal(data, 'abc');
      equal(this, myInstance);
      return equal(eventName, 'event-1');
    };
    manufactory.on('event-1', 'SuperModule', handler);
    myInstance.fire('event-1', 'abc');
    myInstance.fire('not-listened-event');
    manufactory.off('event-1', 'SuperModule', handler);
    return myInstance.fire('event-1', 'abc');
  });

  test("module events (syntax sugar)", function() {
    var currentAInstance, moduleA1, moduleA2, moduleB1, moduleB2;
    expect(28);
    currentAInstance = null;
    manufactory.module('ModuleA', function(M) {
      return M.methods({
        initializer: function() {
          return this.fire('born', 'abc');
        },
        die: function() {
          return this.fire('die', 'cba');
        }
      });
    });
    manufactory.module('ModuleB', function(M) {
      M.moduleEvents("born ModuleA onItBorn\n\ndie  ModuleA onItDie");
      return M.methods({
        onItDie: function(aInstance, data, eventName) {
          equal(aInstance, currentAInstance);
          equal(data, 'cba');
          equal(eventName, 'die');
          return equal(this.constructor.NAME, 'ModuleB');
        },
        onItBorn: function(aInstance, data, eventName) {
          equal(data, 'abc');
          equal(eventName, 'born');
          return equal(this.constructor.NAME, 'ModuleB');
        }
      });
    });
    moduleB1 = new ModuleB($('<div></div>'));
    moduleB2 = new ModuleB($('<div></div>'));
    moduleA1 = new ModuleA($('<div></div>'));
    moduleA2 = new ModuleA($('<div></div>'));
    currentAInstance = moduleA1;
    moduleA1.die();
    currentAInstance = moduleA2;
    return moduleA2.die();
  });

}).call(this);
