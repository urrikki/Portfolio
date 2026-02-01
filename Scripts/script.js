document.addEventListener("DOMContentLoaded", () => {
    console.log("🌱 Portfolio growing...");
    
    initLoading();
    initTheme();
    initNavigation();
    loadProjects();
    initContact();
    initScrollAnimations();
    initEasterEggs();
    
    document.getElementById('currentYear').textContent = new Date().getFullYear();
});

function initLoading() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 1500);
}

function initTheme() {
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
            icon.className = 'fas fa-leaf';
        }
    });
}

function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelectorAll('.nav-link');
    
    navToggle.addEventListener('click', () => {
        const navMenu = document.querySelector('.nav-links');
        navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '100%';
        navMenu.style.left = '0';
        navMenu.style.width = '100%';
        navMenu.style.backgroundColor = 'var(--card-bg)';
        navMenu.style.padding = '20px';
        navMenu.style.borderTop = '1px solid var(--border-color)';
    });
    
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const navMenu = document.querySelector('.nav-links');
            if (window.innerWidth <= 768) {
                navMenu.style.display = 'none';
            }
        });
    });
}

function loadProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    
    fetch('realisations.json')
        .then(response => {
            if (!response.ok) throw new Error('Could not load projects');
            return response.json();
        })
        .then(projects => {
            renderProjects(projects);
        })
        .catch(error => {
            console.error('Error loading projects:', error);
            projectsGrid.innerHTML = `
                <div class="project-error">
                    <p><i class="fas fa-exclamation-circle"></i> Projects couldn't load. Check back soon!</p>
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
        
        let techIcon = 'fas fa-code';
        if (project.technologies.some(t => t.toLowerCase().includes('unity'))) {
            techIcon = 'fab fa-unity';
        } else if (project.technologies.some(t => t.toLowerCase().includes('unreal'))) {
            techIcon = 'fas fa-gamepad';
        } else if (project.technologies.some(t => t.toLowerCase().includes('c++'))) {
            techIcon = 'fas fa-plus';
        }
        
        card.innerHTML = `
            <div class="project-video">
                <iframe 
                    src="${project.video}" 
                    title="${project.titre}"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            </div>
            
            <div class="project-info">
                <div class="project-header">
                    <h3 class="project-title">${project.titre}</h3>
                    <span class="project-duration">${project.duree}</span>
                </div>
                
                <div class="project-meta">
                    <span><i class="fas fa-users"></i> ${project.personnes} person${project.personnes > 1 ? 's' : ''}</span>
                    <span><i class="${techIcon}"></i> School Project</span>
                </div>
                
                <div class="project-tech">
                    ${project.technologies.map(tech => 
                        `<span class="tech-tag">${tech}</span>`
                    ).join('')}
                </div>
                
                <a href="${project.video}" target="_blank" class="project-link">
                    Watch Video
                    <i class="fas fa-external-link-alt"></i>
                </a>
            </div>
        `;
        
        return card;
    }
}

function initContact() {
    const contactForm = document.getElementById('simpleContactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('simpleName').value,
                email: document.getElementById('simpleEmail').value,
                message: document.getElementById('simpleMessage').value
            };
            
            if (!formData.name || !formData.email || !formData.message) {
                alert('Please fill in all fields');
                return;
            }
            
            console.log('Message received:', formData);
            
            alert('Thanks for your message! I\'ll get back to you soon.');
            
            contactForm.reset();
        });
    }
}

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.inspiration-card, .value-item, .project-card');
    
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
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(element);
    });
}

function initEasterEggs() {
    const plants = document.querySelectorAll('.plant');
    let plantClickCount = 0;
    
    plants.forEach(plant => {
        plant.style.cursor = 'pointer';
        plant.title = 'Click me?';
        
        plant.addEventListener('click', () => {
            plantClickCount++;
            
            if (plantClickCount === 5) {
                const originalFilter = plant.style.filter;
                plant.style.filter = 'hue-rotate(90deg)';
                
                console.log('%c🌿 You found the secret plant! 🌿', 'color: #2E8B57; font-size: 16px;');
                console.log('%c"Every great oak was once a little nut who held its ground."', 'color: #8B7355; font-style: italic;');
                
                setTimeout(() => {
                    plant.style.filter = originalFilter;
                }, 2000);
                
                setTimeout(() => {
                    plantClickCount = 0;
                }, 10000);
            }
        });
    });
    
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            
            if (konamiIndex === konamiCode.length) {
                document.body.classList.toggle('dark-theme');
                
                console.log('%c🎮 Konami Code Activated!', 'color: #D4AF37; font-size: 20px; font-weight: bold;');
                console.log('%cYou unlocked developer mode!', 'color: #2E8B57;');
                
                const message = document.createElement('div');
                message.textContent = '🎮 Konami Code Activated!';
                message.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: var(--accent-primary);
                    color: white;
                    padding: 10px 20px;
                    border-radius: var(--border-radius);
                    z-index: 10000;
                    animation: slideIn 0.3s ease;
                `;
                document.body.appendChild(message);
                
                setTimeout(() => {
                    message.style.animation = 'slideOut 0.3s ease';
                    setTimeout(() => message.remove(), 300);
                }, 3000);
                
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
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