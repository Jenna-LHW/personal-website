function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const hamburger = document.querySelector('.hamburger');
    
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    hamburger.classList.toggle('active');
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const hamburger = document.querySelector('.hamburger');
    
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    hamburger.classList.remove('active');
}

// Close sidebar when clicking outside
document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebar');
    const hamburger = document.querySelector('.hamburger');
    
    if (!sidebar.contains(event.target) && !hamburger.contains(event.target)) {
        closeSidebar();
    }
});

// Handle window resize
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        closeSidebar();
    }
});

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Mobile navigation loaded successfully!');
});

function toggleDropdown(button) {
    const content = button.nextElementSibling;
    const icon = button.querySelector('.expand-icon');
    
    // Close all other dropdowns
    document.querySelectorAll('.dropdown-content').forEach(dropdown => {
        if (dropdown !== content) {
            dropdown.classList.remove('active');
        }
    });
    
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        if (toggle !== button) {
            toggle.classList.remove('active');
        }
    });
    
    // Toggle current dropdown
    content.classList.toggle('active');
    button.classList.toggle('active');
    
    // Update button text
    if (content.classList.contains('active')) {
        button.innerHTML = button.innerHTML.replace('View Details', 'Hide Details')
                                            .replace('View Subjects', 'Hide Subjects');
    } else {
        button.innerHTML = button.innerHTML.replace('Hide Details', 'View Details')
                                            .replace('Hide Subjects', 'View Subjects');
    }
}

// Add smooth scrolling and interactive effects
document.addEventListener('DOMContentLoaded', function() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    // Add stagger animation on load
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.6s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 200);
    });

    // Tab switching functionality
    const tabs = document.querySelectorAll('.tab');
    const sections = document.querySelectorAll('.section-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Hide all sections
            sections.forEach(section => {
                section.style.display = 'none';
            });
            
            // Show target section with animation
            const targetElement = document.getElementById(targetSection + '-section');
            if (targetElement) {
                targetElement.style.display = 'block';
                
                // Animate timeline items in the new section
                const sectionItems = targetElement.querySelectorAll('.timeline-item');
                sectionItems.forEach((item, index) => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(30px)';
                    
                    setTimeout(() => {
                        item.style.transition = 'all 0.6s ease';
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, index * 150);
                });
            }
        });
    });

    // Button click effects
    const buttons = document.querySelectorAll('.view-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'translateY(-2px)';
            }, 150);
        });
    });
});

 document.addEventListener('DOMContentLoaded', function() {
            const tabs = document.querySelectorAll('.tab');
            const sections = document.querySelectorAll('.section-content');

            tabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    const targetSection = this.getAttribute('data-section');
                    
                    // Remove active class from all tabs
                    tabs.forEach(t => t.classList.remove('active'));
                    
                    // Add active class to clicked tab
                    this.classList.add('active');
                    
                    // Hide all sections
                    sections.forEach(section => {
                        section.classList.remove('active');
                    });
                    
                    // Show target section
                    const targetElement = document.getElementById(targetSection + '-section');
                    if (targetElement) {
                        targetElement.classList.add('active');
                    }
                });
            });
        });

        function toggleSubjects(button) {
            const subjectsSection = button.parentElement.querySelector('.subjects-section');
            const isVisible = subjectsSection.classList.contains('show');
            
            // Close all other open dropdowns first
            const allSubjectsSections = document.querySelectorAll('.subjects-section');
            const allButtons = document.querySelectorAll('.view-btn');
            
            allSubjectsSections.forEach((section, index) => {
                if (section !== subjectsSection && section.classList.contains('show')) {
                    section.classList.remove('show');
                    allButtons[index].textContent = getButtonText(allButtons[index]);
                }
            });
            
            // Toggle the clicked dropdown
            if (isVisible) {
                subjectsSection.classList.remove('show');
                button.textContent = getButtonText(button);
            } else {
                subjectsSection.classList.add('show');
                button.textContent = getHideButtonText(button);
            }
        }

        function getButtonText(button) {
            const card = button.closest('.education-card');
            const institution = card.querySelector('.institution').textContent;
            
            if (institution.includes('University')) {
                return 'View Modules';
            } else if (institution.includes('Venyleos')) {
                return 'View Skills';
            } else {
                return 'View Subjects';
            }
        }

        function getHideButtonText(button) {
            const card = button.closest('.education-card');
            const institution = card.querySelector('.institution').textContent;
            
            if (institution.includes('University')) {
                return 'Hide Modules';
            } else if (institution.includes('Venyleos')) {
                return 'Hide Skills';
            } else {
                return 'Hide Subjects';
            }
        }
