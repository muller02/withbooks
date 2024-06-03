package kr.withbooks.web.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.withbooks.web.entity.Bookshorts;
import kr.withbooks.web.entity.BookshortsAttachment;
import kr.withbooks.web.entity.BookshortsView;
import kr.withbooks.web.repository.BookshortsAttachmentRepository;
import kr.withbooks.web.repository.BookshortsRepository;
import kr.withbooks.web.repository.BookshortsViewRepository;


@Service
public class BookshortsServiceImp  implements  BookshrotsService{

    @Autowired
    private BookshortsRepository repository;

    @Autowired
    private BookshortsViewRepository shortsViewRepository;

    @Autowired
    private BookshortsAttachmentRepository shortsAttachmentRepository;

    // shorts 저장
    @Override
    public Long add(Bookshorts shorts) {
        repository.save(shorts);
        System.out.println("아이디왔어용 = " + shorts.getId());
        return shorts.getId();
    }

    // shortsview 가져오기
    @Override
    public List<BookshortsView> getView() {
        return  getView(null,null, 1);
    }

    @Override
    public List<BookshortsView> getView(Long bookId,Long userId, int page) {
        int size = 20;
        int offset = (page-1)*size;
        return shortsViewRepository.findAll(bookId,userId, size, offset);
    }

    // /api/bookShorts/list
    // 무한스크롤
    @Override
    public List<BookshortsView> getView(Long bookId, Long userId, Long lastShortsId) {
        return shortsViewRepository.findAllViews(bookId, userId, lastShortsId);
    }

    @Override
    public List<BookshortsAttachment> getAttach() {
        return shortsAttachmentRepository.findAll();
    }

    // shorts 가져오기
    @Override
    public Bookshorts get(Long shortsId) {
        return repository.findById(shortsId);
    }

    @Override
    public void delete(Long shortsId) {
        
        repository.blindById(shortsId);

    }

    // main
    @Override
    public List<BookshortsView> getBestList() {
        return shortsViewRepository.findAllBestShorts();
    }

    @Override
    public BookshortsView getById(Long shortsId, Long userId) {
        return shortsViewRepository.findById(shortsId, userId);
    }
    
    // admin/user
    public List<BookshortsView> getByUserId(Long userid, Integer page){

        int size = 6;
        int offset = (page - 1) * size;

        return shortsViewRepository.findByUserId(userid, size, offset);
    }

    @Override
    public Integer getCount(Long userid) {
        return shortsViewRepository.count(userid);
    }

    @Override
    public void edit(Long sid, String content) {
        repository.update(sid,content);
    }


}
