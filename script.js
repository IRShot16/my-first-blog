
/* ================================================================
   数据
   ----------------------------------------------------------------
   以后新增项目或者笔记，只需要修改下面两个数组，HTML 不用动。

   每一条数据的格式：
       title       标题
       description 简介
       date        发布日期，统一写成 "YYYY-MM-DD"
       url         外部链接（本网站不创建详情页）
       tags        技术栈标签，数组。不需要标签就写 []

   页面会自动按 date 倒序排列，最新的排在最前面。
================================================================ */

const projects = [
    {
        title: "零到全栈",
        description: "学习B站系列课程。从零开始，建立技术直觉。传授在AI时代 把想法做成产品的能力",
        date: "2026-06-12",
        url: "https://github.com/IRShot16/zero-to-tech",
        tags: ["全栈", "React", "Nextjs", "FastAPI", "SQLite"]
    },
    {
        title: "个人博客",
        description: "使用 HTML、CSS 和 JavaScript 构建的个人网站，用于整理项目、学习笔记以及个人信息。",
        date: "2026-08-15",
        url: "https://github.com/IRShot16/my-first-blog",
        tags: ["前端三大件", "github pages"]
    },
];


const notes = [
    {
        title: "提升效率工具汇总",
        description: "发现适合自己的好用工具，提升效率。",
        date: "2026-09-10",
        url: "https://www.yuque.com/g/debug-vmvaw/exkgpz/hc79qam17vhq2844/collaborator/join?token=iVDhctQdMKpCWp1N&source=doc_collaborator# 《提升效率工具》",
        tags: ["个人经验", "电脑"]
    },
];


/* ================================================================
   配置
================================================================ */

// 首页最多展示几条
const HOME_LIMIT = 3;

// 索引页每页展示几条
const ITEMS_PER_PAGE = 5;

// 背景涂鸦用到的技术词。取自 GitHub Topics 和 Stack Overflow 的高频话题，
// 静态写死，不请求任何接口。想换词只改这个数组就行。
const DOODLE_TAGS = [
    "GitHub", "AI", "ChatGPT", "LLM", "Prompt", "Agent", "RAG",
    "Python", "JavaScript", "TypeScript", "Rust", "Go", "SQL",
    "React", "Next.js", "Node.js", "FastAPI", "Vue",
    "Linux", "Docker", "K8s", "Git", "Nginx", "Redis", "MySQL",
    "API", "Open Source", "Algorithm", "Frontend", "Backend", "Full-Stack",
    "PyTorch", "Hugging Face", "Cloud", "Vercel",
    "VS Code", "Markdown", "Terminal",
    "开源", "机器学习", "深度学习", "全栈", "云原生", "算法"
];


/* ================================================================
   工具函数
================================================================ */

// 按日期倒序排列，新的在前
function sortByDateDesc(list) {
    return list.slice().sort(function (a, b) {
        return a.date < b.date ? 1 : -1;
    });
}

// "2026-09-12" → "2026.09.12"
function formatDate(date) {
    return date.replace(/-/g, ".");
}

// 1 → "01"
function padNumber(number) {
    return number < 10 ? "0" + number : String(number);
}

// 转义，防止数据里的特殊字符破坏 HTML 结构
function escapeHtml(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

// 技术栈标签。tags 为空数组或没写时返回空字符串，标签区整块不渲染
function tagsHTML(tags) {
    if (!tags || tags.length === 0) {
        return "";
    }

    const items = tags
        .map(function (tag) {
            return `<span class="tag">${escapeHtml(tag)}</span>`;
        })
        .join("");

    return `<div class="tags">${items}</div>`;
}


/* ================================================================
   背景涂鸦
   ----------------------------------------------------------------
   把上面的技术词撒成一整页的浅色手写体，纯装饰。
   位置用固定种子的伪随机数算出来，所以每次刷新图案都一模一样，
   不会加载一次跳一次。
================================================================ */

// 固定种子的伪随机（mulberry32），保证涂鸦位置稳定可复现
function createRandom(seed) {
    let state = seed;

    return function () {
        state = (state + 0x6d2b79f5) | 0;

        let t = Math.imul(state ^ (state >>> 15), 1 | state);

        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

// 粗略估算一行文字有多宽，用来判断会不会顶出右边界。
// 中文按一个字符宽算，英文按 0.58 算，够用了
function estimateTextWidth(text, fontSize) {
    let units = 0;

    for (const character of text) {
        units += /[一-龥]/.test(character) ? 1 : 0.58;
    }

    return units * fontSize;
}

function renderDoodle() {
    const layer = document.createElement("div");

    layer.className = "bg-doodle";

    // 装饰层，读屏软件直接跳过
    layer.setAttribute("aria-hidden", "true");

    const random = createRandom(20260922);

    // 窄屏少分几列，否则 nowrap 的词会叠成一团
    const columns = window.innerWidth < 768 ? 3 : 5;
    const rows = Math.ceil(DOODLE_TAGS.length / columns);

    const layerWidth = document.documentElement.clientWidth;

    DOODLE_TAGS.forEach(function (tag, index) {
        const element = document.createElement("span");

        element.textContent = tag;

        // 先均分到网格里，再在格子内部随机偏移，避免看出行列
        const column = index % columns;
        const row = Math.floor(index / columns);

        const size = 14 + random() * 20;

        // 往右挪到放不下就把整行往回收，免得出现 "TypeSc" 这种断头词。
        // 收不动（词比屏幕还宽）就让 overflow: hidden 去裁
        const maxLeft =
            ((layerWidth - estimateTextWidth(tag, size) - 12) / layerWidth) * 100;

        const left = Math.min(
            ((column + 0.08 + random() * 0.7) / columns) * 100,
            Math.max(1, maxLeft)
        );

        const top = ((row + 0.12 + random() * 0.76) / rows) * 100;

        element.style.left = left.toFixed(2) + "%";
        element.style.top = top.toFixed(2) + "%";

        // 字号和角度走 CSS 变量，方便窄屏断点里整体缩放
        element.style.setProperty("--size", size.toFixed(1));
        element.style.setProperty(
            "--rotate",
            ((random() * 2 - 1) * 13).toFixed(1) + "deg"
        );

        // 蓝色点缀稍微重一点，不然混在灰字里看不出来
        const isAccent = random() < 0.22;
        const opacity = 0.09 + random() * 0.11;

        element.style.opacity = (
            isAccent ? Math.min(opacity * 1.45, 0.26) : opacity
        ).toFixed(3);

        if (isAccent) {
            element.className = "accent";
        }

        layer.appendChild(element);
    });

    document.body.appendChild(layer);
}


/* ================================================================
   生成 HTML 片段
================================================================ */

// 首页的项目卡片
function projectCardHTML(project, index) {
    return `
        <a class="card"
           href="${escapeHtml(project.url)}"
           target="_blank"
           rel="noopener noreferrer">

            <p class="card-number">${padNumber(index + 1)}</p>

            <h3>${escapeHtml(project.title)}</h3>

            <p>${escapeHtml(project.description)}</p>

            ${tagsHTML(project.tags)}

            <p class="card-date">${formatDate(project.date)}</p>

            <span class="card-link">查看项目 →</span>

        </a>
    `;
}

// 首页的笔记条目
function homeNoteHTML(note) {
    return `
        <a class="note"
           href="${escapeHtml(note.url)}"
           target="_blank"
           rel="noopener noreferrer">

            <div>

                <span class="note-title">${escapeHtml(note.title)}</span>

                <span class="note-description">${escapeHtml(note.description)}</span>

                ${tagsHTML(note.tags)}

                <span class="note-date">${formatDate(note.date)}</span>

            </div>

            <span class="note-arrow">→</span>

        </a>
    `;
}

// 项目索引页的条目。index 是全局序号，所以第 2 页会接着显示 PROJECT 06
function projectItemHTML(project, index) {
    return `
        <a class="project-item"
           href="${escapeHtml(project.url)}"
           target="_blank"
           rel="noopener noreferrer">

            <p class="project-item-number">PROJECT ${padNumber(index + 1)}</p>

            <h2>${escapeHtml(project.title)}</h2>

            <p class="project-item-description">${escapeHtml(project.description)}</p>

            ${tagsHTML(project.tags)}

            <p class="project-item-date">${formatDate(project.date)}</p>

            <span class="project-item-link">查看项目 →</span>

        </a>
    `;
}

// 笔记索引页的条目
function noteItemHTML(note) {
    return `
        <a class="note-page-item"
           href="${escapeHtml(note.url)}"
           target="_blank"
           rel="noopener noreferrer">

            <div>

                <h2>${escapeHtml(note.title)}</h2>

                <p>${escapeHtml(note.description)}</p>

                ${tagsHTML(note.tags)}

                <p class="note-page-date">${formatDate(note.date)}</p>

            </div>

            <span class="note-page-arrow">→</span>

        </a>
    `;
}


/* ================================================================
   分页
================================================================ */

// 计算页码按钮。页数不多时全部显示，页数多时收成 1 … 4 5 6 … 20
function getPageNumbers(currentPage, totalPages) {
    const pages = [];

    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
        return pages;
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    pages.push(1);

    if (start > 2) {
        pages.push("…");
    }

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    if (end < totalPages - 1) {
        pages.push("…");
    }

    pages.push(totalPages);

    return pages;
}

// 生成「上一页 / 下一页」按钮。enabled 为 false 时用 span，不可点击
function createNavButton(label, enabled, onClick) {
    let element;

    if (enabled) {
        element = document.createElement("a");
        element.href = "#";
        element.addEventListener("click", function (event) {
            event.preventDefault();
            onClick();
        });
    } else {
        element = document.createElement("span");
    }

    element.className = enabled ? "page-nav" : "page-nav disabled";
    element.textContent = label;

    return element;
}

// 渲染整组分页按钮
function renderPagination(container, currentPage, totalPages, onPageChange) {
    container.innerHTML = "";

    container.appendChild(
        createNavButton("‹ 上一页", currentPage > 1, function () {
            onPageChange(currentPage - 1);
        })
    );

    getPageNumbers(currentPage, totalPages).forEach(function (page) {
        if (page === "…") {
            const dots = document.createElement("span");
            dots.className = "dots";
            dots.textContent = "…";
            container.appendChild(dots);
            return;
        }

        if (page === currentPage) {
            const active = document.createElement("span");
            active.className = "active";
            active.textContent = page;
            container.appendChild(active);
            return;
        }

        const link = document.createElement("a");
        link.href = "#";
        link.textContent = page;
        link.addEventListener("click", function (event) {
            event.preventDefault();
            onPageChange(page);
        });
        container.appendChild(link);
    });

    container.appendChild(
        createNavButton("下一页 ›", currentPage < totalPages, function () {
            onPageChange(currentPage + 1);
        })
    );
}

// 一个列表 + 一组分页按钮 = 一套完整的分页
function setupPagination(options) {
    let currentPage = 1;

    const totalPages = Math.max(
        1,
        Math.ceil(options.data.length / options.perPage)
    );

    function render() {
        // 根据当前页算出这一页要显示的数据范围
        const start = (currentPage - 1) * options.perPage;
        const pageItems = options.data.slice(start, start + options.perPage);

        let html = "";

        pageItems.forEach(function (item, index) {
            html += options.renderItem(item, start + index);
        });

        options.listEl.innerHTML = html;

        renderPagination(
            options.paginationEl,
            currentPage,
            totalPages,
            function (page) {
                currentPage = page;
                render();

                // 翻页后把列表滚回视野，免得还停在页面底部
                options.listEl.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        );
    }

    render();
}


/* ================================================================
   初始化
   ----------------------------------------------------------------
   三个页面共用这一个文件，靠 id 判断当前在哪个页面，
   找不到对应元素就跳过，不影响其他页面。
================================================================ */

document.addEventListener("DOMContentLoaded", function () {

    // 三个页面都先铺背景涂鸦
    renderDoodle();

    const sortedProjects = sortByDateDesc(projects);
    const sortedNotes = sortByDateDesc(notes);


    /* ---------- 首页：最新 3 个项目 ---------- */

    const homeProjects = document.getElementById("home-projects");

    if (homeProjects) {
        homeProjects.innerHTML = sortedProjects
            .slice(0, HOME_LIMIT)
            .map(projectCardHTML)
            .join("");
    }


    /* ---------- 首页：最新 3 篇笔记 ---------- */

    const homeNotes = document.getElementById("home-notes");

    if (homeNotes) {
        homeNotes.innerHTML = sortedNotes
            .slice(0, HOME_LIMIT)
            .map(homeNoteHTML)
            .join("");
    }


    /* ---------- 项目索引页：全部项目 + 分页 ---------- */

    const projectList = document.getElementById("project-list");

    if (projectList) {
        setupPagination({
            listEl: projectList,
            paginationEl: document.getElementById("project-pagination"),
            data: sortedProjects,
            perPage: ITEMS_PER_PAGE,
            renderItem: projectItemHTML
        });
    }


    /* ---------- 笔记索引页：全部笔记 + 分页 ---------- */

    const noteList = document.getElementById("note-list");

    if (noteList) {
        setupPagination({
            listEl: noteList,
            paginationEl: document.getElementById("note-pagination"),
            data: sortedNotes,
            perPage: ITEMS_PER_PAGE,
            renderItem: noteItemHTML
        });
    }

});
