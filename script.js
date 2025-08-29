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
        // 检测设备类型并跳转到相应应用商店
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        let downloadUrl = '';
        
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            // iOS设备 - 跳转到App Store中的"高途医考"
            downloadUrl = 'https://apps.apple.com/cn/app/%E9%AB%98%E9%80%94%E5%8C%BB%E8%80%83/id6702016387';
        } else if (/android/i.test(userAgent)) {
            // Android设备 - 根据机型跳转到对应应用商店
            if (/MiuiBrowser/i.test(userAgent) || /XiaoMi/i.test(userAgent)) {
                // 小米设备 - 小米应用商店
                downloadUrl = 'mimarket://details?id=com.gaotu.yikao';
            } else if (/HuaweiBrowser/i.test(userAgent) || /HUAWEI|HONOR/i.test(userAgent)) {
                // 华为设备 - 华为应用市场
                downloadUrl = 'appmarket://details?id=com.gaotu.yikao';
            } else if (/VivoBrowser/i.test(userAgent) || /vivo/i.test(userAgent)) {
                // vivo设备 - vivo应用商店
                downloadUrl = 'vivomarket://details?id=com.gaotu.yikao';
            } else if (/OppoBrowser/i.test(userAgent) || /OPPO/i.test(userAgent)) {
                // OPPO设备 - OPPO软件商店
                downloadUrl = 'oppomarket://details?id=com.gaotu.yikao';
            } else if (/SamsungBrowser/i.test(userAgent) || /Samsung/i.test(userAgent)) {
                // 三星设备 - Galaxy Store
                downloadUrl = 'samsungapps://ProductDetail/com.gaotu.yikao';
            } else {
                // 其他Android设备 - Google Play商店或通用下载
                downloadUrl = 'https://play.google.com/store/apps/details?id=com.gaotu.yikao';
            }
        } else {
            // 其他设备 - 跳转到通用下载页面
            downloadUrl = 'https://yikao.gaotuyk.com/#/pages/recruit/notice_detail?id=489&share=app&share=h5&invitationCode=p_1101AVShmN&invitationCode=p_0918PNnatY';
        }
        
        // 打开下载链接
        window.open(downloadUrl, '_blank');
        
        // 隐藏模态框
        this.hideModal();
        
        // 显示提示
        this.showNotification('正在跳转到下载页面...', 'info');
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

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    const giftPage = new NewUserGiftPage();
    
    // 全局引用，便于调试
    window.giftPage = giftPage;
    
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
`;

document.head.appendChild(style);