
$(document).ready(function() {

    // document.cookie = document.cookie = "username=John Doe; expires=Thu, 18 Dec 2013 12:00:00 UTC";
    // document.cookie  = "cookieAccepted=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    // let decodeCookie = decodeURIComponent( document.cookie )
    // let cookies = decodeCookie.split(';')
    // let $cookieBar = $('#cookieBar')
    // let isCookieAccepted = false
    // cookies.forEach( cookie => {
    //     let splittedCookie = cookie.split('=')
    //     // console.log(splittedCookie)
    //     if( splittedCookie[0].trim() == 'cookieAccepted' ) {
    //         let cookieAcceptedValue = splittedCookie[1].trim()
    //         if( cookieAcceptedValue == true ) {
    //             isCookieAccepted = true
    //             console.log( 'true' )

    //         } else {
                
                
    //             console.log( 'false' )
    //         }
    //     }

    //     if( !isCookieAccepted ) {
    //         $cookieBar.show()

    //     }

    // } )
    // // console.log(cookies)
    // $('#cookiesBtn').on( 'click', function() {
    //     document.cookie = 'cookieAccepted=true'
    //     $cookieBar.hide()
    // } )
    // console.log(document.cookie)

    $.getJSON("assets/images/photos.json", function(data) {
        var photos = data.photos
        
        
        let miniSearch = new MiniSearch({
            fields: ['title', 'description'], // fields to index for full-text search
            idField: 'title',
            storeFields: ['title', 'description'] // fields to return with search results
        })
        miniSearch.addAll(photos)

        var $filterInput = $('#filterInput')
        $filterInput.on('keyup', function() {
            var term = $filterInput.val()
            let results = miniSearch.search( term, { boost: {title: 2} } )
            if( results.length <= 0 ) {
                $('#app').html('')

                photos.forEach( photo => {
                    let img = document.createElement('img')
                    img.src = '/assets/images/thumbnails/' + photo.src
                    $('#app').append( img )
                } )
            } else {
                $('#app').html('')
                console.log( results )
                photos.forEach( photo => {
                    results.forEach( result => {

                        if( photo.title == result.id)  {
                            
                            let img = document.createElement('img')
                            img.src = '/assets/images/thumbnails/' + photo.src
                            $('#app').append( img )
                        }
                    } )

                    
                } )
            }
            
            
        } )


        photos.forEach( photo => {
            let img = document.createElement('img')
            img.src = '/assets/images/thumbnails/' + photo.src
            $('#app').append( img )
        } )
        
    });
    
    
    
})