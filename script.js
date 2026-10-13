const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#site-nav');

menuButton.addEventListener('click', () => {
  const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isExpanded));
  menuButton.setAttribute('aria-label', isExpanded ? '打开导航菜单' : '关闭导航菜单');
  navigation.classList.toggle('is-open', !isExpanded);
});

navigation.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', '打开导航菜单');
    navigation.classList.remove('is-open');
  });
});

const phaseTabs = [...document.querySelectorAll('.phase-tab')];
const phases = [
  {
    label: 'PHASE 01 / PREP', index: '01 / 04', title: '把需求变成清单',
    description: '先确认活动目标和场地条件，把分散的需求整理成负责人、时间点和交付标准。',
    tasks: ['对接场地与设备清单', '确认网站、报名与宣传节点', '分工并建立现场联络方式'], progress: 25,
  },
  {
    label: 'PHASE 02 / REHEARSE', index: '02 / 04', title: '让每个节点可执行',
    description: '在彩排中核对伴奏、灯光、投屏和节目顺序，提前发现问题，为现场留出调整空间。',
    tasks: ['测试音频、灯光与投影', '同步主持人与节目流程', '记录问题并明确现场负责人'], progress: 52,
  },
  {
    label: 'PHASE 03 / LIVE', index: '03 / 04', title: '快速响应现场变化',
    description: '活动开始后保持沟通顺畅，关注设备状态和流程节奏，在出现问题时及时补位。',
    tasks: ['持续关注音响与舞台设备', '跟随节目单调整技术节点', '与各部门同步现场状态'], progress: 78,
  },
  {
    label: 'PHASE 04 / REVIEW', index: '04 / 04', title: '把经验留给下一次',
    description: '活动结束后整理设备、素材和问题记录，把解决方案沉淀成团队可复用的流程。',
    tasks: ['归还并盘点设备物料', '整理活动照片与网页内容', '复盘问题并更新工作清单'], progress: 100,
  },
];

function activatePhase(index) {
  const phase = phases[index];
  const selectedTab = phaseTabs[index];
  if (!phase || !selectedTab) return;

  phaseTabs.forEach((tab, tabIndex) => {
    const active = tabIndex === index;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  document.querySelector('#phase-panel').setAttribute('aria-labelledby', selectedTab.id);
  document.querySelector('#phase-status').textContent = phase.label;
  document.querySelector('#phase-index').textContent = phase.index;
  document.querySelector('#phase-title').textContent = phase.title;
  document.querySelector('#phase-description').textContent = phase.description;
  document.querySelector('#phase-percent').textContent = `${phase.progress}%`;
  document.querySelector('#phase-progress-bar').style.setProperty('--progress', `${phase.progress}%`);
  document.querySelector('#phase-tasks').replaceChildren(...phase.tasks.map((task) => {
    const item = document.createElement('li');
    item.textContent = task;
    return item;
  }));
}

phaseTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activatePhase(index));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let nextIndex = index;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + phaseTabs.length) % phaseTabs.length;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % phaseTabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = phaseTabs.length - 1;
    activatePhase(nextIndex);
    phaseTabs[nextIndex].focus();
  });
});

const copyEmailButton = document.querySelector('#copy-email');
const copyStatus = document.querySelector('#copy-status');

copyEmailButton.addEventListener('click', async () => {
  const email = copyEmailButton.dataset.email;
  try {
    await navigator.clipboard.writeText(email);
  } catch {
    const temporaryInput = document.createElement('textarea');
    temporaryInput.value = email;
    temporaryInput.setAttribute('readonly', '');
    temporaryInput.style.position = 'fixed';
    temporaryInput.style.opacity = '0';
    document.body.append(temporaryInput);
    temporaryInput.select();
    document.execCommand('copy');
    temporaryInput.remove();
  }
  copyStatus.textContent = '邮箱已复制';
});
