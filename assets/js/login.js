/* 云酿智链 AI OS —— 登录页逻辑 */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const sleep = ms => new Promise(r => setTimeout(r, ms));

// 密码显示切换
$('#pwdToggle')?.addEventListener('click', () => {
  const pwd = $('#password');
  pwd.type = pwd.type === 'password' ? 'text' : 'password';
  $('#pwdToggle').textContent = pwd.type === 'password' ? '👁' : '🙈';
});

// 登录表单提交
$('#loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = $('#btnLogin');
  const btnText = btn.querySelector('.btn-text');
  const btnLoader = btn.querySelector('.btn-loader');

  // 简单校验
  const account = $('#account').value.trim();
  const password = $('#password').value.trim();
  if (!account || !password) {
    shakeElement(btn);
    return;
  }

  // 按钮加载状态
  btn.disabled = true;
  btnText.style.display = 'none';
  btnLoader.style.display = 'inline-block';

  // 保存登录状态
  if ($('#remember').checked) {
    localStorage.setItem('yn_logged_in', '1');
    localStorage.setItem('yn_account', account);
  }

  // 显示过渡动画
  await sleep(600);
  showTransition();

  // 模拟加载进度
  const fill = $('#transFill');
  for (let i = 0; i <= 100; i += 2) {
    fill.style.width = i + '%';
    await sleep(20 + Math.random() * 15);
  }

  await sleep(300);
  // 跳转到主控台
  window.location.href = 'dashboard.html';
});

// 显示过渡层
function showTransition() {
  const t = $('#loginTransition');
  t.classList.add('show');
}

// 抖动效果
function shakeElement(el) {
  el.style.animation = 'none';
  el.offsetHeight; // trigger reflow
  el.style.animation = 'shake .4s ease';
}

// 添加抖动动画
const style = document.createElement('style');
style.textContent = `@keyframes shake{
  0%,100%{transform:translateX(0)}
  20%{transform:translateX(-8px)}
  40%{transform:translateX(8px)}
  60%{transform:translateX(-6px)}
  80%{transform:translateX(6px)}
}`;
document.head.appendChild(style);

// 自动检测登录状态
(function autoLoginCheck() {
  const logged = localStorage.getItem('yn_logged_in');
  if (logged === '1') {
    // 已登录直接跳转
    window.location.replace('dashboard.html');
  }
})();
