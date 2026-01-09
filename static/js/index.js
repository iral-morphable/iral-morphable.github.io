// ============================================
// 3D PARTICLE BACKGROUND SYSTEM
// ============================================
class ParticleBackground {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.particleCount = 80;
    this.mouseX = 0;
    this.mouseY = 0;

    this.init();
    this.animate();
    this.setupEventListeners();
  }

  init() {
    this.resize();
    this.createParticles();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        z: Math.random() * 1000,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        vz: (Math.random() - 0.5) * 2,
        size: Math.random() * 2 + 1,
        color: this.getParticleColor()
      });
    }
  }

  getParticleColor() {
    const colors = [
      'rgba(74, 158, 255, 0.6)',
      'rgba(0, 212, 255, 0.6)',
      'rgba(139, 92, 246, 0.6)',
      'rgba(167, 139, 250, 0.6)'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  updateParticles() {
    for (let particle of this.particles) {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.z += particle.vz;

      // Wrap around edges
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;
      if (particle.z < 0) particle.z = 1000;
      if (particle.z > 1000) particle.z = 0;

      // Mouse interaction
      const dx = this.mouseX - particle.x;
      const dy = this.mouseY - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 150) {
        const force = (150 - distance) / 150;
        particle.vx -= dx * force * 0.01;
        particle.vy -= dy * force * 0.01;
      }

      particle.vx *= 0.99;
      particle.vy *= 0.99;
    }
  }

  drawParticles() {
    for (let particle of this.particles) {
      const scale = 1000 / (1000 + particle.z);
      const size = particle.size * scale;

      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
      this.ctx.fillStyle = particle.color;
      this.ctx.fill();

      this.ctx.shadowBlur = 10 * scale;
      this.ctx.shadowColor = particle.color;
    }
    this.ctx.shadowBlur = 0;
  }

  connectParticles() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          const opacity = (120 - distance) / 120 * 0.3;
          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(74, 158, 255, ${opacity})`;
          this.ctx.lineWidth = 1;
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.updateParticles();
    this.connectParticles();
    this.drawParticles();
    requestAnimationFrame(() => this.animate());
  }

  setupEventListeners() {
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });
  }
}

// ============================================
// SCROLL ANIMATION OBSERVER
// ============================================
class ScrollAnimationObserver {
  constructor() {
    this.elements = document.querySelectorAll('.animate-on-scroll');
    this.staggerElements = document.querySelectorAll('.animate-stagger');
    this.init();
  }

  init() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('animated');
          }, parseInt(delay));
        }
      });
    }, options);

    this.elements.forEach(el => this.observer.observe(el));
    this.staggerElements.forEach(el => this.observer.observe(el));
  }
}

// ============================================
// PARALLAX SCROLLING CONTROLLER
// ============================================
class ParallaxController {
  constructor() {
    this.sections = document.querySelectorAll('.parallax-section');
    this.init();
  }

  init() {
    if (this.sections.length === 0) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          this.updateParallax();
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  updateParallax() {
    const scrollY = window.scrollY;
    this.sections.forEach(section => {
      const speed = parseFloat(section.dataset.parallaxSpeed) || 0.5;
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top + scrollY;

      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const offset = (scrollY - sectionTop) * speed;
        const parallaxBg = section.querySelector('.parallax-bg');
        if (parallaxBg) {
          parallaxBg.style.transform = `translateY(${offset}px)`;
        }
      }
    });
  }
}

// ============================================
// ANIMATED STATISTICS COUNTER
// ============================================
class StatCounter {
  constructor() {
    this.statElements = document.querySelectorAll('.stat-number');
    this.animated = new Set();
    this.init();
  }

  init() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animated.has(entry.target)) {
          this.animateCounter(entry.target);
          this.animated.add(entry.target);
        }
      });
    }, options);

    this.statElements.forEach(el => this.observer.observe(el));
  }

  animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000;
    const startTime = performance.now();
    const startValue = 0;

    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const currentValue = Math.floor(startValue + (target - startValue) * easedProgress);

      element.textContent = currentValue;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    };

    requestAnimationFrame(updateCounter);
  }
}

// ============================================
// VIDEO HOVER CONTROLLER
// ============================================
class VideoHoverController {
  constructor() {
    this.videoCards = document.querySelectorAll('.video-card-enhanced');
    this.init();
  }

  init() {
    this.videoCards.forEach(card => {
      const video = card.querySelector('video');
      if (video) {
        card.addEventListener('mouseenter', () => {
          video.playbackRate = 1.2;
        });
        card.addEventListener('mouseleave', () => {
          video.playbackRate = 1.0;
        });
      }
    });
  }
}

window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "./static/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);
}


$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    var options = {
			slidesToScroll: 1,
			slidesToShow: 3,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
			breakpoints: [
				{ changePoint: 480, slidesToShow: 1, slidesToScroll: 1 },
				{ changePoint: 768, slidesToShow: 2, slidesToScroll: 1 },
				{ changePoint: 1024, slidesToShow: 3, slidesToScroll: 1 }
			]
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
    	// Add listener to  event
    	carousels[i].on('before:show', state => {
    		console.log(state);
    	});
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    /*var player = document.getElementById('interpolation-video');
    player.addEventListener('loadedmetadata', function() {
      $('#interpolation-slider').on('input', function(event) {
        console.log(this.value, player.duration);
        player.currentTime = player.duration / 100 * this.value;
      })
    }, false);*/
    preloadInterpolationImages();

    $('#interpolation-slider').on('input', function(event) {
      setInterpolationImage(this.value);
    });
    setInterpolationImage(0);
    $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);

    bulmaSlider.attach();

    // Sequential teaser video playback with manual navigation
    var teaserVideos = [
        './static/videos/360_pitch_semantic_seg.mp4',
        './static/videos/hand_tracking.mp4',
        './static/videos/obstacle_course.mp4',
        './static/videos/perching_on_whiteboard.mp4'
    ];
    var teaserVideoTitles = [
        'Pipe Inspection with 360° Pitch',
        'Hand Tracking',
        'Obstacle Course Navigation',
        'Perching on Whiteboard'
    ];
    var currentVideoIndex = 0;
    var teaserVideo = document.getElementById('teaser');
    var autoPlayEnabled = true;
    var userInteractionTimer = null;

    function playTeaserVideo(index) {
        currentVideoIndex = index;
        teaserVideo.src = teaserVideos[currentVideoIndex];
        teaserVideo.play();

        // Update video title (get element each time to ensure it's found)
        var teaserVideoTitle = document.getElementById('teaser-video-title');
        if (teaserVideoTitle) {
            teaserVideoTitle.textContent = teaserVideoTitles[currentVideoIndex];
            console.log('Updated title to:', teaserVideoTitles[currentVideoIndex]);
        } else {
            console.error('teaser-video-title element not found');
        }

        // Update indicator dots
        document.querySelectorAll('.teaser-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentVideoIndex);
        });
    }

    function nextTeaserVideo() {
        playTeaserVideo((currentVideoIndex + 1) % teaserVideos.length);
    }

    function prevTeaserVideo() {
        playTeaserVideo((currentVideoIndex - 1 + teaserVideos.length) % teaserVideos.length);
    }

    function pauseAutoAdvance() {
        autoPlayEnabled = false;
        clearTimeout(userInteractionTimer);

        // Resume auto-play after 10 seconds of inactivity
        userInteractionTimer = setTimeout(() => {
            autoPlayEnabled = true;
        }, 10000);
    }

    if (teaserVideo) {
        // Auto-advance when video ends
        teaserVideo.addEventListener('ended', function() {
            if (autoPlayEnabled) {
                nextTeaserVideo();
            } else {
                teaserVideo.play(); // Loop current video if auto-advance paused
            }
        });

        // Navigation button handlers
        document.querySelector('.teaser-nav-prev')?.addEventListener('click', () => {
            pauseAutoAdvance();
            prevTeaserVideo();
        });

        document.querySelector('.teaser-nav-next')?.addEventListener('click', () => {
            pauseAutoAdvance();
            nextTeaserVideo();
        });

        // Indicator dot handlers
        document.querySelectorAll('.teaser-dot').forEach((dot, index) => {
            dot.addEventListener('click', () => {
                pauseAutoAdvance();
                playTeaserVideo(index);
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (document.activeElement.closest('.teaser-video-wrapper') ||
                document.activeElement.classList.contains('teaser-dot') ||
                document.activeElement.classList.contains('teaser-nav')) {
                if (e.key === 'ArrowLeft') {
                    pauseAutoAdvance();
                    prevTeaserVideo();
                } else if (e.key === 'ArrowRight') {
                    pauseAutoAdvance();
                    nextTeaserVideo();
                }
            }
        });
    }

    // ============================================
    // INITIALIZE NEW ANIMATION SYSTEMS
    // ============================================

    // Initialize 3D particle background
    const particleBackground = new ParticleBackground('particle-canvas');

    // Initialize scroll animations
    const scrollAnimations = new ScrollAnimationObserver();

    // Initialize parallax effects
    const parallax = new ParallaxController();

    // Initialize animated statistics
    const statCounter = new StatCounter();

    // Initialize video hover effects
    const videoHover = new VideoHoverController();

    // ============================================
    // CUSTOM VIDEO PLAY/PAUSE CONTROLS
    // ============================================

    // Function to setup play/pause button for a video container
    function setupPlayPauseButton(container) {
        const video = container.querySelector('video');
        const playButton = container.querySelector('.custom-play-button');

        if (!video || !playButton) return;

        const playIcon = playButton.querySelector('.play-icon');
        const pauseIcon = playButton.querySelector('.pause-icon');

        function updateButton() {
            if (video.paused) {
                playButton.classList.add('paused');
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
            } else {
                playButton.classList.remove('paused');
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
            }
        }

        // Toggle play/pause when button is clicked
        playButton.addEventListener('click', (e) => {
            e.stopPropagation();
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
            updateButton();
        });

        // Toggle play/pause when clicking on the video itself
        video.addEventListener('click', (e) => {
            e.stopPropagation();
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
            updateButton();
        });

        // Update button state when video play/pause state changes
        video.addEventListener('play', updateButton);
        video.addEventListener('pause', updateButton);

        // Initial button state
        updateButton();
    }

    // Setup teaser video play/pause
    const teaserWrapper = document.querySelector('.teaser-video-wrapper');
    if (teaserWrapper) {
        setupPlayPauseButton(teaserWrapper);
    }

    // Setup carousel videos play/pause
    const carouselItems = document.querySelectorAll('.results-carousel .item.video-card-enhanced');
    carouselItems.forEach(item => {
        setupPlayPauseButton(item);
    });

    // ============================================
    // VIDEO AUTOPLAY ON SCROLL (INTERSECTION OBSERVER)
    // ============================================

    // Pause carousel videos that are not in viewport
    const carouselVideoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target.querySelector('video');
            if (!video) return;

            if (entry.isIntersecting) {
                // Video is in viewport - play it
                video.play().catch(err => {
                    console.log('Autoplay prevented:', err);
                });
            } else {
                // Video is out of viewport - pause it
                video.pause();
            }
        });
    }, {
        threshold: 0.5 // Video needs to be at least 50% visible
    });

    // Observe all carousel video items
    carouselItems.forEach(item => {
        carouselVideoObserver.observe(item);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Hero video error handling
    const heroVideo = document.querySelector('.hero-video-background');
    if (heroVideo) {
        heroVideo.addEventListener('error', function() {
            console.warn('Hero video failed to load, using fallback background');
            this.style.display = 'none';
        });
    }

    // Performance monitoring (optional)
    if (window.performance && window.performance.now) {
        const loadTime = window.performance.now();
        console.log(`Page interactive in ${Math.round(loadTime)}ms`);
    }

    // Scroll to next section when clicking scroll indicator
    const scrollIndicator = document.getElementById('scroll-indicator');
    if (scrollIndicator) {
        // Find the next section after the hero
        const heroSection = document.getElementById('hero-section');
        const nextSection = heroSection ? heroSection.nextElementSibling : null;

        const scrollToNext = () => {
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        };

        // Click handler
        scrollIndicator.addEventListener('click', scrollToNext);

        // Keyboard accessibility (Enter or Space key)
        scrollIndicator.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                scrollToNext();
            }
        });
    }

})
