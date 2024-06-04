package kr.withbooks.web.service;

import kr.withbooks.web.entity.With;
import kr.withbooks.web.entity.WithView;

import java.util.List;

public interface WithService {
  // 전체 목록 조회

  List<WithView> getList(Long[] categoryId, String query, Long faceYn, Long id, String name, String withTop, String sort, Integer page);


  void add(With with);

  With get(Long withId);


  boolean getName(String withName);

  List<WithView> getListByBookId(Long bookId);

  List<WithView> getListByUserId(Long userId);


  Integer getCount(Long[] categoryId, String query, Long faceYn, Long id, String name, String withTop, String sort, Integer page);


}
