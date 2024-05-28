 package kr.withbooks.web.controller;

 import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import kr.withbooks.web.entity.Book;
import kr.withbooks.web.entity.Bookshorts;
import kr.withbooks.web.entity.BookshortsView;
import kr.withbooks.web.service.BookService;
import kr.withbooks.web.service.BookshrotsService;


 @Controller
 public class HomeController {

    @Autowired
    private BookService bookService;
    @Autowired
    private BookshrotsService shortsService;
    
    @GetMapping({"/","index"})
    public String home(Model model){
        
        List<BookshortsView> shortsList = shortsService.getBestList();
        Collections.shuffle(shortsList);
        List<Book> bookList = bookService.getBestsellerList();

        model.addAttribute("shortsList", shortsList);
        model.addAttribute("bookList", bookList);
        return "home";
    }
    
 }
