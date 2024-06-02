window.addEventListener("load", function () {
  let searchBook = this.document.querySelector("#search-book");
  let btn = searchBook.querySelector(".btn");
  let resultList = searchBook.querySelector(".result-list");
  let queryInput = searchBook.querySelector(".query-input");
  let inputReset = searchBook.querySelector(".input-reset");
  let formGroup = this.document.querySelector(".form-group");

  let previewPanel = formGroup.querySelector(".preview-panel");



});

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
  const maxLength = 700;
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
  const shortsContent = document.querySelector(".shorts-content");

  let content = shortsContent.dataset.content;

  const output = content.replace(/<[^>]*>/g, ""); //html 태그 제거 1
  /**
   * <: 문자열에서 < 문자를 찾기
   * [^>]: > 문자를 제외한 어떤 문자열.
   * *: 바로 앞에 있는 패턴이 0번 이상 반복.
   * >: 문자열에서 > 문자를 찾기.
   * 찾은 value 를 공백으로 제거
   */
  const output2 = output.replace(/[-<>]/g, ""); //html 태그 제거 2

  quill.setText(output2);

  // 내용이 변경될 때마다 함수 호출
  // function regBtnbgColorChange() {
  //   // 에디터가 텍스트를 넣어주는 div안의 innerText가 빈 문자열이 아니거나, 책 검색 input이 공백이 아닐 때 실행
  //
  //   if (editer.innerText.trim() !== "" || queryInput.value !== "") {
  //     regBtn.classList.add("bg-color:main-5"); //bg-color:main-5 컬러 추가
  //   } else {
  //     regBtn.classList.remove("bg-color:main-5");
  //     regBtn.classList.add("bg-color:main-3");
  //   }
  // }

  // //keyup
  // editer.addEventListener("keyup", regBtnbgColorChange);
  // queryInput.addEventListener("input", regBtnbgColorChange);

  regBtn.onclick = function (e) {
    // if (queryInput.value === "") {
    //   alert("책을 입력 해주세요");
    //   e.preventDefault();
    // }
    // if (textArea.value === "") {
    //   alert("내용을 입력 해주세요");
    //   e.preventDefault();
    // }
    textArea.classList.add("ln-h:1.75");
    textArea.innerHTML = quill.getSemanticHTML();
    console.log(textArea.innerText);
  };
};

/**
 *  서버에서 데이터를 뿌려준다 .
 *
 */

//////////////////////////////////////////////////////////
window.addEventListener("load", function () {
  var formGroup = this.document.querySelector(".form-group");
  var imgInput = formGroup.querySelector(".img-input");

  var previewPanel = formGroup.querySelector(".preview-panel");
  var imgLabel = formGroup.querySelector(".img-label");

  var previewPanel = formGroup.querySelector(".preview-panel");

  var datatransfer = new DataTransfer();

  // 입력받은 이미지들을 처리(저장 및 img-panel에 이미지 추가)해주는 함수
  function inputImgHandler(files) {
    for (var file of files) {
      if (file.type.indexOf("image/") != 0) {
        alert("이미지만 업로드 할 수 있습니다.");
        return;
      }

      if (file.size > 100 * 1024 * 1024) {
        alert("크기는 100KB 이하만 업로드 할 수 있습니다.");
        return;
      }
    }

    for (var file of files) {
      datatransfer.items.add(file);
      imgInput.files = datatransfer.files;

      console.log(imgInput.files);

      var reader = new FileReader();

      reader.onload = function (e) {
        var img = document.createElement("img");

        img.src = e.target.result;
        img.classList.add("h:3", "bd-radius:3", "mr:3", "w:3", "h:3");
        previewPanel.append(img);

        //렌더리이이이잉~~~~
        setTimeout(() => {
          img.classList.add("slide-in");
        }, 10);
      };

      reader.readAsDataURL(file);
    }
  }

  imgLabel.ondragleave = function (e) {
    console.log("드래그 리브");
    imgLabel.classList.remove("valid");
    imgLabel.classList.remove("invalid");
  };

  // 드래그 오버
  imgLabel.ondragover = function (e) {
    e.preventDefault();
    e.stopPropagation();
    console.log("드래그 오버");

    var valid =
      e.dataTransfer &&
      e.dataTransfer.types &&
      e.dataTransfer.types.indexOf("Files") >= 0; //배열의 indexOf메소드다. 문자열의 메소드와 이름이 같아서 착각할 수 있으니 주의

    if (valid) imgLabel.classList.add("valid");
    else imgLabel.classList.add("invalid");
  };

  // 드래그 앤 드랍 시 처리
  imgLabel.ondrop = function (e) {
    e.preventDefault();
    e.stopPropagation();
    console.log("드래그 드랍");

    inputImgHandler(e.dataTransfer.files);
  };

  // 이미지 직접 input 시 처리
  imgInput.oninput = function (e) {
    inputImgHandler(e.target.files);
  };
});

window.addEventListener("load",function (e){

  const previewPanel = document.querySelector(".preview-panel");
  const regBtn  = document.querySelector(".reg-btn");
  const formGroup = document.querySelector(".form-group");

  let imgArr =[];

  previewPanel.addEventListener("click",function (e){

    console.log(e.target.nodeName);
    if(!e.target.classList.contains("delete-pic"))
      return;

    // 이미지 엘리먼트 선택
    let imgSection = e.target.previousElementSibling;

    //이미지 엘리먼트 부모 선택
    let imgSectionParent = imgSection.parentElement;

    let imgSrc = imgSection.src;
    let relativePath = imgSrc.substring(imgSrc.indexOf('shorts/') + 7); // 'shorts/' 다음부터 추출
    // imgArr.push(relativePath);
    // console.log(imgArr)

    console.log(relativePath);

    imgSectionParent.classList.add("d:none");

    const newInput = document.createElement("input"); // input 엘리먼트 생성
    newInput.type = "hidden"; // 숨겨진 input으로 설정
    newInput.name = "imgPaths"; // 이름 설정
    newInput.value = relativePath; // 값 설정

    formGroup.appendChild(newInput);



    //json 으로 변경
    // const imgJson = JSON.stringify(imgArr);
    //
    // regBtn.addEventListener("click",function (){
    //
    //   fetch('/shorts/edit', {
    //     method: 'POST', // 요청 메서드는 POST입니다.
    //     headers: {
    //       'Content-Type': 'application/json' // 요청의 Content-Type을 JSON으로 설정합니다.
    //     },
    //     body: imgJson // JSON 데이터를 요청 본문에 포함합니다.
    //   })
    //
    // })


  })


})