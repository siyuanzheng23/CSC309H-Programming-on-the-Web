$(document).ready(function()
{
    
    /**
     *
     *  WEEK 7 LAB 6 BASIC
     *
     *  The goal of this activity is to create a dynamic image slider.
     * 
     */
    
    // No database or flatfile ... we're using inline data.
    // Where things go in MVC on the web is flexible and contextual.
    // Note how JSON and JS arrays work very nicely together.
    // Note also that we don't need an ID per image since we have the array index.
    
    var images = [
        {
            "title": "Andromeda Galaxy",
            "url": "assets/images/space-1.jpg"
        },
        {
            "title": "Collection of galaxies",
            "url": "assets/images/space-2.jpg"
        },
        {
            "title": "Lights on Earth at night from space",
            "url": "assets/images/space-3.jpg"
        },
        {
            "title": "Earth from space",
            "url": "assets/images/space-4.jpg"
        },
        {
            "title": "Pluto (New Horizons)",
            "url": "assets/images/space-5.jpg"
        }
    ];
    

    // Our first step is to create the HTML elements we need dynamically.
    // We use $("<element>") with the < and > to do this.
    // Although very similar, $("element") is a CSS-style selector of an existing element (we hope).
    // So be very careful with your syntax!

    // Let's use a <ul> list element for the images:
    // var $slider = ...
    
    var $slider = $("<ul/>");

    
    // Next, let's create a <li> for each image using a loop.
    // You can use the utility method $.each(), which isn't called on a selection.
    // Or you can use $(selection).each() to iterate over that selection.
    // Since this is a non-jQuery array, we can use the utility method or basic JS loops.
    
    var leftOffset = 0;
    
    $.each( images, function(index, item)
    {
        // You'll want to create a <li> with an <img> inside of it.
        // Each <li> needs to have a CSS left property applied to it that is += 250px each time,
        // EXCEPT for the second element which is 500px to account for huge width of the first element.
        // Hint: You'll want to add the <img> you create to the <li>, then add the <li> to the <ul>.
        // Hint: .append() vs .appendTo() depends on whether you've selected the parent or child.
        
        // You'll also want to use both properties in each image JSON: url and title.
        // Hint: You can use title as the alt and/or title attribute for the <img> element.
  
        
        if ( index == 1 ) leftOffset += 250;
        
        //var $li = ...
        var $li = $('<li/>');
        $li.css('left',leftOffset);

        
        //var $img = ...
        var $img = $('<img/>',{
            title:images[index].title,
            src:images[index].url
        });
        
        // Do appending here! YOUR CODE HERE
        $li.append($img);
        $slider.append($li);
        
        leftOffset += 250;
    });
    
    // Then we can append the slider <ul> to <section id="gallery">, which is a non-dyanamic HTML element in index.html.
    // YOUR CODE HERE
    
    $('#gallery').append($slider);
    
    // Since we want the first image to be bigger than the next two, we'll need to apply double the width.
    // Use the :first-child selector.
    // YOUR CODE HERE

    $('li:first-child').css('width','500px');
    
    
    // Next, let's use jQuery UI, which extends jQuery by adding user interface controllers and other tools.
    // We're going to use a slider as the control mechanism for scrolling among the images.
    // You'll have to create a <div> in jQuery with id "controller", then apply the .slider() to this dynamic element.
    // Some day we'll have a <controller> element or similar ... but the semantic web isn't there yet.
    // Place it below the slider <ul> in the <section> element with one of the append functions.
    
    var step_size = 100 / (images.length - 1); //25
    
    // var $controller = ...
    var $controller = $("<div/>",{
        id:'controller'
    });
    $slider.append($controller);
    
    $controller.slider({
        value: 0,
        min: 0,
        max: 100,
        step: step_size,
        slide: function( event, ui )
        {
            // You may wish to take a minute here to open your browser developer tools (e.g., Firebug),
            // inspect the controller, use it, and watch how classes are dynamically added/removed to the DOM
            // depending on the various mouse-related events (mouseover, mousedown, dragging ...).

            // ui.value indicates the position of the slider in pixels, Since
            // we specified min=0 and max=100, it will be between these values,
            // locked to increments of step_size.
            //
            // Thus, we can get the slider index (0, 1, 2, 3, 4) by dividing ui.value by our step size.
            var slider_index = ui.value / step_size; //25

            // Let's start with the first big "showcased" element. Since we're going to refer
            // to it a lot, let's make a reference. The convention for the variable name is to add
            // a $ to the front so we know it's a jQuery object. Use .eq(slider_index).
            // var $showcase = ...
            var $showcase = $('li').eq(slider_index);

            // Now, let's get the images before (to the left of) and after (to the right of) the showcase.
            var before = $showcase.prevAll();
            var after = $showcase.nextAll();

            // Let's animate the showcase! 
            // The showcase should always be the leftmost image (left: 0), and should have a width of 500 px.
            //$showcase.animate(...);
            $showcase.animate({
                width:'500px',
                left:'0px'
            });

            // prevAll() returns elements starting with the closest sibling --
            // so, if the third image is currently shown, prevAll()[0] will be
            // the second image, and prevAll()[1] will be the third image.
            // This is a little tricky, so we'll provide the code:
            $showcase.prevAll().each(function(index) {
                $(this).animate({
                    left: -250*(index + 1),
                    width: 250
                }, { duration: 200, queue: true });
            });

            // Now perform a similar operation for images coming after the showcase.
            // Hint: Use nextAll().
            $showcase.nextAll().each(function(index) {
                $(this).animate({
                    left: 250*(index) + 500,
                    width: 250
                }, { duration: 200, queue: true });
            });
            // Hint: The "left" value should be width multiplied by the index and also account for a 500 px offset.
            //$showcase. ...
        }
    });
    
    $("section#gallery").append($controller);
    
});
