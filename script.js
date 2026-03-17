// Mobile Navigation Toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    
    if (window.scrollY > 50) {
        navbar.style.background = 'var(--card-bg)';
        navbar.style.padding = '1rem 0';
        navbar.style.boxShadow = 'var(--shadow-premium)';
    } else {
        navbar.style.background = 'transparent';
        navbar.style.padding = '1.25rem 0';
        navbar.style.boxShadow = 'none';
    }
});

// Animate skill bars on scroll (fallback for older browsers)
const animateSkillBars = () => {
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillsSection = document.querySelector('.skills');
    
    if (skillsSection) {
        const skillsSectionTop = skillsSection.offsetTop;
        const windowHeight = window.innerHeight;
        
        if (window.scrollY > skillsSectionTop - windowHeight + 80) {
            skillBars.forEach(bar => {
                const width = bar.getAttribute('data-width');
                bar.style.width = width;
            });
        }
    }
};

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Dedicated observer for skill bars to ensure they fill when visible
const skillBarObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const width = entry.target.getAttribute('data-width');
            if (width) {
                entry.target.style.width = width;
            }
            skillBarObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.35 });

// Add animation classes to elements
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in animation to sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
    
    // Add slide animations to about content
    const aboutText = document.querySelector('.about-text');
    const aboutImage = document.querySelector('.about-image');
    
    if (aboutText) {
        aboutText.classList.add('slide-in-left');
        observer.observe(aboutText);
    }
    
    if (aboutImage) {
        aboutImage.classList.add('slide-in-right');
        observer.observe(aboutImage);
    }
    
    // Add slide animations to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.animationDelay = `${index * 0.2}s`;
        observer.observe(card);
    });
    
    // Add slide animations to skill categories
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach((category, index) => {
        category.classList.add('fade-in');
        category.style.animationDelay = `${index * 0.1}s`;
        observer.observe(category);
    });

    // Observe each skill bar for smooth fill on mobile & desktop
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => skillBarObserver.observe(bar));
});

// Contact form handling
const form = document.getElementById('form');

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Typing animation for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.innerHTML;
        typeWriter(heroTitle, originalText, 50);
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add active class styles for navigation
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: #6366f1 !important;
    }
    .nav-link.active::after {
        width: 100% !important;
    }
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;
document.head.appendChild(style);

// Scroll to top functionality
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: #6366f1;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.2rem;
    box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
`;

document.body.appendChild(scrollToTopBtn);

// Show/hide scroll to top button
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopBtn.style.opacity = '1';
        scrollToTopBtn.style.visibility = 'visible';
    } else {
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.visibility = 'hidden';
    }
});

// Scroll to top functionality
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Add hover effect to scroll to top button
scrollToTopBtn.addEventListener('mouseenter', () => {
    scrollToTopBtn.style.background = '#4f46e5';
    scrollToTopBtn.style.transform = 'translateY(-3px)';
});

scrollToTopBtn.addEventListener('mouseleave', () => {
    scrollToTopBtn.style.background = '#6366f1';
    scrollToTopBtn.style.transform = 'translateY(0)';
});

// Initialize all animations and effects
document.addEventListener('DOMContentLoaded', () => {
    // Trigger skill bar animation on scroll
    window.addEventListener('scroll', animateSkillBars);
    
    // Initial check for skill bars
    animateSkillBars();
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add loading styles
const loadingStyle = document.createElement('style');
loadingStyle.textContent = `
    body {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
    body.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(loadingStyle);

// Dark Mode Functionality
class DarkMode {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.themeIcon = document.getElementById('theme-icon');
        this.init();
    }

    init() {
        // Check for saved theme preference or default to light mode
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            this.enableDarkMode();
        } else {
            this.enableLightMode();
        }

        // Add event listener for theme toggle
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                if (e.matches) {
                    this.enableDarkMode();
                } else {
                    this.enableLightMode();
                }
            }
        });
    }

    enableDarkMode() {
        document.documentElement.setAttribute('data-theme', 'dark');
        this.themeIcon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'dark');
        this.updateNavbarScroll();
    }

    enableLightMode() {
        document.documentElement.setAttribute('data-theme', 'light');
        this.themeIcon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'light');
        this.updateNavbarScroll();
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            this.enableLightMode();
        } else {
            this.enableDarkMode();
        }
        
        // Add animation effect
        const icon = this.themeIcon;
        icon.style.transform = 'rotate(360deg) scale(0)';
        
        setTimeout(() => {
            icon.style.transform = 'rotate(0) scale(1)';
        }, 300);
        
        this.themeToggle.style.transform = 'scale(0.8)';
        setTimeout(() => {
            this.themeToggle.style.transform = 'scale(1)';
        }, 150);
    }

    updateNavbarScroll() {
        // Trigger navbar scroll update to apply correct colors
        const event = new Event('scroll');
        window.dispatchEvent(event);
    }
}

// Language Management
class LanguageManager {
    constructor() {
        this.langBtns = document.querySelectorAll('.lang-btn');
        this.translations = {
            'uz': {
                'nav-home': 'Bosh sahifa',
                'nav-about': "O'zim haqimda",
                'nav-skills': 'Mahoratlar',
                'nav-projects': 'Loyihalar',
                'nav-certs': 'Sertifikatlar',
                'nav-contact': 'Kontakt',
                'hero-title': 'Salom, men Azatov Murodbek — Software Developer',
                'hero-subtitle': 'Veb dasturchi va dizayner',
                'hero-desc': "Zamonaviy va chiroyli veb-saytlar yaratishga ixtisoslashganman. Yaratijaviy yechimlarni texnik mahorat bilan uyg'unlashtirib, mijozlar uchun eng yaxshi tajribani taqdim etaman.",
                'hero-btn-projects': 'Loyihalarim',
                'hero-btn-resume': 'Rezyume',
                'hero-btn-contact': "Bog'lanish",
                'about-title': 'Men kimman?',
                'about-intro-text': "Men zamonaviy raqamli yechimlar yaratishga ixtisoslashgan va texnologiyalarga ishtiyoqi baland bo'lgan Software Developer'man. Hozirda asosiy e'tiborimni Web-tizimlar va murakkab Telegram botlari ishlab chiqishga qaratganman.",
                'about-card1-title': 'Asosiy Maqsad',
                'about-card1-desc': 'TATU talabasi bo\'lish va IT olamida global miqyosdagi yirik loyihalarda yetuk mutaxassis sifatida qatnashish.',
                'about-card2-title': 'Ishga Yondashuv',
                'about-card2-desc': 'Faqat kod yozish emas, balki foydalanuvchilar va biznes uchun aniq qiymat yaratadigan mahsulotlar yaratish.',
                'about-card3-title': 'Doimiy Bilim',
                'about-card3-desc': '"Al-Xorazmiy vorislari" IT kurslari orqali nazariy bilimlarni real loyihalarda mustahkamlab bormoqdaman.',
                'stat-projects': 'Loyiha',
                'stat-clients': 'Mijoz',
                'stat-years': 'Yil',
                'skills-title': 'Mahoratlar',
                'skills-frontend': 'Frontend',
                'skills-backend': 'Backend',
                'skills-mobile': 'Mobile & Desktop',
                'skills-tools': 'Tools',
                'projects-title': 'Loyihalar',
                'project1-title': 'E-commerce Sayti',
                'project1-desc': 'Zamonaviy dizayn va to\'liq funksionallik bilan onlayn do\'kon sayti.',
                'project2-title': 'Test Bot',
                'project2-desc': 'Telegram bot yordamida testlar o\'tkazish va natijalarni baholash tizimi.',
                'project3-title': 'Tez-Yoz',
                'project3-desc': 'Klaviatura mahoratingizni professional darajaga ko\'tarish uchun platforma.',
                'project4-title': 'Habit Tracker Bot',
                'project4-desc': 'Kundalik rejimlarni boshqarish va odatlarni kuzatish uchun Telegram bot.',
                'btn-view': 'Ko\'rish',
                'btn-code': 'Kod',
                'contact-title': 'Kontakt',
                'contact-h3': 'Bog\'lanish',
                'contact-p': 'Loyiha yoki hamkorlik haqida gaplashish uchun men bilan bog\'laning.',
                'form-name': 'Ism familya',
                'form-msg': 'Xabar',
                'form-btn': 'Xabarni yuborish',
                'footer-text': '© 2024 Portfolio. Barcha huquqlar himoyalangan.'
            },
            'ru': {
                'nav-home': 'Главная',
                'nav-about': 'О себе',
                'nav-skills': 'Навыки',
                'nav-projects': 'Проекты',
                'nav-certs': 'Сертификаты',
                'nav-contact': 'Контакт',
                'hero-title': 'Привет, я Азатов Муродбек — Software Developer',
                'hero-subtitle': 'Веб-разработчик и дизайнер',
                'hero-desc': 'Я специализируюсь на создании современных и красивых веб-сайтов. Сочетая творческие решения с техническими навыками, я предоставляю лучший опыт для клиентов.',
                'hero-btn-projects': 'Мои проекты',
                'hero-btn-resume': 'Резюме',
                'hero-btn-contact': 'Связаться',
                'about-title': 'Кто я?',
                'about-intro-text': 'Я Software Developer, специализирующийся на создании современных цифровых решений и увлеченный технологиями. В настоящее время я сосредоточен на разработке веб-систем и сложных Telegram-ботов.',
                'about-card1-title': 'Основная цель',
                'about-card1-desc': 'Стать студентом ТАТУ и участвовать в крупных глобальных проектах в мире ИТ как ведущий специалист.',
                'about-card2-title': 'Подход к работе',
                'about-card2-desc': 'Не просто писать код, а создавать продукты, которые приносят реальную пользу пользователям и бизнесу.',
                'about-card3-title': 'Постоянное обучение',
                'about-card3-desc': 'Я укрепляю теоретические знания в реальных проектах через ИТ-курсы "Наследники Аль-Хорезми".',
                'stat-projects': 'Проектов',
                'stat-clients': 'Клиентов',
                'stat-years': 'Год опыта',
                'skills-title': 'Навыки',
                'skills-frontend': 'Фронтенд',
                'skills-backend': 'Бэкенд',
                'skills-mobile': 'Мобильные и ПК',
                'skills-tools': 'Инструменты',
                'projects-title': 'Проекты',
                'project1-title': 'E-commerce Сайт',
                'project1-desc': 'Сайт интернет-магазина с современным дизайном и полной функциональностью.',
                'project2-title': 'Тест Бот',
                'project2-desc': 'Система проведения тестов и оценки результатов с помощью Telegram-бота.',
                'project3-title': 'Tez-Yoz',
                'project3-desc': 'Платформа для повышения навыков владения клавиатурой до профессионального уровня.',
                'project4-title': 'Habit Tracker Bot',
                'project4-desc': 'Универсальный Telegram-бот для управления повседневными делами и привычками.',
                'btn-view': 'Смотреть',
                'btn-code': 'Код',
                'contact-title': 'Контакт',
                'contact-h3': 'Связаться',
                'contact-p': 'Свяжитесь со мной, чтобы обсудить проект или сотрудничество.',
                'form-name': 'Имя и фамилия',
                'form-msg': 'Сообщение',
                'form-btn': 'Отправить сообщение',
                'footer-text': '© 2024 Портфолио. Все права защищены.'
            },
            'en': {
                'nav-home': 'Home',
                'nav-about': 'About',
                'nav-skills': 'Skills',
                'nav-projects': 'Projects',
                'nav-certs': 'Certificates',
                'nav-contact': 'Contact',
                'hero-title': 'Hi, I am Murodbek Azatov — Software Developer',
                'hero-subtitle': 'Web Developer & Designer',
                'hero-desc': 'I specialize in creating modern and beautiful websites. Combining creative solutions with technical skills, I provide the best experience for clients.',
                'hero-btn-projects': 'My Projects',
                'hero-btn-resume': 'Resume',
                'hero-btn-contact': 'Contact Me',
                'about-title': 'Who am I?',
                'about-intro-text': 'I am a Software Developer specialized in creating modern digital solutions and passionate about technology. Currently, my main focus is on developing Web systems and complex Telegram bots.',
                'about-card1-title': 'Main Goal',
                'about-card1-desc': 'Become a TUIT student and participate in large-scale global IT projects as a leading specialist.',
                'about-card2-title': 'Work Approach',
                'about-card2-desc': 'Not just writing code, but creating products that generate clear value for users and businesses.',
                'about-card3-title': 'Constant Learning',
                'about-card3-desc': 'I am strengthening theoretical knowledge through real projects via "Heirs of Al-Khwarizmi" IT courses.',
                'stat-projects': 'Projects',
                'stat-clients': 'Clients',
                'stat-years': 'Year Experience',
                'skills-title': 'Skills',
                'skills-frontend': 'Frontend',
                'skills-backend': 'Backend',
                'skills-mobile': 'Mobile & Desktop',
                'skills-tools': 'Tools',
                'projects-title': 'Projects',
                'project1-title': 'E-commerce Site',
                'project1-desc': 'Online store site with modern design and full functionality.',
                'project2-title': 'Test Bot',
                'project2-desc': 'System for conducting tests and evaluating results using a Telegram bot.',
                'project3-title': 'Tez-Yoz',
                'project3-desc': 'Platform to raise your keyboard skills to a professional level.',
                'project4-title': 'Habit Tracker Bot',
                'project4-desc': 'Universal Telegram bot for managing daily routines and tracking habits.',
                'btn-view': 'View',
                'btn-code': 'Code',
                'contact-title': 'Contact',
                'contact-h3': 'Get in Touch',
                'contact-p': 'Contact me to discuss a project or collaboration.',
                'form-name': 'Full Name',
                'form-msg': 'Message',
                'form-btn': 'Send Message',
                'footer-text': '© 2024 Portfolio. All rights reserved.'
            }
        };
        this.init();
    }

    init() {
        const savedLang = localStorage.getItem('language') || 'uz';
        this.setLanguage(savedLang);

        this.langBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.getAttribute('data-lang');
                this.setLanguage(lang);
            });
        });
    }

    setLanguage(lang) {
        localStorage.setItem('language', lang);
        
        // Update buttons UI
        this.langBtns.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });

        // Update content
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (this.translations[lang][key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = this.translations[lang][key];
                } else {
                    el.innerText = this.translations[lang][key];
                }
            }
        });

        // Update HTML lang attribute
        document.documentElement.lang = lang;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DarkMode();
    new LanguageManager();
});

