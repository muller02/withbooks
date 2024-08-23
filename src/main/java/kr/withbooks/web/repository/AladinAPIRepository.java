package kr.withbooks.web.repository;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class AladinAPIRepository {
    // field
    private static String apiUrl;

    // final 변수
    private static final String PRE_URL = "http://www.aladin.co.kr/ttb/api/";
	private static final String SUF_URL = ".aspx?";

	public static final String Item_List= "ItemList";
	public static final String Item_Search = "ItemSearch";
	public static final String Item_Look_Up = "ItemLookUp";

    //TTBKEY 변수
	@Value("${aladdin-key.value}")
    private String TTBKey;

	public String urlMaker(Integer sort, String queryType, String query, String itemId, Integer page){

		StringBuilder builder = new StringBuilder();
		boolean isList = true;

		// 한글깨짐 -> encode 필요
		String encodedQuery = "";
		if(query != null)
			try {
				encodedQuery = URLEncoder.encode(query, "UTF-8");
			} catch (UnsupportedEncodingException e) {
				e.printStackTrace();
			}
		
		// 주소 앞단 만들어주기
		// http://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=##
		/*  
			sort 1 = ItemList
			sort 2 = ItemSearch
			sort 3 = ItemLookUp
		*/
		{
			builder.append(PRE_URL);
			switch (sort) {
				case 1:
					builder.append(Item_List);
					break;
				case 2:
					builder.append(Item_Search);
					break;
				case 3:
					builder.append(Item_Look_Up);
					isList = false;
					break;
			}
			builder.append(SUF_URL);
			builder.append("ttbkey="+TTBKey);
		}
		// parameters
		// Query=도둑맞은&QueryType=Title&MaxResults=100&start=1&SearchTarget=Book&output=js&Version=20131101
		{
			switch (sort) {
				case 1:
					builder.append("&QueryType="+queryType);
					builder.append("&Start="+page);
					break;
				case 2:
					builder.append("&Query="+encodedQuery);
					builder.append("&QueryType="+queryType);
					builder.append("&Start="+page);
					break;
				case 3:
					builder.append("&ItemId="+itemId);
					builder.append("&ItemIdType=ISBN13");
					isList = false;
					break;
			}
		}

		// List를 찾는 경우 SearchTarget 필요, 1건 검색인 경우 필요없음
		if(isList)
			builder.append("&SearchTarget=Book");
		builder.append("&MaxResults=100&output=js&Version=20131101");

		apiUrl = builder.toString();

		return apiUrl;
	}

		// Aladdin API 통신 함수
        public String jsonResponse(String apiUrl){

			String jsonResponse="";

			try {
				// URL 객체 생성
					URL url = new URL(apiUrl);

					// HttpURLConnection 객체 생성
					HttpURLConnection connection = (HttpURLConnection) url.openConnection();

					// 요청 메서드 설정
					connection.setRequestMethod("GET");

					// 응답 코드 확인
					int responseCode = connection.getResponseCode();
					if (responseCode == HttpURLConnection.HTTP_OK) { // 성공적으로 응답을 받은 경우
						// 응답 데이터를 읽어오기 위한 BufferedReader 생성
						// UTF-8 설정하지 않는 경우 한글 깨짐
						BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream(), "utf-8"));
						StringBuilder builder = new StringBuilder();
						String line;

						// 한 줄씩 읽어서 StringBuilder에 추가
						while ((line = reader.readLine()) != null) {
							builder.append(line);
						}

						// BufferedReader 닫기
						reader.close();

						// 응답 데이터 출력
						jsonResponse = builder.toString();
						// System.out.println("JSON Response:\n" + jsonResponse);

					} else {
						log.info("HTTP request failed with response code {} " + responseCode);
					}
					// HttpURLConnection 닫기
					connection.disconnect();

				} catch (Exception e) {
					e.printStackTrace();
				}
			return jsonResponse;
		}
}
