/* ===================================
   Panel Interactions & Animated Counters
   =================================== */

const Panels = (() => {
    // Animated count-up for stat values
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-value[data-count]');
        counters.forEach(counter => {
            if (counter.dataset.animated) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !counter.dataset.animated) {
                        counter.dataset.animated = 'true';
                        const target = parseInt(counter.dataset.count, 10);
                        animateNumber(counter, 0, target, 1500);
                        observer.unobserve(counter);
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(counter);
        });
    }

    function animateNumber(el, start, end, duration) {
        const startTime = performance.now();
        const range = end - start;

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + range * eased);

            el.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // Uptime counter
    function startUptimeCounter() {
        const startDate = new Date('2022-06-01T00:00:00');

        function updateUptime() {
            const now = new Date();
            let years = now.getFullYear() - startDate.getFullYear();
            let months = now.getMonth() - startDate.getMonth();
            let days = now.getDate() - startDate.getDate();

            if (days < 0) {
                months--;
                const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
                days += prevMonth.getDate();
            }
            if (months < 0) {
                years--;
                months += 12;
            }

            const yEl = document.getElementById('uptime-years');
            const mEl = document.getElementById('uptime-months');
            const dEl = document.getElementById('uptime-days');

            if (yEl) yEl.textContent = years;
            if (mEl) mEl.textContent = months;
            if (dEl) dEl.textContent = days;
        }

        updateUptime();
        setInterval(updateUptime, 60000); // Update every minute
    }

    // Expandable squeue rows
    function initExpandableRows() {
        document.querySelectorAll('.squeue-row.expandable').forEach(row => {
            row.addEventListener('click', () => {
                const jobId = row.dataset.job;
                const detail = document.getElementById(jobId);
                if (!detail) return;

                const isVisible = detail.classList.contains('visible');

                // Close all
                document.querySelectorAll('.squeue-detail').forEach(d => d.classList.remove('visible'));
                document.querySelectorAll('.squeue-row').forEach(r => r.classList.remove('expanded-active'));

                // Toggle this one
                if (!isVisible) {
                    detail.classList.add('visible');
                    row.classList.add('expanded-active');
                }
            });
        });
    }

    function init() {
        animateCounters();
        startUptimeCounter();
        initExpandableRows();

        // Re-animate counters when switching pages
        window.addEventListener('pageChanged', () => {
            animateCounters();
        });
    }

    return { init, animateCounters };
})();
