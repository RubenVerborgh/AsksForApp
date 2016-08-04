# AsksForApp
Which websites ask you to “use the app instead”?

This command-line tool pretends to be a mobile browser (using [PhantomJS](http://phantomjs.org/)),
and checks whether the website offers to install a mobile app using a couple of heuristics.

## Usage
For a couple of websites:
```bash
$ ./asksforapp http://google.com/ http://facebook.com/
```

With a list of websites:
```bash
$ xargs -L 1 ./asksforapp < alexa/top.txt
```
