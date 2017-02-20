# MongoDB
Only a relatively small(also core) portion of codes were implemented, given starter code.
<br><br>
This is the lab that uses MongoDB database to stores data in the server side(Using Node.js). This lab involves front end + back end coding, http requests, and usages of callback functions.
<br><br>
Three main characteristics:
<br>
--All books data are stored in MongoDB(Using Node.js), there is no local data storage.
<br>
--While 'like' button clicked, client side will send a http put request to the server, server updates the 'likes'(type: number) and save it to the MongoDB, sending back the response of updated 'likes' to the client upon successful save(*). Client will update the correponding html element that indicates 'likes' numbers upon successful call of 'put'.
<br>
--User is able to add data to database by submitting a book's information at the page bottom.
<br><br><br>
<b>Instructions to start: (Mac OS X)</b><br>
1, install <a href='https://nodejs.org/en/'>Node.js</a><br>
2, clone this repo<br>
3, in the terminal, cd into the directory that is cloned<br>
4, follow instructions <a href="https://docs.mongodb.com/manual/installation/?jmp=footer">here</a> to install <b>MongoDB Community edition</b><br>
6, in the terminal, run `mkdir data` <br>
7, in the terminal, run `mongod --dbpath=$PWD/data`<br>
8, in the terminal, run `mongoimport --db booksdb --collection books --type json --file giller.json --jsonArray` <br>
9, open another terminal window, repeat step 3 once and run  `npm install` <br>
10, In the terminal that is opened at step 9, run `node server.js` <br>
11, open a browser and set `localhost:3000` as the url<br>
