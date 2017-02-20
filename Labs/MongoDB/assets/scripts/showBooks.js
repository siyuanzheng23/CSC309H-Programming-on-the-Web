// App namespace.
var booksApp = {};


/**
 * Makes list text.
 *
 * @param {object} book
 * @return {string} book item text.
 */
booksApp.makeListText = function(book) {
    return `"${book.title}", by ${book.author}. [ISBN ${book.isbn}]`
};

/**
 * Makes like button.
 *
 * @param {object} book
 * @return {object} like button elem.
 */
booksApp.makeLikeButton = function(book) {
    let btn = $(`<button>Like (${book.likes} likes)</button>`);

    // Add click handler. 
    // Binds an event handler for each button at time of creation, with the
    // `isbn` property in the lexical scope. [Aside: if the number of
    // books becomes huge, consider binding handler once to an ancestor]
    btn.on('click', function(evt) {
        $.ajax({
            type: 'PUT',
            url: '/like/' + book.isbn,
            success: function(res) {
                parsedData = JSON.parse(res);
                // Update the number of likes in the button
                btn.text(`Like (${parsedData.likes} likes)`);
            }
        });
    });

    return btn;
};

/**
 * Builds List item.
 *
 * @param {object} book
 * @return {object} book item elem.
 */
booksApp.buildListItem = function(book) {
    return $('<li>').text(this.makeListText(book))
                    .append(this.makeLikeButton(book));
                    //Note for myself: this way is really efficient...
};

/**
 * List Builder.
 */
booksApp.buildList = function() {
    let context = this;

    // Build a list with all the books.
    $.get('books', function(data) {
        let parent = $('#booksList');
        console.log(data);
        for (let i in data) {
            parent.append(context.buildListItem(data[i]));
        }
        //Note for myself: this way is really efficient...
    });
};

/**
 * Add button event handler callback.
 *
 * @param {object} click event
 */
booksApp.submitHandler = function(evt) {
    evt.preventDefault();

    let formData = $('form').serialize();
    console.log(formData);
    $.post('/addbook', formData);
    location.reload(true);
};

/**
 * Init Method.
 */
booksApp.init = function() {
    // Perform a get request and build list.
    this.buildList();

    // Adding event handlers.
    $('#add').submit(this.submitHandler);
};

// Start the app.
$(document).ready(function() {
    booksApp.init();
});

//Note For myself : there are 'two' ways of updating info from server to local in this code, 
//the first is the onclick handler for like button and the other is when user click submit, it 
//'post' the data to the server, after which is calls location.reload to call get books again to load
// data from the server...
