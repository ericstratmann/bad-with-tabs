haml src/options.haml > out/options.html
#haml test/test.haml > out/test.html
cp spec/specrunner.html out/specrunner.html
coffee -o out -c src/options.coffee
coffee -bcj out/spec.js spec/*.coffee
coffee -bcj out/background.js src/{util.coffee,policy.coffee,browser.coffee,window.coffee,tab.coffee}
