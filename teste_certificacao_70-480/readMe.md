# API - Watch Later
---
### api/ping
```js
      METHOD | GET
RESPONSE 200 | "dd/MM/yyyy HH:mm:ss"
```

### api/user
```js
      METHOD | POST
        BODY | { username: "", password: "" }
RESPONSE 200 |
RESPONSE 400 | ["error1", "error2"]
```

### api/login
```js
      METHOD | POST
        BODY | { username: "", password: "" }
RESPONSE 200 | "ID-USER"
RESPONSE 400 | ["error1", "error2"]
```
### api/category
```js
      METHOD | GET
RESPONSE 200 | [ { id: "", name: "" }, ... ]
```

### api/user/{id}/movie
```js
      METHOD | GET
RESPONSE 200 | [ 
             |     { 
             |         id: "", 
             |         idUser: "", 
             |         idCategory: "", 
             |         name: "", 
             |         urlPoster: "", 
             |         urlTrailler: "", 
             |         watched: false, 
             |         watchedDate: "yyyy-MM-ddTHH:mm:ssZ", 
             |         quality: 0, 
             |         description: "" 
             |     }, 
             |     ... 
             | ]
RESPONSE 400 | ["error1", "error2"]
```

### api/user/{id}/movie
```js
      METHOD | POST
        BODY | {
             |     idUser: "",
             |     idCategory: "",
             |     name: "",
             |     urlPoster: "",
             |     urlTrailler: "",
             |     watched: false,
             |     watchedDate: "yyyy-MM-ddTHH:mm:ssZ",
             |     quality: 0,
             |     description: ""
             | }
RESPONSE 200 | 
RESPONSE 400 | ["error1", "error2"]
```

### api/user/{id}/movie/{idMovie}
```js
      METHOD | PUT
        BODY | {
             |     idUser: "",
             |     idCategory: "",
             |     name: "",
             |     urlPoster: "",
             |     urlTrailler: "",
             |     watched: false,
             |     watchedDate: "yyyy-MM-ddTHH:mm:ssZ",
             |     quality: 0,
             |     description: ""
             | }
RESPONSE 200 | 
RESPONSE 400 | ["error1", "error2"]
```

### api/user/{id}/movie/{idMovie}
```js
      METHOD | DELETE
RESPONSE 200 | 
RESPONSE 400 | ["error1", "error2"]
```