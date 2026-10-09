import { parseOptions, validationMessage, randomIndex, landingRotation } from './wheel.mjs';
const input = document.querySelector('#options');
const wheel = document.querySelector('#wheel');
const start = document.querySelector('#start');
const center = document.querySelector('#center');
const result = document.querySelector('#result');
const error = document.querySelector('#error');
const colors = ['#e3d5c6','#e7e9e3','#cfd9df','#eee4d7','#d9d0c8','#dbe1d3'];
let options = [], busy = false, rotation = 0;
const svgNS = 'http://www.w3.org/2000/svg';
function svgElement(tag, attributes, text) {
  const node = document.createElementNS(svgNS, tag);
  for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
  if (text !== undefined) node.textContent = text;
  return node;
}
function update() {
  if (busy) return;
  options = parseOptions(input.value);
  const message = validationMessage(options);
  error.textContent = message;
  input.setAttribute('aria-invalid', String(Boolean(message)));
  start.disabled = center.disabled = Boolean(message);
  document.querySelector('#count').textContent = `${options.length} / 50`;
  result.textContent = '等待开始';
  rotation = 0;
  wheel.style.transform = 'rotate(0deg)';
  wheel.replaceChildren();
  if (message) {
    wheel.append(svgElement('circle', {cx:200,cy:200,r:194,fill:'#e7e9e3'}));
    return;
  }
  const step = 360 / options.length;
  const point = angle => [200 + 194 * Math.sin(angle * Math.PI / 180), 200 - 194 * Math.cos(angle * Math.PI / 180)];
  options.forEach((option, index) => {
    const [x1,y1] = point(index * step), [x2,y2] = point((index+1)*step);
    const path = svgElement('path', {d:`M200 200 L${x1} ${y1} A194 194 0 ${step>180?1:0} 1 ${x2} ${y2} Z`,fill:colors[index%colors.length],stroke:'#f6f4ef','stroke-width':1});
    path.append(svgElement('title', {}, `${index+1}. ${option}`));
    wheel.append(path);
    const label = Array.from(option);
    const maxLength = options.length > 20 ? 7 : 10;
    const short = label.length > maxLength ? label.slice(0,maxLength-1).join('')+'…' : option;
    wheel.append(svgElement('text', {x:262,y:200,transform:`rotate(${(index+.5)*step-90} 200 200)`,'text-anchor':'start','dominant-baseline':'middle',fill:'#233449','font-size':options.length>30?8:options.length>15?10:12},short));
  });
}
async function spin() {
  if (busy || validationMessage(options)) return;
  let index;
  try { index = randomIndex(options.length); }
  catch { error.textContent = '无法使用安全随机数，请换用现代浏览器后重试。'; return; }
  busy = true;
  input.disabled = start.disabled = center.disabled = true;
  result.textContent = '抽签中…';
  const target = landingRotation(rotation, index, options.length);
  const duration = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 4200;
  try {
    if (duration) {
      const animation = wheel.animate([{transform:`rotate(${rotation}deg)`},{transform:`rotate(${target}deg)`}],{duration,easing:'cubic-bezier(.12,.7,.12,1)',fill:'forwards'});
      await animation.finished;
      wheel.style.transform = `rotate(${target % 360}deg)`;
      animation.cancel();
    } else wheel.style.transform = `rotate(${target % 360}deg)`;
    rotation = target % 360;
    result.textContent = options[index];
  } catch {
    result.textContent = '抽签中断，请重新开始。';
  } finally {
    busy = false;
    input.disabled = start.disabled = center.disabled = false;
  }
}
input.addEventListener('input', update);
start.addEventListener('click', spin);
center.addEventListener('click', spin);
update();
