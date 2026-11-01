/* Decorative RF wavefronts with a pointer-controlled reflecting surface. */
(() => {
  'use strict';
  document.querySelectorAll('[data-rf-waves]').forEach(canvas => {
    const host = canvas.closest('.rf-hero');
    const ctx = canvas.getContext('2d');
    if (!host || !ctx || canvas.dataset.waveReady) return;
    canvas.dataset.waveReady = 'true';
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const speed = 112, spacing = 138, obstacleRadius = 19;
    let width = 0, height = 0, limit = 0, source = {x: 0, y: 0};
    let waves = [], echoes = [], nextWave = 0, time = 0, previous = 0, frame = 0, visible = true, reflectionCount = 0;
    let pointer = {x: 0, y: 0, active: false, expires: Infinity};

    const resize = () => {
      width = host.clientWidth;
      height = host.clientHeight;
      const ratio = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      source = {x: Math.max(30, Math.min(110, width * .09)), y: height * .58};
      limit = Math.hypot(width, height) + 60;
      waves = [];
      for (let radius = 0; radius < limit; radius += spacing) waves.push({radius, reflected: false});
      echoes = [];
      nextWave = spacing / speed;
      draw();
    };
    const strokeArc = (x, y, radius, start, end, color, opacity, thickness = 1.3) => {
      if (radius <= 0 || opacity <= 0) return;
      ctx.beginPath();
      ctx.arc(x, y, radius, start, end);
      ctx.strokeStyle = `rgba(${color},${opacity})`;
      ctx.lineWidth = thickness;
      ctx.stroke();
    };
    function draw() {
      ctx.clearRect(0, 0, width, height);
      for (const wave of waves) {
        const opacity = .31 * Math.max(.1, 1 - wave.radius / limit);
        strokeArc(source.x, source.y, wave.radius, 0, Math.PI * 2, '0,107,91', opacity);
      }
      for (const echo of echoes) {
        const opacity = .55 * Math.max(0, 1 - echo.radius / 650);
        strokeArc(echo.x, echo.y, echo.radius, echo.angle - 1.1, echo.angle + 1.1, '30,111,139', opacity, 1.8);
      }
      // A small transmitter symbol marks the origin of the circular fronts.
      ctx.strokeStyle = 'rgba(0,107,91,.62)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();ctx.moveTo(source.x, source.y - 6);ctx.lineTo(source.x, source.y + 13);
      ctx.moveTo(source.x - 5, source.y + 13);ctx.lineTo(source.x + 5, source.y + 13);ctx.stroke();
      ctx.fillStyle = 'rgba(0,107,91,.8)';ctx.beginPath();ctx.arc(source.x, source.y - 6, 2.7, 0, Math.PI * 2);ctx.fill();
      ctx.font = '9px Inter,Arial,sans-serif';ctx.fillText('TX', source.x - 6, source.y + 26);
      if (pointer.active) {
        ctx.fillStyle = 'rgba(234,244,238,.87)';ctx.beginPath();ctx.arc(pointer.x, pointer.y, obstacleRadius, 0, Math.PI * 2);ctx.fill();
        strokeArc(pointer.x, pointer.y, obstacleRadius, 0, Math.PI * 2, '0,93,78', .52, 1.4);
        ctx.fillStyle = 'rgba(0,107,91,.65)';ctx.beginPath();ctx.arc(pointer.x, pointer.y, 2.6, 0, Math.PI * 2);ctx.fill();
      }
    }
    const tick = now => {
      frame = 0;
      const dt = previous ? Math.min((now - previous) / 1000, .05) : 0;
      previous = now;time += dt;nextWave -= dt;
      if (pointer.expires < time) pointer.active = false;
      if (nextWave <= 0) {waves.unshift({radius: 0, reflected: false});nextWave += spacing / speed;}
      for (const wave of waves) {
        const prior = wave.radius;
        wave.radius += speed * dt;
        if (pointer.active && !wave.reflected) {
          const dx = pointer.x - source.x, dy = pointer.y - source.y, distance = Math.hypot(dx, dy);
          const contact = distance - obstacleRadius;
          if (distance > obstacleRadius * 2 && prior <= distance + obstacleRadius && wave.radius >= contact) {
            const nx = dx / distance, ny = dy / distance;
            echoes.push({x: pointer.x - nx * obstacleRadius, y: pointer.y - ny * obstacleRadius, radius: Math.max(1, wave.radius - contact), angle: Math.atan2(-ny, -nx)});
            wave.reflected = true;
            canvas.dataset.reflectionCount = String(++reflectionCount);
          }
        }
      }
      waves = waves.filter(wave => wave.radius < limit);
      echoes.forEach(echo => {echo.radius += speed * dt;});
      echoes = echoes.filter(echo => echo.radius < 650);
      draw();
      if (visible && !document.hidden && !reduced.matches) frame = requestAnimationFrame(tick);
    };
    const syncAnimation = () => {
      cancelAnimationFrame(frame);frame = 0;previous = 0;
      if (visible && !document.hidden && !reduced.matches) frame = requestAnimationFrame(tick);
      else draw();
    };
    const position = event => {
      const rect = host.getBoundingClientRect();
      pointer = {x: event.clientX - rect.left, y: event.clientY - rect.top, active: true, expires: event.pointerType === 'touch' ? time + 4.5 : Infinity};
      if (reduced.matches) draw();
    };
    host.addEventListener('pointermove', position, {passive: true});
    host.addEventListener('pointerdown', position, {passive: true});
    host.addEventListener('pointerleave', event => {if (event.pointerType !== 'touch') pointer.active = false;if (reduced.matches) draw();});
    host.addEventListener('pointercancel', () => {pointer.expires = time + 2.5;});
    new ResizeObserver(resize).observe(host);
    new IntersectionObserver(entries => {visible = entries[0].isIntersecting;syncAnimation();}, {rootMargin: '60px'}).observe(host);
    document.addEventListener('visibilitychange', syncAnimation);
    reduced.addEventListener('change', syncAnimation);
    resize();syncAnimation();
  });
})();
