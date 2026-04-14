// ============================================
// CONFIGURATION - MizraimPhoenix Website
// ============================================

// ============================================
// NAVIGATION SCROLL EFFECT
// ============================================
const navMenu = document.getElementById('navMenu');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navMenu.classList.add('scrolled');
    } else {
        navMenu.classList.remove('scrolled');
    }
}, { passive: true });

// ============================================
// MOBILE MENU TOGGLE
// ============================================
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');

if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const isExpanded = navLinks.classList.contains('active');
        mobileToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
            mobileToggle.focus();
        }
    });
}

// ============================================
// CATEGORY TABS WITH ACCESSIBILITY
// ============================================
const tabBtns = document.querySelectorAll('.tab-btn');
const gamesCarousel = document.getElementById('gamesCarousel');
const accessoriesCarousel = document.getElementById('accessoriesCarousel');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active tab
        tabBtns.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        // Show corresponding carousel
        const category = btn.dataset.category;
        if (category === 'games') {
            gamesCarousel.classList.remove('hidden');
            accessoriesCarousel.classList.add('hidden');
            gamesCarousel.setAttribute('aria-hidden', 'false');
            accessoriesCarousel.setAttribute('aria-hidden', 'true');
        } else {
            gamesCarousel.classList.add('hidden');
            accessoriesCarousel.classList.remove('hidden');
            gamesCarousel.setAttribute('aria-hidden', 'true');
            accessoriesCarousel.setAttribute('aria-hidden', 'false');
            // Refresh accessories position when shown
            setTimeout(() => {
                updateCarouselDimensions('accessories');
                updateCarouselPosition('accessories', false);
            }, 10);
        }
    });

    // Keyboard navigation for tabs
    btn.addEventListener('keydown', (e) => {
        let newIndex;
        const tabs = Array.from(tabBtns);
        const currentIndex = tabs.indexOf(btn);

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            newIndex = (currentIndex + 1) % tabs.length;
            tabs[newIndex].focus();
            tabs[newIndex].click();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
            tabs[newIndex].focus();
            tabs[newIndex].click();
        }
    });
});

// ============================================
// CAROUSEL FUNCTIONALITY - INFINITE & SWIPE
// ============================================
const carousels = {
    games: {
        track: document.getElementById('gamesTrack'),
        currentIndex: 0,
        autoScrollInterval: null,
        cardWidth: 0,
        visibleCards: 3,
        totalCards: 5,
        clonedCount: 0,
        isDragging: false,
        startPos: 0,
        currentTranslate: 0,
        prevTranslate: 0,
        animationID: 0
    },
    accessories: {
        track: document.getElementById('accessoriesTrack'),
        currentIndex: 0,
        autoScrollInterval: null,
        cardWidth: 0,
        visibleCards: 3,
        totalCards: 3,
        clonedCount: 0,
        isDragging: false,
        startPos: 0,
        currentTranslate: 0,
        prevTranslate: 0,
        animationID: 0
    }
};

// Calculate dimensions
function updateCarouselDimensions(category) {
    const carousel = carousels[category];
    const container = document.getElementById(category + 'Carousel');
    const wrapper = container.querySelector('.carousel-wrapper');

    if (window.innerWidth <= 768) {
        carousel.visibleCards = 1;
        carousel.cardWidth = wrapper.offsetWidth * 0.8;
    } else if (window.innerWidth <= 1024) {
        carousel.visibleCards = 2;
        carousel.cardWidth = (wrapper.offsetWidth - 32) / 2; // 2rem gap
    } else {
        carousel.visibleCards = 3;
        carousel.cardWidth = (wrapper.offsetWidth - 64) / 3; // 2rem gap * 2
    }
}

// Initialize carousels
function initCarousels() {
    ['games', 'accessories'].forEach(category => {
        const carousel = carousels[category];
        if (!carousel.track) return; // Skip if element doesn't exist

        updateCarouselDimensions(category);
        setupInfiniteLoop(category);
        createIndicators(category);
        updateCarouselPosition(category, false);
        setupSwipeEvents(category);
        startAutoScroll(category);
    });
}

// Setup infinite loop by cloning cards
function setupInfiniteLoop(category) {
    const carousel = carousels[category];
    const track = carousel.track;
    const cards = Array.from(track.querySelectorAll('.product-card'));

    if (cards.length === 0) return;

    // Clone first and last cards for seamless infinite scroll
    const firstCards = cards.slice(0, carousel.visibleCards).map(card => card.cloneNode(true));
    const lastCards = cards.slice(-carousel.visibleCards).map(card => card.cloneNode(true));

    // Add clones to track
    lastCards.forEach(card => track.insertBefore(card, track.firstChild));
    firstCards.forEach(card => track.appendChild(card));

    // Update total cards count including clones
    carousel.totalCards = cards.length;
    carousel.clonedCount = carousel.visibleCards;

    // Start at the first real card (after clones)
    carousel.currentIndex = carousel.clonedCount;
}

// Create dot indicators
function createIndicators(category) {
    const container = document.getElementById(category + 'Indicators');
    const carousel = carousels[category];
    const realCardCount = carousel.totalCards;

    if (!container) return;

    container.innerHTML = '';
    for (let i = 0; i < realCardCount; i++) {
        const dot = document.createElement('div');
        dot.className = 'indicator-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('role', 'button');
        dot.setAttribute('tabindex', '0');
        dot.setAttribute('aria-label', `Go to ${category} card ${i + 1}`);
        dot.onclick = () => goToSlide(category, i + carousel.clonedCount);
        dot.onkeydown = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                goToSlide(category, i + carousel.clonedCount);
            }
        };
        container.appendChild(dot);
    }
}

// Move carousel (infinite)
function moveCarousel(category, direction) {
    const carousel = carousels[category];
    if (!carousel.track) return;
    
    carousel.currentIndex += direction;
    updateCarouselPosition(category, true);
    updateIndicators(category);
    resetAutoScroll(category);

    // Check if we need to loop
    checkInfiniteLoop(category);
}

// Check and handle infinite loop
function checkInfiniteLoop(category) {
    const carousel = carousels[category];
    const track = carousel.track;
    const realCardCount = carousel.totalCards;

    // If at the end clones, jump to start
    if (carousel.currentIndex >= realCardCount + carousel.clonedCount) {
        setTimeout(() => {
            track.style.transition = 'none';
            carousel.currentIndex = carousel.clonedCount;
            updateCarouselPosition(category, false);
            setTimeout(() => {
                track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            }, 10);
        }, 500);
    }

    // If at the start clones, jump to end
    if (carousel.currentIndex < carousel.clonedCount) {
        setTimeout(() => {
            track.style.transition = 'none';
            carousel.currentIndex = realCardCount + carousel.clonedCount - 1;
            updateCarouselPosition(category, false);
            setTimeout(() => {
                track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            }, 10);
        }, 500);
    }
}

// Go to specific slide
function goToSlide(category, index) {
    const carousel = carousels[category];
    carousel.currentIndex = index;
    updateCarouselPosition(category, true);
    updateIndicators(category);
    resetAutoScroll(category);
}

// Update carousel position
function updateCarouselPosition(category, animate) {
    const carousel = carousels[category];
    const gap = 32; // 2rem gap
    const offset = -(carousel.currentIndex * (carousel.cardWidth + gap));
    carousel.track.style.transform = `translateX(${offset}px)`;
    carousel.currentTranslate = offset;
    carousel.prevTranslate = offset;
}

// Update indicators
function updateIndicators(category) {
    const container = document.getElementById(category + 'Indicators');
    const carousel = carousels[category];
    const dots = container.querySelectorAll('.indicator-dot');
    const realIndex = (carousel.currentIndex - carousel.clonedCount + carousel.totalCards) % carousel.totalCards;

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === realIndex);
    });
}

// Setup swipe/touch events
function setupSwipeEvents(category) {
    const carousel = carousels[category];
    const track = carousel.track;

    if (!track) return;

    // Touch events
    track.addEventListener('touchstart', touchStart(category), { passive: true });
    track.addEventListener('touchend', touchEnd(category));
    track.addEventListener('touchmove', touchMove(category), { passive: true });

    // Mouse events (for desktop dragging)
    track.addEventListener('mousedown', touchStart(category));
    track.addEventListener('mouseup', touchEnd(category));
    track.addEventListener('mouseleave', () => {
        if (carousel.isDragging) touchEnd(category)();
    });
    track.addEventListener('mousemove', touchMove(category));

    // Prevent context menu on right click
    track.addEventListener('contextmenu', e => e.preventDefault());

    // Keyboard navigation for carousel
    track.setAttribute('tabindex', '0');
    track.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            moveCarousel(category, 1);
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            moveCarousel(category, -1);
        }
    });
}

function touchStart(category) {
    return function (event) {
        const carousel = carousels[category];
        carousel.isDragging = true;
        carousel.startPos = getPositionX(event);
        carousel.animationID = requestAnimationFrame(() => animation(category));
        stopAutoScroll(category);

        // Disable transition during drag
        carousel.track.style.transition = 'none';
    };
}

function touchMove(category) {
    return function (event) {
        const carousel = carousels[category];
        if (carousel.isDragging) {
            const currentPosition = getPositionX(event);
            const diff = currentPosition - carousel.startPos;
            carousel.currentTranslate = carousel.prevTranslate + diff;
            carousel.track.style.transform = `translateX(${carousel.currentTranslate}px)`;
        }
    };
}

function touchEnd(category) {
    return function (event) {
        const carousel = carousels[category];
        carousel.isDragging = false;
        cancelAnimationFrame(carousel.animationID);

        const movedBy = carousel.currentTranslate - carousel.prevTranslate;
        const threshold = 100; // Minimum swipe distance

        // Re-enable transition
        carousel.track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';

        // Determine swipe direction
        if (movedBy < -threshold) {
            // Swiped left - go next
            moveCarousel(category, 1);
        } else if (movedBy > threshold) {
            // Swiped right - go prev
            moveCarousel(category, -1);
        } else {
            // Snap back to current position
            updateCarouselPosition(category, true);
        }

        resetAutoScroll(category);
    };
}

function getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
}

function animation(category) {
    const carousel = carousels[category];
    if (carousel.isDragging) {
        carousel.animationID = requestAnimationFrame(() => animation(category));
    }
}

// Auto-scroll functionality
function startAutoScroll(category) {
    const carousel = carousels[category];
    stopAutoScroll(category);

    carousel.autoScrollInterval = setInterval(() => {
        moveCarousel(category, 1);
    }, 4000);
}

function stopAutoScroll(category) {
    const carousel = carousels[category];
    if (carousel.autoScrollInterval) {
        clearInterval(carousel.autoScrollInterval);
        carousel.autoScrollInterval = null;
    }
}

function resetAutoScroll(category) {
    startAutoScroll(category);
}

// Pause on hover
['games', 'accessories'].forEach(category => {
    const container = document.getElementById(category + 'Carousel');
    if (!container) return;
    
    container.addEventListener('mouseenter', () => stopAutoScroll(category));
    container.addEventListener('mouseleave', () => startAutoScroll(category));
});

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        ['games', 'accessories'].forEach(category => {
            updateCarouselDimensions(category);
            updateCarouselPosition(category, false);
        });
    }, 250);
});

// Initialize on load
window.addEventListener('load', initCarousels);

// ============================================
// SMOOTH SCROLL FOR NAV LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId === '#privacy' || targetId === '#terms' || targetId === '#socials') {
            return; // Skip empty/placeholder links
        }
        
        e.preventDefault();
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Update URL without page reload
            history.pushState(null, null, targetId);
        }
    });
});

// ============================================
// ACTIVE NAV LINK ON SCROLL
// ============================================
const sections = document.querySelectorAll('section[id]');
const navLinkItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinkItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// ============================================
// YOUTUBE THUMBNAIL UPDATER
// ============================================
function updateYouTubeThumbnail(videoId) {
    const thumbnail = document.getElementById('youtubeThumbnail');
    if (!thumbnail || !videoId) return;
    
    thumbnail.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    thumbnail.onerror = function () {
        this.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    };
}

// Example: updateYouTubeThumbnail('YOUR_VIDEO_ID_HERE');

// ============================================
// TWITCH EMBED WITH ERROR HANDLING
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Wait for Twitch script to load
    const checkTwitch = setInterval(() => {
        if (typeof Twitch !== 'undefined' && Twitch.Player) {
            clearInterval(checkTwitch);
            initTwitchPlayer();
        }
    }, 100);

    // Timeout after 10 seconds if Twitch doesn't load
    setTimeout(() => {
        clearInterval(checkTwitch);
        handleTwitchError();
    }, 10000);
});

function initTwitchPlayer() {
    try {
        const twitchOptions = {
            width: "100%",
            height: "100%",
            channel: "mizraimphoenix2",
            parent: [window.location.hostname || 'localhost'],
            autoplay: true,
            muted: true
        };

        const twitchPlayer = new Twitch.Player("twitch-embed", twitchOptions);
        
        twitchPlayer.setVolume(0.5);

        // Check if stream is live
        twitchPlayer.addEventListener(Twitch.Player.READY, function () {
            const statusEl = document.getElementById('twitchStatus');
            if (statusEl) statusEl.textContent = 'Stream ready';
        });

        twitchPlayer.addEventListener(Twitch.Player.ONLINE, function () {
            const statusEl = document.getElementById('twitchStatus');
            const offlineEl = document.getElementById('twitchOffline');
            const liveIndicatorEl = document.getElementById('twitchLiveIndicator');
            const titleEl = document.getElementById('twitchTitle');
            
            if (statusEl) statusEl.textContent = 'Streaming Now';
            if (offlineEl) offlineEl.style.display = 'none';
            if (liveIndicatorEl) liveIndicatorEl.style.display = 'flex';
            if (titleEl) titleEl.textContent = 'Live Now';
        });

        twitchPlayer.addEventListener(Twitch.Player.OFFLINE, function () {
            const statusEl = document.getElementById('twitchStatus');
            const offlineEl = document.getElementById('twitchOffline');
            const liveIndicatorEl = document.getElementById('twitchLiveIndicator');
            const titleEl = document.getElementById('twitchTitle');
            const linkTextEl = document.getElementById('twitchLinkText');
            
            if (statusEl) statusEl.textContent = 'Offline';
            if (offlineEl) offlineEl.style.display = 'flex';
            if (liveIndicatorEl) liveIndicatorEl.style.display = 'none';
            if (titleEl) titleEl.textContent = 'Offline';
            if (linkTextEl) linkTextEl.textContent = 'View Channel →';
        });

        twitchPlayer.addEventListener(Twitch.Player.ERROR, function (error) {
            console.warn('Twitch player error:', error);
            handleTwitchError();
        });
    } catch (error) {
        console.error('Failed to initialize Twitch player:', error);
        handleTwitchError();
    }
}

function handleTwitchError() {
    const twitchContent = document.getElementById('twitchContent');
    const twitchOffline = document.getElementById('twitchOffline');
    const twitchStatus = document.getElementById('twitchStatus');
    const twitchTitle = document.getElementById('twitchTitle');

    if (twitchContent) {
        twitchContent.innerHTML = `
            <div class="video-placeholder" style="background: linear-gradient(135deg, #1A1A1A 0%, #0F0F0F 100%);">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="#9146FF" opacity="0.8">
                    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
                </svg>
                <span style="color: var(--text-secondary); font-size: 1.2rem;">Stream unavailable</span>
                <a href="https://twitch.tv/mizraimphoenix2" target="_blank" style="color: var(--brand-gold); margin-top: 1rem; text-decoration: none; font-weight: 600;">Visit Twitch Channel →</a>
            </div>
        `;
    }
    if (twitchStatus) twitchStatus.textContent = 'Click to watch';
    if (twitchTitle) twitchTitle.textContent = 'Twitch';
}

// ============================================
// DYNAMIC YEAR IN FOOTER
// ============================================
const yearEl = document.getElementById('currentYear');
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

// ============================================
// LAZY LOADING FOR IMAGES
// ============================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}
