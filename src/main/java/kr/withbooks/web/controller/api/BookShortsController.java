package kr.withbooks.web.controller.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.withbooks.web.config.CustomUserDetails;
import kr.withbooks.web.entity.BookshortsView;
import kr.withbooks.web.service.BookshortsAttachmentService;
import kr.withbooks.web.service.BookshrotsService;

@RestController("apiBookShortsController")
@RequestMapping("/api/bookShorts")
public class BookShortsController {

    @Autowired
    private BookshrotsService service;

    @Autowired
    private BookshortsAttachmentService shortsAttachmentService;


    @GetMapping("list")
    public List<BookshortsView> getList(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(name = "id", required = false) Long bookId,
            @RequestParam(name = "ls") Long lastShortsId
    ) {
        Long userId = 1L;
        if (userDetails != null)
            userId = userDetails.getId();

        List<BookshortsView> list = service.getView(bookId, userId, lastShortsId);

        System.out.println("=================================================================");
        System.out.println(list);

        return list;
    }

    @GetMapping("/isUser")
    public Integer isUser(@AuthenticationPrincipal CustomUserDetails userDetails, @RequestParam(name = "sid") Long shortsId) {

        Long userId = null;

        // 로그인을 했으면 userId 입력
        if (userDetails != null)
            userId = userDetails.getId();


        // 해당 쇼츠가 해당 유저가 쓴 것인지 확인 하는 로직
        Integer checkShorts = service.getShortsByUserId(userId, shortsId);
        
        if (userDetails == null || checkShorts == 0) {

            return 0;
        }

        return 1;


    }

    @GetMapping("/isanonymous")
    public Integer isanonymous(@AuthenticationPrincipal CustomUserDetails userDetails, @RequestParam(name = "sid") Long shortsId) {

        Long userId = null;

        System.out.println("userdetials = " + userDetails);
        // 로그인을 했으면 userId 입력
        if (userDetails != null)
            userId = userDetails.getId();


        // 해당 쇼츠가 해당 유저가 쓴 것인지 확인 하는 로직
        Integer checkShorts = service.getShortsByUserId(userId, shortsId);
        System.out.println(checkShorts);

        System.out.println(userDetails == null && checkShorts == 0);
        if (userDetails == null || checkShorts == 0) {

            return 1;
        }

        return 0;


    }
}
