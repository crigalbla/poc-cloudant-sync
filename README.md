# poc-cloudant-sync

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).



#### Filtro sobre usuario
```json
{
  "_id": "_design/gestiones-poc",
  "_rev": "7-b8b5696631ab63a99d017213cda57981",
  "filters": {
    "todos-user": "function(doc, req) { if ( doc.user=== req.query.user) {  return true  } else {  return false  }}"
  },
  "language": "javascript"
}
```