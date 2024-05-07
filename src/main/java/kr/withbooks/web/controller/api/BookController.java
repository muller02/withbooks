package kr.withbooks.web.controller.api;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.withbooks.web.entity.BookView;
import kr.withbooks.web.service.BookService;

@RestController("apiBookController")
@RequestMapping("api/book")
public class BookController {

    @Autowired
    private BookService service;

     @GetMapping("list")
     public List<BookView> list(
                                 @RequestParam(name = "q", required = false) String query
                                 ,@RequestParam(name = "c", required = false) Long categoryId
                                 ,@RequestParam(name = "s", required = false) Long size
                                 ,@RequestParam(name = "p", required = false) Long page
                                 ) {

         // 카테고리 선택하지 않고 책 검색 시 0으로 보내는 값을 null로 처리
        if(categoryId == 0)
            categoryId=null;

         List<BookView> list = service.getList(query, categoryId);
         System.out.println("list : " + list);

         return list;

     }

     @GetMapping("detail")
     public BookView detail(Long id){

        System.out.println("id = "+id);
        BookView book = service.getView(id);
        return book;
     }
}
