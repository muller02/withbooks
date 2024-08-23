package kr.withbooks.web.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.withbooks.web.entity.Book;
import kr.withbooks.web.repository.AladinAPIRepository;
import kr.withbooks.web.repository.BookRepository;
import kr.withbooks.web.util.AladinJsonParser;

@Service
public class AladinAPIServiceImp implements AladinAPIService {
    
    @Autowired
    private AladinAPIRepository repository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private AladinJsonParser jsonparser;

    @Override
    public Integer getList(List<Book> list, Integer sort, String queryType, String query, String itemId, Integer page) {
        // TODO Auto-generated method stub
        String apiUrl = repository.urlMaker(sort, queryType, query,itemId,page);
        System.out.println("apiUrl = "+apiUrl);
        String jsonResponse = repository.jsonResponse(apiUrl);
        Integer totalResults = jsonparser.parser(list, jsonResponse);

        // Test
        // 알라딘에서 검색해온 책들을 기존 DB와 비교하여 없는 책인 경우 0, 있는 책인 경우 1 세팅
        if(list.size() > 0)
            for (Book book : list) {
                String isbn13 = book.getIsbn13();
                int bool = bookRepository.findBoolByISBN13(isbn13);
                book.setPublicYn(bool);
            }

        return totalResults;
    }
    @Override
    public Integer getByISBN13(List<Book> list, String isbn13) {

        String apiUrl = repository.urlMaker(3, null, null,isbn13, 1);
        String jsonResponse = repository.jsonResponse(apiUrl);
        Integer result = jsonparser.parser(list, jsonResponse);
        
        return result;
    }
}
