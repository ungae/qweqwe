// DOM Elements
const pages = {
    landing: document.getElementById('landing-page'),
    upload: document.getElementById('upload-page'),
    loading: document.getElementById('loading-page'),
    result: document.getElementById('result-page')
};

const imageUploadInput = document.getElementById('image-upload');
const imagePreview = document.getElementById('image-preview');
const previewContainer = document.getElementById('preview-container');
const uploadBox = document.querySelector('.upload-box');
const analyzeBtn = document.getElementById('analyze-btn');
const loadingText = document.getElementById('loading-text');

let uploadedImageSrc = '';

// Result Data Database
const resultTypes = [
    {
        title: "상견례 프리패스상",
        desc: "어머님, 아버님이 보자마자 함박웃음을 지으실 관상입니다. 신뢰감 있는 눈매와 온화한 미소가 특징이네요. 명절에 용돈 두둑히 받으실 것 같습니다.",
        score: { trust: 98, likeability: 95, charisma: 40 }
    },
    {
        title: "면접 프리패스상",
        desc: "성실함과 똑똑함이 얼굴에 묻어있습니다. 대기업 인사팀장이 놓치고 싶지 않아 할 인재상! 꼼꼼하고 야무진 살림꾼 느낌도 납니다.",
        score: { trust: 92, likeability: 88, charisma: 60 }
    },
    {
        title: "문전박대상",
        desc: "앗... 조금은 차가워 보일 수 있는 인상입니다. 하지만 알고 보면 따뜻한 도시 남자/여자! 첫인상은 강렬하지만 볼매(볼수록 매력) 스타일이시네요.",
        score: { trust: 30, likeability: 40, charisma: 95 }
    },
    {
        title: "주말농장상",
        desc: "사람 좋고 넉넉한 인심이 느껴집니다. 주말마다 상추 뜯어서 나눠줄 것 같은 편안한 매력의 소유자! 며느리/사위 삼고 싶은 1순위입니다.",
        score: { trust: 85, likeability: 98, charisma: 20 }
    },
    {
        title: "천재 아티스트상",
        desc: "평범함을 거부하는 자유로운 영혼의 관상입니다. 어른들은 조금 낯설어 할 수 있지만, 당신만의 독특한 매력이 넘쳐흐르네요!",
        score: { trust: 50, likeability: 60, charisma: 90 }
    }
];

// Navigation Functions
function showPage(pageName) {
    Object.values(pages).forEach(page => {
        page.classList.remove('active');
        // Reset scroll
        page.scrollTop = 0;
    });
    pages[pageName].classList.add('active');
}

function startTest() {
    showPage('upload');
}

function goBack() {
    showPage('landing');
    resetUpload();
}

function retryTest() {
    resetUpload();
    showPage('upload');
}

// Upload Functions
function triggerUpload() {
    imageUploadInput.click();
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            uploadedImageSrc = e.target.result;
            imagePreview.src = uploadedImageSrc;

            // UI Updates
            uploadBox.classList.add('hidden');
            previewContainer.classList.remove('hidden');
            analyzeBtn.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
}

function resetUpload() {
    imageUploadInput.value = '';
    uploadedImageSrc = '';
    uploadBox.classList.remove('hidden');
    previewContainer.classList.add('hidden');
    analyzeBtn.classList.add('hidden');
}

// Analysis Logic
function startAnalysis() {
    if (!uploadedImageSrc) return;

    showPage('loading');

    // Simulate Analysis Steps
    const messages = [
        "얼굴 윤곽 스캔 중...",
        "눈매 데이터 분석 중...",
        "관상학적 데이터 대조 중...",
        "결과 도출 중..."
    ];

    let step = 0;
    const interval = setInterval(() => {
        if (step < messages.length) {
            loadingText.textContent = messages[step];
            step++;
        } else {
            clearInterval(interval);
            showResult();
        }
    }, 800);
}

function showResult() {
    // Randomly select a result (Mock Logic)
    // In a real app, this would use a hash of the image data or a real ML model result
    const randomIndex = Math.floor(Math.random() * resultTypes.length);
    const result = resultTypes[randomIndex];

    // Populate Data
    document.getElementById('result-title').textContent = result.title;
    document.getElementById('result-desc').textContent = result.desc;
    document.getElementById('result-user-img').src = uploadedImageSrc;

    // Animate Bars
    const bars = document.querySelectorAll('.progress-fill');
    bars[0].style.width = '0%';
    bars[1].style.width = '0%';
    bars[2].style.width = '0%';

    showPage('result');

    // Trigger animation after page load
    setTimeout(() => {
        bars[0].style.width = result.score.trust + '%';
        bars[1].style.width = result.score.likeability + '%';
        bars[2].style.width = result.score.charisma + '%';
    }, 300);
}

function shareResult() {
    const resultTitle = document.getElementById('result-title').textContent;
    const shareText = `나의 얼굴상 테스트 결과는: [${resultTitle}] 입니다! \n당신도 지금 바로 확인해보세요.`;
    const shareUrl = window.location.href;

    if (navigator.share) {
        navigator.share({
            title: '상견례 프리패스상 테스트',
            text: shareText,
            url: shareUrl
        }).then(() => {
            console.log('Thanks for sharing!');
        }).catch(console.error);
    } else {
        // Fallback: Copy to clipboard
        const textArea = document.createElement('textarea');
        textArea.value = `${shareText} \n${shareUrl}`;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            alert('결과가 클립보드에 복사되었습니다! 친구들에게 공유해보세요.');
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
            alert('공유하기를 실패했습니다. URL을 직접 복사해주세요.');
        }
        document.body.removeChild(textArea);
    }
}
