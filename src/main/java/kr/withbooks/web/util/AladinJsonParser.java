package kr.withbooks.web.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.stereotype.Component;

import kr.withbooks.web.entity.Book;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class AladinJsonParser {
    
	public Integer parser(List<Book> list, String jsonResponse){
		
        // JSON 문자열을 JSONObject로 변환
        JSONObject jsonObject = new JSONObject(jsonResponse);

        // 에러코드가 뜬 경우
        if(jsonObject.has("errorCode")){
            log.info("ErrorCode {}"+jsonObject.getInt("errorCode"));
            log.info("ErrorMessage {}"+jsonObject.getString("errorMessage"));
            return null;
        }

        // 검색 정보가 없는 경우
        int totalResults = jsonObject.getInt("totalResults");
        if(totalResults==0){
            log.info("No Searched Keyword's Response");
            return null;
        }
        
        // JSON에서 페이징 정보 꺼내기
        int startIndex = jsonObject.getInt("startIndex");
        int itemsPerPage = jsonObject.getInt("itemsPerPage");

        // items 배열에서 각 책 정보를 가져와 List<Book>에 저장
        JSONArray items = jsonObject.getJSONArray("item");
        
        for (int i = 0; i < items.length(); i++) {

            JSONObject item = items.getJSONObject(i);

            // cover : coversum -> cover500 변경
            String cover = item.getString("cover").replaceAll("sum", "500");
            
            // categoryName : 그대로 박아넣기
            String categoryName = item.getString("categoryName");

             //Date 포맷
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        
            Book book = new Book();
            try {
                book = Book.builder()
                            .categoryName(categoryName)
                            .cid(item.getLong("categoryId"))
                            .title(item.getString("title"))
                            .purchaseLink(item.getString("link"))
                            .author(item.getString("author"))
                            .pubDate(dateFormat.parse(item.getString("pubDate")))
                            .description(item.getString("description"))
                            .isbn13(item.getString("isbn13"))
                            .price(item.getInt("priceStandard"))
                            .cover(cover)
                            .publisher(item.getString("publisher"))
                            .build();

            } catch (JSONException | ParseException e) {
                e.printStackTrace();
            }
            // List<Book>에 책 정보 추가
            list.add(book);
        }
        return totalResults;
	}
}
