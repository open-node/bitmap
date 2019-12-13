const x = 0;
const y = 0;
const f = 1;

const n = f % 600;
const r = (((n + x) / 60) | 0) % 2;
const c = (((n + y) / 60) | 0) % 2;

if (c && !r) return 0;
if (r && !c) return 0;

return 255;
