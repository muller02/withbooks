window.addEventListener("load", function () {
  let searchBook = this.document.querySelector("#search-book");
  let btn = searchBook.querySelector(".btn");
  let resultList = searchBook.querySelector(".result-list");
  let queryInput = searchBook.querySelector(".query-input");
  let inputReset = searchBook.querySelector(".input-reset");
  let formGroup = this.document.querySelector(".form-group");

  let previewPanel = formGroup.querySelector(".preview-panel");

  inputReset.onclick = function (e) {
    queryInput.value = "";
    resultList.innerHTML = "";

  queryInput.disabled=false


  };

  resultList.onclick = function (e) {
    // 사용자가 클릭한게 책이라면
    // .book 요소를 선택한다
    // 그 요소 안에서 h1을 찾는다
    // 찾은 h1 요소의 textContent 읽는다
    // textContent를 queryInput에 넣는다
    if (e.target.closest(".book")) {
      const book = e.target.closest(".book");
      const bookH1 = book.querySelector(".book-title");
      const bookTitle = bookH1.textContent;

      let bookId = book.getElementsByTagName("div")[0].textContent;
      queryInput.value = bookTitle;

      document.querySelector(".id-input").value = bookId;
      queryInput.setAttribute("disabled", true);
    }

    resultList.innerHTML = "";
  };

  btn.onclick = function (e) {
    e.preventDefault();

    if(queryInput.value == "" || queryInput.value.length < 2 ){
      alert("2글자 이상 입력해주세요.");
      return;
    }

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    //비동기 처리
    xhr.onload = function () {
      //콜백 함수
      resultList.innerHTML = "";

      var list = JSON.parse(this.responseText);

      var bookCount = list.length;
      searchResultHtml = `<div class="mb:3 ml:2 fw:3 mt:3">검색결과 <span class="fw:3 mt:2">${bookCount} 개</span></div>`;
      resultList.insertAdjacentHTML("beforeend", searchResultHtml);

      for (book of list) {
        let pubDate = book.pubDate.substr(0,10);
        let sectionHTML = ` <section class="book item d:flex pl:3 py:3 csr:pointer">
                                <h1 class="d:none">책정보</h1>
                                <div class="book-id d:none">${book.id}</div>
                                <div class="h: w:2 mr:5 text-align:center fl-shrink:0 box-shadow-custom">
                                    <img src="${book.cover}" alt="책이미지" class="book-cover h:100p w:100p ">
                                </div>
                                <div class="d:flex flex-direction:column" title="${book.title}">
                                    <div class="book-title fs:4 fw:3 mb:2 ln-clamp:2">${book.title}</div>
                                    <div class="book-author fs:2 fw:2 mb:1 ln-clamp:1">${book.author} 저</div>
                                    <div class="book-publisher fs:2 color:base-7 ln-clamp:1">${book.publisher}</div>
                                    <div class="fs:2 color:base-7">${pubDate}</div>
                                </div>
                            </section>`;

        resultList.insertAdjacentHTML("beforeend", sectionHTML);

        book = resultList.querySelector(".book");
      }
    };

    // false 를 붙이면 동기
    var q = queryInput.value;

    xhr.open("GET", `/api/book/list?q=${q}&c=0`);
    xhr.send();
  };
});


// 텍스트 에디터
window.onload = function () {
  const textArea = document.querySelector(".text-area");
  const regBtn = document.querySelector(".reg-btn");
  const queryInput = document.querySelector(".query-input");

  const editer = document.querySelector("#editor");
  // <!-- Initialize Quill editor -->
  const quill = new Quill("#editor", {
    modules: {
      syntax: true,
      toolbar: "#toolbar-container",
    },
    placeholder: "여기에 입력해 주세요",
    theme: "snow",
  });

  // 글자수 제한
  const maxLength = 600;
  const restrict = document.querySelector(".restrict");

  quill.on("editor-change", (e) => {
    const length = quill.getLength();

    if (length > maxLength) {
      quill.deleteText(maxLength, length);

      restrict.classList.add("fade-out");
    } else {
      restrict.classList.remove("fade-out");
    }
  });



  // 내용이 변경될 때마다 함수 호출
  function regBtnbgColorChange() {
    // 에디터가 텍스트를 넣어주는 div안의 innerText가 빈 문자열이 아니거나, 책 검색 input이 공백이 아닐 때 실행

    const qlEditor = document.querySelector(".ql-editor > p "); // qlEditor 클래스 하위 p 선택
    let qlEditorChild = qlEditor.children; //  p의 자식 => <br>

    console.log('dsaff= ' , qlEditor)
    let existContent = qlEditorChild.item(0) === null;
    let existQuerInput = queryInput.value !== "";

    if (existContent && existQuerInput) {
      regBtn.classList.add("bg-color:main-5"); //bg-color:main-5 컬러 추가
    } else {
      regBtn.classList.remove("bg-color:main-5");
      regBtn.classList.add("bg-color:main-3");
    }
  }

  editer.addEventListener("keyup", regBtnbgColorChange); //editer에 키가 입력 될 떄 마다 함수 호출
  queryInput.addEventListener("input", regBtnbgColorChange); //editer에 키가 입력 될 떄 마다 함수 호출

  const qlEditor = document.querySelector(".ql-editor > p "); // qlEditor 클래스 하위 p 선택
  let qlEditorChild = qlEditor.children; // qlEditor의 자식들
  regBtn.onclick = function (e) {
    if (queryInput.value === "") {
      alert("책을 입력 해주세요");
      e.preventDefault();
    }

    let qlEditorChildTagName; // qlEditorChild의 tagName 을 저장 할 변수
    if (qlEditorChild.item(0) !== null) {
      qlEditorChildTagName = qlEditorChild.item(0).tagName; //qlEditor 자식들 중 첫번째 자식 br 선택
    }
    if (qlEditorChildTagName === "BR") {
      alert("내용을 입력 해주세요");
      e.preventDefault();
    }
    textArea.classList.add("ln-h:1.75");

    textArea.innerHTML = quill.getSemanticHTML();
  };
};

//////////////////////////////////////////////////////////

let imgArr = []; // 삭제 이미지 저장소
window.addEventListener("load", function () {
  let formGroup = this.document.querySelector(".form-group");
  let imgInput = formGroup.querySelector(".img-input");

  let previewPanel = formGroup.querySelector(".preview-panel");
  let imgLabel = formGroup.querySelector(".img-label");


  // 이미지 임시 저장소 생성 (이유 : input에 이미지를 또 넣으면 마지막 이미지로 초기화 되기 때문)
  let datatransfer = new DataTransfer();

  // 입력받은 이미지들을 처리(저장 및 img-panel에 이미지 추가)해주는 함수



  function inputImgHandler(files) {

    //파일 타입과 , 크기 검증
    for (let file of files) {
      if (file.type.indexOf("image/") != 0) {
        alert("이미지만 업로드 할 수 있습니다.");
        return;
      }

      if (file.size > 100 * 1024 * 1024) {
        alert("크기는 100KB 이하만 업로드 할 수 있습니다.");
        return;
      }
    }

    //파일을 dataTrasfer에 저장
    for (let file of files) {

      //전역에 있는 datatransfer에 fiels를 모두 담기
      datatransfer.items.add(file);


      // 사용자가 등록 버튼을 눌렀을 경우 최신의 이미지파일들을 submit 해야 하기 때문이다
      imgInput.files = datatransfer.files;


      let reader = new FileReader();
      //콜백 함수
      reader.onload = function (e) {
        let img = document.createElement("img");
        let imgParentDiv = document.createElement("div");
        let deleteDiv = document.createElement("div");

        img.src = e.target.result;  // 콜백으로 받은 url을 이미지 엘리먼트 src 값으로 저장

        // ========== 엘리먼트 클래스 추가 및 엘리먼트 추가 ==========
        img.classList.add("h:3", "w:3", "bd-radius:3");
        previewPanel.append(imgParentDiv);

        imgParentDiv.classList.add("pos:relative", "mr:2", "cursor:pointer");
        imgParentDiv.append(img);

        deleteDiv.classList.add(
          "pos:absolute",
          "right:1",
          "top:1",
          "icon-color:main-2",
          "icon",
          "icon:x"
        );


        //  ========== 삭제 버튼 클릭시 이미지 삭제 ==========
        //삭제 버튼에 data 속성을 지정하고, 값을 file의 lastModified를 지정한다.
        deleteDiv.setAttribute('data-index', file.lastModified);


        deleteDiv.addEventListener("click", function (e) {

          //클릭 대상이 삭제 버튼이 아닐시 종료
          if (!e.target.classList.contains("icon:x")) return;

          //삭제 버튼의 data-index 값을 가지고 와 Number 형으로 변경
          let removeTargetId = parseInt( e.target.dataset.index);

          const files = imgInput.files;

          //삭제 한 후의 files와 연결하기 위한 DataTransfer
          const deleteFilterDataTransfer = new DataTransfer();

          //input에 있는 파일 객체를 배열로 변경 한 후 , files에서 file을 하나 씩 꺼낸 후
          //lastModified 와 삭제 버튼의
          Array.from(files).filter(file =>  file.lastModified !==  removeTargetId)
              .forEach((file,index) =>{

            deleteFilterDataTransfer.items.add(file);

              })

          imgInput.files = deleteFilterDataTransfer.files;


          const deleteBtn = e.target;
          const deleteBtnParent = deleteBtn.parentNode;
          deleteBtnParent.remove();


        });


        imgParentDiv.append(deleteDiv);
      };

      // 주어진 파일을 읽어들이고, 해당 파일의 내용을 Data URL 형식으로 변환하여  콜백함수에 반환
      reader.readAsDataURL(file);
    }
  }

  // imgLabel.ondragleave = function (e) {
  //   console.log("드래그 리브");
  //   imgLabel.classList.remove("valid");
  //   imgLabel.classList.remove("invalid");
  // };

  // // 드래그 오버 => 사용안함
  //   imgLabel.ondragover = function (e) {
  //     e.preventDefault();
  //     e.stopPropagation();
  //     console.log("드래그 오버");
  //
  //     var valid =
  //       e.dataTransfer &&
  //       e.dataTransfer.types &&
  //       e.dataTransfer.types.indexOf("Files") >= 0; //배열의 indexOf메소드다. 문자열의 메소드와 이름이 같아서 착각할 수 있으니 주의
  //
  //     if (valid) imgLabel.classList.add("valid");
  //     else imgLabel.classList.add("invalid");
  //   };

  // 드래그 앤 드랍 시 처리
  // imgLabel.ondrop = function (e) {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   console.log("드래그 드랍");
  //
  //   inputImgHandler(e.dataTransfer.files);
  // };

  // 이미지 직접 input 시 처리
  imgInput.oninput = function (e) {
    inputImgHandler(e.target.files);
    e.target.files=null;  //이 부분이 있어야, 인풋에 파일 넣고, 다음 또 인풋을 클릭해서 넣을 떄 초기화  가능 중요!

  };
});



// 삭제를 누르면  src d
