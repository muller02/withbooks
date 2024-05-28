window.addEventListener("load", function(e) {
    let bookIntro = document.querySelector(".book-intro");
    let bookIntroDiv = bookIntro.querySelector(".book-intro-div");
    let countImg = bookIntroDiv.querySelectorAll("img");
    let currentIndex = 0; // 초기값을 0으로 설정

    const img = document.querySelector('.book-intro-div img');
    let imgSize = img.clientWidth;


    let moveLen = -imgSize; // 이미지의 너비로 이동 거리 설정
    let intervalId;

    function slideNextImage() {
        currentIndex = (currentIndex + 1) % countImg.length; // currentIndex를 다음 이미지로 갱신
        if (currentIndex === 0) {

            bookIntroDiv.classList.remove("effect");
            bookIntroDiv.style.transform = `translateX(0px)`;
            bookIntroDiv.classList.add("effect");

        }
        bookIntroDiv.style.transform = `translateX(${moveLen * currentIndex}px)`;


    }

    function startSlide() {
        intervalId = setInterval(slideNextImage, 3300);
    }

    function stopSlide() {
        clearInterval(intervalId);
    }

    bookIntroDiv.addEventListener("mouseenter", stopSlide);
    bookIntroDiv.addEventListener("mouseleave", startSlide);

    // 슬라이드 조건 확인
    function checkSlideCondition() {
        stopSlide(); // 슬라이드를 멈추고 조건을 확인

        if (window.innerWidth < 768) {
            moveLen = -imgSize; // 기본 이동 거리
        } else {
            moveLen = -imgSize; // 768px 이상일 때 이동 거리
        }

        // 슬라이드 위치 초기화
        bookIntroDiv.classList.remove("effect");
        bookIntroDiv.style.transform = `translateX(${moveLen * currentIndex}px)`;
        setTimeout(() => {
            bookIntroDiv.classList.add("effect");
        }, 20);

        startSlide(); // 슬라이드를 다시 시작
    }

    // 초기화할 때 슬라이드 조건 확인
    checkSlideCondition();

    // 윈도우 크기 변경 감지하여 슬라이드 조건 확인
    let resizeTimeout;
    window.addEventListener("resize", function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            checkSlideCondition(); // 조건 재확인
        }, 100);
    });
});

document.addEventListener('DOMContentLoaded', function() {

    var scrollAmount = 310; // 스크롤 이동 거리

    document.querySelectorAll('.scroll-box').forEach(function(scrollBox) {
        scrollBox.addEventListener('wheel', function(event) {
            if (event.deltaY > 0) {
                scrollBox.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            } else {
                scrollBox.scrollBy({
                    left: -scrollAmount,
                    behavior: 'smooth'
                });
            }
            event.preventDefault();
        });
    });
});


// =========================================================================
// bestseller, new section
const bookSection = document.querySelector("#book-section");
const ul = bookSection.querySelector(".book-content>ul");
const bestseller = bookSection.querySelector(".bestseller");
const newBook = bookSection.querySelector(".new-book");

// bestseller 비동기 데이터 통신
bestseller.onclick = function(e){
    if(bestseller.classList.contains("book-on"))
        return;
    else{
        bestseller.classList.toggle("book-on");
        newBook.classList.toggle("book-on");
    }

    fetch("/api/home/bestseller")
    .then((response)=>response.json())
    .then((data)=>{
        makeTemplate(data);
    })

}

// new 비동기 데이터 통신
newBook.onclick = function(e){
    if(newBook.classList.contains("book-on"))
        return;
    else{
        newBook.classList.toggle("book-on");
        bestseller.classList.toggle("book-on");
    }

    fetch("/api/home/new")
    .then((response)=>response.json())
    .then((data)=>{
        makeTemplate(data);
    })

}

function makeTemplate(list){
    ul.innerHTML = "";
    let index = 1;
    let template = "";
    for(book of list){
        let pubDate = book.pubDate.substr(0, 10);
        template +=  `
        <li class="shorts-shadow min-width:6 box-sizing:border-box">
            <a class="d:flex  p:3 gap:4 m:2  bg-color:main-1 border-radius:3 " href="/book/detail?id=${book.id}&m=1">
                <div class="fw:3 fs:3">${index++}</div>
                <div class="book-img-wh">
                    <img src="${book.cover}" class="book-img-wh">
                </div>
                <div>
                    <div class="fs:3 fw:3 ln-clamp:1">${book.title}</div>
                    <div class="ln-clamp:1">${book.author}</div>
                    <div class="ln-clamp:1">${book.publisher}</div>
                    <div>${pubDate}</div>
                </div>
            </a>
            </li>
        `;
    }
    ul.insertAdjacentHTML("beforeend", template);
}

