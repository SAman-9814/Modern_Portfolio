// --- 1. Smooth Scroll ---
        function scrollToSection(id) { document.getElementById(id).scrollIntoView({ behavior: 'smooth' }); }

        // --- 2. Nav Active State ---
        const allSections = document.querySelectorAll('section');
        const navItems = document.querySelectorAll('.nav-item');
        window.addEventListener('scroll', () => {
            let current = "";
            allSections.forEach(s => { if (window.scrollY >= s.offsetTop - 60) current = s.getAttribute('id'); });
            navItems.forEach(item => {
                item.classList.remove('active');
                if (current && item.getAttribute('onclick').includes(current)) item.classList.add('active');
            });
        });

        // --- 3. IDE 3D Tilt ---
        const ideContainer = document.getElementById('ide-container');
        const ideWindow = document.getElementById('ide-window');
        ideContainer.addEventListener('mousemove', (e) => {
            const rect = ideContainer.getBoundingClientRect();
            const px = (e.clientX - rect.left - rect.width/2) / (rect.width/2);
            const py = (e.clientY - rect.top - rect.height/2) / (rect.height/2);
            ideWindow.style.transform = `rotateX(${py * -10}deg) rotateY(${px * 10}deg)`;
            ideWindow.style.setProperty('--mouse-x', `${((e.clientX - rect.left)/rect.width)*100}%`);
            ideWindow.style.setProperty('--mouse-y', `${((e.clientY - rect.top)/rect.height)*100}%`);
        });
        ideContainer.addEventListener('mouseleave', () => { ideWindow.style.transform = 'rotateX(0deg) rotateY(0deg)'; });

        // --- 4. Typewriter ---
        const codeContainer = document.getElementById('typewriter-content');
        const codeText = `// Welcome to my workspace
import { Developer } from './universe';

const Portfolio = () => {
  return (
    <Developer
      name="Aman Kumar Sah"
      role="Software & Full-Stack Developer"
      passion="Engineering Beyond Boundaries"
    />
  );
};`;
        let charIndex = 0;
        function escapeHTML(s) { return s.replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
        function highlightCode(t) {
            return escapeHTML(t)
                .replace(/(\/\/.*)/g,'<span class="comment">$1</span>')
                .replace(/(import|from|const|return)/g,'<span class="keyword">$1</span>')
                .replace(/('.*?'|".*?")/g,'<span class="string">$1</span>')
                .replace(/(Developer)/g,'<span class="variable">$1</span>')
                .replace(/(Portfolio)/g,'<span class="function">$1</span>')
                .replace(/(name|role|passion)(?==)/g,'<span class="tag">$1</span>');
        }
        function typeCode() {
            if (charIndex < codeText.length) {
                codeContainer.innerHTML = highlightCode(codeText.substring(0, charIndex + 1)) + '<span class="cursor"></span>';
                charIndex++;
                setTimeout(typeCode, Math.random() * 10 + 5);
            } else { codeContainer.innerHTML = highlightCode(codeText) + '<span class="cursor blink"></span>'; }
        }
        setTimeout(typeCode, 1000);

        // --- 5. About Tilt Cards ---
        document.querySelectorAll('.tilt-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const r = card.getBoundingClientRect();
                const px = (e.clientX - r.left - r.width/2) / (r.width/2);
                const py = (e.clientY - r.top - r.height/2) / (r.height/2);
                card.style.transform = `rotateX(${py * -8}deg) rotateY(${px * 8}deg)`;
                card.style.setProperty('--mouse-x', `${e.clientX - r.left}px`);
                card.style.setProperty('--mouse-y', `${e.clientY - r.top}px`);
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'rotateX(0deg) rotateY(0deg)';
                card.style.setProperty('--mouse-x','50%'); card.style.setProperty('--mouse-y','50%');
            });
        });

        // --- 6. Network Sphere Canvas ---
        const canvas = document.getElementById('network-sphere');
        const ctx = canvas.getContext('2d');
        let nodes = [];
        const numNodes = 45, sphereRadius = 220;
        let autoAngleX = 0, autoAngleY = 0;
        let mouseOffsetX = 0, mouseOffsetY = 0, targetMouseOffsetX = 0, targetMouseOffsetY = 0;
        let windowHalfX = window.innerWidth / 2, windowHalfY = window.innerHeight / 2;
        function initNodes() {
            const phi = Math.PI * (3 - Math.sqrt(5));
            for (let i = 0; i < numNodes; i++) {
                const y = 1 - (i / (numNodes - 1)) * 2;
                const radiusAtY = Math.sqrt(1 - y * y);
                const theta = phi * i;
                nodes.push({ x: Math.cos(theta)*radiusAtY*sphereRadius, y: y*sphereRadius, z: Math.sin(theta)*radiusAtY*sphereRadius, color: Math.random() > 0.7 ? '#f78166' : '#00f0ff' });
            }
        }
        window.addEventListener('mousemove', (e) => {
            targetMouseOffsetX = ((e.clientX - windowHalfX) / windowHalfX) * 0.5;
            targetMouseOffsetY = ((e.clientY - windowHalfY) / windowHalfY) * 0.5;
        });
        window.addEventListener('resize', () => { windowHalfX = window.innerWidth/2; windowHalfY = window.innerHeight/2; });
        function animateSphere() {
            autoAngleX += 0.0015; autoAngleY += 0.0025;
            mouseOffsetX += (targetMouseOffsetX - mouseOffsetX) * 0.05;
            mouseOffsetY += (targetMouseOffsetY - mouseOffsetY) * 0.05;
            const fax = autoAngleX - mouseOffsetY, fay = autoAngleY + mouseOffsetX;
            const cosX = Math.cos(fax), sinX = Math.sin(fax), cosY = Math.cos(fay), sinY = Math.sin(fay);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const cx = canvas.width/2, cy = canvas.height/2;
            const projected = nodes.map(n => {
                const x1 = n.x*cosY - n.z*sinY, z1 = n.z*cosY + n.x*sinY;
                const y2 = n.y*cosX - z1*sinX, z2 = z1*cosX + n.y*sinX;
                const scale = 600 / (600 - z2);
                return { px: cx + x1*scale, py: cy + y2*scale, z: z2, color: n.color };
            });
            ctx.lineWidth = 0.7;
            for (let i = 0; i < projected.length; i++) {
                for (let j = i+1; j < projected.length; j++) {
                    const p1 = projected[i], p2 = projected[j];
                    const dist = Math.sqrt((p1.px-p2.px)**2 + (p1.py-p2.py)**2);
                    if (dist < 110) {
                        ctx.strokeStyle = `rgba(88,166,255,${(1-dist/110)*((p1.z+sphereRadius)/(2*sphereRadius))*0.6})`;
                        ctx.beginPath(); ctx.moveTo(p1.px, p1.py); ctx.lineTo(p2.px, p2.py); ctx.stroke();
                    }
                }
            }
            projected.forEach(p => {
                const da = (p.z + sphereRadius) / (2 * sphereRadius);
                const size = 2.5 * (600 / (600 - p.z));
                ctx.fillStyle = p.color; ctx.globalAlpha = 0.2 + da*0.8;
                ctx.shadowBlur = 12*da; ctx.shadowColor = p.color;
                ctx.beginPath(); ctx.arc(p.px, p.py, size > 0 ? size : 0, 0, Math.PI*2); ctx.fill();
                ctx.shadowBlur = 0;
            });
            ctx.globalAlpha = 1.0;
            requestAnimationFrame(animateSphere);
        }
        initNodes(); animateSphere();

        // --- 7. Skills Terminal Progress ---
        const skillsTerminal = document.querySelector('.skills-terminal');
        const progressText = document.querySelector('.progress-text');
        let progressInterval, currentProgress = 30;
        if (skillsTerminal) {
            skillsTerminal.addEventListener('mouseenter', () => {
                clearInterval(progressInterval);
                progressInterval = setInterval(() => { if (currentProgress < 90) { currentProgress++; progressText.textContent = currentProgress + '%'; } else clearInterval(progressInterval); }, 25);
            });
            skillsTerminal.addEventListener('mouseleave', () => {
                clearInterval(progressInterval);
                progressInterval = setInterval(() => { if (currentProgress > 30) { currentProgress--; progressText.textContent = currentProgress + '%'; } else clearInterval(progressInterval); }, 25);
            });
        }

        // --- 8. GitHub Heatmap ---
        document.addEventListener('DOMContentLoaded', () => {
            const graphContainer = document.getElementById('github-squares');
            if (!graphContainer) return;
            for (let i = 0; i < 52; i++) {
                const col = document.createElement('div');
                col.className = 'graph-col';
                for (let j = 0; j < 7; j++) {
                    const cell = document.createElement('div');
                    cell.className = 'graph-cell';
                    const rand = Math.random();
                    let level = 0;
                    if (rand > 0.85) level = 4;
                    else if (rand > 0.5) level = 3;
                    else if (rand > 0.2) level = 2;
                    else if (rand > 0.08) level = 1;
                    else if (rand > 0.02) level = 5;
                    cell.setAttribute('data-level', level);
                    col.appendChild(cell);
                }
                graphContainer.appendChild(col);
            }
        });

// --- 9. Projects See More ---
const seeMoreBtn = document.getElementById('seeMoreBtn');
if (seeMoreBtn) {
    seeMoreBtn.onclick = () => {
        const extraCards = document.querySelectorAll('.extra-card');
        const isShowingMore = seeMoreBtn.innerText.includes('More');
        
        extraCards.forEach(p => {
            if (isShowingMore) {
                p.classList.remove('hidden-card');
            } else {
                p.classList.add('hidden-card');
            }
        });
        
        seeMoreBtn.innerHTML = isShowingMore
            ? 'Show Less <i class="fas fa-chevron-up"></i>'
            : 'See More Projects <i class="fas fa-chevron-down"></i>';
    };
}

// --- 10. Contact Form ---
function ctRunScript() {
    const name    = document.getElementById('ct-userName').value;
    const email   = document.getElementById('ct-userEmail').value;
    const message = document.getElementById('ct-userMessage') ? document.getElementById('ct-userMessage').value : '';
    if (!name || !email) {
        alert('Terminal Error:\nPlease fill in both Name and Email fields.');
        return;
    }
    const subject = encodeURIComponent('Portfolio Contact from ' + name);
    const body    = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message);
    window.location.href = 'mailto:amansah9814@gmail.com?subject=' + subject + '&body=' + body;
}


// --- Project Filtering ---
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category') || '';
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.style.display = 'flex'; // card is display:flex in CSS
                    // If it's a hidden card, ensure we also manage its display appropriately
                    // Note: 'Show more' logic might need adjustment but this is fine for now
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Hide the 'See More' button when filtering
            const seeMoreBtn = document.getElementById('seeMoreBtn');
            if(seeMoreBtn) {
                seeMoreBtn.style.display = filterValue === 'all' ? 'block' : 'none';
            }
        });
    });
}
