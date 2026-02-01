document.addEventListener("DOMContentLoaded", () => {
    initLoadingScreen();
    initThemeToggle();
    initNavigation();
    initAnimations();
    initProjects();
    initContactForm();
    initBackToTop();
    initParticles();
    initTypewriter();
    
    initScrollAnimations();
    
    console.log("%c🎮 Portfolio Loaded Successfully!", "color: #7C3AED; font-size: 18px; font-weight: bold;");
    console.log("%c👨‍💻 Built with passion by Mattéo Stampanoni", "color: #10B981; font-size: 14px;");
});

function initLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 500);
    }, 2000);
}

function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        icon.className = 'fas fa-sun';
    }
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        
        if (document.body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
            icon.className = 'fas fa-sun';
        } else {
            localStorage.setItem('theme', 'light');
            icon.className = 'fas fa-moon';
        }
    });
}

function initNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
    
    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        menuToggle.innerHTML = mobileMenu.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= (sectionTop - 200)) {
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
}

function initAnimations() {
    const plant = document.querySelector('.plant');
    const shadow = document.querySelector('.shadow');
    
    if (plant && shadow) {
        plant.style.animationPlayState = 'running';
        shadow.style.animationPlayState = 'running';
    }
    
    const programmingIcon = document.querySelector('.programming-icon');
    if (programmingIcon) {
        programmingIcon.style.animationPlayState = 'running';
    }
    
    const skillBars = document.querySelectorAll('.level-bar');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                bar.style.animationPlayState = 'running';
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => observer.observe(bar));
}

function initProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    fetch('realisations.json')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(projects => {
            renderProjects(projects);
            setupFilters(projects);
        })
        .catch(error => {
            console.error('Error loading projects:', error);
            projectsGrid.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Unable to load projects. Please check your internet connection.</p>
                </div>
            `;
        });
    
    function renderProjects(projects) {
        projectsGrid.innerHTML = '';
        
        projects.forEach(project => {
            const projectCard = createProjectCard(project);
            projectsGrid.appendChild(projectCard);
        });
    }
    
    function createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card';
        
        let techClass = '';
        if (project.technologies.some(t => t.toLowerCase().includes('unity'))) {
            techClass = 'unity';
        } else if (project.technologies.some(t => t.toLowerCase().includes('unreal') || t === 'UE')) {
            techClass = 'unreal';
        } else if (project.technologies.some(t => t.toLowerCase().includes('c++'))) {
            techClass = 'cpp';
        }
        
        card.setAttribute('data-tech', techClass);
        
        const durationIcon = project.duree.includes('week') ? 'fas fa-calendar-week' : 'fas fa-calendar-day';
        
        const peopleIcon = project.personnes === 1 ? 'fas fa-user' : 'fas fa-users';
        
        card.innerHTML = `
            <div class="project-media">
                <div class="video-container">
                    <iframe 
                        src="${project.video}" 
                        title="${project.titre}" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                </div>
            </div>
            
            <div class="project-info">
                <div class="project-header">
                    <h3 class="project-title">${project.titre}</h3>
                    <span class="project-badge">${project.technologies[0]}</span>
                </div>
                
                <div class="project-meta">
                    <span><i class="${durationIcon}"></i> ${project.duree}</span>
                    <span><i class="${peopleIcon}"></i> ${project.personnes} person${project.personnes > 1 ? 's' : ''}</span>
                </div>
                
                <div class="project-tech">
                    ${project.technologies.map(tech => 
                        `<span class="tech-tag">${tech}</span>`
                    ).join('')}
                </div>
                
                <a href="${project.video}" target="_blank" class="project-link">
                    Watch Demo
                    <i class="fas fa-external-link-alt"></i>
                </a>
            </div>
        `;
        
        return card;
    }
    
    function setupFilters(projects) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const filter = button.getAttribute('data-filter');
                filterProjects(filter);
            });
        });
    }
    
    function filterProjects(filter) {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-tech') === filter) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }
}

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const toast = document.getElementById('successToast');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value,
                timestamp: new Date().toISOString()
            };
            
            console.log('Form submitted:', formData);
            
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
            
            contactForm.reset();
            
            console.log(`Message from ${formData.name} (${formData.email}): ${formData.message}`);
        });
    }
}

function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function initParticles() {
    const particlesContainer = document.getElementById('particles');
    
    if (!particlesContainer) return;
    
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 1;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = Math.random() * 10 + 10;
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            background: var(--primary-color);
            opacity: ${Math.random() * 0.3 + 0.1};
            position: absolute;
            top: ${posY}%;
            left: ${posX}%;
            border-radius: 50%;
            animation: floatParticle ${duration}s linear infinite ${delay}s;
        `;
        
        particlesContainer.appendChild(particle);
    }
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatParticle {
            0% {
                transform: translate(0, 0) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 0.3;
            }
            90% {
                opacity: 0.3;
            }
            100% {
                transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

function initTypewriter() {
    const codeLines = document.querySelectorAll('.code-line');
    let currentLine = 0;
    
    function typeLine() {
        if (currentLine < codeLines.length) {
            const line = codeLines[currentLine];
            const text = line.textContent;
            line.textContent = '';
            line.style.display = 'block';
            
            let charIndex = 0;
            const typeChar = () => {
                if (charIndex < text.length) {
                    line.textContent += text.charAt(charIndex);
                    charIndex++;
                    setTimeout(typeChar, 30);
                } else {
                    currentLine++;
                    setTimeout(typeLine, 500);
                }
            };
            
            typeChar();
        }
    }
    
    setTimeout(typeLine, 1500);
}

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.skill-card, .project-card, .contact-card, .highlight-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

const currentYear = new Date().getFullYear();
const yearElements = document.querySelectorAll('.current-year');
yearElements.forEach(el => {
    if (el) el.textContent = currentYear;
});