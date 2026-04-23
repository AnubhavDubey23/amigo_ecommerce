/*  ---------------------------------------------------
    Template Name: Violet 
    Description: Violet ecommerce Html Template
    Author: Colorlib
    Author URI: https://colorlib.com/
    Version: 1.0
    Created: Colorlib
---------------------------------------------------------  */

'use strict';

(function ($) {

    /*------------------
        Preloader
    --------------------*/
    $(window).on('load', function () {
        $(".loader").fadeOut();
        $("#preloder").delay(200).fadeOut("slow");

        /*------------------
            Product filter
        --------------------*/
        if ($('#product-list').length > 0) {
            var containerEl = document.querySelector('#product-list');
            var mixer = mixitup(containerEl);
        }
    });

    /*------------------
        Background Set
    --------------------*/
    $('.set-bg').each(function () {
        var bg = $(this).data('setbg');
        $(this).css('background-image', 'url(' + bg + ')');
    });

    /*------------------
        Navigation
    --------------------*/
    $(".mobile-menu").slicknav({
        appendTo: '.header-section',
        allowParentLinks: true,
        closedSymbol: '<i class="fa fa-angle-right"></i>',
        openedSymbol: '<i class="fa fa-angle-down"></i>'
    });

    /*------------------
        Search model
    --------------------*/
    $('.search-trigger').on('click', function () {
        $('.search-model').fadeIn(400);
    });

    $('.search-close-switch').on('click', function () {
        $('.search-model').fadeOut(400, function () {
            $('#search-input').val('');
        });
    });

    /*------------------
        Carousel Slider
    --------------------*/
    $(".hero-items").owlCarousel({
        loop: true,
        margin: 0,
        nav: true,
        items: 1,
        dots: true,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
        smartSpeed: 1200,
        autoplayHoverPause: true,
        mouseDrag: false,
        autoplay: false,
    });

    /*------------------
        Carousel Slider
    --------------------*/
    $(".logo-items").owlCarousel({
        loop: true,
        nav: false,
        dots: false,
        margin: 40,
        autoplay: true,
        responsive: {
            0: {
                items: 2
            },
            480: {
                items: 2
            },
            768: {
                items: 3
            },
            992: {
                items: 5
            }
        }
    });


    /*------------------
        Carousel Slider
    --------------------*/
    $(".product-slider").owlCarousel({
        loop: true,
        margin: 0,
        nav: false,
        items: 1,
        dots: true,
        autoplay: true,
    });


    /*------------------
        Magnific Popup
    --------------------*/
    $('.pop-up').magnificPopup({
        type: 'image'
    });

    /*-------------------
        Sort Select
    --------------------- */
    $('.sort').niceSelect();

    /*-------------------
        Cart Select
    --------------------- */
    $('.cart-select').niceSelect();

    /*-------------------
        Quantity change
    --------------------- */
    var proQty = $('.pro-qty');
    proQty.prepend('<span class="dec qtybtn">-</span>');
    proQty.append('<span class="inc qtybtn">+</span>');
    proQty.on('click', '.qtybtn', function () {
        var $button = $(this);
        var oldValue = $button.parent().find('input').val();
        if ($button.hasClass('inc')) {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            // Don't allow decrementing below zero
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }
        $button.parent().find('input').val(newVal);
    });

    /*-------------------
        Radio Btn
    --------------------- */
    $(".shipping-info .cs-item label").on('click', function () {
        $(".shipping-info .cs-item label").removeClass('active');
        $(this).addClass('active');
    });

    $(".checkout-form .diff-addr label").on('click', function () {
        $(this).toggleClass('active');
    });

    $(".payment-method ul li label").on('click', function () {
        $(this).toggleClass('active');
    });

    /*-------------------
        Scroll Animations
    --------------------- */
    // Fade-in-up animation on scroll
    var observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe product items, feature boxes, and section titles
    document.querySelectorAll('.single-product-item, .single-features-ads, .single-box-item, .section-title, .footer-widget .single-footer-widget, .lookbok-left, .lookbok-pic').forEach(function (el) {
        el.classList.add('fade-in-up');
        observer.observe(el);
    });

    // Stagger product cards
    document.querySelectorAll('.single-product-item').forEach(function (el, i) {
        el.style.transitionDelay = (i % 4) * 0.1 + 's';
    });

    // --- Amigo Backend Integration ---
    const API_BASE = '/api';

    // Utility to get auth headers
    window.getAuthHeaders = function() {
        const token = localStorage.getItem('amigo_token');
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? 'Bearer ' + token : ''
        };
    };

    // Global: Update Cart Counter
    window.updateCartCounter = async function() {
        const token = localStorage.getItem('amigo_token');
        if (!token) return;

        try {
            const res = await fetch(API_BASE + '/cart', { headers: window.getAuthHeaders() });
            if (res.ok) {
                const cart = await res.json();
                const count = cart.reduce((acc, item) => acc + item.quantity, 0);
                
                // Update all bag counters
                const bagCounters = document.querySelectorAll('.header-right a span');
                bagCounters.forEach(span => {
                    span.innerText = count;
                });
            }
        } catch (err) {
            console.error('Failed to fetch cart', err);
        }
    };

    // Global: Update UI based on auth state
    window.updateAuthStateUI = function() {
        const token = localStorage.getItem('amigo_token');
        const userAccessContainers = document.querySelectorAll('.user-access');
        
        userAccessContainers.forEach(container => {
            if (token) {
                container.innerHTML = '<a href="#" onclick="logout(event)">Log out</a>';
            } else {
                container.innerHTML = '<a href="register.html">Register</a><a href="login.html" class="in">Sign in</a>';
            }
        });
    };

    window.logout = function(e) {
        if(e) e.preventDefault();
        localStorage.removeItem('amigo_token');
        localStorage.removeItem('amigo_user');
        window.location.reload();
    };

    $(document).ready(function() {
        window.updateAuthStateUI();
        window.updateCartCounter();
    });

})(jQuery);