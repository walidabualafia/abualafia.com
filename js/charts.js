/* ===================================
   Canvas-based Mini Charts
   =================================== */

const Charts = (() => {

    // Draw sparklines in stat cards
    function drawSparklines() {
        document.querySelectorAll('.stat-sparkline').forEach(container => {
            if (container.querySelector('canvas')) return;

            const canvas = document.createElement('canvas');
            const width = container.offsetWidth || 200;
            const height = container.offsetHeight || 24;
            canvas.width = width * 2; // retina
            canvas.height = height * 2;
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            container.appendChild(canvas);

            const ctx = canvas.getContext('2d');
            ctx.scale(2, 2);

            // Generate random but upward-trending data
            const type = container.dataset.type;
            const points = generateData(type, 20);
            drawSparkline(ctx, points, width, height);
        });
    }

    function generateData(type, count) {
        const data = [];
        let val = 20;
        for (let i = 0; i < count; i++) {
            val += (Math.random() - 0.3) * 15;
            val = Math.max(5, Math.min(95, val));
            // Trend upward
            val += (i / count) * 3;
            data.push(val);
        }
        return data;
    }

    function drawSparkline(ctx, data, w, h) {
        const step = w / (data.length - 1);
        const max = Math.max(...data);
        const min = Math.min(...data);
        const range = max - min || 1;
        const pad = 2;

        // Gradient fill
        const gradient = ctx.createLinearGradient(0, 0, 0, h);
        gradient.addColorStop(0, 'rgba(0, 212, 170, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 212, 170, 0)');

        // Fill
        ctx.beginPath();
        ctx.moveTo(0, h);
        data.forEach((val, i) => {
            const x = i * step;
            const y = h - pad - ((val - min) / range) * (h - pad * 2);
            ctx.lineTo(x, y);
        });
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        // Line
        ctx.beginPath();
        data.forEach((val, i) => {
            const x = i * step;
            const y = h - pad - ((val - min) / range) * (h - pad * 2);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = '#00d4aa';
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }

    // Heartbeat animation for contact page
    function drawHeartbeat() {
        const container = document.getElementById('heartbeat-line');
        if (!container || container.querySelector('canvas')) return;

        const canvas = document.createElement('canvas');
        const width = container.offsetWidth || 300;
        const height = 40;
        canvas.width = width * 2;
        canvas.height = height * 2;
        canvas.style.width = '100%';
        canvas.style.height = height + 'px';
        container.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        ctx.scale(2, 2);

        let offset = 0;

        function animate() {
            ctx.clearRect(0, 0, width, height);
            ctx.beginPath();

            const mid = height / 2;
            const segWidth = 40;

            for (let x = 0; x < width; x++) {
                const pos = (x + offset) % segWidth;
                let y = mid;

                if (pos > segWidth * 0.4 && pos < segWidth * 0.45) {
                    y = mid - 12;
                } else if (pos > segWidth * 0.45 && pos < segWidth * 0.5) {
                    y = mid + 16;
                } else if (pos > segWidth * 0.5 && pos < segWidth * 0.55) {
                    y = mid - 8;
                } else if (pos > segWidth * 0.55 && pos < segWidth * 0.6) {
                    y = mid;
                }

                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }

            ctx.strokeStyle = '#00d4aa';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            offset += 0.5;
            requestAnimationFrame(animate);
        }

        animate();
    }

    function init() {
        // Draw after a short delay to ensure layout is ready
        setTimeout(() => {
            drawSparklines();
            drawHeartbeat();
        }, 100);

        window.addEventListener('pageChanged', () => {
            setTimeout(() => {
                drawSparklines();
                drawHeartbeat();
            }, 100);
        });

        // Redraw on resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Clear existing canvases
                document.querySelectorAll('.stat-sparkline canvas, #heartbeat-line canvas').forEach(c => c.remove());
                drawSparklines();
                drawHeartbeat();
            }, 250);
        });
    }

    return { init };
})();
