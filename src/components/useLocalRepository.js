import PouchDB from 'pouchdb';
import {credentials} from "./useCredentials";

import {todos} from "./useTodos"

export function useLocalRepository() {
    let dbName = 'gestiones-poc'
    let userName = ""
    // PouchDB.debug.enable('*');

    var localDB = {};
    let remoteDB = {};


    let todoStorage = {
        init: (user) => {
            userName = user
            console.log(`UserName ${userName}`);

            let options = {
                live: true,
                // retry: true,
                continuous: true,
                checkpoint: false,
                auth: {
                    username: credentials.username,
                    password: credentials.password
                },
                filter: "poc-filtro/todos-user",
                query_params: {"user": userName}
            };

            let optionsLocal = {
                live: true,
                // retry: true,
                continuous: true,
                checkpoint: false

            };
            localDB = new PouchDB(dbName, optionsLocal);
            remoteDB = new PouchDB(`${credentials.url}/${dbName}`, options);

            localDB.replicate.from(remoteDB, options).on('active', (doc) => {
                todoStorage.replicatoToRemote();

                console.log(`Active Event replicate from ${JSON.stringify(doc)}`);
                console.log("Lanzado Init Remote DB");
            }).on('error', (err) => console.log('[Database::syncChanges() SYNC]: Error (1):' + JSON.stringify(err))
            ).on('complete', function (doc) {
                console.log(`Active Event replicate from  ${JSON.stringify(doc)}`);
            });

            todos.getTodos();
        },
        replicatoToRemote() {

            localDB.replicate.to(remoteDB
            ).on('change', function (info) {
                console.log(`Change Event  ${JSON.stringify(info)}`);
            }).on('paused', function (err) {
                console.log('[Database::syncChanges() paused]: Error (1):' + JSON.stringify(err));
            }).on('active', function (doc) {
                console.log(`Active Event  ${JSON.stringify(doc)}`);
                todos.getTodos();
            }).on('denied', function (err) {
                console.log('[Database::syncChanges() TO]: Error (1):' + JSON.stringify(err));
            }).on('complete', function (info) {
                console.log(`Complete Event  ${JSON.stringify(info)}`);

            }).on('error', function (err) {
                console.log(' TO]: Error (1):' + JSON.stringify(err));
            });
        },
        fetch: () => {
            return localDB.allDocs({include_docs: true, descending: true}).then((todos) => {
                console.log(todos);
                return todos;
            }).catch(function (err) {
                console.log("Error al recuperar documentos");
                console.log(err);
            });
        },
        create: function (todo) {
            return localDB.put(todo).then(() => {
                todoStorage.replicatoToRemote();
                return todo;
            }).catch(function (err) {
                console.log("OOOOPS");
                console.log(err);
            });
        },
        update: function (todo) {
            return localDB.get(todo.doc._id).then(() => {
                todoStorage.replicatoToRemote();
                return localDB.put(todo.doc);
            }).then(() => {
                return true;
            });
        },
        deleteItem: function (id, rev) {
            return localDB.remove(id, rev).then(() => {
                todoStorage.replicatoToRemote();
                return true;
            }).catch(function (err) {
                console.log("Uh oh");
                console.log(err);
            });
        }
    };

    return {todoStorage};
}