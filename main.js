document.addEventListener('DOMContentLoaded', () => {
  initActiveNavigation()
  initThemeToggle()
  initMobileMenu()
  initTeamMembers()
  initRevealMotion()
  initFilters()
  initSearch()
  initCodeTabs()
  initCopyButtons()
  initChecklistProgress()
  initQuizCategories()
  initQuiz()
  initXSSLab()
  initSQLiLab()
  initBackToTop()
})

function initActiveNavigation() {
  const current = window.location.pathname.split('/').pop() || 'index.html'
  document.querySelectorAll('[data-nav-link]').forEach((link) => {
    const target = link.getAttribute('href')
    if (target === current || (current === '' && target === 'index.html')) {
      link.classList.add('active')
      link.setAttribute('aria-current', 'page')
    }
  })
}

function initThemeToggle() {
  const button = document.querySelector('[data-theme-toggle]')
  if (!button) return

  const savedTheme = localStorage.getItem('web-pedia-theme')
  const prefersLight = window.matchMedia(
    '(prefers-color-scheme: light)',
  ).matches
  document.body.classList.toggle(
    'light-theme',
    savedTheme ? savedTheme === 'light' : prefersLight,
  )
  updateThemeButton(button)

  button.addEventListener('click', () => {
    document.body.classList.toggle('light-theme')
    localStorage.setItem(
      'web-pedia-theme',
      document.body.classList.contains('light-theme') ? 'light' : 'dark',
    )
    updateThemeButton(button)
  })
}

function updateThemeButton(button) {
  const light = document.body.classList.contains('light-theme')
  button.textContent = light ? '\uB2E4\uD06C' : '\uB77C\uC774\uD2B8'
  button.setAttribute(
    'aria-label',
    light
      ? '\uB2E4\uD06C \uD14C\uB9C8\uB85C \uBCC0\uACBD'
      : '\uB77C\uC774\uD2B8 \uD14C\uB9C8\uB85C \uBCC0\uACBD',
  )
}

function initMobileMenu() {
  const button = document.querySelector('[data-menu-toggle]')
  const menu = document.querySelector('[data-nav-menu]')
  if (!button || !menu) return

  const closeMenu = () => {
    menu.classList.remove('open')
    document.body.classList.remove('menu-open')
    button.setAttribute('aria-expanded', 'false')
    button.setAttribute('aria-label', '메뉴 열기')
    button.classList.remove('menu-open')
  }

  button.addEventListener('click', () => {
    const open = menu.classList.toggle('open')
    document.body.classList.toggle('menu-open', open)
    button.setAttribute('aria-expanded', String(open))
    button.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기')
    button.classList.toggle('menu-open', open)
  })

  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      closeMenu()
    }
  })

  // ESC 키 이벤트 감지 및 모바일 메뉴 닫기 (a11y 접근성 개선)
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.classList.contains('open')) {
      closeMenu()
      button.focus() // 햄버거 버튼으로 포커스 복구
    }
  })
}

function initRevealMotion() {
  const revealItems = document.querySelectorAll('.reveal')
  if (!revealItems.length) return

  if (!('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('visible'))
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -28px 0px',
    },
  )

  revealItems.forEach((item) => observer.observe(item))
}

function initFilters() {
  document.querySelectorAll('[data-filter-group]').forEach((group) => {
    const buttons = group.querySelectorAll('[data-filter]')
    const cards = document.querySelectorAll(
      `[data-filter-card="${group.dataset.filterGroup}"]`,
    )

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter
        buttons.forEach((item) =>
          item.classList.toggle('active', item === button),
        )
        cards.forEach((card) => {
          const categories = (card.dataset.category || '').split(' ')
          card.classList.toggle(
            'hidden',
            !(filter === 'all' || categories.includes(filter)),
          )
        })
      })
    })
  })
}

function initSearch() {
  document.querySelectorAll('[data-search]').forEach((input) => {
    const targetName = input.dataset.search
    const items = document.querySelectorAll(
      `[data-search-item="${targetName}"]`,
    )

    input.addEventListener('input', () => {
      const query = input.value.trim().toLowerCase()
      items.forEach((item) => {
        item.classList.toggle(
          'hidden',
          !item.textContent.toLowerCase().includes(query),
        )
      })
    })
  })
}

function initCodeTabs() {
  document.querySelectorAll('[data-code-tabs]').forEach((wrapper) => {
    const tabs = wrapper.querySelectorAll('[data-code-tab]')
    const panels = wrapper.querySelectorAll('[data-code-panel]')

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.codeTab
        tabs.forEach((item) => item.classList.toggle('active', item === tab))
        panels.forEach((panel) =>
          panel.classList.toggle('active', panel.dataset.codePanel === target),
        )
      })
    })
  })
}

function initCopyButtons() {
  document.querySelectorAll('[data-copy-target]').forEach((button) => {
    button.addEventListener('click', async () => {
      const target = document.querySelector(button.dataset.copyTarget)
      if (!target) return

      const original = button.textContent
      try {
        await navigator.clipboard.writeText(target.textContent.trim())
        button.textContent = '\uC644\uB8CC'
      } catch {
        button.textContent = '\uC2E4\uD328'
      }

      window.setTimeout(() => {
        button.textContent = original
      }, 1400)
    })
  })
}

function initChecklistProgress() {
  document.querySelectorAll('[data-checklist]').forEach((checklist) => {
    const boxes = checklist.querySelectorAll("input[type='checkbox']")
    const bar = document.querySelector(
      `[data-progress-bar="${checklist.dataset.checklist}"]`,
    )
    const label = document.querySelector(
      `[data-progress-label="${checklist.dataset.checklist}"]`,
    )
    if (!bar || !label || !boxes.length) return

    const update = () => {
      const checked = [...boxes].filter((box) => box.checked).length
      const percent = Math.round((checked / boxes.length) * 100)
      bar.style.width = `${percent}%`
      label.textContent = `${checked}/${boxes.length} \uC644\uB8CC`
    }

    boxes.forEach((box) => box.addEventListener('change', update))
    update()
  })
}

function initQuizCategories() {
  const nav = document.querySelector('[data-quiz-category-nav]')
  if (!nav) return

  const buttons = nav.querySelectorAll('[data-category]')
  const panels = document.querySelectorAll('[data-panel]')

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.category

      // 버튼 active 상태 전환
      buttons.forEach((b) => b.classList.toggle('active', b === btn))

      // 패널 표시/숨김 전환
      panels.forEach((panel) => {
        const isTarget = panel.dataset.panel === target
        panel.hidden = !isTarget
      })

      // 결과 영역 초기화
      const result = document.querySelector('[data-quiz-result]')
      if (result) {
        result.hidden = true
        result.innerHTML = ''
      }

      // 이전 채점 상태 초기화
      document.querySelectorAll('.quiz-question').forEach((q) => {
        q.classList.remove('correct', 'wrong')
        q.querySelector('.quiz-badge')?.remove()
        q.querySelector('.quiz-explanation')?.remove()
        q.querySelectorAll('.quiz-options label').forEach((l) =>
          l.classList.remove('is-correct'),
        )
      })
    })
  })
}

function initQuiz() {
  const form = document.querySelector('[data-quiz-form]')
  const result = document.querySelector('[data-quiz-result]')
  if (!form || !result) return

  form.addEventListener('submit', (event) => {
    event.preventDefault()

    // 현재 보이는 패널의 문제만 채점
    const activePanel = form.querySelector('[data-panel]:not([hidden])')
    const questions = activePanel
      ? activePanel.querySelectorAll('[data-answer]')
      : form.querySelectorAll('[data-answer]')
    let score = 0
    let unanswered = 0

    questions.forEach((question) => {
      const name = question.dataset.answer
      const correct = question.dataset.correct
      const explanation = question.dataset.explanation || ''
      const selected = form.querySelector(`input[name="${name}"]:checked`)

      if (!selected) {
        unanswered++
        return
      }

      const isCorrect = selected.value === correct

      question.classList.remove('correct', 'wrong')
      question.classList.toggle('correct', isCorrect)
      question.classList.toggle('wrong', !isCorrect)

      if (isCorrect) score++

      // \uC774\uC804 \uBC43\uC9C0\u00B7\uD574\uC124 \uC81C\uAC70
      question.querySelector('.quiz-badge')?.remove()
      question.querySelector('.quiz-explanation')?.remove()

      // \uC815\uB2F5/\uC624\uB2F5 \uBC43\uC9C0 \uC0BD\uC785
      const badge = document.createElement('div')
      badge.className = `quiz-badge ${isCorrect ? 'correct' : 'wrong'}`
      badge.textContent = isCorrect
        ? '\u2705 \uC815\uB2F5'
        : '\u274C \uC624\uB2F5'
      question.insertBefore(badge, question.firstChild)

      // \uC815\uB2F5 \uC120\uD0DD\uC9C0 \uCD08\uB85D\uC0C9 \uAC15\uC870
      question.querySelectorAll('.quiz-options label').forEach((label) => {
        const input = label.querySelector('input')
        if (input) label.classList.toggle('is-correct', input.value === correct)
      })

      // \uD574\uC124 \uD45C\uC2DC
      if (explanation) {
        const expl = document.createElement('div')
        expl.className = 'quiz-explanation'
        expl.innerHTML = `<strong>\uD83D\uDCA1 \uD574\uC124:</strong> ${explanation}`
        question.appendChild(expl)
      }
    })

    const answered = questions.length - unanswered
    const total = questions.length
    const percent = answered ? Math.round((score / answered) * 100) : 0

    let message = ''
    if (unanswered > 0) {
      message = `\u26A0\uFE0F ${unanswered}\uBB38\uC81C\uAC00 \uBBF8\uC120\uD0DD \uC0C1\uD0DC\uC785\uB2C8\uB2E4. \uBAA8\uB4E0 \uBB38\uC81C\uB97C \uD480\uACE0 \uB2E4\uC2DC \uCC44\uC810\uD574\uC8FC\uC138\uC694.`
    } else if (score === total) {
      message = `\uD83C\uDF89 \uC644\uBCBD! ${total}\uBB38\uC81C \uBAA8\uB450 \uC815\uB2F5\uC785\uB2C8\uB2E4! (100%)`
    } else {
      message = `${total}\uBB38\uC81C \uC911 <strong>${score}\uBB38\uC81C \uC815\uB2F5 (${percent}%)</strong> \u2014 \uBE68\uAC04 \uCE74\uB4DC\uC758 \uD574\uC124\uC744 \uD655\uC778\uD574\uBCF4\uC138\uC694.`
    }

    result.innerHTML = message
    result.hidden = false
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  })
}

function initBackToTop() {
  const button = document.querySelector('[data-back-to-top]')
  if (!button) return

  window.addEventListener('scroll', () => {
    button.classList.toggle('visible', window.scrollY > 640)
  })

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })
}

function initTeamMembers() {
  const container = document.getElementById('team-members-container')
  if (!container) return

  const teamMembers = [
    {
      name: '함유진',
      role: '팀장',
      avatar: '함',
      links: {
        github: 'https://github.com/chael2',
        blog: 'https://chael2.tistory.com/',
        portfolio: 'https://chael2-fin-portfolio.vercel.app/',
      },
    },
    {
      name: '남유진',
      role: '팀원',
      avatar: '남',
      links: {
        github: 'https://github.com/yoojin33',
        blog: 'https://blog.naver.com/quarter0330',
        portfolio: 'https://nyj-final.vercel.app/',
      },
    },
    {
      name: '조윤서',
      role: '팀원',
      avatar: '조',
      links: {
        github: 'https://github.com/avac2613',
        blog: 'https://blog.naver.com/avac-ode2613',
        portfolio: 'https://finals-own.vercel.app/',
      },
    },
    {
      name: '홍영우',
      role: '팀원',
      avatar: '홍',
      links: {
        github: 'https://github.com/hongwoo0516-commits',
        blog: 'https://blog.naver.com/youngwoo0405',
        portfolio: 'https://files-nine-weld.vercel.app',
      },
    },
  ]

  container.innerHTML = ''

  teamMembers.forEach((member) => {
    const card = document.createElement('article')
    card.className = 'card member-card reveal'

    card.innerHTML = `
      <div class="member-top">
        <div class="avatar">${member.avatar}</div>
        <div>
          <h3>${member.name}</h3>
          <p>${member.role}</p>
        </div>
      </div>
      <div class="link-row">
        <a class="small-link" href="${member.links.github}" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a class="small-link" href="${member.links.blog}" target="_blank" rel="noopener noreferrer">블로그</a>
        <a class="small-link" href="${member.links.portfolio}" target="_blank" rel="noopener noreferrer">포트폴리오</a>
      </div>
    `
    container.appendChild(card)
  })
}

function initXSSLab() {
  const container = document.getElementById('xss-simulator-section')
  if (!container) return

  const textarea = document.getElementById('xss-input')
  const outputBox = document.getElementById('xss-output-box')
  const btnUnsafe = document.getElementById('btn-unsafe')
  const btnSafe = document.getElementById('btn-safe')
  const consoleLog = document.getElementById('xss-console')
  const logText = document.getElementById('xss-log-text')
  const modal = document.getElementById('hacker-alert')
  const btnCloseModal = document.getElementById('btn-close-hacker')
  const templates = document.querySelectorAll('[data-template]')

  const xssPayloads = {
    alert: `<script>alert('XSS 해킹!')<\/script>`,
    img: `<img src="invalid-path" onerror="alert('이미지 우회 XSS 성공!')">`,
    cookie: `<script>
const stolen = document.cookie || 'session_id=WP_92410988_ADMIN';
alert('stolen cookie: ' + stolen);
<\/script>`,
  }

  // 템플릿 바인딩
  templates.forEach((btn) => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.template
      if (xssPayloads[type]) {
        textarea.value = xssPayloads[type]
        textarea.focus()
      }
    })
  })

  // 안전 모드 (textContent 사용)
  btnSafe.addEventListener('click', () => {
    const rawValue = textarea.value.trim()
    if (!rawValue) {
      alert('코드를 입력하세요!')
      return
    }

    // textContent는 태그를 일반 문자열로 변환하여 삽입
    outputBox.textContent = rawValue

    // 콘솔 안전 갱신
    consoleLog.className = 'sim-console success'
    logText.textContent =
      '안전 (textContent 적용): 스크립트가 무해한 텍스트 기호로 자동 치환되었습니다. 실행 방지 성공!'
  })

  // 취약 모드 (innerHTML 사용)
  btnUnsafe.addEventListener('click', () => {
    const rawValue = textarea.value.trim()
    if (!rawValue) {
      alert('코드를 입력하세요!')
      return
    }

    // innerHTML은 렌더링되면서 스크립트 실행 위험을 초래
    outputBox.innerHTML = rawValue

    // 가상 해킹 경고 모달 제어
    // script 태그 존재 여부 또는 onerror가 포함되어 있으면 XSS 성공으로 취급
    const hasScript = /<script\b[^>]*>([\s\S]*?)<\/script>/gi.test(rawValue)
    const hasOnerror = /onerror\s*=/gi.test(rawValue)

    if (hasScript || hasOnerror) {
      // 렌더링 후 약간의 딜레이 뒤 모달 발생 (극적 효과)
      setTimeout(() => {
        modal.hidden = false
        consoleLog.className = 'sim-console alert'
        logText.textContent =
          '😈 [위험] 취약점 공격 성공! 브라우저가 스크립트를 실제 실행하여 쿠키가 강제 탈취되었습니다!'
      }, 350)
    } else {
      consoleLog.className = 'sim-console'
      logText.textContent =
        '동작 실행됨: 단순 마크업이 삽입되었습니다. (스크립트 미감지)'
    }
  })

  // 모달 닫기
  btnCloseModal.addEventListener('click', () => {
    modal.hidden = true
    outputBox.innerHTML =
      '<span style="color: var(--muted-2);">[출력 영역이 안전하게 복원되었습니다. 다시 테스트해보세요]</span>'
    consoleLog.className = 'sim-console'
    logText.textContent = '콘솔: 대기 중...'
  })
}

function initSQLiLab() {
  const container = document.getElementById('sqli-simulator-section')
  if (!container) return

  const inputId = document.getElementById('sqli-id')
  const outputBox = document.getElementById('sqli-output-box')
  const btnUnsafe = document.getElementById('btn-sqli-unsafe')
  const btnSafe = document.getElementById('btn-sqli-safe')
  const consoleLog = document.getElementById('sqli-console')
  const logText = document.getElementById('sqli-log-text')
  const modal = document.getElementById('sqli-hacker-alert')
  const btnCloseModal = document.getElementById('btn-close-sqli')
  const templates = document.querySelectorAll('[data-sqli-template]')

  const sqliPayloads = {
    bypass: `admin' --`,
    always: `' OR '1'='1`,
  }

  // 템플릿 바인딩
  templates.forEach((btn) => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.sqliTemplate
      if (sqliPayloads[type]) {
        inputId.value = sqliPayloads[type]
        inputId.focus()
      }
    })
  })

  // 안전 모드 (Prepared Statement 사용)
  btnSafe.addEventListener('click', () => {
    const rawVal = inputId.value.trim()
    if (!rawVal) {
      alert('아이디를 입력하세요!')
      return
    }

    // Prepared Statement 쿼리 가시화 (파라미터 분리)
    outputBox.innerHTML = `
<span class="token-warn">// 1. 쿼리 템플릿 프리컴파일 (Pre-compiled)</span><br>
<span class="token-tag">SQL = "SELECT * FROM users WHERE id = <strong style="color: var(--cyan); font-size: 1.08rem;">?</strong> AND pw = <strong style="color: var(--cyan); font-size: 1.08rem;">?</strong>";</span><br><br>
<span class="token-warn">// 2. 파라미터 안전 대입 (SQL과 입력 데이터의 문맥적 격리)</span><br>
<span class="token-attr">Parameters = ["${escapeHtml(rawVal)}", "••••••••"];</span>
    `

    consoleLog.className = 'sim-console success'
    logText.textContent =
      '🛡️ 안전 (Prepared Statement): 사용자 입력이 쿼리 구조를 바꾸지 못하고 단순 텍스트 인자로만 바인딩되었습니다. 공격 무력화 완료!'
  })

  // 취약 모드 (문자열 결합)
  btnUnsafe.addEventListener('click', () => {
    const rawVal = inputId.value.trim()
    if (!rawVal) {
      alert('아이디를 입력하세요!')
      return
    }

    // 위험한 문자열 연결 결과 가시화
    const isBypass = rawVal.includes("' --")
    const isAlways = rawVal.includes("' OR")

    let highlightedVal = escapeHtml(rawVal)
    if (isBypass) {
      highlightedVal = highlightedVal.replace(
        /'\s*--/g,
        `<strong style="color: var(--red); font-size: 1.08rem;">' --</strong>`,
      )
    } else if (isAlways) {
      highlightedVal = highlightedVal.replace(
        /'\s*OR\s*'\s*1\s*'\s*=\s*'\s*1/gi,
        `<strong style="color: var(--red); font-size: 1.08rem;">' OR '1'='1</strong>`,
      )
    }

    outputBox.innerHTML = `
<span class="token-warn">// 위험: 문자열 연결로 SQL 완성 (SQL 구조 변조 가능)</span><br>
<span class="token-tag">SQL = "SELECT * FROM users WHERE id = '${highlightedVal}' AND pw = '••••••••'";</span>
    `

    if (isBypass || isAlways) {
      setTimeout(() => {
        modal.hidden = false
        consoleLog.className = 'sim-console alert'
        logText.textContent =
          '😈 [위험] SQL Injection 인증 우회 침투 성공! 패스워드 검증 없이 admin 계정 로그인 권한을 취득했습니다.'
      }, 350)
    } else {
      consoleLog.className = 'sim-console'
      logText.textContent =
        '동작 실행됨: 데이터베이스에 일반 문자열 쿼리를 조회했습니다. (로그인 실패)'
    }
  })

  // 모달 닫기
  btnCloseModal.addEventListener('click', () => {
    modal.hidden = true
    outputBox.innerHTML =
      '<span style="color: var(--muted-2);">[출력 영역이 안전하게 복원되었습니다. 다시 로그인 테스트를 해보세요]</span>'
    consoleLog.className = 'sim-console'
    logText.textContent = '가상 DB 엔진 로그: 대기 중...'
  })
}

// 특수문자 HTML 엔티티 치환 헬퍼 함수
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

//퀴즈 js 추가 내용

// ============================================================
// [REPLACED] 기존 initQuiz() — 일괄 채점 방식
// 아래 새 버전으로 교체됨 (오답 진동, 정답 해설, 문제별 즉시 피드백)
// ============================================================

function initQuiz() {
  const form = document.querySelector('[data-quiz-form]')
  const result = document.querySelector('[data-quiz-result]')
  if (!form || !result) return

  form.addEventListener('submit', (event) => {
    event.preventDefault()

    const activePanel = form.querySelector('[data-panel]:not([hidden])')
    const questions = activePanel
      ? activePanel.querySelectorAll('[data-answer]')
      : form.querySelectorAll('[data-answer]')
    let score = 0
    let unanswered = 0

    questions.forEach((question) => {
      const name = question.dataset.answer
      const correct = question.dataset.correct
      const explanation = question.dataset.explanation || ''
      const selected = form.querySelector(`input[name="${name}"]:checked`)

      if (!selected) {
        unanswered++
        return
      }

      const isCorrect = selected.value === correct
      question.classList.remove('correct', 'wrong')
      question.classList.toggle('correct', isCorrect)
      question.classList.toggle('wrong', !isCorrect)
      if (isCorrect) score++

      question.querySelector('.quiz-badge')?.remove()
      question.querySelector('.quiz-explanation')?.remove()

      const badge = document.createElement('div')
      badge.className = `quiz-badge ${isCorrect ? 'correct' : 'wrong'}`
      badge.textContent = isCorrect ? '✅ 정답' : '❌ 오답'
      question.insertBefore(badge, question.firstChild)

      question.querySelectorAll('.quiz-options label').forEach((label) => {
        const input = label.querySelector('input')
        if (input) label.classList.toggle('is-correct', input.value === correct)
      })

      if (explanation) {
        const expl = document.createElement('div')
        expl.className = 'quiz-explanation'
        expl.innerHTML = `<strong>💡 해설:</strong> ${explanation}`
        question.appendChild(expl)
      }
    })

    const answered = questions.length - unanswered
    const total = questions.length
    const percent = answered ? Math.round((score / answered) * 100) : 0

    let message = ''
    if (unanswered > 0) {
      message = `⚠️ ${unanswered}문제가 미선택 상태입니다. 모든 문제를 풀고 다시 채점해주세요.`
    } else if (score === total) {
      message = `🎉  ${total}문제를 모두 맞췄습니다! (100%)`
    } else {
      message = `${total}문제 중 <strong>${score}문제 정답 (${percent}%)</strong> — 빨간 카드의 해설을 확인해보세요.`
    }

    result.innerHTML = message
    result.hidden = false
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  })
}

// ============================================================
// [NEW] initQuiz() — 문제별 즉시 피드백 방식
// 변경 내용:
//   1. 채점하기 클릭 시 각 문제마다 즉시 오답/정답 판정
//   2. 오답 문제 → shake 진동 애니메이션 + 빨간 테두리
//   3. 정답 문제 → 해설 즉시 표시
//   4. 미선택 문제 → 경고 강조 (pulse 애니메이션)
//   5. 최종 점수는 기존과 동일하게 하단 result 영역에 표시
// ============================================================
function initQuiz() {
  const form = document.querySelector('[data-quiz-form]')
  const result = document.querySelector('[data-quiz-result]')
  if (!form || !result) return

  form.addEventListener('submit', (event) => {
    event.preventDefault()

    const activePanel = form.querySelector('[data-panel]:not([hidden])')
    const questions = activePanel
      ? activePanel.querySelectorAll('[data-answer]')
      : form.querySelectorAll('[data-answer]')

    let score = 0
    let unanswered = 0

    questions.forEach((question) => {
      const name = question.dataset.answer
      const correct = question.dataset.correct
      const explanation = question.dataset.explanation || ''
      const selected = form.querySelector(`input[name="${name}"]:checked`)

      // -- 이전 피드백 초기화 --
      question.classList.remove(
        'correct',
        'wrong',
        'quiz-shake',
        'quiz-unanswered',
      )
      question.querySelector('.quiz-badge')?.remove()
      question.querySelector('.quiz-explanation')?.remove()
      question.querySelector('.quiz-next-btn')?.remove()
      question
        .querySelectorAll('.quiz-options label')
        .forEach((l) => l.classList.remove('is-correct'))

      // [NEW] 미선택 처리 — pulse 강조
      if (!selected) {
        unanswered++
        question.classList.add('quiz-unanswered')
        // 애니메이션 재트리거를 위해 requestAnimationFrame 사용
        requestAnimationFrame(() => {
          question.classList.add('quiz-pulse')
          question.addEventListener(
            'animationend',
            () => question.classList.remove('quiz-pulse'),
            { once: true },
          )
        })
        return
      }

      const isCorrect = selected.value === correct
      question.classList.toggle('correct', isCorrect)
      question.classList.toggle('wrong', !isCorrect)
      if (isCorrect) score++

      // 정답/오답 뱃지
      const badge = document.createElement('div')
      badge.className = `quiz-badge ${isCorrect ? 'correct' : 'wrong'}`
      badge.textContent = isCorrect ? '✅ 정답' : '❌ 오답'
      question.insertBefore(badge, question.firstChild)

      // 정답 선택지 초록 강조
      question.querySelectorAll('.quiz-options label').forEach((label) => {
        const input = label.querySelector('input')
        if (input) label.classList.toggle('is-correct', input.value === correct)
      })

      // [NEW] 오답 → shake 진동 애니메이션
      if (!isCorrect) {
        requestAnimationFrame(() => {
          question.classList.add('quiz-shake')
          question.addEventListener(
            'animationend',
            () => question.classList.remove('quiz-shake'),
            { once: true },
          )
        })
      }

      // 해설 표시 (정답·오답 모두)
      if (explanation) {
        const expl = document.createElement('div')
        expl.className = 'quiz-explanation'
        expl.innerHTML = `<strong>💡 해설:</strong> ${explanation}`
        question.appendChild(expl)
      }
    })

    // 최종 점수 표시
    const total = questions.length
    const answered = total - unanswered
    const percent = answered ? Math.round((score / answered) * 100) : 0

    // 오답 문제 수집 및 localStorage 저장
    const wrongQuestions = []
    questions.forEach((question) => {
      const name = question.dataset.answer
      const correct = question.dataset.correct
      const explanation = question.dataset.explanation || ''
      const selected = form.querySelector(`input[name="${name}"]:checked`)
      if (!selected) return

      // data-answer 접두사로 카테고리 판별
      const catMap = {
        q_hc: 'html-css',
        q_hk: 'hacking',
        q_ow: 'owasp',
        q_sc: 'secure-coding',
      }
      const prefix = name.replace(/_\d+$/, '')
      const category =
        catMap[prefix] ||
        question.closest('[data-panel]')?.dataset.panel ||
        'html-css'

      const isCorrect = selected.value === correct
      if (!isCorrect) {
        const titleEl = question.querySelector('h3')
        const title = titleEl
          ? titleEl.textContent.replace(/^\d+\.\s*/, '').trim()
          : ''
        const options = []
        question.querySelectorAll('.quiz-options label').forEach((label) => {
          const input = label.querySelector('input')
          if (input)
            options.push({ value: input.value, text: label.textContent.trim() })
        })
        wrongQuestions.push({
          name,
          title,
          correct,
          explanation,
          options,
          category,
        })
      }
    })

    if (unanswered === 0) {
      // 사용자별 키 사용
      const user = localStorage.getItem('wp-logged-in-user')
      const storageKey = user ? `wp-wrong-answers-${user}` : null

      if (storageKey) {
        // 기존 오답 불러오기
        const existing = JSON.parse(localStorage.getItem(storageKey)) || []

        // 이번 채점 결과 반영: 맞은 문제는 제거, 틀린 문제는 추가(중복 제외)
        const solvedNames = new Set()
        questions.forEach((question) => {
          const name = question.dataset.answer
          const correct = question.dataset.correct
          const selected = form.querySelector(`input[name="${name}"]:checked`)
          if (selected && selected.value === correct) solvedNames.add(name)
        })

        // 기존 오답 중 이번에 맞힌 것 제거
        const filtered = existing.filter((q) => !solvedNames.has(q.name))

        // 이번에 새로 틀린 것 중 아직 없는 것만 추가
        wrongQuestions.forEach((wq) => {
          if (!filtered.some((q) => q.name === wq.name)) filtered.push(wq)
        })

        if (filtered.length > 0) {
          localStorage.setItem(storageKey, JSON.stringify(filtered))
        } else {
          localStorage.removeItem(storageKey)
        }
      }
    }

    let message = ''
    if (unanswered > 0) {
      message = `⚠️ ${unanswered}문제가 미선택 상태입니다. 모든 문제를 풀고 다시 채점해주세요.`
    } else if (score === total) {
      message = `🎉 완벽! ${total}문제 모두 정답입니다! (100%)`
    } else {
      message = `${total}문제 중 <strong>${score}문제 정답 (${percent}%)</strong> — 빨간 카드의 해설을 확인해보세요.`
    }

    result.innerHTML = message

    // 오답이 있고 로그인된 경우에만 오답노트 버튼 표시
    const loggedInUser = localStorage.getItem('wp-logged-in-user')
    if (unanswered === 0 && score < total && loggedInUser) {
      result.innerHTML += `
        <div style="margin-top: 16px; padding-top: 14px; border-top: 1px solid var(--line);">
          <p style="margin: 0 0 10px; font-size: 0.9rem; color: var(--muted);">틀린 문제를 다시 풀어보세요 →</p>
          <a class="button primary" href="wrongnotes.html" style="display: inline-flex; align-items: center; gap: 6px;">
            📝 오답노트
          </a>
        </div>
      `
    }

    result.hidden = false
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  })
}

// ============================================================
// [최종 통합] 퀴즈 랜덤 출제 + 커스텀 추가/삭제 + 로컬스토리지 보관 + 채점 시스템
// ============================================================

// 1. 카테고리별 퀴즈를 보관할 전역 데이터 풀 (반드시 최상단 선언)
const quizPool = {
  'html-css': [],
  hacking: [],
  owasp: [],
  'secure-coding': [],
}

document.addEventListener('DOMContentLoaded', () => {
  // 2. 웹사이트 시작 시 기본 문제들과 로컬스토리지 저장 문제 병합하기
  const panels = document.querySelectorAll('[data-panel]')
  panels.forEach((panel) => {
    const category = panel.getAttribute('data-panel')

    // HTML에 적혀있는 기본 문제들 풀(Pool)에 수집
    const questions = panel.querySelectorAll('.quiz-question')
    questions.forEach((q) => {
      quizPool[category].push(q.cloneNode(true))
    })

    // 브라우저에 보관된 커스텀 문제들이 있다면 가져와서 풀(Pool)에 합치기
    const savedQuizzes =
      JSON.parse(localStorage.getItem(`custom_quiz_${category}`)) || []
    savedQuizzes.forEach((data) => {
      const customArticle = createQuizElement(
        data.category,
        data.title,
        data.options,
        data.correct,
        data.explanation,
      )
      quizPool[category].push(customArticle)
    })
  })

  // 3. 퀴즈들을 무작위로 섞어 7개만 화면에 보여주는 함수
  function renderRandomQuiz(category) {
    const panel = document.querySelector(`[data-panel="${category}"]`)
    if (!panel) return

    const header = panel.querySelector('.quiz-section-header')
    panel.innerHTML = ''
    if (header) panel.appendChild(header)

    let questions = [...quizPool[category]]

    // Fisher-Yates 무작위 셔플
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[questions[i], questions[j]] = [questions[j], questions[i]]
    }

    // 완전히 무작위로 섞인 문제 중 상위 7개만 잘라서 배치
    const selected = questions.slice(0, 7)
    selected.forEach((q, index) => {
      const titleEl = q.querySelector('h3')
      if (titleEl) {
        // 기존 내부 스팬 또는 텍스트 알맹이 추출해서 번호 재정렬
        const pureText = titleEl.querySelector('span')
          ? titleEl.querySelector('span').textContent
          : titleEl.textContent
        titleEl.innerHTML = `<span>${index + 1}. ${pureText.replace(/^\d+\.\s*/, '')}</span>`

        // 삭제 버튼이 있다면 제목 우측에 다시 붙여줌
        const delBtn = q.querySelector('.quiz-del-btn')
        if (delBtn) titleEl.appendChild(delBtn)
      }

      // 라디오 버튼 선택 상태 초기화 (이전 채점 기록 지우기)
      const inputs = q.querySelectorAll('input[type="radio"]')
      inputs.forEach((input) => {
        input.checked = false
        input.disabled = false
      })

      // 기존 결과 스타일(클래스) 초기화
      q.classList.remove('correct', 'incorrect', 'quiz-shake')

      panel.appendChild(q)
    })
  }

  // 데이터 객체를 받아서 실제 HTML 태그(DOM Element)로 만들어주는 헬퍼 함수
  function createQuizElement(category, title, options, correct, explanation) {
    const article = document.createElement('article')
    article.className = 'quiz-question'

    const uniqueName = `q_custom_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
    article.setAttribute('data-answer', uniqueName)
    article.setAttribute('data-correct', correct)
    article.setAttribute('data-explanation', explanation)

    // 🌟 h3 구조 내에서 삭제 버튼이 짤리지 않고 우측 정렬되도록 flex 속성 강화
    const h3 = document.createElement('h3')
    h3.style.display = 'flex'
    h3.style.justifyContent = 'space-between'
    h3.style.alignItems = 'flex-start' // 글자가 길어져도 위쪽 정렬 유지
    h3.style.gap = '1rem'
    h3.style.width = '100%'
    h3.style.minHeight = 'auto' // 높이 제한 풀기
    h3.style.overflow = 'visible' // 잘림 방지

    const titleSpan = document.createElement('span')
    titleSpan.textContent = title
    titleSpan.style.flex = '1' // 제목이 공간을 최대한 차지하도록 설정
    h3.appendChild(titleSpan)

    // 🗑️ 삭제 버튼 생성 (크기 및 마진 보강)
    const deleteBtn = document.createElement('button')
    deleteBtn.textContent = '삭제하기' // 글자를 명확하게 변경
    deleteBtn.className = 'quiz-del-btn'
    deleteBtn.style.padding = '0.3rem 0.7rem'
    deleteBtn.style.fontSize = '0.8rem'
    deleteBtn.style.backgroundColor = '#fb7185' // var 대신 직접 헥사코드 부여 (안전용)
    deleteBtn.style.color = '#ffffff'
    deleteBtn.style.border = 'none'
    deleteBtn.style.borderRadius = '4px'
    deleteBtn.style.cursor = 'pointer'
    deleteBtn.style.whiteSpace = 'nowrap' // 글자가 아래로 꺾이지 않게 강제
    deleteBtn.style.display = 'inline-block'

    deleteBtn.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      if (
        confirm(
          '이 문제를 삭제하시겠습니까?\n(삭제 시 브라우저 저장소에서도 영구 제외됩니다.)',
        )
      ) {
        quizPool[category] = quizPool[category].filter((q) => q !== article)

        const currentSaved =
          JSON.parse(localStorage.getItem(`custom_quiz_${category}`)) || []
        const updatedSaved = currentSaved.filter((item) => item.title !== title)
        localStorage.setItem(
          `custom_quiz_${category}`,
          JSON.stringify(updatedSaved),
        )

        renderRandomQuiz(category)
        alert('문제가 저장소에서 완전히 삭제되었습니다.')
      }
    })
    h3.appendChild(deleteBtn)
    article.appendChild(h3)

    const optionsDiv = document.createElement('div')
    optionsDiv.className = 'quiz-options'

    options.forEach((optVal) => {
      const label = document.createElement('label')
      const input = document.createElement('input')
      input.type = 'radio'
      input.name = uniqueName
      input.value = optVal

      label.appendChild(input)
      label.appendChild(document.createTextNode(` ${optVal}`))
      optionsDiv.appendChild(label)
    })
    article.appendChild(optionsDiv)

    return article
  }

  // 초기 페이지 로드 시 카테고리별 무작위 7개씩 기본 자동 배치
  Object.keys(quizPool).forEach((cat) => renderRandomQuiz(cat))

  // ============================================================
  // 4. 사용자가 폼으로 문제를 직접 추가하고 로컬 스토리지에 저장하는 이벤트
  // ============================================================
  const customForm = document.getElementById('custom-quiz-form')
  if (customForm) {
    customForm.addEventListener('submit', (e) => {
      e.preventDefault()

      try {
        const category = document.getElementById('new-quiz-cat').value
        const title = document.getElementById('new-quiz-title').value
        const explanation =
          document.getElementById('new-quiz-exp').value ||
          '해설이 등록되지 않은 문제입니다.'

        const checkedRadio = document.querySelector(
          'input[name="new-correct"]:checked',
        )
        const correctOptId = checkedRadio ? checkedRadio.value : 'opt1'
        const correctText = document.getElementById(`new-${correctOptId}`).value

        if (!correctText || correctText.trim() === '') {
          alert('정답으로 체크한 보기 칸에 내용을 입력해 주세요.')
          return
        }

        const optionsArray = []
        ;['opt1', 'opt2', 'opt3', 'opt4'].forEach((optId) => {
          const val = document.getElementById(`new-${optId}`).value
          if (val && val.trim() !== '') optionsArray.push(val)
        })

        // 로컬 스토리지 누적 저장
        const currentSaved =
          JSON.parse(localStorage.getItem(`custom_quiz_${category}`)) || []
        const newQuizData = {
          category: category,
          title: title,
          options: optionsArray,
          correct: correctText,
          explanation: explanation,
        }
        currentSaved.push(newQuizData)
        localStorage.setItem(
          `custom_quiz_${category}`,
          JSON.stringify(currentSaved),
        )

        // 가상 풀(Pool) 등록 및 화면 리렌더링
        const newArticle = createQuizElement(
          category,
          title,
          optionsArray,
          correctText,
          explanation,
        )
        quizPool[category].push(newArticle)

        renderRandomQuiz(category)

        const totalCount = quizPool[category].length
        customForm.reset()
        alert(
          `🎉 문제가 브라우저 저장소에 영구 추가되었습니다! 새로 추가된 문제를 포함해 총 7문제가 랜덤 출제됩니다.`,
        )
      } catch (error) {
        console.error('퀴즈 추가 중 에러 발생:', error)
      }
    })
  }

  // ============================================================
  // 5. 카테고리 탭 네비게이션 전환 이벤트 (탭 누르면 새로 섞어서 7개 노출)
  // ============================================================
  const catButtons = document.querySelectorAll('[data-category]')
  catButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetCat = btn.getAttribute('data-category')

      catButtons.forEach((b) => b.classList.remove('active'))
      btn.classList.add('active')

      // 탭을 바꿀 때마다 완벽하게 무작위로 새로 섞인 문제지 출력
      renderRandomQuiz(targetCat)

      panels.forEach((p) => {
        if (p.getAttribute('data-panel') === targetCat) {
          p.removeAttribute('hidden')
        } else {
          p.setAttribute('hidden', 'true')
        }
      })

      // 기존 채점 결과 영역 숨기기
      const resultEl = document.querySelector('[data-quiz-result]')
      if (resultEl) resultEl.setAttribute('hidden', 'true')
    })
  })

  // 🌟 [추가] 웹사이트가 처음 켜질 때, 기존에 저장된 커스텀 문제 리스트를 화면에 그려줍니다.
  if (typeof updateCustomManagementList === 'function') {
    updateCustomManagementList()
  }
})

// 내가 만든 문제만 모아서 삭제 버튼과 함께 따로 리스트업해주는 함수
function updateCustomManagementList() {
  const listContainer = document.getElementById('my-custom-quiz-list')
  if (!listContainer) return

  listContainer.innerHTML = '' // 기존 목록 청소
  let hasData = false

  // 4개 카테고리를 순회하며 로컬스토리지에 저장된 데이터를 수집
  const categories = ['html-css', 'hacking', 'owasp', 'secure-coding']

  categories.forEach((cat) => {
    const saved = JSON.parse(localStorage.getItem(`custom_quiz_${cat}`)) || []
    if (saved.length > 0) {
      hasData = true
      saved.forEach((item) => {
        // 관리용 슬림 레이아웃 바 생성
        const itemDiv = document.createElement('div')
        itemDiv.style.display = 'flex'
        itemDiv.style.justifyContent = 'space-between'
        itemDiv.style.alignItems = 'center'
        itemDiv.style.padding = '0.75rem 1rem'
        itemDiv.style.backgroundColor = 'var(--bg-sub, #f8fafc)'
        itemDiv.style.borderRadius = '6px'
        itemDiv.style.border = '1px solid var(--border, #e2e8f0)'

        const infoSpan = document.createElement('span')
        infoSpan.innerHTML = `<small style="color:#3b82f6; font-weight:bold; margin-right:8px;">[${cat.toUpperCase()}]</small> <strong>${item.title}</strong>`
        itemDiv.appendChild(infoSpan)

        // 실제 하드디스크와 메모리에서 지워버리는 찐 삭제 버튼
        const delBtn = document.createElement('button')
        delBtn.textContent = '삭제하기'
        delBtn.style.padding = '0.3rem 0.6rem'
        delBtn.style.fontSize = '0.8rem'
        delBtn.style.backgroundColor = '#fb7185'
        delBtn.style.color = '#fff'
        delBtn.style.border = 'none'
        delBtn.style.borderRadius = '4px'
        delBtn.style.cursor = 'pointer'

        delBtn.addEventListener('click', () => {
          if (confirm(`'${item.title}' 문제를 삭제하시겠습니까?`)) {
            // 1. 로컬스토리지 삭제
            const currentSaved =
              JSON.parse(localStorage.getItem(`custom_quiz_${cat}`)) || []
            const updatedSaved = currentSaved.filter(
              (q) => q.title !== item.title,
            )
            localStorage.setItem(
              `custom_quiz_${cat}`,
              JSON.stringify(updatedSaved),
            )

            // 2. 가상 풀 새로고침을 위해 새로고침 안내 또는 리렌더링
            alert(
              '문제가 삭제되었습니다. 변경사항 반영을 위해 페이지가 새로고침됩니다.',
            )
            location.reload()
          }
        })

        itemDiv.appendChild(delBtn)
        listContainer.appendChild(itemDiv)
      })
    }
  })

  if (!hasData) {
    listContainer.innerHTML = `<p style="text-align: center; color: var(--muted); font-size: 0.9rem; padding: 1rem 0;">아직 직접 추가한 커스텀 퀴즈가 없습니다.</p>`
  }
}

// 기존DOMContentLoaded 이벤트 구문 맨 마지막 줄( }가 닫히기 직전)에
// updateCustomManagementList(); 를 실행하도록 한 줄 적어주세요!

// ── 로그인 상태 연동 (네비게이션 Log In / 유저 드롭다운) ──
function initAuthNav() {
  const actions = document.querySelector('.nav-actions')
  if (!actions) return

  const user = localStorage.getItem('wp-logged-in-user')

  if (user) {
    const wrapper = document.createElement('div')
    wrapper.className = 'nav-user-wrapper'

    const chip = document.createElement('button')
    chip.type = 'button'
    chip.className = 'nav-user-chip'
    chip.textContent = user
    chip.setAttribute('aria-haspopup', 'true')
    chip.setAttribute('aria-expanded', 'false')

    const dropdown = document.createElement('div')
    dropdown.className = 'nav-user-dropdown'
    dropdown.setAttribute('role', 'menu')

    dropdown.innerHTML = `
      <a class="nav-dropdown-item" href="wrongnotes.html" role="menuitem">
        <span class="item-icon">📝</span> 오답노트
      </a>
      <a class="nav-dropdown-item" href="favorites.html" role="menuitem">
        <span class="item-icon">★</span> 즐겨찾기
      </a>
      <div class="nav-dropdown-divider"></div>
      <button class="nav-dropdown-item logout" type="button" data-dropdown-action="logout" role="menuitem">
        <span class="item-icon">↩</span> 로그아웃
      </button>
    `

    function openDropdown() {
      chip.classList.add('open')
      dropdown.classList.add('open')
      chip.setAttribute('aria-expanded', 'true')
    }
    function closeDropdown() {
      chip.classList.remove('open')
      dropdown.classList.remove('open')
      chip.setAttribute('aria-expanded', 'false')
    }

    chip.addEventListener('click', (e) => {
      e.stopPropagation()
      dropdown.classList.contains('open') ? closeDropdown() : openDropdown()
    })

    dropdown.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-dropdown-action]')
      if (!btn) return
      if (btn.dataset.dropdownAction === 'logout') {
        localStorage.removeItem('wp-logged-in-user')
        window.location.reload()
      }
    })

    document.addEventListener('click', closeDropdown)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDropdown()
    })

    wrapper.appendChild(chip)
    wrapper.appendChild(dropdown)
    actions.insertBefore(wrapper, actions.firstChild)
  } else {
    const loginBtn = document.createElement('a')
    loginBtn.href = 'login.html'
    loginBtn.className = 'nav-login-btn'
    loginBtn.textContent = 'Log In'
    actions.insertBefore(loginBtn, actions.firstChild)
  }
}

// ══════════════════════════════════════════════════════
//  즐겨찾기 시스템
// ══════════════════════════════════════════════════════
function getFavKey() {
  const user = localStorage.getItem('wp-logged-in-user')
  return user ? `wp-favorites-${user}` : null
}
function getFavorites() {
  const key = getFavKey()
  if (!key) return []
  return JSON.parse(localStorage.getItem(key)) || []
}
function saveFavorites(arr) {
  const key = getFavKey()
  if (!key) return
  localStorage.setItem(key, JSON.stringify(arr))
}
function toggleFavorite(id, title, desc, source, category) {
  const favs = getFavorites()
  const idx = favs.findIndex((f) => f.id === id)
  if (idx === -1) {
    favs.push({
      id,
      title,
      desc,
      source,
      category: category || '',
      savedAt: Date.now(),
    })
  } else {
    favs.splice(idx, 1)
  }
  saveFavorites(favs)
  return idx === -1
}
function isFavorited(id) {
  return getFavorites().some((f) => f.id === id)
}
function initFavoriteButtons() {
  const user = localStorage.getItem('wp-logged-in-user')
  const sourceMeta = document.querySelector('meta[name="fav-source"]')
  const pageSource = sourceMeta ? sourceMeta.content : 'unknown'

  document.querySelectorAll('[data-fav-id]').forEach((card) => {
    if (card.querySelector('.fav-btn')) return
    const id = card.dataset.favId
    const titleEl =
      card.querySelector('h3') ||
      card.querySelector('h2') ||
      card.querySelector('h4')
    const title = titleEl ? titleEl.textContent.trim() : id
    const descEl = card.querySelector('p')
    const desc = descEl ? descEl.textContent.trim().slice(0, 120) : ''
    const category = card.dataset.category || ''

    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'fav-btn'
    btn.setAttribute('aria-label', '즐겨찾기')
    btn.setAttribute('title', '즐겨찾기에 추가')

    const starred = user && isFavorited(id)
    btn.classList.toggle('active', starred)
    btn.textContent = starred ? '★' : '☆'

    btn.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      if (!localStorage.getItem('wp-logged-in-user')) {
        const toast = document.createElement('div')
        toast.className = 'fav-toast'
        toast.textContent = '로그인 후 즐겨찾기를 사용할 수 있습니다.'
        document.body.appendChild(toast)
        requestAnimationFrame(() => toast.classList.add('show'))
        setTimeout(() => {
          toast.classList.remove('show')
          setTimeout(() => toast.remove(), 300)
        }, 2200)
        return
      }
      const added = toggleFavorite(id, title, desc, pageSource, category)
      btn.classList.toggle('active', added)
      btn.textContent = added ? '★' : '☆'
      const toast = document.createElement('div')
      toast.className = 'fav-toast'
      toast.textContent = added
        ? '★ 즐겨찾기에 추가했습니다.'
        : '즐겨찾기에서 삭제했습니다.'
      document.body.appendChild(toast)
      requestAnimationFrame(() => toast.classList.add('show'))
      setTimeout(() => {
        toast.classList.remove('show')
        setTimeout(() => toast.remove(), 300)
      }, 1800)
    })

    card.style.position = 'relative'
    card.appendChild(btn)
  })
}

document.addEventListener('DOMContentLoaded', () => {
  initAuthNav()
  initFavoriteButtons()
})
