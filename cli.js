const { createServer } = require("http");
const { execFile } = require("child_process");
const { readdir, readFile, watch } = require("fs");
const path = require("path");

const port = process.env.PORT || 3000;

class Server {
  constructor() {
    this.server = createServer((req, res) => {
      if (req.url.split("/")[1] === "images") {
        readFile(__dirname + req.url, (err, data) => {
          if (err) {
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
          }
          res.writeHead(200);
          return res.end(data);
        });
      } else {
        execFile(
          path.join(__dirname, "the.cow"),
          {
            env: {
              ...process.env,
              PATH_INFO: req.url
            }
          },
          (err, stdout, stderr) => {
            res.statusCode = 200;
            const processedOut = stdout.split("\n\n");
            processedOut
              .shift()
              .split("\n")
              .forEach(header => {
                res.setHeader(...header.split(": "));
              });
            return res.end(processedOut.join("\n\n"));
          }
        );
      }
    });
    return this;
  }

  listen(port) {
    this.server.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}`);
    });
  }
}

const compile = (() => {
  let compiling = false;
  return (message = null, outputFile = "the.cow", cb) => {
    if (!compiling) {
      compiling = true;
      console.time("compiling");
      if (message) console.log(message);
      readdir(path.join(__dirname, "controllers"), (err, items) => {
        if (err) items = [];
        execFile(
          "cobc",
          [
            "-x",
            "-free",
            "cow.cbl",
            ...items.map(item => `controllers/${item}`),
            "-o",
            outputFile
          ],
          {},
          (err, stdout, stderr) => {
            if (stderr) console.error(stderr);
            else console.timeEnd("compiling");
            compiling = false;
            if (cb) cb();
            // hot reloading?
          }
        );
      });
    }
  };
})();

const commands = {
  build: () => {
    compile(null, process.argv[3], () => console.log("Compiled successfully"));
  },
  start: () => {
    compile();
    new Server().listen(port);
  },
  watch: () => {
    const watchHandler = (event, filename) => {
      if (filename.substr(-4).toLowerCase() === ".cbl") {
        compile(`File ${filename} changed.`);
      }
    };
    watch(__dirname, watchHandler);
    watch(path.join(__dirname, "controllers"), watchHandler);
    console.log("Watching for file changes");
    new Server().listen(port);
  },
  help: () => {
    console.log(`
COBOL on Wheelchair CLI
-----------------------
Available commands:
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
    `);
  }
};

(commands[process.argv[2]] || commands.help)();
