package kr.withbooks.web.controller;

import jakarta.servlet.http.HttpServletRequest;
import kr.withbooks.web.config.CustomUserDetails;
import kr.withbooks.web.controller.form.BoardEditForm;
import kr.withbooks.web.controller.form.BoardForm;
import kr.withbooks.web.entity.*;
import kr.withbooks.web.service.*;
import kr.withbooks.web.util.FileStore;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.IOException;
import java.util.List;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("/board")
public class BoardController {

    private final DebateBoardService debateBoardService;
    private final DebateRoomService debateRoomService;
    private final BookService bookService;
    private final DebateTopicService debateTopicService;
    private final DebateAttachmentService debateAttachmentService;
    private final DebateCommentService debateCommentService;
    private final FileStore fileStore;
    private final UserService userService;
    private final WithMemberService withMemberService;

    @GetMapping("/list")
    public String list(
            @RequestParam(name = "rid") Long roomId,
            @RequestParam(name = "wid") Long withId,
            @RequestParam(name = "tid", required = false) Long topicId,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            Model model) {


        User user = userService.getById(userDetails.getId());
        model.addAttribute("user", user);

        Integer isWithMember = 0;
        if(userDetails != null)
            isWithMember = withMemberService.getJoinYn(withId, userDetails.getId());

        model.addAttribute("isWithMember", isWithMember);

        List<DebateBoardView> list = debateBoardService.getList(roomId, topicId);

        // 게시글의 \r\n 을 <br> 태그로 치환
        for(DebateBoardView b : list){
            String replacedStr = b.getContent().replace("\r\n", "<br>");
            b.setContent(replacedStr);
        }

        model.addAttribute("list", list);

        log.info("list = {}", list);

        DebateRoom findRoom = debateRoomService.getById(roomId, withId);

        {
            String replacedStr = findRoom.getNotice().replace("\r\n", "<br>");
            findRoom.setNotice(replacedStr);
        }

        model.addAttribute("debateRoom", findRoom);

        log.info("debateRoom = {}", findRoom);

        List<DebateTopic> topicList = debateTopicService.getList(roomId);

        // 게시글의 \r\n 을 <br> 태그로 치환
        for(DebateTopic t : topicList){
            String replacedStr = t.getContent().replace("\r\n", "<br>");
            t.setContent(replacedStr);
        }
        model.addAttribute("topicList", topicList);

        if (topicId != null) {
            DebateTopic findTopic = debateTopicService.getById(topicId);
            model.addAttribute("selectedOption", findTopic.getId());
        }


        return "board/list";
    }

    @GetMapping("/detail")
    public String detail(
            @RequestParam Long id,
            @RequestParam("wid") Long withId,
            @RequestParam("rid") Long roomId,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            Model model) {

        User loginUser = userService.getById(userDetails.getId());

        Integer isWithMember = 0;
        if(userDetails != null)
            isWithMember = withMemberService.getJoinYn(withId, userDetails.getId());


        DebateBoard findBoard = debateBoardService.getById(id);
        Long userId = findBoard.getUserId();
        User findUser = userService.getById(userId);

//        Long roomId = findBoard.getRoomId();
        Long topicId = findBoard.getTopicId();
        List<DebateCommentView> debateCommentList = debateCommentService.getListById(id);

        // 게시글의 \r\n 을 <br> 태그로 치환
        {
            String replacedStr = findBoard.getContent().replace("\r\n", "<br>");
            findBoard.setContent(replacedStr);
        }

        // 게시글의 \r\n 을 <br> 태그로 치환
        for(DebateCommentView c : debateCommentList){
            String replacedStr = c.getContent().replace("\r\n", "<br>");
            c.setContent(replacedStr);
        }


        DebateRoom findRoom = debateRoomService.getById(roomId);
        Long bookId = findRoom.getBookId();
        Book book = bookService.getById(bookId);

        DebateTopic findTopic = debateTopicService.getById(topicId);
        log.info("findTopic = {}", findTopic);

        List<DebateAttachment> imgList = debateAttachmentService.getAllFileByBoardId(id);
        log.info("imgList = {}", imgList);

        model.addAttribute("board", findBoard);
        model.addAttribute("book", book);
        model.addAttribute("topic", findTopic);
        model.addAttribute("imgList", imgList);
        model.addAttribute("debateCommentList", debateCommentList);
        model.addAttribute("user", findUser);
        model.addAttribute("isWithMember", isWithMember);
        model.addAttribute("loginUser", loginUser);


        log.info("board = {}", findBoard);
        log.info("debateCommentList ={} ", debateCommentList);

        return "board/detail2";
    }

    @GetMapping("/reg")
    public String reg(
        @RequestParam(name = "rid") Long roomId,
        Model model){

        List<DebateTopic> topicList = debateTopicService.getList(roomId);
        model.addAttribute("topicList", topicList);
        model.addAttribute("board", new DebateBoard());

        return "board/reg";
    }

    @PostMapping("/reg")
    public String reg(
            @Validated @ModelAttribute(name = "board") BoardForm boardForm, BindingResult bindingResult,
            @RequestParam("rid") Long roomId,
            @RequestParam(name = "wid") Long withId,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            Model model,
            HttpServletRequest request) throws IOException {

        if (bindingResult.hasErrors()) {
            log.info("errors={}", bindingResult);
            List<DebateTopic> topicList = debateTopicService.getList(roomId);
            model.addAttribute("topicList", topicList);
            return "board/reg";
        }

        Long userId = userDetails.getId();
        log.info("userId = {}", userId);
        log.info("withId = {}", withId);

        // board
        DebateBoard board = DebateBoard.builder()
                .roomId(roomId)
                .userId(userId)
                .title(boardForm.getTitle())
                .content(boardForm.getContent())
                .topicId(boardForm.getTopicId())
                .build();

        Long boardId = debateBoardService.save(board);
        log.info("board id is {}", boardId);

        List<DebateAttachment> debateAttachments = fileStore.storeFiles(boardForm.getFiles(), request);
        log.info("debateAttachments is {}", debateAttachments);

        debateAttachmentService.add(boardId, debateAttachments);

        return "redirect:/board/list?m=3&wid=" + withId + "&rid=" + roomId;

    }

    @GetMapping("/edit")
    public String edit(
            @RequestParam("id") Long id,
            @RequestParam(value = "wid", required = false) Long withId,
            @RequestParam(value = "rid", required = false) Long roomId,
            Model model) {
        DebateBoard debateBoard = debateBoardService.getById(id);
        DebateTopic debateTopic = debateTopicService.getById(debateBoard.getTopicId());

        model.addAttribute("board", debateBoard);
        model.addAttribute("debateTopic", debateTopic);
//        model.addAttribute("id", id);
        return "board/edit";
    }

    @PostMapping("/edit")
    public String edit(
            @RequestParam("id") Long id,
            @RequestParam("wid") Long withId,
            @RequestParam("rid") Long roomId,
            @Validated @ModelAttribute("board") BoardEditForm boardEditForm, BindingResult bindingResult,
            Model model,
            HttpServletRequest request) throws IOException {

        if (bindingResult.hasErrors()) {
            log.info("errors={}", bindingResult);
            DebateBoard debateBoard = debateBoardService.getById(id);
            DebateTopic debateTopic = debateTopicService.getById(debateBoard.getTopicId());

            //model.addAttribute("board", debateBoard);
            model.addAttribute("debateTopic", debateTopic);
            return "board/edit";
        }

        // 1. 게시글 정보 수정
        DebateBoard updateBoard = new DebateBoard();
        updateBoard.setTitle(boardEditForm.getTitle());
        updateBoard.setContent(boardEditForm.getContent());

        debateBoardService.edit(id, updateBoard);

        // 2. 파일 업로드 (to disk)
        log.info("files : {}", boardEditForm.getFiles());
        List<DebateAttachment> debateAttachments = fileStore.storeFiles(boardEditForm.getFiles(), request);

        // 3. 파일 정보 저장 (to database)
        debateAttachmentService.add(id, debateAttachments);

        // 4. 삭제할 파일 정보 조회 (from database)
        List<DebateAttachment> deleteFiles = debateAttachmentService.getAllFileByIds(boardEditForm.getDeleteFilesId());

        // 5. 파일 삭제 (from disk)
        fileStore.deleteFile(deleteFiles, request);

        // 6. 파일 삭제 (from database)
        debateAttachmentService.deleteAllFileByIds(boardEditForm.getDeleteFilesId());

        return "redirect:/board/detail?m=3&wid=" + withId + "&rid=" + roomId + "&id=" + id;
    }

    @PostMapping("/delete")
    public String delete(
            @RequestParam Long id,
            @RequestParam(name = "wid") Long withId,
            @RequestParam(name = "rid") Long roomId
    ) {

        log.info("delete debate board with id {}", id);
        log.info("delete debate with id {}", withId);
        log.info("delete debate room with id {}", roomId);

        debateBoardService.deleteById(id);

        return "redirect:/board/list?m=3&wid=" + withId + "&rid=" + roomId;
    }
}
