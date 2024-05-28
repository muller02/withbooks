package kr.withbooks.web.controller;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import kr.withbooks.web.config.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import kr.withbooks.web.entity.Book;
import kr.withbooks.web.entity.Bookshorts;
import kr.withbooks.web.entity.BookshortsAttachment;
import kr.withbooks.web.entity.BookshortsView;
import kr.withbooks.web.service.BookService;
import kr.withbooks.web.service.BookshortsAttachmentService;
import kr.withbooks.web.service.BookshrotsService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequestMapping("shorts")
public class BookshortsController {

    @Autowired
    private BookshrotsService service;

    @Autowired
    private BookService bookService;


    @Autowired
    private BookshortsAttachmentService shortsAttachmentService;


    @GetMapping("list")
    public String list(Model model, 
                        @RequestParam(name = "id", required = false) Long bookId,
                        @RequestParam(name = "sid", required = false) Long shortsId,
                        @AuthenticationPrincipal CustomUserDetails userDetails) {

        Long userId = null;
        if(userDetails != null)
            userId = userDetails.getId();

        int page = 1;



        List<BookshortsView> list = service.getView(bookId,userId, page);

        for (BookshortsView view : list) {
            Long id = view.getId();
            List<BookshortsAttachment> attachList = shortsAttachmentService.getListById(id);

            List<String> imgList = new ArrayList<>();
            // null이 아닐 떄는, attachlist만큼의 반복을 돌면서 , list.img에 attahlist의 img를 꺼내서  담아주기
            for (BookshortsAttachment shortsAttachment : attachList) {

                imgList.add(shortsAttachment.getImg());
                view.setImg(imgList);
            }
        }

        // shortsId 있는 경우 
        // 인기 북쇼츠를 가져온 후
        // shortsId인 쇼츠를 index 0으로 넣어줌
        if(shortsId != null){
            BookshortsView shorts = service.getById(shortsId, userId);
            list.add(0, shorts);
            boolean checkShorts = true;

            model.addAttribute("checkShorts",checkShorts);
        }

        model.addAttribute("list", list);

        System.out.println("list : " + list);

        return "shorts/list";
    }

    @GetMapping("reg")
    public String regForm(@RequestParam(name = "content", required = false) String content , @AuthenticationPrincipal CustomUserDetails userDetails
    ) {

            if(userDetails ==null)
                return  "redirect:/shorts/list";

        return "shorts/reg";
    }


    @PostMapping("reg")
    public String reg ( 
        @RequestParam(name = "files", required = false) List<MultipartFile> files, 
        @RequestParam(name = "text-area", required = false) String content,
        @RequestParam(required = false , name = "book-id") Long bookId,
        @AuthenticationPrincipal CustomUserDetails userDetails,
        HttpServletRequest request) throws IOException {


        Long userId = userDetails.getId();

        Bookshorts item = Bookshorts.builder()
                            .bookId(bookId)
                            .userId(userId)
                            .content(content)
                            .build();

        service.add(item);   // 북쇼츠 내용 저장

        String fileName = null;

        for(int i=0; i<files.size(); i++){

            if (!files.get(i).isEmpty()) {

                fileName = files.get(i).getOriginalFilename();

                String path = "/image/shorts";
                String realPath = request.getServletContext().getRealPath(path);
                File file = new File(realPath);
                if(!file.exists())
                    file.mkdirs();              

                File filePath = new File(realPath+File.separator+fileName);
                
                files.get(i).transferTo(filePath);
                
            
               BookshortsAttachment shortsAttachment =BookshortsAttachment.builder().shortsId(item.getId()).img(fileName).build();
                //for문을 돌면서 다중 파일 이미지 이름을 db(shorts_attachment)에 저장
                shortsAttachmentService.add(shortsAttachment);
            }
        }
   
        return "redirect:/shorts/list";

    }

    @GetMapping("edit")
    public String editForm(
        @RequestParam(name = "sid") Long shortsId, 
        @RequestParam(name = "bid") Long bookId, 
        Model model) {

        // shortsId 로 수정할 shorts 찾아오기 
        Bookshorts shorts = service.get(shortsId);
        log.info("shorts = {}", shorts);
        // shortsId 로 수정할 shortsAttachments 찾아오기
        List<BookshortsAttachment> shortsAttachments = shortsAttachmentService.getListById(shortsId);
        log.info("shortsAttachments = {}", shortsAttachments);

        Book book = bookService.getById(bookId);
        log.info("book = {}", book);
        // model : view로 전달 하는 저장, 
        // 조합하기 - view는 결합이다. 어쩔수 없이 view를 사용한다.
        /*1. 수정하기를 누를 떄 , 쇼츠 섹션에 있는 bookid 와, shots id가 넘어간다.
         * 2. book service를 통해 booId를 념겨서, title을 얻는다.
         * 3. 모델에 booktitle을 담는다.
         * 4. shorts id를 통해 , shorts 테이블에서 해당 shorts 를 얻어온다.
         * 5. shorts를 모델에 담는다.
         * 6.
         */

        // title,  short id 
        
        // model에 담기
        model.addAttribute("shorts", shorts);
        model.addAttribute("shortsAttachments", shortsAttachments);
        model.addAttribute("book", book);


        return "shorts/edit";
    }

    @PostMapping("edit")
    public String edit() {
        

        return "redirect:/shorts/list";
    }

    @PostMapping("delete")
    public String delete(@RequestParam("shorts-id") Long shortsId){

        service.delete(shortsId);


        return "redirect:list"; 
    }

}

