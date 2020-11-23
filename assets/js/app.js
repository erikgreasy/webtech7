
$(document).ready(function() {

    var settingCookie = true

    // CLEAR COOKIE
    // setCookie('imagesOrder', '')
    
    // get images from json
    $.getJSON("assets/images/photos.json", function(data) {
        photos = data.photos

        var photosSrc = []

        if( getCookie( 'imagesOrder' ) ) {
            let cookiesImagesSrc = getImagesFromCookie()

            cookiesImagesSrc.forEach( photo => {
                photosSrc.push( photo )
            } )


        } else {
            photos.forEach( photo => {
                photosSrc.push( photo.src )
            } )
        }


        let photosLinks = photosSrc.map( photo => '/assets/images/thumbnails/' + photo )

        renderImages( photosLinks )
        miniSearch.addAll(photos)

        $filterInput.on('keyup', function() {
            var term = $filterInput.val()
            
            let results = miniSearch.search( term, { boost: {title: 2} } )
            $('#startSlideshow').show()
            
            if( results.length == 0 ) {
                settingCookie = true
                renderImages( createLinkArrayFromSrcArray( getImagesFromCookie() ) )

            } else {
                if( results.length == 1 ) {
                    $('#startSlideshow').hide()
                }
                settingCookie = false
                let filteredLinks = []
                results.forEach( result => {
                    filteredLinks.push( '/assets/images/thumbnails/' + result.src )
                } )

                renderImages( filteredLinks )
            }

            getActualShownImages()

        } )

    });
    


    var $filterInput = $('#filterInput')
    let miniSearch = new MiniSearch({
        fields: ['title', 'description'], // fields to index for full-text search
        idField: 'title',
        storeFields: ['title', 'description', 'src'] // fields to return with search results
    })
    

    var order = []

    $( "#app" ).sortable({
        update: function( ) {
            order = $('#app').children()
            orderString = ''
            
            order.each( function(i, item) {
                let itemName = item.src.split('/')[ item.src.split('/').length -1 ]
                orderString += itemName + ','
            } )
            if( settingCookie ) {

                setCookie( 'imagesOrder', orderString, 2 )
            }
        },
        
    });

    $('.next-image').on('click', () => {
        showNext( getImageNameFromSrc( $('#exampleModalCenter').find('.modal-img').attr('src') ) )
        stopSlideshow()
    })
    
    $('.prev-image').on('click', () => {
        showPrevious( getImageNameFromSrc( $('#exampleModalCenter').find('.modal-img').attr('src') ) )
        stopSlideshow()
    })

    $('#startSlideshow').on('click', function() {
        
        
        $('#exampleModalCenter').attr('data-slideshow', 'true')
       
            interval = setInterval(function() {
                showNext( getImageNameFromSrc( $('#exampleModalCenter').find('.modal-img').attr('src') ), true )
                
            }, 4000);
          

    })
    $('#stopSlideshow').on('click', function() {
        
        
        
        stopSlideshow()
      

    })
      
        
    
})


function getActualShownImages() {
    return $('#app').find('.gallery-img')
}


function showPrevious( openImage ) {
    images = getActualShownImages()
    let clickedIndex = -1
    images.each( function(i, image) {
        if( getImageNameFromSrc( image.src ) === openImage ) {
            clickedIndex = i
        }
    } )
    if( clickedIndex == 1 && images.length > 1 ) {
        $('.prev-image').addClass('hidden')
        $('.next-image').removeClass('hidden')

    } else {
        $('.prev-image').removeClass('hidden')
        $('.next-image').removeClass('hidden')
    }




    $('#exampleModalCenter').find('.modal-img').attr('src', images[clickedIndex -1 ].src )
    let desc;
    let title;

    photos.forEach( img => {
        if( img.src == getImageNameFromSrc( images[clickedIndex-1 ].src ) ) {
            desc = img.description
            title = img.title
        }
    } )

    $('.img-title').text( title )
    $('.img-desc').text( desc )
    
}
function showNext( openImage, slideshow = false ) {
    images = getActualShownImages()
    let clickedIndex = -1
    images.each( function(i, image) {
        if( getImageNameFromSrc( image.src ) === openImage ) {
            clickedIndex = i
        }
    } )
    if( clickedIndex == images.length-2 && images.length > 1 ) {
        $('.prev-image').removeClass('hidden')
        $('.next-image').addClass('hidden')

    } else if( clickedIndex == images.length-1 ) {
        $('.prev-image').addClass('hidden')
        $('.next-image').removeClass('hidden')

    } else {
        $('.prev-image').removeClass('hidden')
        $('.next-image').removeClass('hidden')
    }


    if(slideshow) {
        if( clickedIndex == images.length-1 ) {
            $('#exampleModalCenter').find('.modal-img').attr('src', images[ 0 ].src )

        } else {
            $('#exampleModalCenter').find('.modal-img').attr('src', images[clickedIndex +1 ].src )

        }
    } else {

        $('#exampleModalCenter').find('.modal-img').attr('src', images[clickedIndex +1 ].src )
    }

    


    let desc;
    let title;
    console.log(clickedIndex)
    photos.forEach( img => {
        if( clickedIndex == images.length-1  ) {
            clickedIndex = -1
            

        }
        if( img.src == getImageNameFromSrc( images[clickedIndex+1 ].src )) {
            desc = img.description
            title = img.title
        }
    } )

    $('.img-title').text( title )
    $('.img-desc').text( desc )
}

function makeImagesOpenable(  ) {
    $('.gallery-img').on('click', function() {
        $('#exampleModalCenter').find('.modal-img').attr('src', '/assets/images/' + getImageNameFromSrc( this.src ))
        
        let images = getActualShownImages()

        let desc;
        let title;

        photos.forEach( img => {
            if( img.src == getImageNameFromSrc( this.src ) ) {
                desc = img.description
                title = img.title
            }
        } )

        $('.img-title').text( title )
        $('.img-desc').text( desc )


        let clickedImage = this

        let clickedIndex = -1

        images.each( function(i, image) {
            if( image.src === clickedImage.src ) {
                clickedIndex = i
            }
        } )

        if( clickedIndex == 0 ) {
            $('.prev-image').addClass('hidden')
        }
        if( clickedIndex == images.length-1 ) {
            $('.next-image').addClass('hidden')
        }



        $('#exampleModalCenter').modal()
    })

    
    $('#exampleModalCenter').on('hidden.bs.modal', function () {
        stopSlideshow()
    
        $('.prev-image').removeClass('hidden')
        $('.next-image').removeClass('hidden')
    
    })
    
}



function getImageNameFromSrc( src ) {
    let splitted = src.split('/')
    return splitted[ splitted.length - 1 ]
}

function getImagesFromCookie() {
    
    let cookiesImagesSrc = getCookie( 'imagesOrder' ).split(',')

    // filter out elements that are empty string
    cookiesImagesSrc = cookiesImagesSrc.filter( image => image.trim() != '' )

    return cookiesImagesSrc
}

function createLinkArrayFromSrcArray( srcArray ) {
    let linkArray = []
    srcArray.forEach( src => {
        linkArray.push( '/assets/images/thumbnails/' + src )
    } )

    return linkArray
}


function reorderImages( images ) {
    

    return images
}

function renderImages( images ) {
    $('#app').html('')
    if( images ) {

        images.forEach( imageSrc => {
            let img = document.createElement('img')
            img.classList.add( 'gallery-img' )
            img.src = imageSrc
            $('#app').append( img )
        } )
    }
    makeImagesOpenable()

}


/**
 * Returns the value of cookie value of cookie with name cname.
 * If no cname cookie found, return empty string.
 */
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}





function stopSlideshow() {
    try {

        clearInterval( interval )
    } catch(error) {
        //
    }
    
    $('#exampleModalCenter').attr('data-slideshow', 'false')

}