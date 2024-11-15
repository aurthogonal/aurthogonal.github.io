// script.js

(function() {
    var initPhotoSwipeFromDOM = function(gallerySelector) {
      // Parse slide data from DOM elements
      var parseThumbnailElements = function(el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            linkEl,
            size,
            item;
  
        for(var i = 0; i < numNodes; i++) {
          linkEl = thumbElements[i]; // <a> element
  
          // include only element nodes
          if(linkEl.nodeType !== 1) {
            continue;
          }
  
          size = linkEl.getAttribute('data-size').split('x');
  
          // create slide object
          item = {
            src: linkEl.getAttribute('href'),
            w: parseInt(size[0], 10),
            h: parseInt(size[1], 10),
            title: linkEl.querySelector('img').getAttribute('alt') || ''
          };
  
          items.push(item);
        }
  
        return items;
      };
  
      // Find nearest parent element
      var closest = function closest(el, fn) {
        return el && ( fn(el) ? el : closest(el.parentNode, fn) );
      };
  
      // On thumbnail click
      var onThumbnailsClick = function(e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;
  
        var eTarget = e.target || e.srcElement;
  
        // Find root element of slide
        var clickedListItem = closest(eTarget, function(el) {
          return (el.tagName && el.tagName.toUpperCase() === 'A');
        });
  
        if(!clickedListItem) {
          return;
        }
  
        // Find index of clicked item
        var clickedGallery = clickedListItem.parentNode,
            childNodes = clickedGallery.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;
  
        for (var i = 0; i < numChildNodes; i++) {
          if(childNodes[i].nodeType !== 1) { 
            continue; 
          }
  
          if(childNodes[i] === clickedListItem) {
            index = nodeIndex;
            break;
          }
          nodeIndex++;
        }
  
        if(index >= 0) {
          openPhotoSwipe(index, clickedGallery);
        }
        return false;
      };
  
      // Open PhotoSwipe
      var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;
  
        items = parseThumbnailElements(galleryElement);
  
        // Define options
        options = {
          index: index,
          bgOpacity: 0.8,
          showHideOpacity: true,
          captionEl: true,
          fullscreenEl: true,
          zoomEl: true,
          shareEl: false,
          arrowEl: true,
          tapToClose: true,
          tapToToggleControls: true
        };
  
        // Initialize and open PhotoSwipe
        gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
      };
  
      // Loop through all gallery elements and bind events
      var galleries = document.querySelectorAll(gallerySelector);
  
      for(var i = 0, l = galleries.length; i < l; i++) {
        galleries[i].setAttribute('data-pswp-uid', i+1);
        galleries[i].onclick = onThumbnailsClick;
      }
    };
  
    // Execute initialization
    initPhotoSwipeFromDOM('.gallery');
  })();
  
document.addEventListener('DOMContentLoaded', function () {
fetch('images.json')
    .then(response => {
    if (!response.ok) {
        throw new Error('Failed to load images.json');
    }
    return response.json();
    })
    .then(images => {
    const gallery = document.querySelector('.gallery');
    images.forEach(image => {
        const link = document.createElement('a');
        link.href = image.src;
        link.setAttribute('data-size', image.size);
        
        const img = document.createElement('img');
        img.src = image.thumbnail;
        img.alt = 'Artwork';
        
        link.appendChild(img);
        gallery.appendChild(link);
    });
    })
    .catch(error => console.error('Error loading images:', error));
});
  