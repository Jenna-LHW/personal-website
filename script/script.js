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