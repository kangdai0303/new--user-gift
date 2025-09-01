// 高途医考新手福利页面交互脚本
class NewUserGiftPage {
    constructor() {
        this.claimButton = null;
        this.modal = null;
        this.isLoading = false;
        
        this.init();
    }

    init() {
        this.setupClaimButton();
        this.setupModal();
        this.addScrollAnimations();
        this.addButtonRippleEffect();
        
        // 页面加载完成后启动数字动画
        window.addEventListener('load', () => {
            this.animateNumbers();
        });
    }

    // 设置领取按钮
    setupClaimButton() {
        this.claimButton = document.getElementById('claimButton');
        if (!this.claimButton) return;

        this.claimButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleClaimClick();
        });
    }

    // 处理领取按钮点击
    handleClaimClick() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        const buttonText = this.claimButton.querySelector('.button-text');
        const originalText = buttonText.textContent;
        
        // 添加加载状态
        this.claimButton.classList.add('loading');
        buttonText.textContent = '领取中...';
        this.claimButton.disabled = true;
        
        // 创建粒子效果
        this.createParticleEffect();
        
        // 模拟异步操作
        setTimeout(() => {
            this.isLoading = false;
            this.claimButton.classList.remove('loading');
            this.claimButton.classList.add('success');
            buttonText.textContent = '领取成功！';
            
            // 显示成功模态框
            setTimeout(() => {
                this.showModal();
            }, 1000);
            
            // 3秒后重置按钮
            setTimeout(() => {
                this.claimButton.classList.remove('success');
                buttonText.textContent = originalText;
                this.claimButton.disabled = false;
            }, 5000);
            
        }, 2000);
    }

    // 创建粒子效果
    createParticleEffect() {
        const rect = this.claimButton.getBoundingClientRect();
        const particles = 20;
        
        for (let i = 0; i < particles; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 6 + 4;
            const x = rect.left + rect.width / 2 + (Math.random() - 0.5) * 200;
            const y = rect.top + rect.height / 2 + (Math.random() - 0.5) * 100;
            const delay = Math.random() * 0.5;
            
            particle.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                background: #ff9500;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${x}px;
                top: ${y}px;
                animation: particleFloat 2s ease-out ${delay}s forwards;
            `;
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 2500);
        }
    }

    // 设置模态框
    setupModal() {
        this.modal = document.getElementById('successModal');
        if (!this.modal) return;

        const closeBtn = document.getElementById('closeModal');
        const downloadBtn = document.getElementById('downloadApp');
        
        // 关闭按钮
        closeBtn?.addEventListener('click', () => {
            this.hideModal();
        });

        // 下载按钮
        downloadBtn?.addEventListener('click', () => {
            this.handleDownloadApp();
        });

        // 点击背景关闭
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hideModal();
            }
        });

        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('show')) {
                this.hideModal();
            }
        });
    }

    // 显示模态框
    showModal() {
        if (this.modal) {
            this.modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    // 隐藏模态框
    hideModal() {
        if (this.modal) {
            this.modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    // 处理下载App
    handleDownloadApp() {
        // 记录下载点击追踪
        if (window.tracker) {
            window.tracker.trackDownload();
        }
        
        // 检测是否在微信、QQ等内置浏览器中
        if (this.isInAppBrowser()) {
            this.showBrowserGuide();
            return;
        }
        
        // 检测设备类型并跳转到相应应用商店
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        let downloadUrl = '';
        
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            // iOS设备 - 跳转到App Store
            downloadUrl = 'https://apps.apple.com/cn/app/id6702016387';
        } else if (/android/i.test(userAgent)) {
            // Android设备 - 根据不同机型跳转到对应应用商店
            downloadUrl = this.getAndroidDownloadUrl(userAgent);
        } else {
            // 其他设备 - 通用下载页面
            downloadUrl = 'https://yikao.gaotuyk.com/#/pages/recruit/notice_detail?id=489&share=app&share=h5&invitationCode=p_1101AVShmN&invitationCode=p_0918PNnatY';
        }
        
        // 直接跳转到对应链接
        this.directDownload(downloadUrl);
        
        // 隐藏模态框
        this.hideModal();
    }
    
    // 获取Android对应机型的下载链接和intent协议
    getAndroidDownloadUrl(userAgent) {
        const packageName = 'uni.UNI6384A90'; // 应用的包名
        
        // 检测华为手机
        if (/huawei/i.test(userAgent) || /honor/i.test(userAgent) || /hms/i.test(userAgent)) {
            return {
                // 华为应用市场的多种拉起方式
                intents: [
                    'https://appgallery.huawei.com/app/C112125043',
                    `market://details?id=${packageName}`,
                    `intent://details?id=${packageName}#Intent;scheme=market;package=com.huawei.appmarket;end`,
                ],
                fallback: 'https://appgallery.huawei.com/app/C112125043',
                marketName: '华为应用市场'
            };
        }
        
        // 检测小米手机
        if (/xiaomi/i.test(userAgent) || /mi\s/i.test(userAgent) || /redmi/i.test(userAgent)) {
            return {
                intents: [
                    'https://app.mi.com/details?id=uni.UNI6384A90',
                    `market://details?id=${packageName}`,
                    `intent://details?id=${packageName}#Intent;scheme=market;package=com.xiaomi.market;end`,
                ],
                fallback: 'https://app.mi.com/details?id=uni.UNI6384A90',
                marketName: '小米应用商店'
            };
        }
        
        // 检测OPPO手机
        if (/oppo/i.test(userAgent) || /oneplus/i.test(userAgent)) {
            return {
                intents: [
                    'https://app.cdo.oppomobile.com/home/detail?app_id=32592129',
                    `market://details?id=${packageName}`,
                    `intent://details?id=${packageName}#Intent;scheme=market;package=com.oppo.market;end`,
                ],
                fallback: 'https://app.cdo.oppomobile.com/home/detail?app_id=32592129',
                marketName: 'OPPO软件商店'
            };
        }
        
        // 检测Vivo手机
        if (/vivo/i.test(userAgent) || /iqoo/i.test(userAgent)) {
            return {
                intents: [
                    'https://h5coml.vivo.com.cn/h5coml/appdetail_h5/browser_v2/index.html?appId=3805866',
                    `market://details?id=${packageName}`,
                    `intent://details?id=${packageName}#Intent;scheme=market;package=com.bbk.appstore;end`,
                ],
                fallback: 'https://h5coml.vivo.com.cn/h5coml/appdetail_h5/browser_v2/index.html?appId=3805866',
                marketName: 'Vivo应用商店'
            };
        }
        
        // 其他Android手机默认跳转应用宝
        return {
            intents: [
                'https://a.app.qq.com/o/simple.jsp?pkgname=uni.UNI6384A90',
                `market://details?id=${packageName}`,
                `intent://details?id=${packageName}#Intent;scheme=market;package=com.tencent.android.qqdownloader;end`,
            ],
            fallback: 'https://a.app.qq.com/o/simple.jsp?pkgname=uni.UNI6384A90',
            marketName: '应用宝'
        };
    }
    
    // 直接下载跳转 - 支持拉起应用商店APP
    directDownload(downloadInfo) {
        // iOS设备直接跳转
        if (typeof downloadInfo === 'string') {
            try {
                // iOS使用itms-apps协议直接拉起App Store
                const appStoreUrl = downloadInfo.replace('https://apps.apple.com/', 'itms-apps://apps.apple.com/');
                window.location.href = appStoreUrl;
                this.showNotification('正在拉起App Store...', 'success');
                
                // 如果itms-apps失败，1秒后尝试https协议
                setTimeout(() => {
                    if (document.visibilityState === 'visible') {
                        window.location.href = downloadInfo;
                    }
                }, 1000);
                
            } catch (error) {
                console.log('iOS跳转失败:', error);
                window.location.href = downloadInfo;
                this.showNotification('正在跳转到App Store...', 'info');
            }
            return;
        }
        
        // Android设备 - 使用多种协议直接拉起应用商店APP
        const { intents, fallback, marketName } = downloadInfo;
        
        this.showNotification(`正在尝试拉起${marketName}...`, 'info');
        
        let hasJumped = false;
        let intentIndex = 0;
        
        // 监听页面可见性和焦点变化来检测是否成功拉起
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden' && !hasJumped) {
                hasJumped = true;
                this.showNotification(`${marketName}已成功拉起！`, 'success');
                cleanup();
            }
        };
        
        const handleBlur = () => {
            if (!hasJumped) {
                hasJumped = true;
                this.showNotification(`${marketName}已成功拉起！`, 'success');
                cleanup();
            }
        };
        
        const cleanup = () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('pagehide', handleBlur);
        };
        
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);
        window.addEventListener('pagehide', handleBlur);
        
        // 尝试每一个intent协议
        const tryNextIntent = () => {
            if (intentIndex >= intents.length || hasJumped) {
                // 所有intent都尝试过了，使用fallback
                if (!hasJumped) {
                    console.log('所有intent协议都失败，使用fallback');
                    this.showNotification(`${marketName}拉起失败，正在打开网页版...`, 'warning');
                    window.location.href = fallback;
                }
                cleanup();
                return;
            }
            
            const currentIntent = intents[intentIndex];
            console.log(`尝试intent ${intentIndex + 1}:`, currentIntent);
            
            try {
                // 方法1: 直接location跳转 (最直接的方式)
                window.location.href = currentIntent;
                
                // 立即检测是否跳转成功
                const checkJump = () => {
                    setTimeout(() => {
                        if (!hasJumped && document.visibilityState === 'visible') {
                            // 如果页面还在前台，说明没有跳转成功，尝试下一个
                            console.log(`Intent ${intentIndex + 1} 可能失败，尝试下一个`);
                            intentIndex++;
                            tryNextIntent();
                        }
                    }, 600);
                };
                
                checkJump();
                
            } catch (error) {
                console.log(`Intent ${intentIndex + 1} 失败:`, error);
                intentIndex++;
                setTimeout(tryNextIntent, 100);
            }
        };
        
        // 开始尝试第一个intent
        tryNextIntent();
        
        // 3秒后强制清理并检查状态
        setTimeout(() => {
            if (!hasJumped && document.visibilityState === 'visible') {
                console.log('3秒后仍未成功拉起，可能需要fallback');
                if (intentIndex >= intents.length) {
                    this.showNotification(`${marketName}可能未安装，正在打开网页版`, 'info');
                }
            }
            cleanup();
        }, 3000);
    }
    
    // 尝试多个下载链接
    tryMultipleDownloadLinks(urls) {
        let currentIndex = 0;
        
        const tryNextUrl = () => {
            if (currentIndex >= urls.length) {
                this.showNotification('下载链接暂时无法打开，请稍后再试', 'warning');
                this.showDownloadFallback();
                return;
            }
            
            const currentUrl = urls[currentIndex];
            this.showNotification(`正在尝试下载方式 ${currentIndex + 1}...`, 'info');
            
            try {
                // 方法1：直接打开
                const newWindow = window.open(currentUrl, '_blank', 'noopener,noreferrer');
                
                // 检测是否成功打开
                setTimeout(() => {
                    if (newWindow && !newWindow.closed) {
                        this.showNotification('下载已开始！', 'success');
                    } else {
                        // 如果失败，尝试下一个链接
                        currentIndex++;
                        setTimeout(tryNextUrl, 500);
                    }
                }, 1000);
                
            } catch (error) {
                console.log(`尝试链接 ${currentIndex + 1} 失败:`, error);
                currentIndex++;
                setTimeout(tryNextUrl, 500);
            }
        };
        
        tryNextUrl();
    }
    
    // 显示下载备选方案
    showDownloadFallback() {
        const fallbackDiv = document.createElement('div');
        fallbackDiv.className = 'download-fallback';
        fallbackDiv.innerHTML = `
            <div class="fallback-content">
                <div class="fallback-header">
                    <h3>📱 下载高途医考APP</h3>
                    <button class="fallback-close" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
                </div>
                <div class="fallback-body">
                    <p class="fallback-title">多种下载方式，总有一种适合你</p>
                    <div class="fallback-options">
                        <button class="fallback-btn ios-btn" onclick="window.open('https://apps.apple.com/cn/app/id6702016387', '_blank')">
                            🍎 苹果用户 - App Store下载
                        </button>
                        <button class="fallback-btn android-btn" onclick="window.open('https://yikao.gaotuyk.com/', '_blank')">
                            🤖 安卓用户 - 官网下载
                        </button>
                        <button class="fallback-btn copy-btn" onclick="this.copyPageUrl()">
                            📋 复制页面链接分享给朋友
                        </button>
                    </div>
                    <div class="fallback-tip">
                        💡 如果仍然无法下载，请尝试：<br>
                        1. 检查网络连接是否正常<br>
                        2. 使用不同的浏览器打开<br>
                        3. 稍后再试或联系客服
                    </div>
                </div>
            </div>
        `;
        
        // 添加复制功能
        const copyBtn = fallbackDiv.querySelector('.copy-btn');
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(window.location.href).then(() => {
                copyBtn.textContent = '✅ 已复制页面链接';
                copyBtn.style.background = '#34a853';
                setTimeout(() => {
                    copyBtn.innerHTML = '📋 复制页面链接分享给朋友';
                    copyBtn.style.background = '';
                }, 2000);
            }).catch(() => {
                this.showNotification('复制失败，请手动复制地址栏链接', 'warning');
            });
        });
        
        document.body.appendChild(fallbackDiv);
        document.body.style.overflow = 'hidden';
        
        // 点击关闭时恢复滚动
        fallbackDiv.addEventListener('click', (e) => {
            if (e.target === fallbackDiv || e.target.classList.contains('fallback-close')) {
                document.body.style.overflow = '';
            }
        });
    }

    // 检测是否在内置浏览器中
    isInAppBrowser() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        
        // 检测微信浏览器
        const isWechat = /micromessenger/i.test(userAgent);
        
        // 检测QQ浏览器
        const isQQ = /qq/i.test(userAgent) && /mobile/i.test(userAgent);
        
        // 检测支付宝
        const isAlipay = /alipay/i.test(userAgent);
        
        // 检测微博
        const isWeibo = /weibo/i.test(userAgent);
        
        // 检测抖音
        const isDouyin = /tiktok|bytedance/i.test(userAgent);
        
        return isWechat || isQQ || isAlipay || isWeibo || isDouyin;
    }

    // 显示浏览器打开引导
    showBrowserGuide() {
        // 创建引导遮罩
        const guideOverlay = document.createElement('div');
        guideOverlay.className = 'browser-guide-overlay';
        
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
        const isWechat = /micromessenger/i.test(userAgent);
        
        let platformName = '应用内';
        if (isWechat) platformName = '微信';
        else if (/qq/i.test(userAgent)) platformName = 'QQ';
        else if (/alipay/i.test(userAgent)) platformName = '支付宝';
        else if (/weibo/i.test(userAgent)) platformName = '微博';
        else if (/tiktok|bytedance/i.test(userAgent)) platformName = '抖音';
        
        const deviceType = isIOS ? 'iPhone' : 'Android';
        const browserName = isIOS ? 'Safari' : '浏览器';
        
        guideOverlay.innerHTML = `
            <div class="browser-guide-content">
                <div class="guide-header">
                    <h3>📱 下载高途医考APP</h3>
                    <button class="guide-close" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
                </div>
                
                <div class="guide-body">
                    <div class="guide-icon">🚀</div>
                    <p class="guide-title">当前在${platformName}中打开，无法直接下载</p>
                    <p class="guide-desc">请按照以下步骤操作：</p>
                    
                    <div class="guide-steps">
                        <div class="step-item">
                            <span class="step-number">1</span>
                            <div class="step-content">
                                <p class="step-title">点击右上角 "⋯" 菜单</p>
                                <p class="step-desc">找到页面右上角的更多选项</p>
                            </div>
                        </div>
                        
                        <div class="step-item">
                            <span class="step-number">2</span>
                            <div class="step-content">
                                <p class="step-title">选择 "在${browserName}中打开"</p>
                                <p class="step-desc">将页面在系统浏览器中打开</p>
                            </div>
                        </div>
                        
                        <div class="step-item">
                            <span class="step-number">3</span>
                            <div class="step-content">
                                <p class="step-title">重新点击下载按钮</p>
                                <p class="step-desc">${isIOS ? '将自动跳转到App Store' : '将跳转到下载页面'}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="guide-tip">
                        💡 <strong>小贴士：</strong>也可以复制链接发送给自己，然后在${browserName}中打开
                    </div>
                </div>
                
                <div class="guide-footer">
                    <button class="copy-url-btn" onclick="this.copyCurrentUrl()">
                        📋 复制当前链接
                    </button>
                    <button class="guide-confirm" onclick="this.parentElement.parentElement.parentElement.remove()">
                        我知道了
                    </button>
                </div>
            </div>
        `;
        
        // 添加复制链接功能
        const copyBtn = guideOverlay.querySelector('.copy-url-btn');
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(window.location.href).then(() => {
                copyBtn.textContent = '✅ 已复制';
                copyBtn.style.background = '#34a853';
                setTimeout(() => {
                    copyBtn.textContent = '📋 复制当前链接';
                    copyBtn.style.background = '';
                }, 2000);
            }).catch(() => {
                this.showNotification('复制失败，请手动复制地址栏链接', 'warning');
            });
        });
        
        document.body.appendChild(guideOverlay);
        
        // 阻止页面滚动
        document.body.style.overflow = 'hidden';
        
        // 点击关闭时恢复滚动
        guideOverlay.addEventListener('click', (e) => {
            if (e.target === guideOverlay || e.target.classList.contains('guide-close') || e.target.classList.contains('guide-confirm')) {
                document.body.style.overflow = '';
            }
        });
    }

    // 添加滚动动画
    addScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // 观察所有卡片元素
        const cards = document.querySelectorAll('.package-card, .feature-card');
        cards.forEach(card => {
            observer.observe(card);
        });
    }

    // 添加按钮波纹效果
    addButtonRippleEffect() {
        const buttons = document.querySelectorAll('.claim-button, .download-btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const ripple = button.querySelector('.button-ripple');
                if (!ripple) return;
                
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.remove('active');
                
                // 强制重排
                void ripple.offsetWidth;
                
                ripple.classList.add('active');
                
                setTimeout(() => {
                    ripple.classList.remove('active');
                }, 600);
            });
        });
    }

    // 数字动画
    animateNumbers() {
        const numberElements = document.querySelectorAll('.stat-number');
        
        const animateValue = (element, start, end, duration) => {
            const startTime = performance.now();
            const startValue = start;
            const endValue = end;
            
            const animate = (currentTime) => {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                
                // 缓动函数
                const easeOutCubic = 1 - Math.pow(1 - progress, 3);
                const currentValue = startValue + (endValue - startValue) * easeOutCubic;
                
                element.firstChild.textContent = Math.floor(currentValue);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            
            requestAnimationFrame(animate);
        };

        // 动画各个数字
        numberElements.forEach((element, index) => {
            const textContent = element.firstChild.textContent;
            const targetNumber = parseInt(textContent);
            
            if (!isNaN(targetNumber)) {
                setTimeout(() => {
                    animateValue(element, 0, targetNumber, 2000);
                }, index * 200);
            }
        });
    }

    // 显示通知
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const colors = {
            success: '#34a853',
            error: '#ea4335',
            info: '#4285f4',
            warning: '#fbbc04'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.success};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            z-index: 1001;
            font-size: 14px;
            font-weight: 500;
            max-width: 300px;
            opacity: 0;
            transform: translateX(100px);
            transition: all 0.3s ease;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // 显示动画
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // 3秒后自动消失
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100px)';
            
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // 获取统计信息
    getStats() {
        return {
            totalValue: 446, // 99 + 199 + 79 + 69
            packageCount: 4,
            schoolCount: 300,
            studentCount: 50000
        };
    }
}

// 推广追踪系统
class PromotionTracker {
    constructor() {
        this.promoterInfo = this.getPromoterFromURL();
        this.init();
    }
    
    getPromoterFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            promoterId: urlParams.get('pid') || 'direct',
            promoterName: urlParams.get('promoter') || '直接访问',
            source: urlParams.get('source') || 'web',
            campaign: urlParams.get('campaign') || 'default'
        };
    }
    
    init() {
        localStorage.setItem('promoter_info', JSON.stringify(this.promoterInfo));
        this.displayPromoterInfo();
        this.trackPageView();
    }
    
    displayPromoterInfo() {
        if (this.promoterInfo.promoterId !== 'direct') {
            const banner = document.createElement('div');
            banner.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-align: center;
                padding: 8px;
                font-size: 14px;
                z-index: 1001;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                font-family: 'SimHei', 'Heiti SC', 'Microsoft YaHei UI', 'Microsoft YaHei', sans-serif;
            `;
            banner.innerHTML = `🎉 您通过 <strong>${this.promoterInfo.promoterName}</strong> 的推荐来到这里`;
            document.body.appendChild(banner);
            
            setTimeout(() => banner.remove(), 3000);
        }
    }
    
    async trackPageView() {
        await this.sendTracking({
            action: 'page_view',
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            referrer: document.referrer,
            url: window.location.href
        });
    }
    
    async trackDownload() {
        await this.sendTracking({
            action: 'download_click',
            timestamp: new Date().toISOString(),
            device: this.getDeviceType(),
            url: window.location.href
        });
    }
    
    getDeviceType() {
        const userAgent = navigator.userAgent;
        if (/iPad|iPhone|iPod/.test(userAgent)) return 'iOS';
        if (/android/i.test(userAgent)) return 'Android';
        return 'Other';
    }
    
    async sendTracking(additionalData) {
        const data = {
            promoterId: this.promoterInfo.promoterId,
            promoterName: this.promoterInfo.promoterName,
            source: this.promoterInfo.source,
            campaign: this.promoterInfo.campaign,
            ...additionalData
        };
        
        try {
            // 发送到后端API（如果有的话）
            // await fetch('https://your-api.com/track', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(data)
            // });
            
            // 保存到本地存储作为备份
            const trackingHistory = JSON.parse(localStorage.getItem('tracking_history') || '[]');
            trackingHistory.push(data);
            localStorage.setItem('tracking_history', JSON.stringify(trackingHistory.slice(-50)));
            
            console.log('📊 追踪数据:', data);
        } catch (error) {
            console.log('追踪数据发送失败:', error);
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    const giftPage = new NewUserGiftPage();
    const tracker = new PromotionTracker();
    
    // 全局引用，便于调试
    window.giftPage = giftPage;
    window.tracker = tracker;
    
    // 页面加载完成，显示内容
    document.documentElement.classList.add('loaded');
});

// 确保页面资源完全加载后显示
window.addEventListener('load', () => {
    document.documentElement.classList.add('loaded');
});

// 添加CSS动画样式
const style = document.createElement('style');
style.textContent = `
    /* 粒子动画 */
    @keyframes particleFloat {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(-150px) rotate(360deg);
            opacity: 0;
        }
    }
    
    /* 滚动进入动画 */
    .package-card,
    .feature-card {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .package-card.animate-in,
    .feature-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    /* 按钮状态 */
    .claim-button.loading {
        pointer-events: none;
        opacity: 0.8;
    }
    
    .claim-button.success {
        background: linear-gradient(135deg, #34a853 0%, #137333 100%);
    }
    
    .button-ripple.active {
        animation: ripple 0.6s linear;
    }
    
    /* 通知样式 */
    .notification {
        font-family: 'SimHei', 'Heiti SC', 'Microsoft YaHei UI', 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', sans-serif;
    }
    
    /* 浏览器引导遮罩样式 */
    .browser-guide-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(8px);
        z-index: 2000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
    }
    
    .browser-guide-content {
        background: white;
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        max-width: 480px;
        width: 90%;
        max-height: 85vh;
        overflow-y: auto;
        animation: slideUp 0.4s ease;
    }
    
    .guide-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 24px 28px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 20px 20px 0 0;
    }
    
    .guide-header h3 {
        font-size: 1.4rem;
        font-weight: 700;
        margin: 0;
        font-family: 'SimHei', 'Heiti SC', 'Microsoft YaHei UI', 'Microsoft YaHei', sans-serif;
    }
    
    .guide-close {
        background: none;
        border: none;
        font-size: 2rem;
        color: white;
        cursor: pointer;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.3s ease;
        line-height: 1;
    }
    
    .guide-close:hover {
        background: rgba(255, 255, 255, 0.2);
    }
    
    .guide-body {
        padding: 32px 28px;
    }
    
    .guide-icon {
        font-size: 3rem;
        text-align: center;
        margin-bottom: 16px;
    }
    
    .guide-title {
        font-size: 1.3rem;
        font-weight: 700;
        color: #2c3e50;
        text-align: center;
        margin-bottom: 8px;
        font-family: 'SimHei', 'Heiti SC', 'Microsoft YaHei UI', 'Microsoft YaHei', sans-serif;
    }
    
    .guide-desc {
        font-size: 1rem;
        color: #64748b;
        text-align: center;
        margin-bottom: 24px;
        font-family: 'SimHei', 'Heiti SC', 'Microsoft YaHei UI', 'Microsoft YaHei', sans-serif;
    }
    
    .guide-steps {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-bottom: 24px;
    }
    
    .step-item {
        display: flex;
        align-items: flex-start;
        gap: 16px;
        padding: 16px;
        background: linear-gradient(135deg, #f8fafc 0%, #e8f4f8 100%);
        border-radius: 12px;
        border-left: 4px solid #667eea;
    }
    
    .step-number {
        width: 32px;
        height: 32px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 1rem;
        flex-shrink: 0;
    }
    
    .step-content {
        flex: 1;
    }
    
    .step-title {
        font-size: 1.1rem;
        font-weight: 700;
        color: #2c3e50;
        margin-bottom: 4px;
        font-family: 'SimHei', 'Heiti SC', 'Microsoft YaHei UI', 'Microsoft YaHei', sans-serif;
    }
    
    .step-desc {
        font-size: 0.95rem;
        color: #64748b;
        line-height: 1.4;
        margin: 0;
        font-family: 'SimHei', 'Heiti SC', 'Microsoft YaHei UI', 'Microsoft YaHei', sans-serif;
    }
    
    .guide-tip {
        padding: 16px;
        background: linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%);
        border-radius: 12px;
        border-left: 4px solid #ff9500;
        font-size: 0.95rem;
        color: #e65100;
        font-family: 'SimHei', 'Heiti SC', 'Microsoft YaHei UI', 'Microsoft YaHei', sans-serif;
    }
    
    .guide-footer {
        padding: 0 28px 28px;
        display: flex;
        gap: 12px;
    }
    
    .copy-url-btn,
    .guide-confirm {
        flex: 1;
        height: 48px;
        border: none;
        border-radius: 12px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        font-family: 'SimHei', 'Heiti SC', 'Microsoft YaHei UI', 'Microsoft YaHei', sans-serif;
    }
    
    .copy-url-btn {
        background: linear-gradient(135deg, #34a853 0%, #137333 100%);
        color: white;
        box-shadow: 0 4px 15px rgba(52, 168, 83, 0.3);
    }
    
    .copy-url-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(52, 168, 83, 0.4);
    }
    
    .guide-confirm {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }
    
    .guide-confirm:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
    
    /* 移动端适配 */
    @media (max-width: 767px) {
        .browser-guide-content {
            width: 95%;
            margin: 20px;
            max-height: 90vh;
        }
        
        .guide-header {
            padding: 20px 24px;
        }
        
        .guide-header h3 {
            font-size: 1.2rem;
        }
        
        .guide-body {
            padding: 28px 24px;
        }
        
        .guide-footer {
            padding: 0 24px 24px;
            flex-direction: column;
        }
        
        .copy-url-btn,
        .guide-confirm {
            height: 44px;
            font-size: 0.95rem;
        }
        
        .step-item {
            padding: 14px;
        }
        
        .step-title {
            font-size: 1rem;
        }
        
        .step-desc {
            font-size: 0.9rem;
        }
    }
    
    /* 下载备选方案样式 */
    .download-fallback {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(8px);
        z-index: 2001;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
    }
    
    .fallback-content {
        background: white;
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        max-width: 500px;
        width: 90%;
        max-height: 85vh;
        overflow-y: auto;
        animation: slideUp 0.4s ease;
    }
    
    .fallback-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 24px 28px;
        background: linear-gradient(135deg, #ff9500 0%, #ff6d00 100%);
        color: white;
        border-radius: 20px 20px 0 0;
    }
    
    .fallback-header h3 {
        font-size: 1.4rem;
        font-weight: 700;
        margin: 0;
        font-family: 'SimHei', 'Heiti SC', 'Microsoft YaHei UI', 'Microsoft YaHei', sans-serif;
    }
    
    .fallback-close {
        background: none;
        border: none;
        font-size: 2rem;
        color: white;
        cursor: pointer;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.3s ease;
        line-height: 1;
    }
    
    .fallback-close:hover {
        background: rgba(255, 255, 255, 0.2);
    }
    
    .fallback-body {
        padding: 32px 28px;
    }
    
    .fallback-title {
        font-size: 1.2rem;
        font-weight: 700;
        color: #2c3e50;
        text-align: center;
        margin-bottom: 24px;
        font-family: 'SimHei', 'Heiti SC', 'Microsoft YaHei UI', 'Microsoft YaHei', sans-serif;
    }
    
    .fallback-options {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 24px;
    }
    
    .fallback-btn {
        width: 100%;
        height: 50px;
        border: none;
        border-radius: 12px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        font-family: 'SimHei', 'Heiti SC', 'Microsoft YaHei UI', 'Microsoft YaHei', sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
    }
    
    .ios-btn {
        background: linear-gradient(135deg, #007aff 0%, #0051d5 100%);
        color: white;
        box-shadow: 0 4px 15px rgba(0, 122, 255, 0.3);
    }
    
    .android-btn {
        background: linear-gradient(135deg, #34a853 0%, #137333 100%);
        color: white;
        box-shadow: 0 4px 15px rgba(52, 168, 83, 0.3);
    }
    
    .copy-btn {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }
    
    .fallback-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    }
    
    .fallback-tip {
        padding: 16px;
        background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
        border-radius: 12px;
        border-left: 4px solid #ff9500;
        font-size: 0.9rem;
        color: #e65100;
        line-height: 1.6;
        font-family: 'SimHei', 'Heiti SC', 'Microsoft YaHei UI', 'Microsoft YaHei', sans-serif;
    }
    
    /* 移动端适配 */
    @media (max-width: 767px) {
        .fallback-content {
            width: 95%;
            margin: 20px;
        }
        
        .fallback-header {
            padding: 20px 24px;
        }
        
        .fallback-header h3 {
            font-size: 1.2rem;
        }
        
        .fallback-body {
            padding: 28px 24px;
        }
        
        .fallback-btn {
            height: 48px;
            font-size: 0.95rem;
        }
        
        .fallback-title {
            font-size: 1.1rem;
        }
        
        .fallback-tip {
            font-size: 0.85rem;
        }
    }
`;

document.head.appendChild(style);