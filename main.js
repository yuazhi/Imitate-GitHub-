// 模拟项目数据，实际使用时可以替换为真实的API请求
// 添加 normalizeLangName 函数定义
function normalizeLangName(name) {
    if (!name) return 'default';
    return name.toLowerCase()
        .replace(/\+/g, 'p')
        .replace(/#/g, 'sharp')
        .replace(/\./g, 'dot')
        .replace(/-/g, '')
        .replace(/\s+/g, '');
}

// 示例项目数据 - 请替换为您的实际项目数据
const projectsData = [
    {
        name: "example-project",
        description: "这是一个示例项目",
        tags: ["JavaScript", "HTML", "CSS"],
        stars: 10,
        forks: 5
    },
    {
        name: "another-project",
        description: "另一个示例项目",
        tags: ["Vue", "Node.js"],
        stars: 25,
        forks: 8
    }
];

// 在 projectsData 数组前添加正在进行的项目数据
const ongoingProject = {
    name: "current-project",
    description: "这是一个正在开发中的重要项目。",
    tags: ["React", "TypeScript"],
    progress: 65, // 进度百分比
    stars: 15,
    forks: 3
};

// ==================== 配置区域 ====================
// 请根据您的实际情况修改以下配置

// GitHub API配置
const GITHUB_USERNAME = 'your-github-username'; // 替换为您的GitHub用户名
const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_TOKEN = ''; // 替换为您的GitHub Token（可选，用于提高API限制）

// Memos API配置（可选）
const MEMOS_API_BASE = ''; // 替换为您的Memos API地址
const MEMOS_TOKEN = ''; // 替换为您的Memos Token

// 文章 API 配置（可选）
const ARTICLES_API_CONFIG = {
    URL: "", // 替换为您的文章API地址
    Method: "post",
    Headers: {
        "Accept": "application/json, text/plain, */*",
    },
    Body: {
        meta: {
            ds: "文章 get",
            table: "posts",
            action: "r",
            filters: {},
            env: "dev"
        }
    },
    Status: 200
};

// ==================== 配置区域结束 ====================

async function fetchArticlesData() {
    // 如果没有配置文章API，返回空数组
    if (!ARTICLES_API_CONFIG.URL) {
        console.log('文章API未配置，使用示例数据');
        return [
            {
                id: 1,
                title: "示例文章标题",
                description: "这是一篇示例文章",
                text: "这是示例文章的内容。您可以在这里添加您的实际文章内容。",
                created_at: new Date().toISOString()
            }
        ];
    }

    try {
        showSkeletonLoading();
        const response = await fetch(ARTICLES_API_CONFIG.URL, {
            method: ARTICLES_API_CONFIG.Method,
            headers: ARTICLES_API_CONFIG.Headers,
            body: JSON.stringify(ARTICLES_API_CONFIG.Body)
        });

        if (!response.ok) {
            throw new Error(`Article API error: ${response.status}`);
        }

        const data = await response.json();
        console.log("API 返回的原始数据:", data);
        hideSkeletonLoading();
        // 对文章数据进行排序，按 created_at 降序排列
        const sortedRows = data.rows.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        return sortedRows;
    } catch (error) {
        console.error("Error fetching articles data:", error);
        hideSkeletonLoading();
        return [];
    }
}

// 示例友情链接数据 - 请替换为您的实际友链数据
const friendsData = [
    {
        name: "示例友链1",
        url: "https://example1.com/",
        description: "这是一个示例友链",
        avatar: "https://example1.com/favicon.ico"
    },
    {
        name: "示例友链2",
        url: "https://example2.com/",
        description: "另一个示例友链",
        avatar: "https://example2.com/favicon.ico"
    }
];

// 渲染友情链接页面
async function renderFriends() {
    const contentArea = document.querySelector('.content-area');
    contentArea.innerHTML = `
        <div class="friends-container">
            <div class="friends-grid">
                ${friendsData.map(friend => `
                    <a href="${friend.url}" class="friend-card" target="_blank" rel="noopener">
                        <div class="friend-avatar">
                            <img src="${friend.avatar}" alt="${friend.name}">
                        </div>
                        <div class="friend-info">
                            <h3>${friend.name}</h3>
                            <p>${friend.description}</p>
                        </div>
                    </a>
                `).join('')}
            </div>
            <div class="site-info">
                <h3>本站基本信息</h3>
                <div class="site-info-content">
                    <div class="site-info-item">
                        <span class="site-info-label">博客名称：</span>
                        <span class="site-info-value">个人网站模板</span>
                    </div>
                    <div class="site-info-item">
                        <span class="site-info-label">地址：</span>
                        <span class="site-info-value"><a href="https://your-domain.com/" target="_blank">https://your-domain.com/</a></span>
                    </div>
                    <div class="site-info-item">
                        <span class="site-info-label">图标：</span>
                        <span class="site-info-value"><a href="https://your-domain.com/favicon.ico" target="_blank">点击查看</a></span>
                    </div>
                    <div class="site-info-item">
                        <span class="site-info-label">简介：</span>
                        <span class="site-info-value">这是一个个人网站模板</span>
                    </div>
                    <div class="site-info-item">
                        <span class="site-info-label">提交邮箱：</span>
                        <span class="site-info-value"><a href="mailto:your-email@example.com">your-email@example.com</a></span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 获取GitHub数据的函数
async function fetchGitHubData() {
    try {
        const headers = {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `Bearer ${GITHUB_TOKEN}`
        };

        // 获取用户仓库列表
        const reposResponse = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&direction=desc`, {
            headers: headers
        });
        
        if (!reposResponse.ok) {
            throw new Error(`GitHub API error: ${reposResponse.status}`);
        }
        
        const repos = await reposResponse.json();

        // 获取用户信息
        const userResponse = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`, {
            headers: headers
        });
        
        if (!userResponse.ok) {
            throw new Error(`GitHub API error: ${userResponse.status}`);
        }
        
        const userData = await userResponse.json();

        // 获取每个仓库的详细信息，包括语言统计
        const repoDetails = await Promise.all(repos.map(async (repo) => {
            try {
                console.log(`处理仓库: ${repo.name}`);
                
                const languagesResponse = await fetch(repo.languages_url, {
                    headers: headers
                });
                const languages = await languagesResponse.json();
                
                // 验证仓库名称，避免特殊字符导致的API错误
                const repoName = repo.name.replace(/[^a-zA-Z0-9._-]/g, '');
                if (!repoName) {
                    console.warn(`跳过无效的仓库名称: ${repo.name}`);
                    return null;
                }
                
                console.log(`清理后的仓库名称: ${repoName}`);
                
                // 获取最近的提交
                let lastCommit = null;
                try {
                    const commitsResponse = await fetch(`${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repoName}/commits?per_page=1`, {
                        headers: headers
                    });
                    
                    if (commitsResponse.ok) {
                        const commits = await commitsResponse.json();
                        lastCommit = commits.length > 0 ? commits[0].commit.author.date : null;
                    } else {
                        console.warn(`无法获取仓库 ${repoName} 的提交信息: ${commitsResponse.status} - ${commitsResponse.statusText}`);
                    }
                } catch (commitError) {
                    console.warn(`获取仓库 ${repoName} 提交信息时出错:`, commitError);
                }
                
                return {
                    name: repo.name,
                    description: repo.description || '',
                    tags: Object.keys(languages),
                    stars: repo.stargazers_count,
                    forks: repo.forks_count,
                    html_url: repo.html_url,
                    updated_at: repo.updated_at,
                    created_at: repo.created_at,
                    last_commit: lastCommit,
                    is_fork: repo.fork,
                    language: repo.language,
                    open_issues: repo.open_issues_count,
                    size: repo.size,
                    languages: languages
                };
            } catch (error) {
                console.error(`处理仓库 ${repo.name} 时出错:`, error);
                return null;
            }
        }));

        // 过滤掉null值（处理失败的仓库）
        const validRepoDetails = repoDetails.filter(repo => repo !== null);

        // 按更新时间排序
        validRepoDetails.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

        // 更新项目数据
        projectsData.length = 0;
        projectsData.push(...validRepoDetails);

        // 更新进行中的项目（使用最近更新的非fork仓库）
        const mostRecentRepo = validRepoDetails.find(repo => !repo.is_fork);
        if (mostRecentRepo) {
            ongoingProject.name = mostRecentRepo.name;
            ongoingProject.description = mostRecentRepo.description;
            ongoingProject.tags = mostRecentRepo.tags;
            ongoingProject.stars = mostRecentRepo.stars;
            ongoingProject.forks = mostRecentRepo.forks;
            // 根据最后提交时间计算进度
            const daysSinceLastCommit = (new Date() - new Date(mostRecentRepo.last_commit)) / (1000 * 60 * 60 * 24);
            ongoingProject.progress = Math.max(0, Math.min(100, 100 - Math.floor(daysSinceLastCommit)));
        }

        return validRepoDetails;
    } catch (error) {
        console.error('Error fetching GitHub data:', error);
        throw error;
    }
}

// 修改渲染项目卡片的函数
function renderProjectCard(project) {
    // 标签处理
    const tags = (project.tags || []).map(tag => {
        // 规范化 class 名称，兼容 C++/C#/Batchfile 等
        let className = 'language-' + tag.replace(/\+/g, 'pp').replace(/#/g, 'Sharp').replace(/\s+/g, '').replace(/\./g, '').replace(/-/g, '');
        return `<span class="repo-tag ${className}">${tag}</span>`;
    }).join('');

    // 统计信息
    const stats = `
        <span class="repo-stat" title="Stars">
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path></svg>
            ${project.stars ?? project.stargazers_count ?? 0}
        </span>
        <span class="repo-stat" title="Forks">
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path></svg>
            ${project.forks ?? project.forks_count ?? 0}
        </span>
        <span class="repo-stat" title="Watchers">
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16"><path d="M1.5 8s2.5-5.5 6.5-5.5S14.5 8 14.5 8s-2.5 5.5-6.5 5.5S1.5 8 1.5 8Zm6.5 4a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"></path></svg>
            ${project.watchers ?? project.watchers_count ?? 0}
        </span>
        <span class="repo-stat" title="Size">
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16"><path d="M1.75 2h12.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 14.25 14H1.75A1.75 1.75 0 0 1 0 12.25v-8.5C0 2.784.784 2 1.75 2ZM1.5 12.251c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V5.809L8.38 9.397a.75.75 0 0 1-.76 0L1.5 5.809v6.442Zm13-8.181v-.32a.25.25 0 0 0-.25-.25H1.75a.25.25 0 0 0-.25.25v.32L8 7.88Z"></path></svg>
            ${(project.size ? (project.size / 1024).toFixed(2) : '0.00')} MB
        </span>
    `;

    // 底部信息
    const bottom = `
        ${project.language ? `
            <span class="repo-lang">
                <span class="language-dot" style="background-color: var(--color-${normalizeLangName(project.language)}, var(--color-default));"></span>
                ${project.language}
            </span>
        ` : ''}
        <span class="repo-license">
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16"><path d="M1.5 2.75A.75.75 0 0 1 2.25 2h11.5a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75H2.25a.75.75 0 0 1-.75-.75V2.75Zm1 .75v9.5h11V3.5H2.5Z"></path></svg>
            ${project.license?.spdx_id || 'MIT License'}
        </span>
        <span class="repo-updated">
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16"><path d="M1.643 3.143 L.427 1.927 A.25.25 0 0 0 0 2.104 V5.75 c0 .138.112.25.25.25 h3.646 a.25.25 0 0 0 .177-.427 L2.715 4.215 a6.5 6.5 0 1 1-1.18 4.458.75.75 0 1 0-1.493.154 A8.001 8.001 0 1 0 8 0a7.964 7.964 0 0 0-6.357 3.143 z"></path></svg>
            Updated ${project.updated_at ? timeAgo(new Date(project.updated_at)) : ''}
        </span>
    `;

    // Open issues
    const openIssues = `
        <span class="repo-issues" style="${project.open_issues === 0 ? 'color: var(--text-secondary);' : ''}">
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16"><path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path></svg>
            <span class="issues-count">${project.open_issues}</span> open issues
        </span>
    `;

    // Projects 标签
    const projectsTag = `<span class="repo-projects">Projects</span>`;

    // 创建时间
    const created = project.created_at ? new Date(project.created_at).toLocaleDateString() : '';

    return `
    <div class="repo-card" onclick="showProjectDetail('${project.name}')">
        <div class="repo-header-row">
            <a class="repo-title" href="${project.html_url || '#'}" target="_blank">${project.name}</a>
            <span class="repo-created">Created ${created}</span>
        </div>
        <div class="repo-description">${project.description || 'No description available'}</div>
        <div class="repo-tags">${tags}</div>
        <div class="repo-stats-row">${stats}</div>
        <div class="repo-bottom">${bottom}</div>
        <div class="repo-extra">
            ${openIssues}
            ${projectsTag}
        </div>
    </div>
    `;
}

// 辅助函数：时间友好显示（中文）
function timeAgo(date) {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return `${diff}秒前`;
    if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)}天前`;
    if (diff < 31536000) return `${Math.floor(diff / 2592000)}个月前`;
    return `${Math.floor(diff / 31536000)}年前`;
}

// 修改渲染正在进行项目的函数
function renderOngoingProject() {
    return `
        <div class="ongoing-project-title">
            <svg viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
                <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path>
            </svg>
            最新项目
        </div>
        <div class="pinned-project">
            <div class="repo-title">${ongoingProject.name}</div>
            <p class="repo-description">${ongoingProject.description}</p>
            <div class="progress-bar">
                <div class="progress" style="width: ${ongoingProject.progress}%"></div>
            </div>
            <div class="repo-meta">
                ${ongoingProject.language ? `
                    <div class="language-tag">
                        <span class="language-dot" style="background-color: var(--color-${normalizeLangName(ongoingProject.language)}, var(--color-default));"></span>
                        <span>${ongoingProject.language}</span>
                    </div>
                ` : ''}
            </div>
            <div class="repo-stats">
                <span class="repo-stat" title="Stars">
                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16">
                        <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path>
                    </svg>
                    ${ongoingProject.stars}
                </span>
                <span class="repo-stat" title="Forks">
                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16">
                        <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path>
                    </svg>
                    ${ongoingProject.forks}
                </span>
            </div>
        </div>
    `;
}

// 在现有代码中添加生成贡献数据的函数
function generateContributionData() {
    const data = [];
    const today = new Date();
    const totalDays = 365;

    for (let i = 0; i < totalDays; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (totalDays - i));
        
        // 随机生成贡献数量（0-4级）
        const level = Math.floor(Math.random() * 5);
        data.push({
            date: date,
            level: level,
            contributions: level === 0 ? 0 : Math.floor(Math.random() * 10) + level
        });
    }
    return data;
}

// 修改获取GitHub贡献数据的函数
async function fetchContributionData(year = new Date().getFullYear(), forceRefresh = false) {
    try {
        // 缓存键名
        const cacheKey = `contribution_data_${year}`;
        const cacheTimestampKey = `contribution_timestamp_${year}`;
        
        // 检查缓存是否有效（5分钟过期）
        const CACHE_DURATION = 5 * 60 * 1000; // 5分钟
        const now = Date.now();
        const cachedTimestamp = localStorage.getItem(cacheTimestampKey);
        const cachedData = localStorage.getItem(cacheKey);
        
        // 如果不是强制刷新且缓存有效，直接返回缓存数据
        if (!forceRefresh && cachedData && cachedTimestamp) {
            const cacheAge = now - parseInt(cachedTimestamp);
            if (cacheAge < CACHE_DURATION) {
                console.log(`使用缓存的贡献数据 (${year})`);
                const parsedData = JSON.parse(cachedData);
                // 恢复Date对象
                parsedData.contributionData = parsedData.contributionData.map(day => ({
                    ...day,
                    date: new Date(day.date)
                }));
                return parsedData;
            }
        }

        console.log(`正在获取最新的贡献数据 (${year})...`);
        
        const headers = {
            'Accept': 'application/vnd.github.v3+json'
        };
        
        if (GITHUB_TOKEN) {
            headers['Authorization'] = `token ${GITHUB_TOKEN}`;
        }

        // 获取指定年份的贡献数据
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31);
        
        // 使用分页方式获取更多事件
        let allEvents = [];
        let page = 1;
        let hasMorePages = true;
        const maxPages = 20; // 增加最大获取页数，确保获取足够的事件
        
        while (hasMorePages && page <= maxPages) {
            const response = await fetch(
                `https://api.github.com/users/${GITHUB_USERNAME}/events?per_page=100&page=${page}`, 
                { headers }
            );
            
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }
            
            const events = await response.json();
            
            if (events.length === 0) {
                hasMorePages = false;
            } else {
                allEvents = [...allEvents, ...events];
                
                // 检查最后一个事件的日期是否早于我们需要的年份
                const lastEventDate = new Date(events[events.length - 1].created_at);
                if (lastEventDate < startDate) {
                    hasMorePages = false;
                }
                
                page++;
            }
        }
        
        console.log(`获取到 ${allEvents.length} 个GitHub事件`);
        
        // 处理事件数据，按日期分组
        const contributionsByDate = {};
        const activitiesByMonth = {};

        allEvents.forEach(event => {
            const eventDate = new Date(event.created_at);
            if (eventDate >= startDate && eventDate <= endDate) {
                const dateStr = eventDate.toISOString().split('T')[0];
                const monthStr = eventDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
                
                // 初始化日期的贡献计数
                if (!contributionsByDate[dateStr]) {
                    contributionsByDate[dateStr] = 0;
                }

                // 初始化月份的活动数组
                if (!activitiesByMonth[monthStr]) {
                    activitiesByMonth[monthStr] = [];
                }

                // 处理不同类型的事件
                switch(event.type) {
                    case 'PushEvent':
                        const commitCount = event.payload.commits ? event.payload.commits.length : 0;
                        contributionsByDate[dateStr] += commitCount;
                        if (commitCount > 0) {
                            activitiesByMonth[monthStr].push({
                                type: 'commit',
                                repo: event.repo.name.split('/')[1],
                                count: commitCount,
                                description: `Created ${commitCount} commit${commitCount > 1 ? 's' : ''} in ${event.repo.name.split('/')[1]}`,
                                date: eventDate.toLocaleString('en-US', { month: 'short', day: 'numeric' })
                            });
                        }
                        break;
                    case 'CreateEvent':
                        contributionsByDate[dateStr] += 1;
                        if (event.payload.ref_type === 'repository') {
                            // 获取仓库的主要语言
                            const language = event.payload.description || 'Unknown';
                            activitiesByMonth[monthStr].push({
                                type: 'create',
                                repo: event.repo.name.split('/')[1],
                                language: language,
                                description: `Created repository ${event.repo.name.split('/')[1]}`,
                                date: eventDate.toLocaleString('en-US', { month: 'short', day: 'numeric' })
                            });
                        } else if (event.payload.ref_type === 'branch') {
                            activitiesByMonth[monthStr].push({
                                type: 'branch',
                                repo: event.repo.name.split('/')[1],
                                branch: event.payload.ref,
                                description: `Created branch ${event.payload.ref} in ${event.repo.name.split('/')[1]}`,
                                date: eventDate.toLocaleString('en-US', { month: 'short', day: 'numeric' })
                            });
                        }
                        break;
                    case 'IssuesEvent':
                        contributionsByDate[dateStr] += 1;
                        const issueAction = event.payload.action;
                        const issueTitleText = event.payload.issue?.title || 'issue';
                        activitiesByMonth[monthStr].push({
                            type: 'issue',
                            repo: event.repo.name.split('/')[1],
                            action: issueAction,
                            title: issueTitleText,
                            description: `${issueAction} issue "${issueTitleText}" in ${event.repo.name.split('/')[1]}`,
                            date: eventDate.toLocaleString('en-US', { month: 'short', day: 'numeric' })
                        });
                        break;
                    case 'PullRequestEvent':
                        contributionsByDate[dateStr] += 1;
                        const prAction = event.payload.action;
                        const prTitleText = event.payload.pull_request?.title || 'pull request';
                        activitiesByMonth[monthStr].push({
                            type: 'pr',
                            repo: event.repo.name.split('/')[1],
                            action: prAction,
                            title: prTitleText,
                            description: `${prAction} pull request "${prTitleText}" in ${event.repo.name.split('/')[1]}`,
                            date: eventDate.toLocaleString('en-US', { month: 'short', day: 'numeric' })
                        });
                        break;
                    case 'IssueCommentEvent':
                        contributionsByDate[dateStr] += 1;
                        const commentAction = event.payload.action;
                        const commentIssueTitle = event.payload.issue?.title || 'issue';
                        activitiesByMonth[monthStr].push({
                            type: 'comment',
                            repo: event.repo.name.split('/')[1],
                            action: commentAction,
                            title: commentIssueTitle,
                            description: `${commentAction} comment on issue "${commentIssueTitle}" in ${event.repo.name.split('/')[1]}`,
                            date: eventDate.toLocaleString('en-US', { month: 'short', day: 'numeric' })
                        });
                        break;
                    case 'PullRequestReviewEvent':
                        contributionsByDate[dateStr] += 1;
                        const reviewAction = event.payload.action;
                        const reviewPrTitle = event.payload.pull_request?.title || 'pull request';
                        activitiesByMonth[monthStr].push({
                            type: 'review',
                            repo: event.repo.name.split('/')[1],
                            action: reviewAction,
                            title: reviewPrTitle,
                            description: `${reviewAction} review on pull request "${reviewPrTitle}" in ${event.repo.name.split('/')[1]}`,
                            date: eventDate.toLocaleString('en-US', { month: 'short', day: 'numeric' })
                        });
                        break;
                    case 'WatchEvent':
                        contributionsByDate[dateStr] += 1;
                        activitiesByMonth[monthStr].push({
                            type: 'star',
                            repo: event.repo.name,
                            description: `Starred ${event.repo.name}`,
                            date: eventDate.toLocaleString('en-US', { month: 'short', day: 'numeric' })
                        });
                        break;
                    case 'ForkEvent':
                        contributionsByDate[dateStr] += 1;
                        const forkedRepo = event.repo.name;
                        const forkDescription = event.payload.forkee?.full_name ? 
                            `Forked ${event.repo.name} to ${event.payload.forkee.full_name}` : 
                            `Forked ${event.repo.name}`;
                        activitiesByMonth[monthStr].push({
                            type: 'fork',
                            repo: event.repo.name,
                            forkedTo: event.payload.forkee?.full_name || null,
                            description: forkDescription,
                            date: eventDate.toLocaleString('en-US', { month: 'short', day: 'numeric' })
                        });
                        break;
                    case 'DeleteEvent':
                        if (event.payload.ref_type === 'branch') {
                            contributionsByDate[dateStr] += 1;
                            activitiesByMonth[monthStr].push({
                                type: 'delete',
                                repo: event.repo.name.split('/')[1],
                                branch: event.payload.ref,
                                description: `Deleted branch ${event.payload.ref} in ${event.repo.name.split('/')[1]}`,
                                date: eventDate.toLocaleString('en-US', { month: 'short', day: 'numeric' })
                            });
                        }
                        break;
                    case 'ReleaseEvent':
                        contributionsByDate[dateStr] += 1;
                        const releaseName = event.payload.release?.name || event.payload.release?.tag_name || 'release';
                        activitiesByMonth[monthStr].push({
                            type: 'release',
                            repo: event.repo.name.split('/')[1],
                            release: releaseName,
                            description: `Created release ${releaseName} in ${event.repo.name.split('/')[1]}`,
                            date: eventDate.toLocaleString('en-US', { month: 'short', day: 'numeric' })
                        });
                        break;
                    case 'GollumEvent':
                        contributionsByDate[dateStr] += 1;
                        const pageName = event.payload.pages?.[0]?.title || 'wiki page';
                        const pageAction = event.payload.pages?.[0]?.action || 'updated';
                        activitiesByMonth[monthStr].push({
                            type: 'wiki',
                            repo: event.repo.name.split('/')[1],
                            page: pageName,
                            action: pageAction,
                            description: `${pageAction} wiki page "${pageName}" in ${event.repo.name.split('/')[1]}`,
                            date: eventDate.toLocaleString('en-US', { month: 'short', day: 'numeric' })
                        });
                        break;
                }
            }
        });

        // 生成指定年份的所有日期数据
        const data = [];
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            const contributions = contributionsByDate[dateStr] || 0;
            
            let level = 0;
            if (contributions > 0) {
                if (contributions <= 2) level = 1;
                else if (contributions <= 4) level = 2;
                else if (contributions <= 6) level = 3;
                else level = 4;
            }

            data.push({
                date: new Date(d),
                level: level,
                contributions: contributions
            });
        }

        // 准备返回的数据
        const result = {
            contributionData: data,
            activityData: activitiesByMonth
        };

        // 缓存数据
        localStorage.setItem(cacheKey, JSON.stringify(result));
        localStorage.setItem(cacheTimestampKey, now.toString());
        
        console.log(`贡献数据已缓存 (${year})`);
        return result;
    } catch (error) {
        console.error('Error fetching contribution data:', error);
        return {
            contributionData: [],
            activityData: {}
        };
    }
}

// 添加检查贡献数据更新的函数
async function checkContributionUpdates() {
    try {
        const currentYear = new Date().getFullYear();
        const cacheKey = `contribution_data_${currentYear}`;
        const cacheTimestampKey = `contribution_timestamp_${currentYear}`;
        
        // 获取缓存的时间戳
        const cachedTimestamp = localStorage.getItem(cacheTimestampKey);
        if (!cachedTimestamp) {
            return false; // 没有缓存，需要更新
        }
        
        // 检查缓存是否过期（1分钟检查一次）
        const CACHE_CHECK_INTERVAL = 1 * 60 * 1000; // 1分钟
        const now = Date.now();
        const cacheAge = now - parseInt(cachedTimestamp);
        
        if (cacheAge > CACHE_CHECK_INTERVAL) {
            // 获取最新的前几个事件来检查是否有新活动
            const headers = {
                'Accept': 'application/vnd.github.v3+json'
            };
            
            if (GITHUB_TOKEN) {
                headers['Authorization'] = `token ${GITHUB_TOKEN}`;
            }
            
            const response = await fetch(
                `https://api.github.com/users/${GITHUB_USERNAME}/events?per_page=5`, 
                { headers }
            );
            
            if (response.ok) {
                const events = await response.json();
                if (events.length > 0) {
                    const latestEventTime = new Date(events[0].created_at).getTime();
                    const cacheTime = parseInt(cachedTimestamp);
                    
                    // 如果最新事件时间晚于缓存时间，说明有新活动
                    if (latestEventTime > cacheTime) {
                        console.log('检测到新的GitHub活动，需要更新贡献数据');
                        console.log('最新活动类型:', events[0].type);
                        return true;
                    }
                }
            }
        }
        
        return false;
    } catch (error) {
        console.error('Error checking contribution updates:', error);
        return false;
    }
}

// 添加手动刷新贡献数据的函数
async function refreshContributionData() {
    try {
        const refreshButton = document.querySelector('.refresh-button');
        if (refreshButton) {
            // 添加加载状态
            refreshButton.classList.add('loading');
            refreshButton.disabled = true;
        }
        
        const currentYear = new Date().getFullYear();
        console.log('手动刷新贡献数据...');
        
        // 强制刷新当前年份的数据
        const { contributionData: data, activityData } = await fetchContributionData(currentYear, true);
        
        // 更新页面显示
        await updateContributionDisplay(data, activityData, currentYear);
        
        // 显示刷新成功提示
        showRefreshToast('贡献数据已更新');
        
    } catch (error) {
        console.error('Error refreshing contribution data:', error);
        showRefreshToast('更新失败，请稍后重试', 'error');
    } finally {
        // 移除加载状态
        const refreshButton = document.querySelector('.refresh-button');
        if (refreshButton) {
            refreshButton.classList.remove('loading');
            refreshButton.disabled = false;
        }
    }
}

// 添加更新贡献显示的辅助函数
async function updateContributionDisplay(data, activityData, year) {
    const content = document.querySelector('.contributions');
    if (!content) return;

    const totalContributions = data.reduce((sum, day) => sum + day.contributions, 0);

    // 更新标题
    const header = content.querySelector('.contribution-header h2');
    if (header) {
        header.textContent = `${totalContributions} contributions in ${year}`;
    }

    // 更新贡献网格
    const grid = content.querySelector('.contribution-grid');
    if (grid) {
        grid.innerHTML = data.map(day => {
            const date = day.date instanceof Date ? day.date : new Date(day.date);
            return `
            <div class="contribution-cell" 
                data-level="${day.level}"
                title="${date.toLocaleDateString()} - ${day.contributions} contributions">
            </div>
        `}).join('');
    }

    // 更新活动时间线
    const timeline = content.querySelector('.activity-timeline');
    if (timeline) {
        timeline.innerHTML = renderActivityTimeline(data, activityData);
    }
}

// 添加显示刷新提示的函数
function showRefreshToast(message, type = 'success') {
    // 移除现有的提示
    const existingToast = document.querySelector('.refresh-toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `refresh-toast ${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <svg class="toast-icon" viewBox="0 0 16 16" width="16" height="16">
                ${type === 'success' ? 
                    '<path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>' :
                    '<path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm3.82 1.636a.75.75 0 0 1 1.038.175l.007.009c.103.118.22.222.35.31.264.178.683.37 1.285.37.602 0 1.02-.192 1.285-.371.13-.088.247-.192.35-.31l.007-.008a.75.75 0 0 1 1.222.87l-.614-.431c.614.43.614.431.613.431v.001l-.001.002-.002.003-.005.007-.014.019a1.984 1.984 0 0 1-.184.213c-.16.166-.338.316-.53.445-.63.418-1.37.638-2.127.629-.946 0-1.652-.308-2.126-.63a3.32 3.32 0 0 1-.715-.657 2.248 2.248 0 0 1-.207-.23l-.01-.013-.004-.006-.002-.003v-.002h-.001l.613-.432-.614.43a.75.75 0 0 1 .183-1.044ZM12 6a.75.75 0 0 1-.75.75h-6.5a.75.75 0 0 1 0-1.5h6.5A.75.75 0 0 1 12 6Z"></path>'
                }
            </svg>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // 显示动画
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // 自动隐藏
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// 修改渲染活动时间线的函数，添加 activities 参数
function renderActivityTimeline(data, activities = null) {
    // 如果没有提供活动数据，使用默认的示例数据
    const effectiveActivities = activities || {
        'March 2025': [
            {
                type: 'commit',
                repo: 'WordPress-LivePhotos',
                count: 2,
                description: 'Created 2 commits in 1 repository'
            },
            {
                type: 'create',
                repo: 'WordPress-LivePhotos',
                language: 'JavaScript',
                description: 'Created 1 repository',
                date: 'Mar 23'
            }
        ]
    };

    let timelineHtml = '';
    let totalActivityItems = 0; // This variable tracks the total count of actual activity items for 'Show more' button logic.
    let visibleActivityItems = 0; // 跟踪可见的活动项数量

    // 设置初始显示的活动数量
    const initialVisibleCount = 5;

    // Sort months in descending order (most recent first) for display
    const sortedMonths = Object.keys(effectiveActivities).sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateB - dateA;
    });

    // 创建一个平面化的活动列表，用于计算前5个活动
    let allActivities = [];
    sortedMonths.forEach(month => {
        effectiveActivities[month].forEach(activity => {
            allActivities.push({
                month,
                activity
            });
        });
    });

    sortedMonths.forEach(month => {
        const monthActivities = effectiveActivities[month];
        
        let monthContentHtml = '';
        let hideMonthClass = ''; // Class to hide month if it's beyond the first few activities

        if (monthActivities.length === 0) {
            // If no activities for this specific month, display the "no activity" message
            monthContentHtml = `
                <div class="activity-item">
                    <div class="activity-icon">
                        <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-dash">
                            <path d="M2.75 7.75h10.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5Z"></path>
                        </svg>
                    </div>
                    <div class="activity-content">
                        <div class="activity-header">
                            ${GITHUB_USERNAME} has no activity yet for this period.
                        </div>
                    </div>
                </div>
            `;
            // Do not increment totalActivityItems for this placeholder
        } else {
            // Generate HTML for all activities in this month
            monthContentHtml = monthActivities.map(activity => {
                // Increment totalActivityItems for each actual activity item
                totalActivityItems++;
                
                // 确定这个活动是否应该被隐藏
                const shouldBeVisible = visibleActivityItems < initialVisibleCount;
                if (shouldBeVisible) {
                    visibleActivityItems++;
                }
                
                const activityItemClass = shouldBeVisible ? '' : 'hidden-activity-item';

                // 根据不同的活动类型返回不同的HTML
                let activityHtml = '';
                switch(activity.type) {
                    case 'commit':
                        activityHtml = `
                            <div class="activity-item ${activityItemClass}">
                                <div class="activity-icon">
                                    <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                                        <path d="M11.93 8.5a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5Zm-1.43-.75a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z"></path>
                                    </svg>
                                </div>
                                <div class="activity-content">
                                    <div class="activity-header">
                                        ${activity.description}
                                    </div>
                                    <div class="activity-details">
                                        <a href="https://github.com/${GITHUB_USERNAME}/${activity.repo}" target="_blank" class="repo-link">
                                            ${activity.repo}
                                        </a>
                                        <span class="activity-date">${activity.date}</span>
                                    </div>
                                </div>
                            </div>
                        `;
                        break;
                    case 'create':
                        activityHtml = `
                            <div class="activity-item ${activityItemClass}">
                                <div class="activity-icon">
                                    <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                                        <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path>
                                    </svg>
                                </div>
                                <div class="activity-content">
                                    <div class="activity-header">
                                        ${activity.description}
                                    </div>
                                    <div class="activity-details">
                                        <a href="https://github.com/${GITHUB_USERNAME}/${activity.repo}" target="_blank" class="repo-link">
                                            ${GITHUB_USERNAME}/${activity.repo}
                                        </a>
                                        <span class="language-tag">
                                            <span class="language-dot" style="background-color: var(--color-${normalizeLangName(activity.language)}, var(--color-default));"></span>
                                            ${activity.language}
                                        </span>
                                        <span class="activity-date">${activity.date}</span>
                                    </div>
                                </div>
                            </div>
                        `;
                        break;
                    case 'issue':
                        activityHtml = `
                            <div class="activity-item ${activityItemClass}">
                                <div class="activity-icon">
                                    <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                                        <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path>
                                    </svg>
                                </div>
                                <div class="activity-content">
                                    <div class="activity-header">
                                        ${activity.description}
                                    </div>
                                    <div class="activity-details">
                                        <a href="https://github.com/${GITHUB_USERNAME}/${activity.repo}" target="_blank" class="repo-link">
                                            ${activity.repo}
                                        </a>
                                        <span class="activity-date">${activity.date}</span>
                                    </div>
                                </div>
                            </div>
                        `;
                        break;
                    case 'pr':
                        activityHtml = `
                            <div class="activity-item ${activityItemClass}">
                                <div class="activity-icon">
                                    <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                                        <path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z"></path>
                                    </svg>
                                </div>
                                <div class="activity-content">
                                    <div class="activity-header">
                                        ${activity.description}
                                    </div>
                                    <div class="activity-details">
                                        <a href="https://github.com/${GITHUB_USERNAME}/${activity.repo}" target="_blank" class="repo-link">
                                            ${activity.repo}
                                        </a>
                                        <span class="activity-date">${activity.date}</span>
                                    </div>
                                </div>
                            </div>
                        `;
                        break;
                    case 'comment':
                        activityHtml = `
                            <div class="activity-item ${activityItemClass}">
                                <div class="activity-icon">
                                    <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                                        <path d="M1 2.75C1 1.784 1.784 1 2.75 1h10.5c.966 0 1.75.784 1.75 1.75v7.5A1.75 1.75 0 0 1 13.25 12H9.06l-2.573 2.573A1.458 1.458 0 0 1 4 13.543V12H2.75A1.75 1.75 0 0 1 1 10.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h4.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
                                    </svg>
                                </div>
                                <div class="activity-content">
                                    <div class="activity-header">
                                        ${activity.description}
                                    </div>
                                    <div class="activity-details">
                                        <a href="https://github.com/${GITHUB_USERNAME}/${activity.repo}" target="_blank" class="repo-link">
                                            ${activity.repo}
                                        </a>
                                        <span class="activity-date">${activity.date}</span>
                                    </div>
                                </div>
                            </div>
                        `;
                        break;
                    case 'review':
                        activityHtml = `
                            <div class="activity-item ${activityItemClass}">
                                <div class="activity-icon">
                                    <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                                        <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm4.936-2.41 4.189 3.348a.75.75 0 0 1 0 1.124l-4.19 3.348a.75.75 0 0 1-1.186-.61V6.2a.75.75 0 0 1 1.186-.61Z"></path>
                                    </svg>
                                </div>
                                <div class="activity-content">
                                    <div class="activity-header">
                                        ${activity.description}
                                    </div>
                                    <div class="activity-details">
                                        <a href="https://github.com/${GITHUB_USERNAME}/${activity.repo}" target="_blank" class="repo-link">
                                            ${activity.repo}
                                        </a>
                                        <span class="activity-date">${activity.date}</span>
                                    </div>
                                </div>
                            </div>
                        `;
                        break;
                    case 'star':
                        activityHtml = `
                            <div class="activity-item ${activityItemClass}">
                                <div class="activity-icon">
                                    <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                                        <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path>
                                    </svg>
                                </div>
                                <div class="activity-content">
                                    <div class="activity-header">
                                        ${activity.description}
                                    </div>
                                    <div class="activity-details">
                                        <a href="https://github.com/${activity.repo}" target="_blank" class="repo-link">
                                            ${activity.repo}
                                        </a>
                                        <span class="activity-date">${activity.date}</span>
                                    </div>
                                </div>
                            </div>
                        `;
                        break;
                    case 'fork':
                        activityHtml = `
                            <div class="activity-item ${activityItemClass}">
                                <div class="activity-icon">
                                    <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                                        <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path>
                                    </svg>
                                </div>
                                <div class="activity-content">
                                    <div class="activity-header">
                                        ${activity.description}
                                    </div>
                                    <div class="activity-details">
                                        <a href="https://github.com/${activity.repo}" target="_blank" class="repo-link">
                                            ${activity.repo}
                                        </a>
                                        ${activity.forkedTo ? `
                                            <span class="fork-arrow">→</span>
                                            <a href="https://github.com/${activity.forkedTo}" target="_blank" class="repo-link">
                                                ${activity.forkedTo}
                                            </a>
                                        ` : ''}
                                        <span class="activity-date">${activity.date}</span>
                                    </div>
                                </div>
                            </div>
                        `;
                        break;
                    case 'branch':
                        activityHtml = `
                            <div class="activity-item ${activityItemClass}">
                                <div class="activity-icon">
                                    <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                                        <path d="M3.75 1.5a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5H3.75Zm6.75.75V4.25c0 .138.112.25.25.25H12.5v7h-9V2.25h6.5V2.25ZM5 3.25a.75.75 0 0 1 .75-.75h3.5a.75.75 0 0 1 0 1.5h-3.5a.75.75 0 0 1-.75-.75Zm0 2.5a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Zm0 2.5a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Z"></path>
                                    </svg>
                                </div>
                                <div class="activity-content">
                                    <div class="activity-header">
                                        ${activity.description}
                                    </div>
                                    <div class="activity-details">
                                        <a href="https://github.com/${GITHUB_USERNAME}/${activity.repo}" target="_blank" class="repo-link">
                                            ${activity.repo}
                                        </a>
                                        <span class="activity-date">${activity.date}</span>
                                    </div>
                                </div>
                            </div>
                        `;
                        break;
                    case 'delete':
                        activityHtml = `
                            <div class="activity-item ${activityItemClass}">
                                <div class="activity-icon">
                                    <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                                        <path d="M11 1.75V3h2.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75ZM4.496 6.675l.66 6.6a.75.75 0 0 0 1.493.154l.825-4.25a.75.75 0 0 1 1.494.154l.825 4.25a.75.75 0 0 0 1.493-.154l.66-6.6a.75.75 0 0 1 1.494.154l.66 6.6A2.25 2.25 0 0 1 13.174 15H2.826a2.25 2.25 0 0 1-2.065-2.171l-.66-6.6a.75.75 0 0 1 1.494-.154ZM6 1.75V3h4V1.75a.25.25 0 0 0-.25-.25h-3.5a.25.25 0 0 0-.25.25Z"></path>
                                    </svg>
                                </div>
                                <div class="activity-content">
                                    <div class="activity-header">
                                        ${activity.description}
                                    </div>
                                    <div class="activity-details">
                                        <a href="https://github.com/${GITHUB_USERNAME}/${activity.repo}" target="_blank" class="repo-link">
                                            ${activity.repo}
                                        </a>
                                        <span class="activity-date">${activity.date}</span>
                                    </div>
                                </div>
                            </div>
                        `;
                        break;
                    case 'release':
                        activityHtml = `
                            <div class="activity-item ${activityItemClass}">
                                <div class="activity-icon">
                                    <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                                        <path d="M8.177.677l2.896 2.896a.25.25 0 0 1 0 .354L8.177 6.823l-2.896-2.896a.25.25 0 0 1 0-.354l2.896-2.896zM1.25 7.5l2.896 2.896a.25.25 0 0 1 0 .354L1.25 13.677l-2.896-2.896a.25.25 0 0 1 0-.354L1.25 7.5zM14.75 7.5l2.896 2.896a.25.25 0 0 1 0 .354L14.75 13.677l-2.896-2.896a.25.25 0 0 1 0-.354L14.75 7.5z"></path>
                                    </svg>
                                </div>
                                <div class="activity-content">
                                    <div class="activity-header">
                                        ${activity.description}
                                    </div>
                                    <div class="activity-details">
                                        <a href="https://github.com/${GITHUB_USERNAME}/${activity.repo}" target="_blank" class="repo-link">
                                            ${activity.repo}
                                        </a>
                                        <span class="activity-date">${activity.date}</span>
                                    </div>
                                </div>
                            </div>
                        `;
                        break;
                    case 'wiki':
                        activityHtml = `
                            <div class="activity-item ${activityItemClass}">
                                <div class="activity-icon">
                                    <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                                        <path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25Zm7.47 3.97a.75.75 0 0 1 1.06 0l2 2a.75.75 0 0 1 0 1.06l-2 2a.75.75 0 1 1-1.06-1.06l1.47-1.47H6.75a.75.75 0 0 1 0-1.5h3.69L9.22 6.28a.75.75 0 0 1 0-1.06Z"></path>
                                    </svg>
                                </div>
                                <div class="activity-content">
                                    <div class="activity-header">
                                        ${activity.description}
                                    </div>
                                    <div class="activity-details">
                                        <a href="https://github.com/${GITHUB_USERNAME}/${activity.repo}" target="_blank" class="repo-link">
                                            ${activity.repo}
                                        </a>
                                        <span class="activity-date">${activity.date}</span>
                                    </div>
                                </div>
                            </div>
                        `;
                        break;
                    default: // Handle other event types not explicitly covered
                        activityHtml = `
                            <div class="activity-item ${activityItemClass}">
                                <div class="activity-icon">
                                    <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                                        <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path>
                                    </svg>
                                </div>
                                <div class="activity-content">
                                    <div class="activity-header">
                                        ${activity.description || 'GitHub Activity'}
                                    </div>
                                    <div class="activity-details">
                                        <a href="https://github.com/${GITHUB_USERNAME}/" target="_blank" class="repo-link">
                                            ${GITHUB_USERNAME}
                                        </a>
                                        <span class="activity-date">${activity.date || ''}</span>
                                    </div>
                                </div>
                            </div>
                        `;
                }
                
                return activityHtml;
            }).join('');
        }

        // Append the month container with its content
        timelineHtml += `
            <div class="activity-month">
                <div class="activity-month-header">
                    <h3>${month}</h3>
                </div>
                ${monthContentHtml}
            </div>
        `;
    });

    // Handle the case where there are absolutely no activities for any month in effectiveActivities.
    // This block should only execute if `sortedMonths` is empty.
    if (sortedMonths.length === 0) {
        timelineHtml = `
            <div class="activity-month">
                <div class="activity-month-header">
                    <h3>No activity</h3>
                </div>
                <div class="activity-item">
                    <div class="activity-icon">
                        <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-dash">
                            <path d="M2.75 7.75h10.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5Z"></path>
                        </svg>
                    </div>
                    <div class="activity-content">
                        <div class="activity-header">
                            This user doesn't have any public activity yet.
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // The show more button logic should check against the total number of actual activity items
    if (totalActivityItems > initialVisibleCount) {
        timelineHtml += `
            <div class="show-more">
                <button class="show-more-button" onclick="toggleActivity(event)">
                    Show more activity
                    <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                        <path d="M12.78 5.22a.749.749 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.06 0L3.22 6.28a.749.749 0 1 1 1.06-1.06L8 8.939l3.72-3.719a.749.749 0 0 1 1.06 0Z"></path>
                    </svg>
                </button>
            </div>
        `;
    }

    return timelineHtml;
}

// 修改渲染贡献图的函数
async function renderContributionGraph() {
    const { contributionData: data, activityData } = await fetchContributionData();
    const currentYear = new Date().getFullYear();
    const totalContributions = data.reduce((sum, day) => sum + day.contributions, 0);
    
    return `
        <div class="contributions">
            <div class="contribution-header">
                <div class="contribution-title-group">
                    <h2>${totalContributions} contributions in ${currentYear}</h2>
                    <div class="contribution-controls">
                        <div class="year-select-container">
                            <select class="year-select" onchange="updateContributionYear(this.value)">
                                <option value="2025" selected>2025</option>
                                <option value="2024">2024</option>
                                <option value="2023">2023</option>
                            </select>
                        </div>
                        <button class="refresh-button" onclick="refreshContributionData()" title="刷新贡献数据">
                            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                                <path d="M8 3a5 5 0 0 0-5 5H1l3.5 3.5L8 8H6a2 2 0 1 1 2 2v2a4 4 0 1 0-4-4H2a6 6 0 1 1 6 6v-2a4 4 0 0 0 0-8Z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="contribution-calendar">
                <div class="contribution-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(10px, 1fr)); grid-template-rows: repeat(7, 1fr); gap: 2px; overflow: hidden;">
                    ${data.map(day => {
                        const date = day.date instanceof Date ? day.date : new Date(day.date);
                        return `
                        <div class="contribution-cell" 
                            data-level="${day.level}"
                            title="${date.toLocaleDateString()} - ${day.contributions} contributions">
                        </div>
                    `}).join('')}
                </div>
                <div class="contribution-legend">
                    <span>Less</span>
                    ${[0, 1, 2, 3, 4].map(level => 
                        `<div class="legend-item" data-level="${level}"></div>`).join('')}
                    <span>More</span>
                </div>

                <div class="code-review-chart">
                    <div class="code-review-line vertical"></div>
                    <div class="code-review-line horizontal"></div>
                    <div class="code-review-marker" style="left: 25%; top: 50%"></div>
                    <div class="code-review-marker" style="left: 50%; top: 25%"></div>
                    <div class="code-review-marker" style="left: 75%; top: 50%"></div>
                    <div class="code-review-marker" style="left: 50%; top: 75%"></div>
                    <div class="code-review-label top">Code review</div>
                    <div class="code-review-label bottom">Pull requests</div>
                    <div class="code-review-percentage commits">67% Commits</div>
                    <div class="code-review-percentage issues">33% Issues</div>
                </div>
            </div>
            
            <div class="activity-timeline">
                ${renderActivityTimeline(data, activityData)}
            </div>
        </div>
    `;
}

// 修改更新年份的函数
async function updateContributionYear(year, forceRefresh = false) {
    try {
        const content = document.querySelector('.contributions');
        if (!content) return;

        // 更新年份选择器的值
        const yearSelect = document.querySelector('.year-select');
        if (yearSelect) {
            yearSelect.value = year;
        }

        // 重新获取并渲染贡献数据
        const { contributionData: data, activityData } = await fetchContributionData(year, forceRefresh);
        const totalContributions = data.reduce((sum, day) => sum + day.contributions, 0);

        // 更新标题
        const header = content.querySelector('.contribution-header h2');
        if (header) {
            header.textContent = `${totalContributions} contributions in ${year}`;
        }

        // 更新贡献网格
        const grid = content.querySelector('.contribution-grid');
        if (grid) {
            grid.innerHTML = data.map(day => {
                const date = day.date instanceof Date ? day.date : new Date(day.date);
                return `
                <div class="contribution-cell" 
                    data-level="${day.level}"
                    title="${date.toLocaleDateString()} - ${day.contributions} contributions">
                </div>
            `}).join('');
        }

        // 更新活动时间线
        const timeline = content.querySelector('.activity-timeline');
        if (timeline) {
            timeline.innerHTML = renderActivityTimeline(data, activityData);
        }
    } catch (error) {
        console.error('Error updating contribution year:', error);
    }
}

// 修改渲染概览页面的函数
async function renderOverview() {
    const content = document.querySelector('.content-area');
    
    // 显示骨架屏
    showSkeletonLoading();
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
        // 获取最新的 GitHub 数据
        const repoDetails = await fetchGitHubData();
        
        // 获取贡献图数据
        const contributionGraph = await renderContributionGraph();
        
        // 获取最新的非 fork 仓库
        const mostRecentRepo = repoDetails.find(repo => !repo.is_fork);
        
        // 获取所有使用的编程语言
        const allLanguages = new Set();
        repoDetails.forEach(repo => {
            if (repo.language) allLanguages.add(repo.language);
            if (repo.tags) repo.tags.forEach(tag => allLanguages.add(tag));
        });
        ['Python', 'TypeScript', 'Vue', 'React', 'Node.js', 'Dart', 'Rust', 'C++', 'C#'].forEach(lang => allLanguages.add(lang));
        content.innerHTML = `
            ${mostRecentRepo ? `
                <div class="ongoing-project-title">
                    <svg viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
                        <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
                        <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path>
                    </svg>
                    最新项目
                </div>
                <div class="pinned-project">
                    ${renderProjectCard(mostRecentRepo)}
                </div>
            ` : ''}
            ${contributionGraph}
            <div class="skills-card">
                <h2 class="skills-title">Tech stack</h2>
                <div class="skills-container">
                    ${Array.from(allLanguages).map(skill => `
                        <div class="language-tag">
                            <span class="language-dot" style="background-color: var(--color-${normalizeLangName(skill)}, var(--color-default));"></span>
                            <span>${skill}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="recent-projects">
                ${repoDetails.slice(0, 2).map(renderProjectCard).join('')}
            </div>
        `;
    } catch (error) {
        console.error('Error rendering overview:', error);
        content.innerHTML = `
            <div class="error-message">
                <h3>概览加载时错误</h3>
                <p>请稍后再试</p>
            </div>
        `;
    } finally {
        await hideSkeletonLoading();
        initLightbox(); // 重新初始化灯箱
    }
}

// 修改渲染项目库页面的函数
async function renderProjects() {
    const content = document.querySelector('.content-area');
    
    try {
        // 显示骨架屏
        showSkeletonLoading();
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // 获取最新的 GitHub 数据
        const repoDetails = await fetchGitHubData();
        
        // 渲染所有项目
        content.innerHTML = repoDetails.map(repo => renderProjectCard(repo)).join('');
    } catch (error) {
        console.error('Error rendering projects:', error);
        content.innerHTML = `
            <div class="error-message">
                <h3>加载项目时出错</h3>
                <p>请稍后再试</p>
            </div>
        `;
    } finally {
        await hideSkeletonLoading();
        initLightbox(); // 重新初始化灯箱
    }
}

// 修改微信二维码弹窗功能
function showWechat(event) {
    event.preventDefault();
    showQRCode('微信', '#', '扫码添加微信');
}

// 添加 QQ 二维码弹窗功能
function showQQ(event) {
    event.preventDefault();
    showQRCode('QQ', '#', '扫码添加QQ');
}

// 通用的二维码弹窗显示函数
function showQRCode(title, qrCodeUrl, description) {
    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    
    // 创建弹窗
    const popup = document.createElement('div');
    popup.className = 'wechat-popup';
    popup.innerHTML = `
        <img src="${qrCodeUrl}" alt="${title}二维码">
        <p>${description}</p>
    `;
    
    // 添加到页面
    document.body.appendChild(overlay);
    document.body.appendChild(popup);
    
    // 显示弹窗
    setTimeout(() => {
        popup.classList.add('show');
    }, 10);
    
    // 点击遮罩层关闭弹窗
    const closePopup = () => {
        popup.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(overlay);
            document.body.removeChild(popup);
        }, 300);
    };
    
    overlay.addEventListener('click', closePopup);
}

// 获取用户 Stars 的仓库
async function fetchStarredRepos() {
    try {
        const headers = {
            'Accept': 'application/vnd.github.v3+json'
        };
        
        if (GITHUB_TOKEN) {
            headers['Authorization'] = `token ${GITHUB_TOKEN}`;
        }

        const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/starred`, {
            headers: headers
        });
        
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const starredRepos = await response.json();

        // 获取每个仓库的详细信息
        const repoDetails = await Promise.all(starredRepos.map(async (repo) => {
            const languagesResponse = await fetch(repo.languages_url, {
                headers: headers
            });
            const languages = await languagesResponse.json();
            
            return {
                name: repo.name,
                full_name: repo.full_name,
                owner: {
                    login: repo.owner.login,
                    avatar_url: repo.owner.avatar_url
                },
                description: repo.description || '',
                language: repo.language,
                languages_url: repo.languages_url,
                languages: languages,
                html_url: repo.html_url,
                stargazers_count: repo.stargazers_count,
                forks_count: repo.forks_count,
                open_issues_count: repo.open_issues_count,
                created_at: repo.created_at,
                updated_at: repo.updated_at
            };
        }));

        return repoDetails;
    } catch (error) {
        console.error('Error fetching starred repos:', error);
        return [];
    }
}

// 修改渲染 Stars 页面的函数
async function renderStars() {
    const content = document.querySelector('.content-area');
    
    // 显示加载中
    showSkeletonLoading();
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
        const starredRepos = await fetchStarredRepos();
        
        if (starredRepos.length === 0) {
            content.innerHTML = `
                <div class="blankslate">
                    <h3>没有加星标的仓库</h3>
                    <p>星标是跟踪您感兴趣的仓库的一种方式</p>
                </div>
            `;
            return;
        }

        // 只取最新的10个项目
        const latestRepos = starredRepos.slice(0, 10);

        const reposHtml = latestRepos.map(repo => {
            // 标签处理
            const tags = (repo.language ? [repo.language] : []).map(tag => {
                let className = 'language-' + tag.replace(/\+/g, 'pp').replace(/#/g, 'Sharp').replace(/\s+/g, '').replace(/\./g, '').replace(/-/g, '');
                return `<span class="repo-tag ${className}">${tag}</span>`;
            }).join('');

            // 统计信息
            const stats = `
                <span class="repo-stat" title="Stars">
                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path></svg>
                    ${repo.stargazers_count}
                </span>
                <span class="repo-stat" title="Forks">
                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path></svg>
                    ${repo.forks_count}
                </span>
                <span class="repo-stat" title="Watchers">
                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16"><path d="M1.5 8s2.5-5.5 6.5-5.5S14.5 8 14.5 8s-2.5 5.5-6.5 5.5S1.5 8 1.5 8Zm6.5 4a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"></path></svg>
                    ${repo.watchers_count || 0}
                </span>
            `;

            // 底部信息
            const bottom = `
                ${repo.language ? `
                    <span class="repo-lang">
                        <span class="language-dot" style="background-color: var(--color-${normalizeLangName(repo.language)}, var(--color-default));"></span>
                        ${repo.language}
                    </span>
                ` : ''}
                <span class="repo-license">
                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16"><path d="M1.5 2.75A.75.75 0 0 1 2.25 2h11.5a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75H2.25a.75.75 0 0 1-.75-.75V2.75Zm1 .75v9.5h11V3.5H2.5Z"></path></svg>
                    ${repo.license?.spdx_id || 'MIT License'}
                </span>
                <span class="repo-updated">
                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16"><path d="M1.643 3.143 L.427 1.927 A.25.25 0 0 0 0 2.104 V5.75 c0 .138.112.25.25.25 h3.646 a.25.25 0 0 0 .177-.427 L2.715 4.215 a6.5 6.5 0 1 1-1.18 4.458.75.75 0 1 0-1.493.154 A8.001 8.001 0 1 0 8 0a7.964 7.964 0 0 0-6.357 3.143 z"></path></svg>
                    Updated ${timeAgo(new Date(repo.updated_at))}
                </span>
            `;

            // Open issues
            const openIssues = `
                <span class="repo-issues" style="${repo.open_issues_count === 0 ? 'color: var(--text-secondary);' : ''}">
                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16"><path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path></svg>
                    <span class="issues-count">${repo.open_issues_count}</span> open issues
                </span>
            `;

            // 创建时间
            const created = new Date(repo.created_at).toLocaleDateString();

            return `
            <div class="repo-card" onclick="showProjectDetail('${repo.full_name}')">
                <div class="repo-header-row">
                    <a class="repo-title" href="${repo.html_url}" target="_blank">${repo.full_name}</a>
                    <span class="repo-created">Created ${created}</span>
                </div>
                <div class="repo-description">${repo.description || 'No description available'}</div>
                <div class="repo-tags">${tags}</div>
                <div class="repo-stats-row">${stats}</div>
                <div class="repo-bottom">${bottom}</div>
                <div class="repo-extra">
                    ${openIssues}
                </div>
            </div>
            `;
        }).join('');

        content.innerHTML = reposHtml;
    } catch (error) {
        console.error('Error rendering stars:', error);
        content.innerHTML = `
            <div class="error-message">
                <h3>加载已加星标的存储库时出错</h3>
                <p>请稍后再试</p>
            </div>
        `;
    } finally {
        // 隐藏加载中
        await hideSkeletonLoading();
        initLightbox(); // 重新初始化灯箱
    }
}

// 添加获取项目详情的函数
async function fetchProjectDetail(projectName) {
    try {
        const headers = {
            'Accept': 'application/vnd.github.v3+json'
        };
        
        if (GITHUB_TOKEN) {
            headers['Authorization'] = `token ${GITHUB_TOKEN}`;
        }

        // 如果 projectName 包含 '/'，说明是完整的仓库名称
        const [owner, repo] = projectName.includes('/') ? projectName.split('/') : [GITHUB_USERNAME, projectName];
        
        // 验证仓库名称，避免特殊字符导致的API错误
        const cleanOwner = owner.replace(/[^a-zA-Z0-9._-]/g, '');
        const cleanRepo = repo.replace(/[^a-zA-Z0-9._-]/g, '');
        
        if (!cleanOwner || !cleanRepo) {
            throw new Error(`无效的仓库名称: ${owner}/${repo}`);
        }

        // 获取仓库详细信息
        const repoResponse = await fetch(`${GITHUB_API_BASE}/repos/${cleanOwner}/${cleanRepo}`, { headers });
        if (!repoResponse.ok) {
            throw new Error(`Failed to fetch repository: ${repoResponse.status}`);
        }
        const repoData = await repoResponse.json();

        // 获取语言统计
        const languagesResponse = await fetch(repoData.languages_url, { headers });
        const languages = await languagesResponse.json();

        // 获取最近的提交
        let commits = [];
        try {
            const commitsResponse = await fetch(`${GITHUB_API_BASE}/repos/${cleanOwner}/${cleanRepo}/commits?per_page=5`, { headers });
            if (commitsResponse.ok) {
                commits = await commitsResponse.json();
            } else {
                console.warn(`无法获取仓库 ${cleanOwner}/${cleanRepo} 的提交信息: ${commitsResponse.status}`);
            }
        } catch (commitError) {
            console.warn(`获取仓库 ${cleanOwner}/${cleanRepo} 提交信息时出错:`, commitError);
        }

        // 获取README内容
        let readme = null;
        try {
            const readmeResponse = await fetch(`${GITHUB_API_BASE}/repos/${cleanOwner}/${cleanRepo}/readme`, { headers });
            if (readmeResponse.ok) {
                const readmeData = await readmeResponse.json();
                // 使用 decodeURIComponent 和 escape 来正确处理中文内容
                readme = decodeURIComponent(escape(atob(readmeData.content)));
            }
        } catch (error) {
            console.log('No README found');
        }

        return {
            ...repoData,
            languages,
            commits,
            readme
        };
    } catch (error) {
        console.error('Error fetching project detail:', error);
        return null;
    }
}

// 添加显示项目详情的函数
async function showProjectDetail(projectName) {
    // 立即创建并显示模态框和骨架屏
    const modal = document.createElement('div');
    modal.className = 'project-modal';
    modal.innerHTML = `
        <div class="project-modal-header">
            <div class="project-modal-title">
                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16">
                    <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path>
                </svg>
                <span class="repo-link">${GITHUB_USERNAME} / ${projectName}</span>
            </div>
            <div class="project-modal-actions">
                <button class="project-modal-close" onclick="closeProjectModal()">
                    <svg width="24" height="24" viewBox="0 0 24 24">
                        <path d="M5.293 5.293a1 1 0 0 1 1.414 0L12 10.586l5.293-5.293a1 1 0 1 1 1.414 1.414L13.414 12l5.293 5.293a1 1 0 0 1-1.414 1.414L12 13.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L10.586 12 5.293 6.707a1 1 0 0 1 0-1.414z"/>
                    </svg>
                </button>
            </div>
        </div>
        <div class="project-modal-body">
            <div class="skeleton-wrapper">
                <div class="skeleton-card skeleton"></div>
                <div class="skeleton-title skeleton"></div>
                <div class="skeleton-text skeleton"></div>
                <div class="skeleton-text skeleton"></div>
                <div class="skeleton-text skeleton"></div>
                <div class="skeleton-text skeleton"></div>
            </div>
        </div>
    `;

    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.addEventListener('click', closeProjectModal);

    // 添加到页面
    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    // 显示模态框
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);

    try {
        // 获取项目数据
        const projectData = await fetchProjectDetail(projectName);
        if (!projectData) {
            throw new Error('Failed to fetch project details');
        }

        // 计算语言百分比
        const totalBytes = Object.values(projectData.languages).reduce((a, b) => a + b, 0);
        const languagesWithPercentage = Object.entries(projectData.languages)
            .map(([name, bytes]) => ({
                name,
                bytes,
                percentage: (bytes / totalBytes) * 100
            }))
            .sort((a, b) => b.percentage - a.percentage)
            .map(lang => ({
                ...lang,
                percentage: lang.percentage.toFixed(1)
            }));

        // 辅助函数：规范化语言名称为CSS变量名
        function normalizeLangName(name) {
            if (!name) return 'default';
            return name.toLowerCase()
                .replace(/\+/g, 'p')
                .replace(/#/g, 'sharp')
                .replace(/\./g, 'dot')
                .replace(/-/g, '')
                .replace(/\s+/g, '');
        }

        // 创建语言条形图
        const languageBar = languagesWithPercentage
            .filter(lang => parseFloat(lang.percentage) >= 0.1)
            .map(lang => {
                const langNameLower = normalizeLangName(lang.name);
                return `
                <div class="language-bar-item" 
                    style="width: ${lang.percentage}%; background-color: var(--color-${langNameLower}, var(--color-default));" 
                    title="${lang.name} ${lang.percentage}%">
                </div>
            `;
            }).join('');

        // 更新模态框内容
        modal.innerHTML = `
            <div class="project-modal-header">
                <div class="project-modal-title">
                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16">
                        <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path>
                    </svg>
                    <a href="${projectData.html_url}" target="_blank" class="repo-link">
                        ${GITHUB_USERNAME} / ${projectData.name}
                    </a>
                </div>
                <div class="project-modal-actions">
                    <a href="${projectData.html_url}" target="_blank" class="github-button">
                        <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16">
                            <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
                        </svg>
                        View on GitHub
                    </a>
                    <button class="project-modal-close" onclick="closeProjectModal()">
                        <svg width="24" height="24" viewBox="0 0 24 24">
                            <path d="M5.293 5.293a1 1 0 0 1 1.414 0L12 10.586l5.293-5.293a1 1 0 1 1 1.414 1.414L13.414 12l5.293 5.293a1 1 0 0 1-1.414 1.414L12 13.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L10.586 12 5.293 6.707a1 1 0 0 1 0-1.414z"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="project-modal-body">
                <div class="project-info-section">
                    <p class="project-description">${projectData.description || '暂无描述'}</p>
                    
                    <div class="project-meta">
                        <div class="project-meta-item">
                            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16">
                                <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path>
                            </svg>
                            ${projectData.stargazers_count} stars
                        </div>
                        <div class="project-meta-item">
                            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16">
                                <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path>
                            </svg>
                            ${projectData.forks_count} forks
                        </div>
                        <div class="project-meta-item">
                            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16">
                                <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path>
                            </svg>
                            ${projectData.open_issues_count} issues
                        </div>
                        <div class="project-meta-item">
                            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16">
                                <path d="M2 1.75C2 .784 2.784 0 3.75 0h8.5C13.216 0 14 .784 14 1.75v5a1.75 1.75 0 0 1-1.75 1.75h-8.5A1.75 1.75 0 0 1 2 6.75v-5Zm1.75-.25a.25.25 0 0 0-.25.25v5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-5a.25.25 0 0 0-.25-.25h-8.5ZM0 11.25c0-.966.784-1.75 1.75-1.75h12.5c.966 0 1.75.784 1.75 1.75v3A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25v-3Zm1.75-.25a.25.25 0 0 0-.25.25v3c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25v-3a.25.25 0 0 0-.25-.25H1.75Z"></path>
                            </svg>
                            ${(projectData.size / 1024).toFixed(1)} MB
                        </div>
                    </div>

                    ${languagesWithPercentage.length > 0 ? `
                        <div class="project-languages-section">
                            <div class="language-bar">
                                ${languageBar}
                            </div>
                            <div class="language-list">
                                ${languagesWithPercentage.map(lang => {
                                    const langNameLower = normalizeLangName(lang.name);
                                    return `
                                    <div class="language-item">
                                        <span class="language-color" style="background-color: var(--color-${langNameLower}, var(--color-default));"></span>
                                        <span class="language-name">${lang.name}</span>
                                        <span class="language-percentage">${lang.percentage}%</span>
                                    </div>
                                `;
                                }).join('')}
                            </div>
                        </div>
                    ` : '<div class="no-content">暂无语言统计信息</div>'}

                    ${projectData.commits && projectData.commits.length > 0 ? `
                        <div class="project-section">
                            <h3 class="section-title">Recent Commits</h3>
                            <div class="commits-list">
                                ${projectData.commits.map(commit => `
                                    <div class="commit-item">
                                        <div class="commit-header">
                                            <img class="commit-avatar" src="${commit.author?.avatar_url || 'https://github.com/identicons/default.png'}" alt="Author avatar">
                                            <div class="commit-info">
                                                <div class="commit-message">${commit.commit.message}</div>
                                                <div class="commit-meta">
                                                    <span class="commit-author">${commit.commit.author.name}</span>
                                                    committed on
                                                    <span class="commit-date">${new Date(commit.commit.author.date).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : '<div class="no-content">暂无提交记录</div>'}

                    ${projectData.readme ? `
                        <div class="project-section">
                            <h3 class="section-title">README</h3>
                            <div class="readme-content markdown-body">
                                ${marked.parse(projectData.readme)}
                            </div>
                        </div>
                    ` : '<div class="no-content">暂无 README 内容</div>'}
                </div>
            </div>
        `;

        // 初始化代码高亮
        modal.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });
    } catch (error) {
        console.error('Error loading project details:', error);
        modal.querySelector('.project-modal-body').innerHTML = `
            <div class="error-message">
                <h3>加载项目详细信息时出错</h3>
                <p>请稍后再试</p>
            </div>
        `;
    }
}

// 添加关闭项目详情的函数
function closeProjectModal() {
    const modal = document.querySelector('.project-modal');
    const overlay = document.querySelector('.overlay');
    
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(modal);
            document.body.removeChild(overlay);
        }, 300);
    }
}

// 添加切换活动显示的函数
function toggleActivity(event) {
    event.preventDefault();
    const hiddenItems = document.querySelectorAll('.hidden-activity-item');
    const button = event.currentTarget;
    
    if (hiddenItems.length > 0) {
        // 检查当前状态：如果第一个隐藏项目是隐藏的，说明当前是收起状态，需要展开
        const firstHiddenItem = hiddenItems[0];
        // 检查元素是否隐藏：通过style.display或CSS类
        const isCurrentlyHidden = firstHiddenItem.style.display === 'none' || 
                                 window.getComputedStyle(firstHiddenItem).display === 'none';
        
        if (isCurrentlyHidden) {
            // 当前是收起状态，展开所有隐藏项目
            hiddenItems.forEach(item => {
                item.style.display = 'block';
            });
            
            button.innerHTML = `
                Show less activity
                <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                    <path d="M3.22 10.53a.749.749 0 0 1 0-1.06l4.25-4.25a.749.749 0 0 1 1.06 0l4.25 4.25a.749.749 0 1 1-1.06 1.06L8 6.811 4.28 10.53a.749.749 0 0 1-1.06 0Z"></path>
                </svg>
            `;
        } else {
            // 当前是展开状态，收起所有隐藏项目
            hiddenItems.forEach(item => {
                item.style.display = 'none';
            });
            
            button.innerHTML = `
                Show more activity
                <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                    <path d="M12.78 5.22a.749.749 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.06 0L3.22 6.28a.749.749 0 1 1 1.06-1.06L8 8.939l3.72-3.719a.749.749 0 0 1 1.06 0Z"></path>
                </svg>
            `;
        }
    }
}

function showSkeletonLoading() {
    const content = document.querySelector('.content-area');
    content.innerHTML = `
        <div class="loading-text">加载中...</div>
    `;
}

function hideSkeletonLoading() {
    // 不需要额外操作，因为内容会被新的内容替换
}

// Modify the tab click event handler
document.addEventListener('DOMContentLoaded', async function() {
    const contentArea = document.querySelector('.content-area');
    const tabs = document.querySelectorAll('.tab');

    // 根据 URL hash 决定初始显示的标签
    const initialHash = window.location.hash.substring(1) || 'overview';
    let activeTab = initialHash;

    // 确保初始活动的标签是有效的
    if (!Array.from(tabs).some(tab => tab.dataset.tab === activeTab)) {
        activeTab = 'overview'; // 如果 hash 无效，则默认为概览
    }

    // 激活初始标签
    tabs.forEach(tab => {
        if (tab.dataset.tab === activeTab) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    // 显示骨架屏
    showSkeletonLoading();

    // 根据初始标签渲染内容
    try {
        switch (activeTab) {
            case 'overview':
                await fetchGitHubData();
                await renderOverview();
                break;
            case 'projects':
                await renderProjects();
                break;
            case 'memos':
                await renderMemos();
                break;
            case 'friends':
                await renderFriends();
                break;
            case 'stars':
                await renderStars();
                break;
            case 'articles':
                await renderArticles();
                break;
            default:
                await fetchGitHubData();
                await renderOverview();
                break;
        }
    } catch (error) {
        console.error('Error loading content:', error);
        contentArea.innerHTML = `
            <div class="error-message">
                <h3>加载内容时出错</h3>
                <p>请稍后再试</p>
            </div>
        `;
    } finally {
        hideSkeletonLoading();
    }

    // 监听标签点击事件
    tabs.forEach(tab => {
        tab.addEventListener('click', async (event) => {
            event.preventDefault();
            const targetTab = event.target.dataset.tab;

            // 移除所有标签的 active 类
            tabs.forEach(t => t.classList.remove('active'));
            // 添加 active 类到被点击的标签
            event.target.classList.add('active');

            // 更新 URL hash
            window.location.hash = targetTab;

            // 显示骨架屏
            showSkeletonLoading();

            try {
                switch(targetTab) {
                    case 'overview':
                        await fetchGitHubData();
                        await renderOverview();
                        break;
                    case 'projects':
                        await renderProjects();
                        break;
                    case 'memos':
                        await renderMemos();
                        break;
                    case 'friends':
                        await renderFriends();
                        break;
                    case 'stars':
                        await renderStars();
                        break;
                    case 'articles':
                        await renderArticles();
                        break;
                    default:
                        await fetchGitHubData();
                        await renderOverview();
                        break;
                }
            } catch (error) {
                console.error('Error loading content:', error);
                contentArea.innerHTML = `
                    <div class="error-message">
                        <h3>加载内容时出错</h3>
                        <p>请稍后再试</p>
                    </div>
                `;
            } finally {
                hideSkeletonLoading();
            }
        });
    });

    // 添加灯箱功能
    initLightbox();
});

// ... existing code ... 

// 添加主题切换功能
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // 更新主题
    html.setAttribute('data-theme', newTheme);
    
    // 保存用户手动设置的主题偏好
    localStorage.setItem('theme-preference', 'manual');
    localStorage.setItem('theme', newTheme);
}

// 初始化主题
function initializeTheme() {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const themePreference = localStorage.getItem('theme-preference');
    
    // 如果用户之前手动设置过主题
    if (themePreference === 'manual') {
        const savedTheme = localStorage.getItem('theme');
        document.documentElement.setAttribute('data-theme', savedTheme || 'light');
        return;
    }
    
    // 跟随系统设置
    const setThemeBySystem = (e) => {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    };
    
    // 初始设置
    setThemeBySystem(prefersDarkScheme);
    
    // 监听系统主题变化
    prefersDarkScheme.addListener(setThemeBySystem);
}

// 在 DOMContentLoaded 事件中初始化主题
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    
    // 启动自动检查贡献数据更新
    startContributionUpdateChecker();
});

// 添加启动贡献数据更新检查器的函数
function startContributionUpdateChecker() {
    // 每1分钟检查一次更新
    setInterval(async () => {
        // 只在页面可见时检查更新
        if (!document.hidden) {
            const needsUpdate = await checkContributionUpdates();
            if (needsUpdate) {
                console.log('检测到新活动，自动更新贡献数据');
                await refreshContributionData();
            }
        }
    }, 1 * 60 * 1000); // 1分钟
    
    // 监听页面可见性变化
    document.addEventListener('visibilitychange', async () => {
        if (!document.hidden) {
            // 页面变为可见时检查更新
            const needsUpdate = await checkContributionUpdates();
            if (needsUpdate) {
                console.log('页面重新可见，检测到新活动，自动更新贡献数据');
                await refreshContributionData();
            }
        }
    });
}

// 获取Memos数据的函数
async function fetchMemosData() {
    try {
        const response = await fetch(`${MEMOS_API_BASE}/memos`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${MEMOS_TOKEN}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`Memos API error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.memos || []; // 直接返回 memos 数组
    } catch (error) {
        console.error('Error fetching Memos data:', error);
        throw error;
    }
}

// Function to style inline tags within memo content
function styleInlineTags(content) {
    if (!content) return '';
    // This regex looks for # followed by one or more non-whitespace characters.
    // It captures the whole tag including the #.
    return content.replace(/#(\S+)/g, '<span class="memo-inline-tag">#$1</span>');
}

// 渲染说说的函数
async function renderMemos() {
    try {
        const memos = await fetchMemosData();
        const contentArea = document.querySelector('.content-area');
        
        if (!memos || memos.length === 0) {
            contentArea.innerHTML = `
                <div class="blankslate">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <h3>暂无说说</h3>
                    <p>还没有发布任何说说</p>
                </div>
            `;
            return;
        }

        // 将说说按置顶状态分组
        const pinnedMemos = memos.filter(memo => memo.pinned);
        const unpinnedMemos = memos.filter(memo => !memo.pinned);

        // 初始只显示5条非置顶说说
        const initialDisplayCount = 5;
        const hasMoreMemos = unpinnedMemos.length > initialDisplayCount;
        
        // 创建所有说说的HTML
        const createMemoHTML = (memo) => {
            const date = new Date(memo.createTime);
            const formattedDate = timeAgo(date);

            // 处理标签 - 将标签直接处理到内容中
            const processedContent = styleInlineTags(memo.content);

            // Group and count reactions
            const groupedReactions = {};
            if (memo.reactions) {
                memo.reactions.forEach(reaction => {
                    groupedReactions[reaction.reactionType] = (groupedReactions[reaction.reactionType] || 0) + 1;
                });
            }

            // 处理资源（图片等）
            const resourcesHTML = memo.resources && memo.resources.length > 0
                ? `<div class="memo-resources">${
                    memo.resources.map(resource => {
                        const memosBaseUrl = MEMOS_API_BASE.replace('/api/v1', '');
                        const resourcePathSegment = resource.name.replace('resources/', '');
                        const imageUrl = resource.externalLink || `${memosBaseUrl}/file/resources/${resourcePathSegment}/${resource.filename}?thumbnail=true`;
                        return `<img src="${imageUrl}" alt="资源图片" class="memo-resource">`;
                    }).join('')
                }</div>`
                : '';

            // 添加置顶标识的类名
            const pinnedClass = memo.pinned ? 'pinned-memo' : '';

            return `
                <div class="memo-card ${pinnedClass}">
                    <div class="memo-header">
                        ${memo.pinned ? `
                            <span class="memo-pin-icon" title="置顶说说">
                                <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                                    <path d="M4.456.734a1.75 1.75 0 0 1 2.826.504l.613 1.327a3.081 3.081 0 0 0 2.084 1.707l2.454.584c1.332.317 1.8 1.972.832 2.94L11.06 10l3.72 3.72a.748.748 0 0 1-.332 1.265.75.75 0 0 1-.729-.205L10 11.06l-2.204 2.205c-.968.968-2.623.5-2.94-.832l-.584-2.454a3.081 3.081 0 0 0-1.707-2.084l-1.327-.613a1.75 1.75 0 0 1-.504-2.826L4.456.734ZM5.92 1.866a.25.25 0 0 0-.404-.072L1.794 5.516a.25.25 0 0 0 .072.404l1.328.613A4.582 4.582 0 0 1 5.73 9.63l.584 2.454a.25.25 0 0 0 .42.12l5.47-5.47a.25.25 0 0 0-.12-.42L9.63 5.73a4.581 4.581 0 0 1-3.098-2.537L5.92 1.866Z"></path>
                                </svg>
                            </span>
                        ` : ''}
                        <span class="memo-date">
                            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
                            </svg>
                            ${formattedDate}
                        </span>
                    </div>
                    <div class="memo-content">
                        ${marked.parse(processedContent)}
                        ${resourcesHTML}
                    </div>
                    <div class="memo-reactions">
                        ${Object.entries(groupedReactions).map(([reactionType, count]) => `
                            <button class="reaction-button">
                                <span class="emoji">${reactionType}</span>
                                <span class="count">${count}</span>
                            </button>
                        `).join('')}
                    </div>
                    <div class="memo-meta">
                        ${memo.visibility === 'PRIVATE' ? '<span class="memo-visibility">私密</span>' : ''}
                        ${memo.state === 'ARCHIVED' ? '<span class="memo-archived">已归档</span>' : ''}
                    </div>
                </div>
            `;
        };

        // 渲染置顶说说
        const pinnedMemosHTML = pinnedMemos.length > 0 ? 
            `<div class="pinned-memos-section">
                ${pinnedMemos.map(createMemoHTML).join('')}
            </div>` : '';

        // 初始显示的非置顶说说
        const initialMemosHTML = unpinnedMemos.slice(0, initialDisplayCount).map(createMemoHTML).join('');
        
        // 剩余的说说（隐藏）
        const hiddenMemosHTML = hasMoreMemos ? 
            `<div class="hidden-memos" style="display: none;">
                ${unpinnedMemos.slice(initialDisplayCount).map(createMemoHTML).join('')}
            </div>` : '';
        
        // 加载更多按钮
        const loadMoreButton = hasMoreMemos ? 
            `<div class="load-more-memos">
                <button class="load-more-button" onclick="loadMoreMemos()">
                    加载更多说说
                </button>
            </div>` : '';

        contentArea.innerHTML = `
            <div class="memos-container">
                ${pinnedMemosHTML}
                ${initialMemosHTML}
                ${hiddenMemosHTML}
                ${loadMoreButton}
            </div>
        `;
    } catch (error) {
        console.error('Error rendering memos:', error);
        const contentArea = document.querySelector('.content-area');
        contentArea.innerHTML = `
            <div class="blankslate">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                <h3>加载失败</h3>
                <p>无法加载说说内容，请稍后重试</p>
            </div>
        `;
    } finally {
        initLightbox(); // 重新初始化灯箱
    }
}

// 添加加载更多说说的函数
function loadMoreMemos() {
    const hiddenMemos = document.querySelector('.hidden-memos');
    const loadMoreButton = document.querySelector('.load-more-button');
    
    if (hiddenMemos) {
        // 显示隐藏的说说
        hiddenMemos.style.display = 'block';
        
        // 平滑滚动到第一个新加载的说说
        const firstHiddenMemo = hiddenMemos.querySelector('.memo-card');
        if (firstHiddenMemo) {
            setTimeout(() => {
                firstHiddenMemo.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
        
        // 移除加载更多按钮
        if (loadMoreButton) {
            loadMoreButton.parentElement.remove();
        }
    }
}

// 添加灯箱功能
function initLightbox() {
    // 为每个说说单独初始化 ViewImage
    const memos = document.querySelectorAll('.memo-resources');
    memos.forEach(memo => {
        const images = memo.querySelectorAll('img');
        if (images.length > 0) {
            const imageUrls = Array.from(images).map(img => img.src);
            images.forEach(img => {
                img.addEventListener('click', function(e) {
                    e.preventDefault();
                    ViewImage.display(imageUrls, this.src);
                });
            });
        }
    });

    // 为 readme 内容单独初始化
    const readmeImages = document.querySelectorAll('.readme-content img');
    if (readmeImages.length > 0) {
        const readmeImageUrls = Array.from(readmeImages).map(img => img.src);
        readmeImages.forEach(img => {
            img.addEventListener('click', function(e) {
                e.preventDefault();
                ViewImage.display(readmeImageUrls, this.src);
            });
        });
    }
}

// 在页面加载完成后初始化 ViewImage
document.addEventListener('DOMContentLoaded', initLightbox);

// 辅助函数：格式化日期为 YYYY/MM/DD
function formatDate(dateString) {
    const date = new Date(dateString); // 直接解析 ISO 8601 字符串
    if (isNaN(date.getTime())) { // 检查日期是否有效
        console.error("Invalid date string for formatDate:", dateString);
        return 'Invalid Date';
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
}

// 渲染文章页面
async function renderArticles() {
    const contentArea = document.querySelector('.content-area');
    contentArea.innerHTML = ''; // 清除旧内容
    showSkeletonLoading();

    const articles = await fetchArticlesData();
    console.log("渲染文章时接收到的文章数据:", articles); // 添加日志
    hideSkeletonLoading();

    if (articles && articles.length > 0) {
        let articlesContentHTML = `<div class="articles-grid">`;
        // 只渲染前五个文章
        const initialArticles = articles.slice(0, 5);
        initialArticles.forEach(article => {
            const descriptionText = article.description || ''; // 移除默认值 'yuazhi'
            // 从文章内容中提取摘要
            const content = article.text || article.content || '';
            const summary = content.replace(/<[^>]+>/g, '').slice(0, 100) + (content.length > 100 ? '...' : '');
            
            articlesContentHTML += `
                <a href="#" class="post-card" data-article-id="${article.id}">
                    <div class="post-date">
                        <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                            <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
                        </svg>
                        ${formatDate(article.created_at)}
                    </div>
                    <h3 class="post-title">${article.title}</h3>
                    <!-- <p class="post-description">${descriptionText}</p> -->
                    <p class="post-summary">${summary}</p>
                </a>
            `;
        });
        articlesContentHTML += `</div>`;
        
        let fullHTML = `<div class="articles-section">${articlesContentHTML}`;

        // 添加加载更多按钮
        if (articles.length > 5) {
            fullHTML += `<button id="load-more-articles" class="load-more-button">加载更多</button>`;
        }
        fullHTML += `</div>`; // Close articles-section div

        contentArea.innerHTML = fullHTML;

        // 为文章卡片添加点击事件监听器
        document.querySelectorAll('.post-card').forEach(card => {
            card.addEventListener('click', async (event) => {
                event.preventDefault();
                const articleId = card.dataset.articleId;
                const article = articles.find(a => a.id == articleId);
                if (article) {
                    console.log("点击文章卡片时:", article); // 添加日志
                    showArticleDetail(article);
                }
            });
        });

        // 为加载更多按钮添加点击事件监听器
        const loadMoreButton = document.getElementById('load-more-articles');
        if (loadMoreButton) {
            loadMoreButton.addEventListener('click', () => loadMoreArticles(articles));
        }

    } else {
        console.log("articles 数组为空或无效，显示暂无文章可显示。"); // 添加日志
        contentArea.innerHTML = '<p>暂无文章可显示。</p>';
    }
    initLightbox(); // 重新初始化灯箱
}

// 加载更多文章的函数
function loadMoreArticles(articles) {
    const articlesGrid = document.querySelector('.articles-grid');
    const loadMoreButton = document.getElementById('load-more-articles');
    const currentArticles = document.querySelectorAll('.post-card');
    const startIndex = currentArticles.length;
    const endIndex = Math.min(startIndex + 5, articles.length);

    for (let i = startIndex; i < endIndex; i++) {
        const article = articles[i];
        const descriptionText = article.description || '';
        const content = article.text || article.content || '';
        const summary = content.replace(/<[^>]+>/g, '').slice(0, 100) + (content.length > 100 ? '...' : '');
        
        const articleHTML = `
            <a href="#" class="post-card" data-article-id="${article.id}">
                <div class="post-date">
                    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                        <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
                    </svg>
                    ${formatDate(article.created_at)}
                </div>
                <h3 class="post-title">${article.title}</h3>
                <!-- <p class="post-description">${descriptionText}</p> -->
                <p class="post-summary">${summary}</p>
            </a>
        `;
        articlesGrid.insertAdjacentHTML('beforeend', articleHTML);
    }

    // 为新添加的文章卡片添加点击事件监听器
    document.querySelectorAll('.post-card').forEach(card => {
        if (!card.hasEventListener) {
            card.hasEventListener = true;
            card.addEventListener('click', async (event) => {
                event.preventDefault();
                const articleId = card.dataset.articleId;
                const article = articles.find(a => a.id == articleId);
                if (article) {
                    console.log("点击文章卡片时:", article); // 添加日志
                    showArticleDetail(article);
                }
            });
        }
    });

    // 如果没有更多文章可显示，则隐藏加载更多按钮
    if (endIndex >= articles.length) {
        loadMoreButton.style.display = 'none';
    }
    initLightbox(); // 重新初始化灯箱
}

// 显示文章详情的模态框
async function showArticleDetail(article) {
    let articleModal = document.querySelector('.article-modal');
    if (!articleModal) {
        articleModal = document.createElement('div');
        articleModal.className = 'article-modal';
        articleModal.innerHTML = `
            <div class="article-modal-content">
                <div class="article-modal-header">
                    <h3 class="article-modal-title"></h3>
                    <div class="article-modal-actions">
                        <button class="article-share-button" title="分享文章">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path>
                            </svg>
                        </button>
                        <button class="article-modal-close">&times;</button>
                    </div>
                </div>
                <div class="article-modal-body markdown-body"></div>
            </div>
        `;
        document.body.appendChild(articleModal);

        // 创建提示消息元素
        const toast = document.createElement('div');
        toast.className = 'copy-toast';
        toast.textContent = '链接已复制！';
        document.body.appendChild(toast);

        // 强制浏览器重绘，以便动画能正确触发
        void articleModal.offsetWidth;

        // 延迟添加 'show' 类，确保动画在第一次弹出时也能触发
        setTimeout(() => {
            articleModal.classList.add('show');
        }, 10);

        // 添加分享按钮点击事件
        articleModal.querySelector('.article-share-button').addEventListener('click', () => {
            const articleUrl = `${window.location.origin}${window.location.pathname}?article=${article.id}`;
            navigator.clipboard.writeText(articleUrl).then(() => {
                // 显示复制成功提示
                toast.classList.add('show');
                setTimeout(() => {
                    toast.classList.remove('show');
                }, 2000);
            }).catch(err => {
                console.error('复制失败:', err);
            });
        });

        articleModal.querySelector('.article-modal-close').addEventListener('click', () => {
            articleModal.classList.remove('show');
            // 清除 URL 中的 article 参数
            const url = new URL(window.location.href);
            url.searchParams.delete('article');
            window.history.replaceState({}, '', url);
        });

        articleModal.addEventListener('click', (e) => {
            if (e.target === articleModal) {
                articleModal.classList.remove('show');
                // 清除 URL 中的 article 参数
                const url = new URL(window.location.href);
                url.searchParams.delete('article');
                window.history.replaceState({}, '', url);
            }
        });
    }

    articleModal.querySelector('.article-modal-title').textContent = article.title;
    // 检查 article.text 是否存在，否则尝试使用 article.content
    const articleContent = article.text || article.content;
    if (articleContent) {
        articleModal.querySelector('.article-modal-body').innerHTML = articleContent;
        hljs.highlightAll();
    } else {
        console.error("文章内容为空或无法找到 'text' 或 'content' 字段:", article);
        articleModal.querySelector('.article-modal-body').innerHTML = '<p>无法加载文章内容。</p>';
    }

    // 确保模态框在 DOM 中并且内容已加载，然后添加 'show' 类以触发动画
    void articleModal.offsetWidth;
    setTimeout(() => {
        articleModal.classList.add('show');
    }, 10);
    initLightbox(); // 重新初始化灯箱
}

// 添加检查URL参数并显示文章的函数
function checkUrlForArticle() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('article');
    if (articleId) {
        // 切换到文章标签
        const articlesTab = document.querySelector('[data-tab="articles"]');
        if (articlesTab) {
            articlesTab.click();
        }
        
        // 获取文章数据并显示
        fetchArticlesData().then(articles => {
            const article = articles.find(a => a.id == articleId);
            if (article) {
                showArticleDetail(article);
            }
        });
    }
}

// 在页面加载完成后检查URL参数
document.addEventListener('DOMContentLoaded', async () => {
    // ... existing code ...
    
    // 添加灯箱功能
    initLightbox();
    
    // 检查URL参数并显示文章
    checkUrlForArticle();
});

// 添加显示提示的函数
function showProjectTip() {
    const hasShownTip = localStorage.getItem('hasShownProjectTip');
    if (!hasShownTip) {
        const tip = document.createElement('div');
        tip.className = 'project-tip';
        tip.innerHTML = `
            <div class="tip-content">
                <p>点击卡片可以查看项目详情</p>
                <button onclick="this.parentElement.parentElement.remove()">知道了</button>
            </div>
        `;
        document.body.appendChild(tip);
        localStorage.setItem('hasShownProjectTip', 'true');
    }
}

// 在页面加载完成后显示提示
document.addEventListener('DOMContentLoaded', () => {
    // 延迟 1 秒显示提示，让页面先加载完成
    setTimeout(showProjectTip, 1000);
});
