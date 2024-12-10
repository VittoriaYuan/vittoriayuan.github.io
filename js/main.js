document.addEventListener('DOMContentLoaded', function() {
    // 视频循环播放控制
    const video = document.querySelector('.background-video');
    if (video) {
        video.play();
        video.addEventListener('ended', function() {
            video.currentTime = 0;
            video.play();
        }, false);
    }

    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // 滚动效果
    window.addEventListener('scroll', throttle(function() {
        if (window.scrollY > 100) {
            header.style.background = 'linear-gradient(180deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.2) 100%)';
        } else {
            header.style.background = 'linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0) 100%)';
        }
    }, 100));
    
    // 处理导航链接点击
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetId === 'home') {
                smoothScroll(0);
            } else if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const offset = targetSection.offsetTop - headerHeight;
                smoothScroll(offset);
            }
        });
    });
    
    // 节流函数
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
    
    // 平滑滚动函数
    function smoothScroll(targetPosition, duration = 600) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const startTime = performance.now();
        
        function easeOutQuint(t) {
            return 1 + (--t) * t * t * t * t;
        }
        
        function animation(currentTime) {
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            window.scrollTo({
                top: startPosition + (distance * easeOutQuint(progress)),
                behavior: 'auto'
            });
            
            if (progress < 1) {
                requestAnimationFrame(animation);
            }
        }
        
        requestAnimationFrame(animation);
    }
    
    // 滚动监听，更新导航激活状态
    window.addEventListener('scroll', throttle(function() {
        const scrollPosition = window.scrollY + 100;
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                const correspondingLink = document.querySelector(`a[href="#${section.id}"]`);
                if (correspondingLink) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    correspondingLink.classList.add('active');
                }
            }
        });
        
        // 处理首页导航激活状态
        if (scrollPosition < 100) {
            navLinks.forEach(l => l.classList.remove('active'));
            const homeLink = document.querySelector('a[href="#home"]');
            if (homeLink) homeLink.classList.add('active');
        }
    }, 100));

    // 初始化导航激活状态
    window.dispatchEvent(new Event('scroll'));
});