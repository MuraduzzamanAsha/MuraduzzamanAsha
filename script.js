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
});
