'use strict';

describe('Feature name', function() {

   //run this callback before each test
   beforeEach(function() {
      //reload the page before each test
      //so that testing "clean"
      browser.get('http://localhost:8000');
   });

   it('should do the first thing', function() { });
   
   it('should do the second thing', function() { });
});


describe('Watchlist Metadata', function(){

it('should have the correct title', function(){

        //open webpage
        broswer.get('http://localhost:8080/#/watchlist');

        var title = broswer.getTitle();

        expect(title).toEqual("My Movie Page");

        var links = element.all(by.css('nav a'));



    });
});

describe('Navbar links', function(){
     
    //open webpage
    broswer.get('http://localhost:8080/#/watchlist');

    it('should have the correct links', function(){
        var links = element.all(by.css('nav a'));
        expect(links.length).toEqual(4);
    })
})

describe('Initial page appearance', function(){
    
      //open webpage
    broswer.get('http://localhost:8080/#/watchlist');

    it('should have the correct header', function(){
        var header = element.all(by.css('header h1'));
        expect(header.getText()).toEqual("Movies to Watch");
    });

    it('should not display by default', function(){
        var elem = element(by.css('.search-results'));
        expect(elem.isPresent()).toEqual(false);
    });

    it('should have correct home url', function(){
        var elem = element(by.linkText('HOME'));
        var blogLink = element(by.linkText('BLOG'));
        expect(elem.getAttribute('href')).toBe('http://localhost:8080/#/home');
        expect(blogLink.getAttribute('href')).toBe('http://localhost:8080/#/blog');
    });

});

describe('search form', function(){
    
    it('should enable the button on valid input', function(){
        var input = element(by.model('searchQuery'));
        var button = element(by.css("#searchButton"));

        input.sendKeys('batman');
        expect(button.isEnabled()).toEqual(true);

        input.clear();
        expect(button.isEnabled()).toEqual(false);
        
    });

    it('should show the modal on search', function(){
        var input = element(by.model('searchQuery'));
        var button = element(by.css("#searchButton"));
        var modal = element(by.css('.modal-body'));

        input.sendKeys('star wars');

        button.click();

        browser.pause();

        expect(modal.isVisible()).toEqual(true);

    });

});