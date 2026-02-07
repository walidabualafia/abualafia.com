/* ===================================
   Hash-Based SPA Router
   =================================== */

const Router = (() => {
    const pages = ['overview', 'experience', 'skills', 'education', 'research', 'projects', 'contact'];
    const pageTitles = {
        overview: 'System Overview',
        experience: 'Experience',
        skills: 'Skills & Technologies',
        education: 'Education',
        research: 'Research',
        projects: 'Projects',
        contact: 'Contact',
    };

    let currentPage = 'overview';

    function navigate(page) {
        if (!pages.includes(page)) page = 'overview';
        if (page === currentPage) return;

        currentPage = page;

        // Update dashboards
        document.querySelectorAll('.dashboard').forEach(d => d.classList.remove('active'));
        const target = document.getElementById('dashboard-' + page);
        if (target) target.classList.add('active');

        // Update sidebar links
        document.querySelectorAll('.sidebar-link[data-page]').forEach(link => {
            link.classList.toggle('active', link.dataset.page === page);
        });

        // Update mobile nav
        document.querySelectorAll('.mobile-nav-link[data-page]').forEach(link => {
            link.classList.toggle('active', link.dataset.page === page);
        });

        // Update breadcrumb
        const breadcrumb = document.getElementById('breadcrumb-text');
        if (breadcrumb) breadcrumb.textContent = pageTitles[page] || page;

        // Update page title
        document.title = `Walid Abu Al-Afia | ${pageTitles[page] || 'HPC Dashboard'}`;

        // Close mobile more menu if open
        const moreMenu = document.getElementById('mobile-more-menu');
        if (moreMenu) moreMenu.classList.remove('visible');

        // Scroll main content to top
        const main = document.getElementById('main-content');
        if (main) main.scrollTop = 0;

        // Trigger panel animations
        window.dispatchEvent(new CustomEvent('pageChanged', { detail: { page } }));
    }

    function handleHash() {
        const hash = window.location.hash.replace('#/', '').replace('#', '') || 'overview';
        navigate(hash);
    }

    function init() {
        // Listen for hash changes
        window.addEventListener('hashchange', handleHash);

        // Set up sidebar link clicks
        document.querySelectorAll('.sidebar-link[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                window.location.hash = '#/' + page;
            });
        });

        // Mobile nav clicks
        document.querySelectorAll('.mobile-nav-link[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                window.location.hash = '#/' + page;
            });
        });

        // Mobile more links
        document.querySelectorAll('.mobile-more-link[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                window.location.hash = '#/' + page;
            });
        });

        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const sidebar = document.getElementById('sidebar');
        if (sidebarToggle && sidebar) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('expanded');
            });
        }

        // Mobile more menu
        const moreBtn = document.getElementById('mobile-more-btn');
        const moreMenu = document.getElementById('mobile-more-menu');
        if (moreBtn && moreMenu) {
            moreBtn.addEventListener('click', (e) => {
                e.preventDefault();
                moreMenu.classList.toggle('visible');
            });

            // Close more menu on outside click
            document.addEventListener('click', (e) => {
                if (!moreBtn.contains(e.target) && !moreMenu.contains(e.target)) {
                    moreMenu.classList.remove('visible');
                }
            });
        }

        // Initial route
        handleHash();
    }

    function navigateTo(page) {
        window.location.hash = '#/' + page;
    }

    function getCurrentPage() {
        return currentPage;
    }

    return { init, navigateTo, getCurrentPage, pages };
})();
