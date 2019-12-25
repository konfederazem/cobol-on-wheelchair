COBOL on Wheelchair
===================

Micro web-framework for COBOL (in statu nascendi)

OK, [COBOL-ON-COGS](http://www.coboloncogs.org/HOME.HTM) was funny, but why not try that for real? ;)

Things you'll need to run _COBOL on Wheelchair_:

* [GNU Cobol](http://sourceforge.net/projects/open-cobol/) (```sudo apt install open-cobol``` on Debian-based distributions)
* Ability to run cgi-bin on Apache server (alternatively, included development server might be used)


Installation
-------------

```
git clone https://github.com/konfederazem/cobol-on-wheelchair/
cd cobol-on-wheelchair
./downhill.sh
```

CLI
---

Requires Node.js to be installed.

Available commands:
```
build – builds an executable. Examples:
          node cli build                    # Outputs to the.cow
          node cli build outputFileName.cow # Outputs to outputFileName.cow
start – starts a local server for development purposes. Examples:
          node cli start                    # Listens on localhost:3000
          PORT=1337 node cli start          # Listens on localhost:1337
watch – starts a local server for development purposes. Builds an executable
        on file change. Example:
          node cli watch
help   – shows this menu
```

Tutorial
--------

[Originally uploaded under http://adrianzandberg.pl/cobol-on-wheelchair/](tutorial/index.md)
