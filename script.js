
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
        title: "植物叶片病害严重程度分级",
        description: "基于多阶段图像分割的植物叶片病害严重程度分级项目。使用 U-Net 与 U-Net++ 对叶片区域和病斑区域进行分割，并根据病斑面积占叶片面积的比例进行严重程度分析。",
        date: "2026-09-12",
        url: "https://你的项目链接1.com",
        tags: ["Python", "PyTorch", "U-Net", "语义分割"]
    },
    {
        title: "AI Learning",
        description: "人工智能与深度学习相关的学习与实践项目，用于记录模型训练、实验过程以及技术探索。",
        date: "2026-08-28",
        url: "https://你的项目链接2.com",
        tags: ["Python", "PyTorch", "深度学习"]
    },
    {
        title: "Personal Website",
        description: "使用 HTML、CSS 和 JavaScript 构建的个人网站，用于整理项目、学习笔记以及个人信息。",
        date: "2026-08-15",
        url: "https://你的项目链接3.com",
        tags: ["HTML", "CSS", "JavaScript"]
    },
    {
        title: "项目名称",
        description: "在这里填写项目简介。简单说明项目的用途、使用的技术以及项目特点。",
        date: "2026-07-30",
        url: "https://你的项目链接4.com",
        tags: []
    },
    {
        title: "项目名称",
        description: "在这里填写项目简介。",
        date: "2026-07-12",
        url: "https://你的项目链接5.com",
        tags: []
    },
    {
        title: "项目名称",
        description: "在这里填写项目简介。",
        date: "2026-06-25",
        url: "https://你的项目链接6.com",
        tags: []
    }
];


const notes = [
    {
        title: "Python 数据分析",
        description: "NumPy、Pandas、Matplotlib 等数据分析工具学习记录。",
        date: "2026-09-10",
        url: "https://你的笔记链接1.com",
        tags: ["Python", "NumPy", "Pandas"]
    },
    {
        title: "Deep Learning",
        description: "神经网络、CNN、语义分割以及深度学习模型相关学习记录。",
        date: "2026-09-05",
        url: "https://你的笔记链接2.com",
        tags: ["深度学习", "CNN", "语义分割"]
    },
    {
        title: "Artificial Intelligence",
        description: "人工智能、机器学习、深度学习以及相关技术学习笔记。",
        date: "2026-08-22",
        url: "https://你的笔记链接3.com",
        tags: ["机器学习", "深度学习"]
    },
    {
        title: "Python",
        description: "Python 基础、数据结构、函数以及数据分析学习笔记。",
        date: "2026-08-10",
        url: "https://你的笔记链接4.com",
        tags: ["Python", "基础语法"]
    },
    {
        title: "Web Development",
        description: "HTML、CSS、JavaScript 以及 Web 开发相关学习记录。",
        date: "2026-07-28",
        url: "https://你的笔记链接5.com",
        tags: ["HTML", "CSS", "JavaScript"]
    },
    {
        title: "Git & GitHub",
        description: "Git 基础、版本控制、GitHub 使用以及常见操作记录。",
        date: "2026-07-16",
        url: "https://你的笔记链接6.com",
        tags: ["Git", "版本控制"]
    }
];


/* ================================================================
   配置
================================================================ */

// 首页最多展示几条
const HOME_LIMIT = 3;

// 索引页每页展示几条
const ITEMS_PER_PAGE = 5;


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
