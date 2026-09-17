import { spawn } from 'child_process';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--user-data-dir=e:\\PraveenBro\\scratch\\chrome-video-test',
  'http://localhost:5173/'
]);

await new Promise(r => setTimeout(r, 1800));

const res = await fetch('http://localhost:9222/json');
const data = await res.json();
const target = data.find(t => t.type === 'page');
const ws = new WebSocket(target.webSocketDebuggerUrl);

await new Promise(r => ws.onopen = r);

ws.send(JSON.stringify({
  id: 1,
  method: 'Runtime.evaluate',
  params: {
    expression: `
      new Promise((resolve) => {
        const v = document.createElement('video');
        v.src = '/feedback_vedios/DdHCh0bh9Uv.mp4';
        v.muted = true;
        let frames = 0;
        v.onloadedmetadata = () => {
          v.play().catch(e => resolve({ error: e.message }));
          const start = performance.now();
          v.ontimeupdate = () => {
            frames++;
            if (performance.now() - start > 2000) {
              resolve({
                duration: v.duration,
                width: v.videoWidth,
                height: v.videoHeight,
                frames,
                currentTime: v.currentTime
              });
            }
          };
        };
        v.onerror = () => resolve({ error: 'failed to load' });
        setTimeout(() => resolve({ timeout: true, readyState: v.readyState }), 6000);
      })
    `,
    returnByValue: true,
    awaitPromise: true
  }
}));

ws.onmessage = (msg) => {
  const parsed = JSON.parse(msg.data);
  console.log('Video Probe Result:', parsed.result?.result?.value);
  chrome.kill();
  process.exit(0);
};
