window.addEventListener("load", function(e) {

    //======================= 기존 이미지 가져오기 =====================================

    // const params = new URLSearchParams(window.location.search);
    // const boardId = params.get("id");

    const fileInput = document.getElementById('file-input');
    const boardId = fileInput.getAttribute('data-boardId');

    const url = `/with/debate/board/files/${boardId}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(files => {
            // 파일을 성공적으로 가져온 경우에 대한 처리
            loadFiles(files);
        })
        .catch(error => {
            // 네트워크 오류 또는 다른 문제로 인해 파일을 가져오지 못한 경우에 대한 처리
            console.error('There was a problem with the fetch operation:', error);
        });

    function loadFiles(files) {
        const fileList = document.querySelector("#file-list");
        for(let i=0; i<files.length; i++) {
            const item = document.createElement('div');
            const fileName = document.createTextNode(files[i].originalImg);
            const deleteButton = document.createElement('button');
            deleteButton.addEventListener('click', (event) => {
                item.remove();
                event.preventDefault();
                const deleteItem = document.createElement('input');
                deleteItem.setAttribute("name", "deleteFilesId");
                deleteItem.setAttribute("value", files[i].id);
                deleteItem.setAttribute("type", "hidden");
                fileList.appendChild(deleteItem);
            });
            deleteButton.innerText="X";
            item.appendChild(fileName);
            item.appendChild(deleteButton);
            fileList.appendChild(item);
        }
    }


    //======================= 이미지 선택 =====================================

    // const fileInput = document.getElementById("file-input");

    console.log(fileInput);

    let selectedFiles = [];
    let dataTransfer = new DataTransfer();

    fileInput.addEventListener("change", function (e) {
        const fileList = document.getElementById("file-list");
        console.log(fileList);

        let files = e.target.files;
        console.log(files);

        for (let i = 0; i < files.length; i++) {
            selectedFiles.push(files[i]);
            const item = document.createElement("div");
            const fileName = document.createTextNode(files[i].name);
            const deleteButton = document.createElement("button");
            deleteButton.addEventListener("click", function (e) {
                const index = selectedFiles.indexOf(files[i]);
                selectedFiles.splice(index, 1);
                fileList.removeChild(item);
                updateFileInput();
            })
            deleteButton.innerText = "X";
            item.appendChild(fileName);
            item.appendChild(deleteButton);
            fileList.appendChild(item);
        }

        updateFileInput();
    })

    function updateFileInput() {
        dataTransfer.items.clear();
        selectedFiles.forEach(file => {
            dataTransfer.items.add(file);
        });
        fileInput.files = dataTransfer.files;
    }
})