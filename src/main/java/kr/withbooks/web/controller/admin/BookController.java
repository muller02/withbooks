package kr.withbooks.web.controller.admin;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import kr.withbooks.web.entity.Book;
import kr.withbooks.web.entity.Category;
import kr.withbooks.web.service.AladinAPIService;
import kr.withbooks.web.service.BookService;
import kr.withbooks.web.service.CategoryService;
import lombok.extern.slf4j.Slf4j;

@Controller("adminBookController")
@RequestMapping("admin/book")
@Slf4j
public class BookController {
    
    @Autowired
    private BookService service;
    @Autowired
    private CategoryService categoryService;
    @Autowired
    private AladinAPIService apiService;

    @GetMapping("list")
    public String list( 
                        // @RequestParam(name = "c", required = false) Long categoryId, 
                        // @RequestParam(name = "qt", required = false) String queryType, 
                        // @RequestParam(name = "q", required = false) String query, 
                        // @RequestParam(name = "p", required = false, defaultValue = "1") Integer page,
                        @RequestParam Map<String, String> params,
                        Model model){

        List<Book> list = new ArrayList<>();
        // select box로 제목, 저자, ISBN13으로 검색하도록 한다.
        // 이때, 해당 카테고리는 queryType으로 받고, 검색어는 query로 받는다.
        // 카테고리 필터링 -> categoryId로 받는다.
        int count = 0;
        if(!params.containsKey("page")){
            int page = 1;
            params.put("page", Integer.toString(page));
        }
        list = service.getListByParams(params);
        count = service.getCountByParams(params);

        List<Category> categoryList = categoryService.getList();
        model.addAttribute("category", categoryList);
        model.addAttribute("list", list);
        model.addAttribute("count", count!=0? count:1);

        return "admin/book/list";
    }

    // =====================================================================
    // Aladdin API
    /*
        sort 1 = QueryType
        sort 2 = Query, QueryType
        sort 3 = ItemId, ItemIdType
    */
    @GetMapping("aladinList")
    public String aladinList(
                           @RequestParam(name = "sort", required = false) Integer sort
                           ,@RequestParam(name = "qt", required = false) String queryType
                           ,@RequestParam(name = "q", required = false) String query
                           ,@RequestParam(name = "i", required = false) String itemId
                           ,@RequestParam(name = "p", required = false, defaultValue = "1") Integer page
                            ,Model model) {

        if(sort == null)
            return "admin/book/aladin-list";

        List<Book> list = new ArrayList<>();
        Integer totalResults = apiService.getList(list, sort, queryType, query, itemId, page);
        
        double lastNum = 0;
        if(totalResults!=null){
            if(totalResults%50 > 0)
                lastNum = Math.floor(totalResults/50) + 1;
            else
                lastNum = totalResults/50;
        }

        model.addAttribute("list", list);
        model.addAttribute("totalResults", totalResults);
        model.addAttribute("sort", sort);
        model.addAttribute("qt", queryType);
        model.addAttribute("q", query);
        model.addAttribute("i", itemId);
        model.addAttribute("p", page);
        model.addAttribute("lastNum", lastNum);

        return "admin/book/aladin-list";
    }
}
