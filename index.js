#! /usr/bin/env node
const client = require('leilo-client-api');
const program = require('commander');
const readline = require('readline');
const colors = require('colors');
const d = require('util').getDefault;
const localID = "local";
const serverID = "leilo";

const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const cust = process.argv.slice(0, 2);

let conn;
const setupConn = (user, pass, address = "http://localhost:80") => {
    conn = client(address, {
        username: user,
        password: pass,
    }, {
        debugLevel: "normal"
    });
};

const p = (e) => {
    if (!Array.isArray(e))
        return [e];
    return e;
};

//setup command template
program
    .version('0.0.1')
    .description('Leilo CLI');

program.command('quit').alias('q')
    .description("Exits the program")
    .action(() => {
        conn.emit(['forceDisconnect', localID, localID]);
        process.exit();
    });

program.command('login <user> <pass> [address]').alias('l')
    .description("Connects to a Leilo server")
    .action(setupConn);

program.command('updateUserLevel <user> <level>').alias('uul')
    .description('Changes a users level')
    .action((user, level) => conn.emit(['updateUserLevel', localID, serverID], {
        user: user,
        level: level,
    }));

program.command('create <name> <value> [path...]').alias('c')
    .description('Create an object')
    .action((name, value, path) =>
        conn.emit(['create', localID, serverID, 'path', ...p(path)], {
            newObjName: name,
            newObjVal: value,
        }));

program.command('update <value> [path...]').alias('u')
    .description('Update an object')
    .action((value, path) =>
        conn.emit(['update', localID, serverID, 'path', ...p(path)], {
            value: value,
        }));

program.command('delete [path...]').alias('d')
    .description('Delete an object')
    .action((path) =>
        conn.emit(['delete', localID, serverID, 'path', ...p(path)]));

program.command('subscribe [path...]').alias("sub")
    .description('Subscribe to an object')
    .action((path) =>
        conn.emit(['subscribe', localID, serverID], {
            path: p(path)
        }));

program.command('unsubscribe [path...]').alias("unsub")
    .description('Unsubscribe from an object')
    .action((path) => conn.emit(['unsubscribe', localID, serverID], {
        path: p(path)
    }));

program.command('createUser <user> <pass>').alias('cu')
    .description('Creates a user')
    .action((user, pass) => conn.emit(['createUser', localID, serverID], {
        username: user,
        password: pass,
    }));

program.parse(process.argv);

console.log("Press [Enter] to send command".yellow);
r1.on('line', (cmd) => {
    program.parse(cust.concat(cmd.match(/(?:[^\s"]+|"[^"]*")+/g)));
});