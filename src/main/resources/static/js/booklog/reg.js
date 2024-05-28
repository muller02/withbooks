window.addEventListener("load", function () {
    let searchBox = this.document.querySelector("#search-box");
    let queryInput = searchBox.querySelector(".query-input");
    let resetBtn = searchBox.querySelector(".reset-btn");
    let resultList = searchBox.querySelector(".result-list");
    let searchBtn = searchBox.querySelector(".search-btn");

    // =============== 로컬스토리지에서 책 아이디 가져오기 ======================
    let getBookIdList = JSON.parse(localStorage.getItem("bookids"));
    let bookIdList = [];

    for (const key in getBookIdList) {
        bookIdList.push(getBookIdList[key]);
    }
    //========================================================================

    // 검색창 리셋
    resetBtn.onclick = function () {
        queryInput.value = "";
        resultList.innerHTML = "";
    };

    // =============================== 책 검색 결과 ===================================================
    searchBtn.onclick = function (e) {
        e.preventDefault();

        if(queryInput.value == "" || queryInput.value.length < 2 ){
            alert("2글자 이상 입력해주세요.");
            return;
        }

        let xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        //비동기 처리
        xhr.onload = function () {
            //콜백 함수
            resultList.innerHTML = "";

            let list = JSON.parse(this.responseText);

            // 검색결과 개수
            let bookCount = list.length;

            // 검색된 책이 있을 경우 검색결과 개수 띄우기
            // if (bookCount > 0) {
            searchResultHtml = `<div class="mb:3 ml:2 fw:3 mt:3">검색결과 <span class="fw:3 mt:2">${bookCount} 개</span></div>`;
            resultList.insertAdjacentHTML("beforeend", searchResultHtml);
            // }

            // 검색된 책이 없을 경우 검색결과 없음 멘트 띄우기
            // else {
            //     let emptyList = `
            //                     <div class="h:100p d:flex fl-dir:column jc:center ai:center">
            //                         <div class="icon icon:file icon-color:base-5">아이콘</div>
            //                         <div class="color:base-5">'${queryInput.value}'에 대한 검색 결과가 없습니다.</div>
            //                     </div>
            //     `;
            //     resultList.insertAdjacentHTML("beforeend", emptyList);
            // }

            // 검색된 책 리스트 보여주기
            for (book of list) {
                let pubDate = book.pubDate.substr(0,10);
                let sectionHTML = ` <section class="book item d:flex pl:3 py:3 csr:pointer">
                                        <h1 class="d:none">책정보</h1>
                                        <div class="book-id d:none">${book.id}</div>
                                        <div class="h:3 w:3 mr:5 text-align:center fl-shrink:0 box-shadow-custom">
                                            <img src="${book.cover}" alt="책이미지" class="book-cover h:100p object-fit:cover">
                                        </div>
                                        <div class="d:flex flex-direction:column" title="${book.title}">
                                            <div class="book-title fs:4 fw:3 mb:2 ln-clamp:2">${book.title}</div>
                                            <div class="book-author fs:2 fw:2 mb:1 ln-clamp:1">${book.author} 저</div>
                                            <div class="book-publisher fs:2 color:base-7 ln-clamp:1">${book.publisher}</div>
                                            <div class="fs:2 color:base-7">${pubDate}</div>
                                        </div>
                                    </section>`;

                resultList.insertAdjacentHTML("beforeend", sectionHTML);
            }

            // count가 10개 넘을 경우 !!
            // 다음 페이지 버튼 insert 필요함
            // 이때, 해당 태그의 onclick function에서
            // fetch로 템플릿 만들기
        };

        let q = queryInput.value;

        xhr.open("GET", `/api/book/list?q=${q}&c=0`);
        xhr.send();
    };

    // =============================== 검색된 책 선택시 새로운 북로그 작성창 생성 ================================================
    resultList.onclick = async function (e) {
        // TODO 등록된 북로그라면 알려주고 리턴하기
        // 사용자가 등록한 북로그의 아이디 값들을 가져온다
        // 사용자가 클릭한게 책이라면
        // .book 요소를 선택한다
        // 그 요소 안에서 h1을 찾는다
        // 찾은 h1 요소의 textContent 읽는다
        // textContent를 queryInput에 넣는다
        if (e.target.closest(".book")) {
            const book = e.target.closest(".book");
            const bookId = book.querySelector(".book-id").textContent;
            const bookTitle = book.querySelector(".book-title").textContent;
            const bookAuthor = book.querySelector(".book-author").textContent;
            const bookPublisher = book.querySelector(".book-publisher").textContent;
            const bookCover = book.querySelector(".book-cover").src;

            // 로컬스토리지에 저장된 책 아이디 값들 중에 선택한 책 아이디와 같은 값을 뽑아낸다.
            let booklogValid = bookIdList.filter((id) => id == bookId);
            // 만약 같은 아이디의 값이 있으면 유효성 멘트를 날리고 새로 작성하지 못하게 한다.
            if (booklogValid.length != 0) {
                // 이미 유효성 멘트가 있는 경우엔 리턴
                if (book.querySelector(".del")) return;
                // 백그라운드 컬러를 바꾸고
                book.classList.add("bg-color:base-2");
                // 유효성 멘트를 삽입한다.
                book.insertAdjacentHTML("beforeend", "<div class='del color:accent-1 flex-grow:1 text-align:end'>이미 등록된 책입니다.</div>");
                // 700밀리세컨드 뒤에 자동으로 지운다.
                setTimeout(function () {
                    book.classList.remove("bg-color:base-2");
                    let del = book.querySelector(".del");
                    del.remove();
                }, 700);
                // 그리고 리턴
                return;
            }

            // 검색된 책 결과 리스트를 지운다.
            resultList.innerHTML = "";

            // 북로그 작성시 오늘날짜 받아오기
            let today = new Date();

            // 년도
            let year = today.getFullYear();

            // 월
            let month = today.getMonth() + 1;
            //해당 월이 한자리면 앞에 '0' 붙이기
            if (month < 10) month = "0" + month;

            // 일
            let date = today.getDate();
            // 해당 일이 한자리면 앞에 '0' 붙이기
            if (date < 10) date = "0" + date;

            // 북로그 작성창 ( 책정보 + 이미지/글 작성란 )
            let sectionHTML = ` 
                            <form name="regform" action="reg" method="post" enctype="multipart/form-data" novalidate>
                                <section id="book-info" class="booklog-style">
                                    <h1 class="d:none">책 정보</h1>
                                    <div class="d:flex px:2 pos:relative">
                                        <img class="book-cover h:4 border-color:base-2 mr:2 box-shadow-custom" src=${bookCover} />
                                        <div class="d:flex fl-dir:column fl-grow:1 px:2 position:relative">
                                            <label class="n-btn n-toggle n-toggle-type:outline-box n-toggle-size:2 margin-bottom:3 font-size:1">
                                                <span class="icon icon:lock_simple icon-size:2 margin-right:1">아이콘</span>
                                                <span class="public">공개</span>
                                                <input type="checkbox" class="public-input d:none" name="public-yn" value="1" checked />
                                            </label>
                                            <div class="book-title fs:3 fw:3 pb:4">${bookTitle}</div>
                                            <div class="d:flex fs:1 pb:2">
                                                <div class="mr:1 fs:1 color:base-4">저자</div>
                                                <div class="book-author">${bookAuthor}</div>
                                            </div>
                                            <div class="d:flex fs:1">
                                                <div class="book-publisher mr:1 fs:1 color:base-4">출판사</div>
                                                <div>${bookPublisher}</div>
                                            </div>
                                        </div>
                                    </div>
                                </section>                                
                                <section id="booklog-reg-form" class="booklog-style d:flex fl-dir:column px:2 py:3">
                                    <h1 class="d:none">로그</h1>
                                    <div class="bd-top pt:3">
                                        <input class="d:none" type="number" name="book-id" value="${bookId}"/>
                                        <div class="d:flex mb:4 pos:relative">
                                        <div class="booklog-date fl-grow:1 fw:3">${year}.${month}.${date}</div>
                                        <div class="reg-cantle n-btn bg-color:base-2 mr:1"><span>취소</span></div>
                                        <button class="reg-btn n-btn bg-color:main-1 color:main-5 top:0 right:0" type="submit">등록</button>
                                    </div>
                                    <div>
                                        <label class="img-label n-btn n-btn:outline mr:1">
                                            <span class="deco icon:camera icon-color:base-9">사진 추가</span>
                                            <input class="booklog-img d:none" name="file" type="file" multiple accept=".jpg,.png,.jpeg" />
                                        </label>
                                        <div class="img-delete d:none n-btn bg-color:accent-1 mr:1"><span class="icon icon:x icon-color:base-1">사진 삭제</span></div>
                                    </div>
                                    <div class="ment fs:2 color:main-4">* 사진은 한 장만 업로드 가능합니다.</div>
                                    <div class="log-content-section d:flex fl-dir:column md:fl-dir:row lg:fl-dir:row">
                                        <section class="d:none mb:1">
                                            <h1 class="d:none">이미지 입력</h1>
                                            <div class="img-group d:flex ai:center bd-radius:5 mr:3">
                                                <div class="preview-panel"></div>
                                            </div>
                                        </section>
                                        <textarea class="booklog-content n-textbox fs:3" type="text" name="text-area" placeholder="새로운 북로그를 작성해주세요 :)"></textarea>
                                    </div>
                                </section>
                            </form>
                            `;

            resultList.insertAdjacentHTML("beforeend", sectionHTML);

            // 공개비공개 텍스트 부분
            let publicSpan = searchBox.querySelector(".public");
            // 공개비공개 input checkbox 부분
            let publicInput = searchBox.querySelector(".public-input");

            // 공개-비공개 버튼 클릭시 value값 0 또는 1로 셋팅 ( DB 저장할 값으로 보내기 위해서 )
            publicInput.onclick = function () {
                if (publicInput.checked) {
                    // 체크된 경우에는 input value에 1값 셋팅
                    publicInput.value = 1;
                    // 보여지는 텍스트를 '공개'로 변경
                    publicSpan.textContent = "공개";
                } else {
                    // 체크가 해제된 경우에 0값 셋팅
                    publicInput.value = 0;
                    // 보여지는 텍스트는 '비공개'로 변경
                    publicSpan.textContent = "비공개";
                }
            };

            // 로그 작성 폼
            let booklogRegForm = searchBox.querySelector("#booklog-reg-form");
            // 이미지 선택하는 label 세션부분
            let inputImg = booklogRegForm.querySelector(".booklog-img");
            // 선택된 이미지가 들어가는 부분
            let previewPanel = booklogRegForm.querySelector(".preview-panel");
            // 선택된 이미지 삭제하는 버튼
            let imgDeleteBtn = booklogRegForm.querySelector(".img-delete");
            // 로그 작성 섹션
            let logContentSection = booklogRegForm.querySelector(".log-content-section");
            // 로그 작성 섹션 중 사진 섹션
            let logContentImg = logContentSection.querySelector("section");
            // 로그 작성 취소
            let regCantleBtn = booklogRegForm.querySelector(".reg-cantle");
            // 등록 버튼
            let regBtn = booklogRegForm.querySelector(".reg-btn");

            // 등록 시 내용 없으면 리턴. 내용 있으면 등록 처리
            regBtn.onclick = function (e) {
                e.preventDefault();
                let file = inputImg.files["0"];
                let textarea = logContentSection.querySelector("textarea").value;

                console.log(file);
                console.log(textarea);

                if (file == undefined && textarea == "") {
                    alert("사진 또는 글을 입력해주세요!");
                    return;
                }

                document.regform.submit();
            };

            // 이미지 선택하기
            inputImg.oninput = function () {
                let file = inputImg.files["0"];

                // 타입 제약
                if (file.type.indexOf("image/") != 0) {
                    alert("이미지만 업로드 가능");
                    return;
                }

                // 크기 제약
                if (file.size > 500 * 1024) {
                    alert("이미지가 너무 큽니다.(50*1024)");
                    return;
                }

                // ======= 바이너리를 읽어와야 해서 비동기로 만든다 =======
                let reader = new FileReader();
                reader.onload = function (e) {
                    let img = document.createElement("img");
                    img.src = e.target.result;
                    img.classList.add("h:5");

                    // 사진 들어가는 섹션 보이기
                    logContentImg.classList.remove("d:none");

                    // 이미지 한개만 가능. 선택한 이미지가 있으면 지우기.
                    if (previewPanel.childNodes.length > 0) {
                        previewPanel.removeChild(previewPanel.firstChild);
                    }

                    // 가져온 이미지 삽입
                    previewPanel.append(img);
                };
                // 바이너리 파일 읽어온다.
                reader.readAsDataURL(file);

                // 이미지 선택시 이미지 삭제버튼 활성화
                if (imgDeleteBtn.classList.contains("d:none")) imgDeleteBtn.classList.remove("d:none");
            };

            // 이미지 삭제 버튼 클릭시
            imgDeleteBtn.onclick = function (e) {
                e.preventDefault();
                // 선택된 이미지 태그 지우기
                previewPanel.removeChild(previewPanel.firstChild);
                // 삭제 버튼 숨기기
                imgDeleteBtn.classList.add("d:none");
                // 사진 들어간 섹션 숨기기
                logContentImg.classList.add("d:none");

                // 사진 삭제 후 같은 사진 업로드 했을 때 이벤트 먹히는 현상 해결하기 위해
                // input value 값을 빈문자열 대입.
                inputImg.value = "";
            };

            // 취소 버튼 클릭시 북로그 리스트 페이지로 이동
            regCantleBtn.onclick = function () {
                // window.location = "list";
                history.back();
            };
        }
    };
});
