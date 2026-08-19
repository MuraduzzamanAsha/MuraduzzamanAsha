/**
 * Muraduzzaman Asha - Cybersecurity Portfolio Scripts
 * Handles typing animation, lab filtering, SOC triage demo, project modals, and UX interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Safe fetch getter/setter protection
  try {
    const _nativeFetch = window.fetch ? window.fetch.bind(window) : null;
    Object.defineProperty(window, 'fetch', {
      get: () => _nativeFetch,
      set: (val) => { /* no-op */ },
      configurable: true,
      enumerable: true
    });
  } catch (e) {}

  // 2. Typing animation for hero role rotating subtitle
  const roles = [
    "Blue Team & SOC Analyst in Training",
    "Penetration Testing & Vulnerability Assessment",
    "SIEM & Log Analysis Practitioner",
    "Web Application & API Security",
    "Security Automation & CTF Player"
  ];
  const typedTarget = document.getElementById('hero-typed-target');
  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typeSpeed = 80;

  function typeRoles() {
    if (!typedTarget) return;
    const currentRole = roles[roleIdx];

    if (isDeleting) {
      typedTarget.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
      typeSpeed = 40;
    } else {
      typedTarget.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
      typeSpeed = 80;
    }

    if (!isDeleting && charIdx === currentRole.length) {
      typeSpeed = 2000; // Pause at end of text
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typeSpeed = 500;
    }

    setTimeout(typeRoles, typeSpeed);
  }
  typeRoles();

  // 3. Navbar scroll effect & Back to top button
  const navbar = document.querySelector('.navbar-custom');
  const backToTopBtn = document.getElementById('backToTopBtn');

  // ==========================================================================
  // PROFILE HUD 5-SECOND ROTATIONAL SLIDESHOW
  // ==========================================================================
  const hudSlides = document.querySelectorAll('.hud-slide');
  const hudDots = document.querySelectorAll('.hud-dot');
  const hudBadgeText = document.getElementById('hudBadgeText');
  const hudPrevBtn = document.getElementById('hudPrevSlideBtn');
  const hudNextBtn = document.getElementById('hudNextSlideBtn');
  const hudProgressBar = document.getElementById('hudRotationProgressBar');
  const hudSliderWrapper = document.getElementById('hudSliderWrapper');

  if (hudSlides.length > 0) {
    let currentSlideIdx = 0;
    let rotationInterval = null;
    const ROTATION_DELAY = 5000; // Exactly 5 seconds

    function showSlide(idx) {
      if (idx < 0) idx = hudSlides.length - 1;
      if (idx >= hudSlides.length) idx = 0;

      hudSlides.forEach((slide, i) => {
        if (i === idx) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });

      hudDots.forEach((dot, i) => {
        if (i === idx) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });

      const activeSlide = hudSlides[idx];
      if (activeSlide && hudBadgeText) {
        const caption = activeSlide.getAttribute('data-caption') || 'OPERATOR: MURADUZZAMAN';
        hudBadgeText.textContent = caption;
      }

      currentSlideIdx = idx;
      resetProgressBar();
    }

    function resetProgressBar() {
      if (hudProgressBar) {
        hudProgressBar.classList.remove('animate');
        void hudProgressBar.offsetWidth; // Trigger reflow
        hudProgressBar.classList.add('animate');
      }
    }

    function startRotation() {
      stopRotation();
      resetProgressBar();
      rotationInterval = setInterval(() => {
        showSlide(currentSlideIdx + 1);
      }, ROTATION_DELAY);
    }

    function stopRotation() {
      if (rotationInterval) {
        clearInterval(rotationInterval);
        rotationInterval = null;
      }
    }

    if (hudPrevBtn) {
      hudPrevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showSlide(currentSlideIdx - 1);
        startRotation();
      });
    }

    if (hudNextBtn) {
      hudNextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showSlide(currentSlideIdx + 1);
        startRotation();
      });
    }

    hudDots.forEach((dot, i) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        showSlide(i);
        startRotation();
      });
    });

    if (hudSliderWrapper) {
      hudSliderWrapper.addEventListener('mouseenter', () => {
        stopRotation();
        if (hudProgressBar) hudProgressBar.style.animationPlayState = 'paused';
      });

      hudSliderWrapper.addEventListener('mouseleave', () => {
        if (hudProgressBar) hudProgressBar.style.animationPlayState = 'running';
        startRotation();
      });
    }

    // Initialize first slide and begin 5s rotation
    showSlide(0);
    startRotation();
  }

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (navbar) {
      if (scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    if (backToTopBtn) {
      if (scrollY > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 4. Smooth scrolling for anchor links with offset
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href !== '#' && href.startsWith('#')) {
        const targetEl = document.querySelector(href);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
          // Close mobile menu if open
          const navbarCollapse = document.getElementById('navbarCyberNav');
          if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
            if (bsCollapse) bsCollapse.hide();
          }
        }
      }
    });
  });

  // 5. Interactive Hands-on Lab Filter System
  const filterBtns = document.querySelectorAll('.lab-filter-btn');
  const labCards = document.querySelectorAll('.lab-card-wrapper');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      labCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category.includes(filterValue)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 6. Interactive SOC Alert Triage Demo
  const socAlerts = {
    'alert-1': {
      id: 'SEC-2026-8941',
      title: 'Repeated SSH Authentication Failures (Brute Force)',
      timestamp: '2 mins ago (14:32:09 UTC)',
      sourceIp: '198.51.100.42 (External / Known Threat Feed)',
      target: 'srv-prod-ssh01 (10.0.4.12:22)',
      severity: 'HIGH',
      sevClass: 'high',
      mitre: 'T1110.001 - Brute Force: Password Guessing',
      payload: 'FAILED_PASSWORD for root from 198.51.100.42 port 49152 ssh2 (280 attempts/min)',
      analysis: 'Threshold of 5 failed attempts within 30s exceeded. External IP cycling common username lists via automated dictionary scan.',
      actions: [
        'Apply immediate firewall drop rule on border gateway for IP 198.51.100.42',
        'Verify root login is strictly disabled in sshd_config (PermitRootLogin no)',
        'Check /var/log/auth.log for any successful subsequent sessions from subnet'
      ]
    },
    'alert-2': {
      id: 'SEC-2026-8942',
      title: 'SQL Injection Payload Detected on /api/v1/auth',
      timestamp: '6 mins ago (14:28:44 UTC)',
      sourceIp: '203.0.113.88 (External)',
      target: 'web-gateway-01 (10.0.2.15:443)',
      severity: 'CRITICAL',
      sevClass: 'critical',
      mitre: 'T1190 - Exploit Public-Facing Application',
      payload: "POST /api/v1/auth/login HTTP/1.1 -> username=admin' OR '1'='1'--",
      analysis: 'WAF signature match for SQL syntax injection attempt on authentication parameter. Application responded with HTTP 400 Bad Request.',
      actions: [
        'Verify parameterized queries / ORM prepared statements across /api/v1/auth endpoints',
        'Confirm WAF blocking mode is strictly enforced for boolean-based SQLi regexes',
        'Audit backend database query logs to confirm no unsanitized execution occurred'
      ]
    },
    'alert-3': {
      id: 'SEC-2026-8943',
      title: 'Suspicious PowerShell Encoded Command Execution',
      timestamp: '14 mins ago (14:20:11 UTC)',
      sourceIp: '10.0.8.44 (Internal Workstation WS-FIN-09)',
      target: 'WS-FIN-09 (Parent: EXCEL.EXE PID 4108)',
      severity: 'CRITICAL',
      sevClass: 'critical',
      mitre: 'T1059.001 - Command & Scripting: PowerShell',
      payload: 'powershell.exe -NoP -NonI -W Hidden -Enc SUVYIChOZXctT2JqZWN0IE5ldC5XZWJDbGllbnQpLi4u',
      analysis: 'Office macro execution spawned PowerShell with Base64 encoded payload attempting remote script staging. Endpoint EDR quarantined the sub-process.',
      actions: [
        'Immediately isolate host WS-FIN-09 from internal subnet',
        'Decode and analyze base64 payload to extract C2 domain and IOCs',
        'Perform memory capture and check persistence mechanisms (Registry Run keys, Scheduled Tasks)'
      ]
    },
    'alert-4': {
      id: 'SEC-2026-8944',
      title: 'High-Volume Port Scan Detected via Nmap SYN Scan',
      timestamp: '22 mins ago (14:12:00 UTC)',
      sourceIp: '192.168.10.105 (VLAN 10 Dev Subnet)',
      target: 'Subnet Range 10.0.1.0/24 (Ports 1-1024)',
      severity: 'MEDIUM',
      sevClass: 'medium',
      mitre: 'T1046 - Network Service Discovery',
      payload: 'TCP SYN packets to 1024 consecutive destination ports with window size 1024',
      analysis: 'Internal reconnaissance pattern characteristic of Nmap -sS scan across critical server segment. Scan originated from developer testing zone.',
      actions: [
        'Verify with developer team if penetration test or scheduled vulnerability scan was authorized',
        'Ensure micro-segmentation ACLs block unauthorized lateral traffic between VLAN 10 and Server VLAN',
        'Log incident in ticket tracker and monitor host for secondary exploitation attempts'
      ]
    }
  };

  const alertItems = document.querySelectorAll('.soc-alert-item');
  const socDetailContainer = document.getElementById('socDetailContent');

  function renderSocDetail(alertKey) {
    const data = socAlerts[alertKey];
    if (!data || !socDetailContainer) return;

    let actionsHtml = data.actions.map(act => `<li><i class="fas fa-shield-alt text-cyan me-2"></i>${act}</li>`).join('');

    socDetailContainer.innerHTML = `
      <div class="soc-detail-row">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="soc-detail-label">Incident ID:</span>
          <span class="badge ${data.sevClass === 'critical' ? 'bg-danger' : data.sevClass === 'high' ? 'bg-warning text-dark' : 'bg-info'} text-uppercase font-mono">${data.severity} SEVERITY</span>
        </div>
        <div class="soc-detail-val text-cyan">${data.id} &mdash; ${data.title}</div>
      </div>
      
      <div class="soc-detail-row">
        <span class="soc-detail-label">Timestamp & Source:</span>
        <div class="soc-detail-val font-mono">${data.timestamp} | <span class="text-warning">${data.sourceIp}</span></div>
      </div>

      <div class="soc-detail-row">
        <span class="soc-detail-label">Target Asset:</span>
        <div class="soc-detail-val font-mono">${data.target}</div>
      </div>

      <div class="soc-detail-row">
        <span class="soc-detail-label">MITRE ATT&CK Mapping:</span>
        <div class="soc-detail-val text-teal font-mono">${data.mitre}</div>
      </div>

      <div class="soc-detail-row">
        <span class="soc-detail-label">Observed Raw Log / Payload:</span>
        <div class="p-2 mt-1 rounded font-mono text-muted small" style="background: rgba(0,0,0,0.5); word-break: break-all; border: 1px solid var(--border-subtle);">
          <code>${data.payload}</code>
        </div>
      </div>

      <div class="soc-detail-row mt-3">
        <span class="soc-detail-label">Analyst Triage & Next Actions:</span>
        <ul class="list-unstyled mt-2 font-mono small text-secondary">
          ${actionsHtml}
        </ul>
      </div>
    `;
  }

  alertItems.forEach(item => {
    item.addEventListener('click', () => {
      alertItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const alertKey = item.getAttribute('data-alert-id');
      renderSocDetail(alertKey);
    });
  });

  // 7. Project Details Modal Data
  const projectDetails = {
    'cyberjobbot': {
      title: 'CyberJobBot — Cybersecurity Job Intelligence Automation',
      category: 'Cybersecurity Automation & Telemetry',
      problem: 'Cybersecurity opportunities, SOC internships, and security analyst roles are posted across dozens of fragmented portals daily. Manual monitoring causes missed deadlines and delayed applications.',
      approach: 'Engineered an automated PowerShell daemon that continuously crawls and parses cybersecurity listings, filters using regex-based role taxonomy (SOC, Pentesting, Blue Team), calculates keyword match relevance scores, rejects duplicate postings via hash tracking, and delivers real-time prioritized alerts directly via Telegram Bot API.',
      tools: ['PowerShell 7', 'Telegram Bot API', 'JSON Parsing', 'RegEx Filtering', 'Task Scheduler', 'Git'],
      learnings: 'Deepened understanding of API integration, headless automation, error recovery loops, and building noise-filtered notification pipelines for high-value intelligence.',
      github: 'https://github.com/Murad734138/CyberJobBot'
    },
    'thm-portfolio': {
      title: 'TryHackMe & VulnHub Security Lab Portfolio',
      category: 'Offensive Security & Vulnerability Assessment',
      problem: 'Gaining real-world practical security competence requires executing and documenting live exploitation, privilege escalation, and network pivoting across realistic simulated vulnerable environments.',
      approach: 'Completed 120+ rooms and practical VulnHub virtual machines. Executed systematic reconnaissance (Nmap, Rustscan, Gobuster), identified OWASP Top 10 vulnerabilities (SQLi, XSS, IDOR, command injection), exploited misconfigurations, bypassed defenses, performed Linux/Windows privilege escalation (LinPEAS, WinPEAS, SUID, kernel exploits), and authored structured writeups with actionable remediation advice.',
      tools: ['Burp Suite', 'Nmap', 'Metasploit', 'LinPEAS', 'Gobuster', 'Wireshark', 'Hydra', 'John the Ripper'],
      learnings: 'Mastered methodology-driven penetration testing, structured reporting, and understanding how defensive misconfigurations create offensive footholds.',
      github: 'https://github.com/Murad734138'
    },
    'home-lab': {
      title: 'Home Penetration Testing & Defense Lab',
      category: 'Virtual Lab Architecture & Security Testing',
      problem: 'Testing attack vectors and analyzing defensive log telemetry safely requires an isolated, non-destructive enterprise network simulation.',
      approach: 'Architected a multi-VM virtualized testing environment using VirtualBox and VMware. Deployed attacking nodes (Kali Linux) alongside intentionally vulnerable Windows and Linux targets (Metasploitable, Windows Active Directory simulation VMs, DVWA). Configured host-only networking, packet capture interfaces, and baseline logging to inspect attack signatures generated during scanning and exploitation.',
      tools: ['Kali Linux', 'Ubuntu Server', 'Windows 10/11 VMs', 'VirtualBox/VMware', 'Burp Suite', 'Wireshark', 'Nmap'],
      learnings: 'Gained hands-on mastery in network isolation, subnet routing, packet analysis during active exploitation, and telemetry inspection.',
      github: 'https://github.com/Murad734138'
    },
    'malicious-package': {
      title: 'Malicious Package Detection Research',
      category: 'Software Security & Machine Learning',
      problem: 'Software supply chain attacks via typosquatting, dependency confusion, and poisoned open-source packages (npm, PyPI) increasingly compromise enterprise applications before deployment.',
      approach: 'Conducted undergraduate research on detecting poisoned open-source packages using static code analysis combined with machine learning classifiers. Extracted syntactic features (Abstract Syntax Tree complexity, suspicious network/eval calls, entropy, obfuscation patterns) and trained ML models to distinguish benign packages from malicious software supply chain payloads.',
      tools: ['Python', 'AST Analysis', 'Machine Learning (Scikit-Learn)', 'Static Code Analysis', 'Security Research'],
      learnings: 'Developed deep insights into static malware triage, supply chain threat vectors, obfuscation mechanics, and defensive automated package validation.',
      github: 'https://github.com/Murad734138'
    }
  };

  const projectModal = document.getElementById('projectDetailModal');
  if (projectModal) {
    projectModal.addEventListener('show.bs.modal', function(event) {
      const button = event.relatedTarget;
      const projectId = button.getAttribute('data-project-id');
      const data = projectDetails[projectId];

      if (!data) return;

      document.getElementById('modalProjectTitle').textContent = data.title;
      document.getElementById('modalProjectCat').textContent = data.category;
      document.getElementById('modalProjectProblem').textContent = data.problem;
      document.getElementById('modalProjectApproach').textContent = data.approach;
      document.getElementById('modalProjectLearnings').textContent = data.learnings;
      
      const toolsContainer = document.getElementById('modalProjectTools');
      toolsContainer.innerHTML = data.tools.map(t => `<span class="tech-chip">${t}</span>`).join(' ');

      const ghLink = document.getElementById('modalProjectGithub');
      if (ghLink) {
        ghLink.href = data.github;
      }
    });
  }

  // 8. Copy Email to Clipboard with visual feedback
  const copyEmailBtns = document.querySelectorAll('.btn-copy-email');
  copyEmailBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'muraduzzamanasha.job@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check text-success me-1"></i> Copied!';
        setTimeout(() => {
          btn.innerHTML = originalHtml;
        }, 2500);
      }).catch(() => {
        window.location.href = 'mailto:muraduzzamanasha.job@gmail.com';
      });
    });
  });

  // 9. Contact Form Validation and Mailto Fallback
  const contactForm = document.getElementById('securityContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const subject = document.getElementById('contactSubject').value.trim() || 'Cybersecurity Inquiry';
      const message = document.getElementById('contactMessage').value.trim();

      if (!name || !email || !message) {
        alert('Please fill out all required fields.');
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Transmitting...';

      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check text-success me-2"></i> Message Ready!';
        
        // Open default mail client as reliable fallback
        const mailtoUri = `mailto:muraduzzamanasha.job@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("From: " + name + " (" + email + ")\n\n" + message)}`;
        window.location.href = mailtoUri;

        contactForm.reset();
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }, 3500);
      }, 800);
    });
  }

  // ==========================================================================
  // 10. INTERACTIVE CYBER CLI TERMINAL
  // ==========================================================================
  const cliToggleBtn = document.getElementById('cyberCliToggleBtn');
  const cliDrawer = document.getElementById('cyberCliDrawer');
  const cliCloseDot = document.getElementById('cliCloseDot');
  const cliOutput = document.getElementById('cliOutputArea');
  const cliInput = document.getElementById('cliInputField');

  if (cliToggleBtn && cliDrawer) {
    cliToggleBtn.addEventListener('click', () => {
      cliDrawer.classList.toggle('open');
      if (cliDrawer.classList.contains('open')) {
        setTimeout(() => cliInput && cliInput.focus(), 150);
      }
    });

    if (cliCloseDot) {
      cliCloseDot.addEventListener('click', () => {
        cliDrawer.classList.remove('open');
      });
    }
  }

  const cliCommands = {
    'help': () => `
Available Commands:
  - <span class="highlight-msg">whoami</span>       : Display operator profile & bio
  - <span class="highlight-msg">skills</span>       : List categorized cybersecurity skill stack
  - <span class="highlight-msg">projects</span>     : Print featured security engineering projects
  - <span class="highlight-msg">soc</span>          : Inspect live SOC monitoring status & active alerts
  - <span class="highlight-msg">ctf</span>          : View CTF achievements & competition highlights
  - <span class="highlight-msg">matrix</span>       : Print MITRE ATT&CK framework coverage
  - <span class="highlight-msg">contact</span>      : Show direct contact channels & email
  - <span class="highlight-msg">clear</span>        : Clear the terminal console
  - <span class="highlight-msg">banner</span>       : Display ASCII security banner
`,
    'whoami': () => `
[+] OPERATOR IDENTIFICATION:
  Name      : Muraduzzaman Asha
  Role      : Aspiring Cyber Security Engineer / Blue Team Analyst
  Education : B.Sc. in ICT (CGPA 3.56/4.00), MBSTU (Graduated June 2026)
  Location  : Tangail, Bangladesh
  Core Motto: "Breaking systems to understand them. Building skills to defend them."
`,
    'skills': () => `
[+] CLASSIFIED SECURITY STACK:
  * Offensive : Burp Suite, Nmap, Metasploit, LinPEAS, Rustscan, Gobuster
  * Blue Team : SOC Operations, SIEM Concepts, Log Analysis, Incident Triage
  * Web & API : OWASP Top 10, SQLi, XSS, Auth Bypasses, JWT Testing
  * Network   : Wireshark, TCP/IP, DNS, HTTP/S, SSH, FTP, SMB, VPN
  * Systems   : Kali Linux, Ubuntu Server, Windows 10/11, VirtualBox
  * Scripting : Python, PowerShell, Bash, C/C++, Git
`,
    'projects': () => `
[+] FEATURED PROJECTS:
  1. CyberJobBot           : Automated PowerShell Telegram security job intel daemon
  2. THM & VulnHub Portfolio: 120+ hands-on pentesting & privesc lab writeups
  3. Home Pentest Lab      : Isolated multi-VM offensive & defensive testing range
  4. Malicious Package RS  : Static code analysis & ML for supply chain defense
`,
    'soc': () => `
[+] SOC DEFENSE TELEMETRY:
  * Status          : SENSOR CLUSTER 04 ONLINE
  * 24h Event Volume: 148,290 events parsed
  * Active Queue    : 4 High/Critical alerts in triage queue
  * MTTR Target     : < 4.2 minutes
  * Framework       : MITRE ATT&CK Enterprise Matrix v14
`,
    'ctf': () => `
[+] CTF COMPETITION RECORD:
  * EWU National RoboFest 2026 : 6th Place Grand Finale (Team Bit Bakers)
  * Cybernauts 2026 CTF        : Grand Finale Representative for MBSTU
  * TryHackMe Global Ranking   : Top 3% Worldwide (120+ Rooms Solved)
`,
    'matrix': () => `
[+] MITRE ATT&CK MATRIX COVERAGE:
  * T1190    : Exploit Public-Facing Application (Web/API)
  * T1110    : Brute Force (SSH / HTTP Auth)
  * T1059.001: Command & Scripting: PowerShell
  * T1046    : Network Service Discovery (Nmap Scans)
  * T1548    : Abuse Elevation Control Mechanism (SUID/Sudoers)
`,
    'contact': () => `
[+] DIRECT TRANSMISSION CHANNELS:
  * Email    : muraduzzamanasha.job@gmail.com
  * GitHub   : https://github.com/Murad734138
  * LinkedIn : https://www.linkedin.com/in/muraduzzaman-asha-9706772b0
  * TryHackMe: https://tryhackme.com
`,
    'banner': () => `
  __  __ _   _ ____      _    ____  
 |  \\/  | | | |  _ \\    / \\  |  _ \\ 
 | |\\/| | | | | |_) |  / _ \\ | | | |
 | |  | | |_| |  _ <  / ___ \\| |_| |
 |_|  |_|\\___/|_| \\_\\/_/   \\_\\____/ 
 [ MURADUZZAMAN ASHA &bull; CYBERSECURITY &bull; SOC &bull; BLUE TEAM ]
`,
    'date': () => `[+] SYSTEM TIME: ${new Date().toUTCString()}`,
    'clear': () => 'CLEAR'
  };

  if (cliInput && cliOutput) {
    cliInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const rawCmd = cliInput.value.trim();
        const cmd = rawCmd.toLowerCase();
        cliInput.value = '';

        if (!rawCmd) return;

        // Print entered command
        const userLine = document.createElement('div');
        userLine.className = 'cli-output-line cmd-prompt';
        userLine.innerHTML = `<span style="color:var(--text-muted)">visitor@sec-hub:~$</span> ${escapeHtml(rawCmd)}`;
        cliOutput.appendChild(userLine);

        if (cmd === 'clear') {
          cliOutput.innerHTML = `
            <div class="cli-output-line system-msg">
              Muraduzzaman Asha [Cybersecurity Interactive CLI v2.4]<br>
              Type <span class="highlight-msg">help</span> for a list of available security commands.
            </div>
          `;
          return;
        }

        const responseHandler = cliCommands[cmd];
        const resLine = document.createElement('div');
        resLine.className = 'cli-output-line';

        if (responseHandler) {
          resLine.innerHTML = responseHandler();
        } else {
          resLine.className = 'cli-output-line error-msg';
          resLine.innerHTML = `Command not recognized: "${escapeHtml(rawCmd)}". Type <span class="highlight-msg">help</span> for valid commands.`;
        }

        cliOutput.appendChild(resLine);
        cliOutput.scrollTop = cliOutput.scrollHeight;
      }
    });
  }

  function escapeHtml(text) {
    return text.replace(/[&<>"']/g, function(m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }

  // ==========================================================================
  // 11. LIVE SOC SYSLOG & TELEMETRY STREAMER
  // ==========================================================================
  const syslogStreamContainer = document.getElementById('socStreamerLogs');
  const sampleLogs = [
    { tag: 'suricata', text: 'ET SCAN Potential Nmap User-Agent Detected [Classification: Reconnaissance] 192.168.10.105:43920 -> 10.0.1.25:80' },
    { tag: 'zeek', text: 'HTTP 401 Unauthorized /api/v1/auth/session - Suspicious header X-Forwarded-For: 203.0.113.88' },
    { tag: 'firewall', text: 'DROP IN=eth0 OUT= MAC=52:54:00:12:34:56 SRC=198.51.100.42 DST=10.0.4.12 PROTO=TCP SPT=49152 DPT=22' },
    { tag: 'auditd', text: 'type=EXECVE msg=audit(1724067200.412:891): argc=3 a0="sudo" a1="-l" a2="root" cwd="/var/tmp" comm="sudo"' },
    { tag: 'zeek', text: 'DNS query ANY _ldap._tcp.dc._msdcs.corp.local -> returned 0 records (Active Directory Recon)' },
    { tag: 'suricata', text: 'ET WEB_SERVER SQL Injection Attempt detected in URI parameter "id=1\' OR \'1\'=\'1"' },
    { tag: 'auditd', text: 'type=SYSCALL arch=c000003e syscall=59 success=yes pid=4108 exe="/usr/bin/powershell" key="susp_shell"' },
    { tag: 'firewall', text: 'ALLOW IN=eth1 OUT=eth0 SRC=10.0.8.44 DST=10.0.2.15 PROTO=TCP SPT=55230 DPT=443 (TLS v1.3)' }
  ];

  if (syslogStreamContainer) {
    let logIndex = 0;
    setInterval(() => {
      const item = sampleLogs[logIndex % sampleLogs.length];
      logIndex++;

      const logRow = document.createElement('div');
      logRow.className = 'stream-log-entry';
      const timeStr = new Date().toISOString().substring(11, 19);

      logRow.innerHTML = `
        <span class="text-muted">${timeStr}</span>
        <span class="log-tag ${item.tag}">${item.tag}</span>
        <span class="text-secondary">${item.text}</span>
      `;

      syslogStreamContainer.appendChild(logRow);

      // Keep maximum 6 lines
      while (syslogStreamContainer.children.length > 6) {
        syslogStreamContainer.removeChild(syslogStreamContainer.firstChild);
      }
    }, 3200);
  }

  // ==========================================================================
  // 12. CTF CIPHER & FLAG DECODER CHALLENGE
  // ==========================================================================
  const ctfDecodeBtn = document.getElementById('ctfQuickDecodeBtn');
  const ctfVerifyBtn = document.getElementById('ctfVerifyFlagBtn');
  const ctfInput = document.getElementById('ctfFlagInput');
  const ctfResult = document.getElementById('ctfResultBadge');
  const correctFlag = 'THM{MURAD_SECURITY_ENGINEER_DEV_2026}';

  if (ctfDecodeBtn && ctfInput) {
    ctfDecodeBtn.addEventListener('click', () => {
      ctfInput.value = correctFlag;
      if (ctfResult) {
        ctfResult.className = 'ctf-result-badge success';
        ctfResult.innerHTML = '<i class="fas fa-check-circle me-1"></i> [PAYLOAD DECODED &amp; VERIFIED] Flag: <strong>' + correctFlag + '</strong> (100 pts)';
      }
    });
  }

  if (ctfVerifyBtn && ctfInput && ctfResult) {
    ctfVerifyBtn.addEventListener('click', () => {
      const val = ctfInput.value.trim();
      if (val === correctFlag || val.toLowerCase() === correctFlag.toLowerCase()) {
        ctfResult.className = 'ctf-result-badge success';
        ctfResult.innerHTML = '<i class="fas fa-check-circle me-1"></i> [EXCELLENT!] Valid Flag Captured: <strong>' + correctFlag + '</strong>';
      } else {
        ctfResult.className = 'ctf-result-badge';
        ctfResult.style.display = 'block';
        ctfResult.style.color = '#EF4444';
        ctfResult.innerHTML = '<i class="fas fa-times-circle me-1"></i> Incorrect flag submission. Decode the Base64 ciphertext above.';
      }
    });
  }

  // ==========================================================================
  // 13. MITRE ATT&CK MATRIX EXPLORER
  // ==========================================================================
  const mitrePills = document.querySelectorAll('.mitre-technique-pill');
  const mitrePanel = document.getElementById('mitreInspectorPanel');
  const mitreDetails = {
    'T1190': {
      name: 'T1190 - Exploit Public-Facing Application',
      tactic: 'Initial Access',
      description: 'Adversaries exploit software vulnerabilities in internet-facing web apps, servers, or APIs to execute arbitrary code or gain an initial foothold.',
      detection: 'Inspect web application firewall (WAF) anomaly alerts, audit HTTP status 500 error spikes, and enable parameterized SQL query enforcement.',
      mitigation: 'Implement strict input validation, automated vulnerability scanning (Burp/OWASP ZAP), and regular software patch cycles.'
    },
    'T1110': {
      name: 'T1110.001 - Password Guessing & Brute Force',
      tactic: 'Credential Access',
      description: 'Adversaries systematically submit lists of commonly used usernames and passwords against SSH, RDP, or web authentication endpoints.',
      detection: 'Monitor auth.log or Event ID 4625 for rapid sequential failure events originating from a single external IP address.',
      mitigation: 'Enforce rate-limiting, Fail2Ban / IP blocking rules, multi-factor authentication (MFA), and disable password-based root SSH logins.'
    },
    'T1059': {
      name: 'T1059.001 - Command and Scripting: PowerShell',
      tactic: 'Execution',
      description: 'Adversaries execute malicious PowerShell scripts with hidden windows (-W Hidden) or Base64 encoded commands (-Enc) to bypass basic controls.',
      detection: 'Enable PowerShell Script Block Logging (Event ID 4104) and monitor process creation events (Event ID 4688 / Sysmon Event ID 1).',
      mitigation: 'Enforce Constrained Language Mode, PowerShell AppLocker execution policies, and deploy modern EDR heuristics.'
    },
    'T1548': {
      name: 'T1548.003 - Sudo and Sudo Caching',
      tactic: 'Privilege Escalation',
      description: 'Adversaries take advantage of misconfigured sudoers rules (NOPASSWD) or binary SUID bits to elevate privileges to root/administrator.',
      detection: 'Audit /etc/sudoers changes, monitor auditd EXECVE calls for sudo with wildcard arguments, and inspect GTFOBins executable usage.',
      mitigation: 'Follow principle of least privilege in sudoers, restrict shell escape capabilities on maintenance utilities, and regularly run LinPEAS audits.'
    },
    'T1046': {
      name: 'T1046 - Network Service Discovery',
      tactic: 'Discovery',
      description: 'Adversaries scan network segments using tools like Nmap or Rustscan to discover active IP addresses, open ports, and vulnerable services.',
      detection: 'Suricata / Zeek rules matching high rates of TCP SYN packets across multiple destination ports within short intervals.',
      mitigation: 'Implement internal VLAN segmentation, zero-trust network access (ZTNA), and restrict inter-VLAN lateral exploration.'
    }
  };

  mitrePills.forEach(pill => {
    pill.addEventListener('click', () => {
      mitrePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const techId = pill.getAttribute('data-tech-id');
      const data = mitreDetails[techId];

      if (data && mitrePanel) {
        mitrePanel.classList.add('visible');
        mitrePanel.innerHTML = `
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="text-cyan font-bold">${data.name}</span>
            <span class="badge bg-dark text-teal border border-secondary">${data.tactic}</span>
          </div>
          <p class="text-secondary small mb-2">${data.description}</p>
          <div class="mb-2">
            <strong class="text-warning small"><i class="fas fa-radar me-1"></i> Detection Playbook:</strong>
            <div class="text-muted small">${data.detection}</div>
          </div>
          <div>
            <strong class="text-success small"><i class="fas fa-shield-alt me-1"></i> Mitigation:</strong>
            <div class="text-muted small">${data.mitre || data.mitigation}</div>
          </div>
        `;
      }
    });
  });

  // ==========================================================================
  // CV VIEWER MODAL & MULTI-STRATEGY DOWNLOAD SYSTEM
  // ==========================================================================
  const cvViewerModalEl = document.getElementById('cvViewerModal');
  const btnModalDirectDownload = document.getElementById('btnModalDirectDownload');
  const btnModalCopyLink = document.getElementById('btnModalCopyLink');
  const btnModalNewTab = document.getElementById('btnModalNewTab');

  function triggerGuaranteedDownload() {
    // Strategy 1: Fetch Base64 data and trigger direct Data-URI download
    fetch('/api/cv-data')
      .then(res => res.json())
      .then(data => {
        if (data && data.base64) {
          const byteCharacters = atob(data.base64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/pdf' });
          const blobUrl = window.URL.createObjectURL(blob);
          
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = blobUrl;
          a.download = data.filename || 'Muraduzzaman_Asha_CV.pdf';
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(blobUrl);
          }, 400);
        }
      })
      .catch(() => {
        // Fallback: window navigation
        window.open('/download-cv', '_blank');
      });
  }

  // Navbar and Hero CV click handlers
  const cvTriggers = document.querySelectorAll('a[href="/download-cv"], #heroDownloadCvBtn');
  cvTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      // 1. Show interactive CV Hub Modal
      if (cvViewerModalEl && typeof bootstrap !== 'undefined') {
        const bsModal = bootstrap.Modal.getOrCreateInstance(cvViewerModalEl);
        bsModal.show();
      }

      // 2. Trigger instant download
      triggerGuaranteedDownload();

      // 3. Button feedback
      const originalHtml = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check-circle text-success me-1"></i> Opening CV...';
      setTimeout(() => {
        btn.innerHTML = originalHtml;
      }, 2000);
    });
  });

  // Modal Toolbar: Direct Download button
  if (btnModalDirectDownload) {
    btnModalDirectDownload.addEventListener('click', () => {
      triggerGuaranteedDownload();
      const origText = btnModalDirectDownload.innerHTML;
      btnModalDirectDownload.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Downloading...';
      setTimeout(() => {
        btnModalDirectDownload.innerHTML = '<i class="fas fa-check text-success me-1"></i> Saved!';
        setTimeout(() => {
          btnModalDirectDownload.innerHTML = origText;
        }, 2000);
      }, 1000);
    });
  }

  // Modal Toolbar: Copy Link button
  if (btnModalCopyLink) {
    btnModalCopyLink.addEventListener('click', () => {
      const fullUrl = window.location.origin + '/download-cv';
      navigator.clipboard.writeText(fullUrl).then(() => {
        const origText = btnModalCopyLink.innerHTML;
        btnModalCopyLink.innerHTML = '<i class="fas fa-check text-success me-1"></i> Copied!';
        setTimeout(() => {
          btnModalCopyLink.innerHTML = origText;
        }, 2500);
      }).catch(() => {
        prompt('Copy this CV download link:', fullUrl);
      });
    });
  }
});

