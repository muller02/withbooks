document.addEventListener("DOMContentLoaded", () => {
  const calendarEl = document.querySelector("#calendar-container");
  const modal = document.querySelector("#calendar-modal");
  let selectedInfo = null;
  const eventForm = modal.querySelector(".event-form");
  const eventTitle = modal.querySelector("#event-title");
  const eventStart = modal.querySelector("#event-start");
  const eventEnd = modal.querySelector("#event-end");
  const eventLocation = modal.querySelector("#event-location");
  const cancelBtn = modal.querySelector("#cancel-btn");
  const allDayCheckbox = modal.querySelector("#all-day-checkbox");
  const timeGroup = modal.querySelector(".time-group");
  const startTime = modal.querySelector("#start-time");
  const endTime = modal.querySelector("#end-time");

  // *** 서버에서 달력 데이터 가져오기 ***
  function getDataToServer(withId) {
    fetch("/api/calendar/events?wid=" + withId)
      .then((response) => response.json())
      .then((data) => {
        renderCalendar(data);
        console.log("Fetched data", data);
      })
      .catch((error) => {
        console.error("일정관리 데이터 가져오는 중 오류 발생:", error);
      });
  }

  // *** 캘린더 구조 렌더링 ***
  function renderCalendar(events) {
    // 기존에 저장된 캘린더 이벤트 불러오기
    console.log("Received events data:", events);
    const formattedEvents = events.map((event) => ({
      // entity 값 매핑하기
      id: event.id,
      title: event.title || event.content,
      start: event.start || event.startDateTime,
      end: event.end || event.endDateTime,
      allDay: event.allDay || false,
    }));

    const calendar = new FullCalendar.Calendar(calendarEl, {
      height: "700px",
      expandRows: true,
      slotMinTime: "08:00",
      slotMaxTime: "20:00",
      defaultTimedEventDuration: "01:00:00",
      now: new Date(),
      // themeSystem: "bootstrap5",
      headerToolbar: {
        left: "prev",
        center: "title",
        right: "next",
      },
      initialView: "dayGridMonth",
      navLinks: true,
      editable: true,
      selectable: true,
      nowIndicator: true,
      dayMaxEvents: true,
      locale: "ko",
      events: formattedEvents,
      dateClick: (info) => handleDateClick(info),
      select: (info) => handleSelect(info),
    });

    calendar.render();

    // 모달창 이벤트 리스너
    cancelBtn.addEventListener("click", handleCancel);
    eventForm.addEventListener("submit", (e) =>
      handleEventFormSubmit(e, calendar),
    );
    allDayCheckbox.addEventListener("change", handleAllDayCheckboxChange);
    startTime.addEventListener("change", () => handleTimeChange(startTime));
    endTime.addEventListener("change", () => handleTimeChange(endTime));
  }

  // *** 날짜 클릭으로 입력 ***
  function handleDateClick(info) {
    selectedInfo = { start: info.date, end: info.date, allDay: true };
    showModal(info.dateStr, info.dateStr, true);
  }

  // *** 날짜 드래그로 입력  ***
  function handleSelect(info) {
    selectedInfo = { start: info.start, end: info.end, allDay: info.allDay };
    // const endDate = new Date(info.endStr);
    // endDate.setDate(endDate.getDate() - 1);
    showModal(info.startStr, info.endStr, info.allDay, info);
  }

  // *** 모달 표시 ***
  function showModal(start, end, allDay, info = null) {
    modal.classList.remove("d:none");
    eventStart.value = start;
    eventEnd.value = end;
    allDayCheckbox.checked = allDay;
    if (allDay) {
      timeGroup.classList.add("d:none");
      timeGroup.classList.remove("d:flex");
    } else {
      timeGroup.classList.remove("d:none");
      timeGroup.classList.add("d:flex");
      if (info) {
        startTime.value = info.startStr;
        endTime.value = info.endStr;
      }
    }
  }

  // *** 모달 취소 ***
  function handleCancel() {
    modal.classList.add("d:none");
    clearModalFields();
  }

  // *** 모달 제출 ***
  function handleEventFormSubmit(e, calendar) {
    e.preventDefault();
    const title = eventTitle.value.trim();
    let start = eventStart.value;
    let end = eventEnd.value;
    const allDay = allDayCheckbox.checked;

    if (allDay) {
      // 종일 이벤트인 경우, 종료 시간을 당일 23:59:59로 설정
      start = `${start}T00:00:00`;
      end = `${end}T23:59:59`;
    } else {
      start = `${start}T${startTime.value}`;
      end = `${end}T${endTime.value}`;
    }

    if (title && start && end) {
      sendDataToServer(title, start, end, allDay, calendar);
      calendar.addEvent({
        title: title,
        start: start,
        end: end,
        allDay: allDayCheckbox.checked,
      });
      modal.classList.add("d:none");
      clearModalFields();
    } else {
      alert("모든 필드를 입력하세요.");
    }
    console.log("모달 제출", start);
    console.log("모달 제출", end);
    console.log("모달 제출", allDay);
  }

  // *** 서버에 데이터 전송 ***
  function sendDataToServer(title, start, end, allDay, calendar) {
    const data = {
      title: title,
      start: start,
      end: end,
      allDay: allDay,
      location: eventLocation.value.trim(),
      withId: wid,
    };
    console.log("서버로 전송할 데이터:", data);

    fetch("/api/calendar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("네트워크 응답이 정상이 아닙니다.");
        }
        return response.json();
      })
      .then((responseData) => {
        if (responseData.id) {
          console.log("성공적으로 저장됨: ", responseData);
          // calendar.addEvent 추가
          calendar.addEvent({
            title: responseData.title,
            start: responseData.start,
            end: responseData.end,
            allDay: responseData.allDay,
          });
        } else {
          console.error("Server error:", responseData.error);
          alert("저장 실패");
        }
      });
  }

  // *** 종일 체크박스 변경 핸들러 ***
  function handleAllDayCheckboxChange() {
    if (allDayCheckbox.checked) {
      timeGroup.classList.add("d:none");
      timeGroup.classList.remove("d:flex");
    } else {
      timeGroup.classList.remove("d:none");
      timeGroup.classList.add("d:flex");
    }
  }

  // *** 시간 변경 핸들러 ***
  function handleTimeChange(timeInput) {
    if (!allDayCheckbox.checked) {
      const value = timeInput.value;
      if (timeInput === startTime) {
        eventStart.value = value;
      } else {
        eventEnd.value = value;
      }
    }
  }

  // *** 모달 입력 필드 초기화 ***
  function clearModalFields() {
    eventTitle.value = "";
    eventStart.value = "";
    eventEnd.value = "";
  }

  // *** url 에서 wid 추출
  function getWidFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("wid");
  }

  const wid = getWidFromUrl();
  getDataToServer(wid);
  console.log(wid);

  // *** 풀캘린더 라이브러리에서 반응형 구현하기 ***
  setTimeout(() => {
    const dateBox = document.querySelector(".fc-toolbar-title"); // 날짜 상자
    const daygridNumbers = document.querySelectorAll(".fc-daygrid-day");

    /** 화면 크기가 변경될 때마다 실행할 함수 **/
    function adjustFontSize() {
      // 현재 화면 크기가 414px 이하인지 확인
      const isMobile414 = window.matchMedia("(max-width: 414px)").matches;
      const isMobile350 = window.matchMedia("(max-width: 350px)").matches;

      // 폰트 크기를 조절할 클래스
      const smallFontClass = "small-font";
      const smallTitleClass = "small-title";

      // 날짜 상자 폰트 크기 조절
      if (isMobile350) {
        dateBox.classList.add(smallTitleClass);
        dateBox.style.fontSize = "14px";
      } else if (isMobile414) {
        dateBox.classList.add(smallTitleClass);
        dateBox.style.fontSize = "18px";
      } else {
        dateBox.classList.remove(smallTitleClass);
        dateBox.style.fontSize = "";
      }

      // 날짜 숫자 폰트 크기 조절
      daygridNumbers.forEach((number) => {
        if (isMobile414 || isMobile350) {
          number.classList.add(smallFontClass);
        } else {
          number.classList.remove(smallFontClass);
        }
      });
    }

    // 페이지 로드시 폰트 크기 조절
    adjustFontSize();

    // 화면 크기 변경 이벤트 리스너 등록
    window.addEventListener("resize", adjustFontSize);
  }, 200); // 적절한 시간을 설정하여 풀캘린더 초기화 및 렌더링이 완료된 후에 작업 수행
});
